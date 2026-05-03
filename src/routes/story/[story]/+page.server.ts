import { error } from "@sveltejs/kit";
import { Story } from "$lib/schemas/documents";
import { type } from "arktype";

import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ params, platform }) => {
    const { story: slug } = params;

    if (!platform?.env.SEARCH) return error(500, "AI Search not configured");

    const data = await platform.env.KV.get(`/stories/${slug}.html`);
    const story = Story(data);

    if (story instanceof type.errors) return error(404, "Story not found");

    return {
        story,
    };
};
