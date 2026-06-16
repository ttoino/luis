import type { Champion, Region, Story } from "$lib/schemas/documents.js";
import type { Component } from "svelte";

import {
    ChampionResponse,
    Explore2Response,
    FactionResponse,
    SearchResponse,
    StoryResponse,
} from "$lib/schemas/universe.js";
import { type, type Type } from "arktype";
import {
    WorkflowEntrypoint,
    type WorkflowEvent,
    type WorkflowStep,
} from "cloudflare:workers";
import { NonRetryableError } from "cloudflare:workflows";
import { render } from "svelte/server";

import ChampionComponent from "./components/Champion.svelte";
import RegionComponent from "./components/Region.svelte";
import StoryComponent from "./components/Story.svelte";
import StorySectionComponent from "./components/StorySection.svelte";

// Riot API constants
const BASE_URL = "https://universe-meeps.leagueoflegends.com/v1/en_us";
const SEARCH_URL = `${BASE_URL}/search/index.json`;
const EXPLORE_URL = `${BASE_URL}/explore2/index.json`;
const CHAMPION_URL = `${BASE_URL}/champions`;
const REGION_URL = `${BASE_URL}/factions`;
const STORY_URL = `${BASE_URL}/story`;

const fetchStep =
    <T extends Type>(url: string, Schema: T) =>
    async (): Promise<T["inferOut"]> => {
        const response = await fetch(url);

        if (!response.ok)
            throw new Error(`Unexpected status: ${response.status}`);

        const data = await response.json();
        const parsed = Schema(data);

        if (parsed instanceof type.errors)
            throw new NonRetryableError(
                `Unexpected fetch data schema: ${parsed}`,
            );

        return parsed;
    };

export class DataPipeline extends WorkflowEntrypoint<Env> {
    async championGroup(step: WorkflowStep, slug: string) {
        const data = await step.do(
            `fetch champion ${slug}`,
            fetchStep(`${CHAMPION_URL}/${slug}/index.json`, ChampionResponse),
        );

        const region = data.champion["associated-faction-slug"];
        const champion: Champion = {
            bio: data.champion.biography.full,
            description: data.champion.biography.short,
            image: data.champion.image.uri,
            name: data.champion.name,
            quote: data.champion.biography.quote,
            races: data.champion.races.map((race) => race.name),
            region: region === "unaffiliated" ? undefined : region,
            releaseDate: data.champion["release-date"],
            slug: data.champion.slug,
            title: data.champion.title,
            type: "champion",
        };

        await this.uploadGroup(
            step,
            "champion",
            slug,
            ChampionComponent,
            champion,
        );
    }

    async exploreGroup(step: WorkflowStep) {
        const explore = await step.do(
            "fetch modules",
            fetchStep(EXPLORE_URL, Explore2Response),
        );

        await Promise.all(
            explore.modules
                .filter((module) => module.type === "story-preview")
                .map((module) => this.storyGroup(step, module["story-slug"])),
        );
    }

    async regionGroup(step: WorkflowStep, slug: string) {
        const data = await step.do(
            `fetch region ${slug}`,
            fetchStep(`${REGION_URL}/${slug}/index.json`, FactionResponse),
        );

        const region: Region = {
            champions: data["associated-champions"].map((champion) => ({
                name: champion.name,
                slug: champion.slug,
            })),
            description: data.faction.overview.short,
            image: data.faction.image.uri,
            name: data.faction.name,
            slug: data.faction.slug,
            type: "region",
        };

        await this.uploadGroup(step, "region", slug, RegionComponent, region);
    }

    override async run(
        _: Readonly<WorkflowEvent<unknown>>,
        step: WorkflowStep,
    ) {
        await Promise.all([this.exploreGroup(step), this.searchGroup(step)]);
    }

    async searchGroup(step: WorkflowStep) {
        const search = await step.do(
            "fetch champions and regions",
            fetchStep(SEARCH_URL, SearchResponse),
        );

        await Promise.all([
            ...search.champions.map(({ slug }) =>
                this.championGroup(step, slug),
            ),
            ...search.factions.map(({ slug }) => this.regionGroup(step, slug)),
        ]);
    }

    async storyGroup(step: WorkflowStep, slug: string) {
        const data = await step.do(
            `fetch story ${slug}`,
            fetchStep(`${STORY_URL}/${slug}/index.json`, StoryResponse),
        );

        const story: Story = {
            image:
                data.story["story-sections"][0]["background-image"]?.uri ?? "",
            releaseDate: data["release-date"],
            sections: data.story["story-sections"].map((section) => ({
                champions: section["featured-champions"].map((champion) => ({
                    name: champion.name,
                    slug: champion.slug,
                })),
                content: render(StorySectionComponent, { props: section }).body,
            })),
            slug: data.id,
            subtitle: data.story.subtitle,
            title: data.story.title,
            type: "story",
        };

        await this.uploadGroup(step, "story", slug, StoryComponent, story);
    }

    async uploadGroup<T extends Record<string, unknown>>(
        step: WorkflowStep,
        entityType: string,
        slug: string,
        EntityComponent: Component<T>,
        entity: T,
    ) {
        const pluralType = entityType.endsWith("y")
            ? entityType.substring(0, entityType.length - 1) + "ies"
            : entityType + "s";

        const doc = JSON.stringify(entity);

        const previousDoc = await step.do(
            `retrieve ${entityType} ${slug} from KV`,
            async () => await this.env.KV.get(`/${pluralType}/${slug}`),
        );

        if (doc === previousDoc) return;

        const html = render(EntityComponent, { props: entity }).body;

        await Promise.all([
            step.do(
                `upload ${entityType} ${slug} to AI Search`,
                async () =>
                    (
                        await this.env.SEARCH.items.upload(
                            `/${pluralType}/${slug}.html`,
                            html,
                        )
                    ).status,
            ),
            step.do(
                `upload ${entityType} ${slug} to KV`,
                async () =>
                    await this.env.KV.put(`/${pluralType}/${slug}`, doc),
            ),
        ]);
    }
}
