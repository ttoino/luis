import { type } from "arktype";

export const Champion = type({
    bio: "string",
    description: "string",
    image: "string.url",
    name: "string",
    quote: "string",
    races: "string[]",
    region: "string?",
    releaseDate: "string.date.iso.parse",
    slug: "string",
    title: "string",
    type: "'champion'",
});
export type Champion = typeof Champion.inferOut;

export const Region = type({
    champions: type({ name: "string", slug: "string" }).array(),
    description: "string",
    image: "string.url",
    name: "string",
    type: "'region'",
});
export type Region = typeof Region.inferOut;

export const Story = type({
    image: "string.url",
    releaseDate: "string.date.iso.parse",
    sections: type({
        champions: type({ name: "string", slug: "string" }).array(),
        content: "string",
    }).array(),
    slug: "string",
    subtitle: "string",
    title: "string",
    type: "'story'",
});
export type Story = typeof Story.inferOut;

export const Document = type.or(Champion, Region, Story);
export type Document = typeof Document.inferOut;
