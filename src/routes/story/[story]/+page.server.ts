import type { Story } from "$lib/documents";
import type { MLTResponse } from "$lib/query";

import { error } from "@sveltejs/kit";
import { solrUrl } from "$lib/solr";

import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ fetch, params }) => {
    const { story: storyId } = params;

    const mltParams = new URLSearchParams({
        df: "id",
        "mlt.fl": "content, title, author, related_champions.name",
        "mlt.maxdf": "25",
        "mlt.mindf": "1",
        "mlt.minwl": "3",
        q: storyId,
    });
    const mltUrl = solrUrl("mlt", mltParams);

    try {
        const response = await fetch(mltUrl, {
            headers: {
                Accept: "application/json",
            },
            method: "GET",
        });

        if (!response.ok) error(response.status, response.statusText);

        const data: MLTResponse<Story> = await response.json();

        const story = data.match.docs[0];
        const otherStories = data.response.docs;

        return {
            otherStories,
            story,
        };
    } catch (_e) {
        console.log(_e);
        error(500, "Failed to fetch results");
    }
};
