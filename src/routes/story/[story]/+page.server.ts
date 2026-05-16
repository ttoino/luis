import { error } from "@sveltejs/kit";
import { getChampion, getStory } from "$lib/server/kv";

import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ params, platform }) => {
    const { story: slug } = params;

    if (!platform?.env.KV) return error(500, "KV not configured");

    const story = await getStory(platform.env.KV, slug);

    const relatedChampions = Promise.all(
        story.sections.map((section) =>
            Promise.all(
                section.champions.map(({ slug }) =>
                    getChampion(platform.env.KV, slug),
                ),
            ),
        ),
    );

    return {
        relatedChampions,
        story,
    };
};
