import { configure, type } from "arktype";

import { deepPartial } from "./helper";

configure({ onUndeclaredKey: "reject" });

export const BaseEntity = type({
    name: "string",
    slug: "string",
});

export const Media = type({
    description: "string",
    encoding: "string",
    "featured-champions": "never[]",
    height: "(number.integer | null)?",
    subtitle: "string",
    title: "string",
    uri: "string.url",
    width: "(number.integer | null)?",
    x: "(number.integer | null)?",
    y: "(number.integer | null)?",
});

export const SearchChampion = type({
    "associated-faction": "''",
    "associated-faction-slug": "string",
    background: Media,
    image: Media,
    name: "string",
    "release-date": "string.date.iso.parse",
    "section-title": "string",
    slug: "string",
    title: "string",
    type: "'champion'",
    url: "string",
});

export const Champion = SearchChampion.and({
    biography: {
        full: "string",
        quote: "string",
        "quote-author": "string",
        short: "string",
    },
    "game-info-url": "(string.url | null)?",
    headerImage: Media.or("null").optional(),
    races: BaseEntity.array(),
    roles: BaseEntity.array(),
    video: Media.or("null").optional(),
});

export const BaseModule = type({
    description: "(string | null)?",
    "release-date": "string.date.iso.parse",
    subtitle: "(string | null)?",
    title: "string",
});

export const FeaturedVideoModule = BaseModule.and({
    "featured-champions": Champion.array().pipe(() => null),
    "featured-image": Media,
    "related-champions": Champion.array().pipe(() => null),
    slug: "string",
    type: "'featured-video'",
    uri: "string.url",
});

export const LinkOutModule = BaseModule.and({
    background: Media,
    "featured-champions": deepPartial(Champion)
        .array()
        .pipe(() => null),
    isComic: "boolean",
    isFanArt: "boolean",
    "issue-title": "string",
    "link-out-type": "'comic' | 'fan-art'",
    series: {},
    type: "'link-out'",
    url: "string",
});

export const StoryPreviewModule = BaseModule.and({
    background: Media,
    "featured-champions": Champion.array().pipe(() => null),
    "featured-image": Media,
    "minutes-to-read": "number.integer",
    slug: "string",
    "story-slug": "string",
    type: "'story-preview'",
    url: "string",
});

export const Module = type.or(
    FeaturedVideoModule,
    LinkOutModule,
    StoryPreviewModule,
);

export const SearchFaction = type({
    "associated-champions": "never[]",
    background: Media,
    description: "string",
    echelon: "string",
    image: Media,
    name: "string",
    "section-title": "string",
    slug: "string",
    title: "string",
    type: "'faction'",
    url: "string",
});

export const Faction = type({
    image: Media,
    name: "string",
    overview: { short: "string" },
    slug: "string",
    video: Media,
});

export const Story = type({
    "custom-story-preview": "string",
    "story-sections": type({
        "background-image": Media.or("null").optional(),
        "featured-champions": Champion.array(),
        "story-subsections": type({
            content: "(string | null)?",
            "icon-image": Media.or("null").optional(),
        }).array(),
        subtitle: "null?",
        title: "null?",
    }).array(),
    subtitle: "string",
    title: "string",
});

export const ChampionResponse = type({
    champion: Champion,
    "explore-champions": Champion.array(),
    id: "string",
    locale: "'en_us'",
    name: "string",
    "related-champions": Champion.array(),
    title: "string",
});

export const FactionResponse = type({
    "associated-champions": Champion.array(),
    "champion-list-order": "number",
    "explore-factions": SearchFaction.array(),
    faction: Faction,
    id: "string",
    locale: "'en_us'",
    name: "string",
});

export const StoryResponse = type({
    dropcaps: "boolean",
    id: "string",
    locale: "'en-us'",
    "minutes-to-read": "number.integer",
    "release-date": "string.date.iso.parse",
    story: Story,
    theme: "null?",
    type: "'story'",
    "word-count": "number.integer",
});

export const Explore2Response = type({
    id: "'explore2'",
    locale: "'en_us'",
    modules: Module.array(),
    name: "'Explore2'",
});

export const SearchResponse = type({
    champions: SearchChampion.array(),
    factions: SearchFaction.array(),
    id: "'search'",
    locale: "'en_us'",
    name: "'Search'",
});
