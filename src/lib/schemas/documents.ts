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
});
export type Champion = typeof Champion.inferOut;

export const Region = type({
    champions: type({ name: "string", slug: "string" }).array(),
    description: "string",
    image: "string.url",
    name: "string",
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
});
export type Story = typeof Story.inferOut;
