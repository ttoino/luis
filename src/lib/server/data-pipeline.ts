import {
    ChampionResponse,
    Explore2Response,
    FactionResponse,
    SearchResponse,
    StoryResponse,
} from "$lib/schemas/universe";
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

        const html = await step.do(
            `render champion ${slug}`,
            async () =>
                render(ChampionComponent, {
                    props: {
                        bio: data.champion.biography.full,
                        description: data.champion.biography.short,
                        image: data.champion.image.uri,
                        name: data.champion.name,
                        quote: data.champion.biography.quote,
                        races: data.champion.races.map((race) => race.name),
                        region:
                            data.champion["associated-faction-slug"] ===
                            "unaffiliated"
                                ? undefined
                                : data.champion["associated-faction-slug"],
                        releaseDate: data.champion["release-date"],
                        slug: data.champion.slug,
                        title: data.champion.title,
                    },
                }).body,
        );

        await step.do(
            `upload champion ${slug}`,
            async () =>
                (
                    await this.env.SEARCH.items.upload(
                        `/champions/${slug}.html`,
                        html,
                    )
                ).status,
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

        const html = await step.do(
            `render region ${slug}`,
            async () =>
                render(RegionComponent, {
                    props: {
                        champions: data["associated-champions"].map(
                            (champion) => ({
                                name: champion.name,
                                slug: champion.slug,
                            }),
                        ),
                        description: data.faction.overview.short,
                        image: data.faction.image.uri,
                        name: data.faction.name,
                    },
                }).body,
        );

        await step.do(
            `upload region ${slug}`,
            async () =>
                (
                    await this.env.SEARCH.items.upload(
                        `/regions/${slug}.html`,
                        html,
                    )
                ).status,
        );
    }

    override async run(
        event: Readonly<WorkflowEvent<unknown>>,
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

        const html = await step.do(
            `render story ${slug}`,
            async () =>
                render(StoryComponent, {
                    props: {
                        releaseDate: data["release-date"],
                        slug: data.id,
                        "story-sections": data.story["story-sections"],
                        subtitle: data.story.subtitle,
                        title: data.story.title,
                    },
                }).body,
        );

        await step.do(
            `upload story ${slug}`,
            async () =>
                (
                    await this.env.SEARCH.items.upload(
                        `/stories/${slug}.html`,
                        html,
                    )
                ).status,
        );
    }
}
