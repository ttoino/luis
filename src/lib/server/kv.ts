import { error } from "@sveltejs/kit";
import { Champion, Document, Region, Story } from "$lib/schemas/documents.js";
import { Type, type } from "arktype";

const makeFns = <T extends Type>(
    Document: T,
    entityType: string,
    skipSlugProcessing = false,
) => {
    const pluralType = entityType.endsWith("y")
        ? entityType.substring(0, entityType.length - 1) + "ies"
        : entityType + "s";

    return [
        async (kv: KVNamespace, slug: string): Promise<T["inferOut"]> => {
            const data = await kv.get(
                skipSlugProcessing ? slug : `/${pluralType}/${slug}`,
                "json",
            );

            if (!data) return error(404, `${entityType} not found`);

            const doc = Document(data);

            if (doc instanceof type.errors) {
                console.error(doc.toString());
                return error(500, "Unexpected data");
            }

            return doc;
        },
        async (kv: KVNamespace, slugs: string[]): Promise<T["inferOut"][]> => {
            const processedSlugs = skipSlugProcessing
                ? slugs
                : slugs.map((slug) => `/${pluralType}/${slug}`);

            const dataMap = await kv.get(processedSlugs, "json");

            const data = processedSlugs.map((slug) => dataMap.get(slug));

            const docs = Document.array()(data);

            if (docs instanceof type.errors) {
                console.error(docs.toString());
                return error(500, "Unexpected data");
            }

            return docs;
        },
    ] as const;
};

export const [getDocument, getDocuments] = makeFns(Document, "document", true);

export const [getChampion, getChampions] = makeFns(Champion, "champion");
export const [getRegion, getRegions] = makeFns(Region, "region");
export const [getStory, getStories] = makeFns(Story, "story");
