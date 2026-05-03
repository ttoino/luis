import { error } from "@sveltejs/kit";
import { Story } from "$lib/schemas/documents";
import { type } from "arktype";

import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ params, platform }) => {
    const { story: slug } = params;

    if (!platform?.env.SEARCH) return error(500, "AI Search not configured");

    const data = await platform.env.KV.get(`/stories/${slug}`, "json");

    if (!data) return error(404, "Story not found");

    console.log(data);

    const story = Story(data);

    if (story instanceof type.errors) {
        console.error(story.toString());
        return error(500, "Unexpected data");
    }

    return {
        story,
    };
};
