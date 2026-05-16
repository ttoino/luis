import { error } from "@sveltejs/kit";
import { getDocuments } from "$lib/server/kv";

import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ platform, url }) => {
    const query = url.searchParams.get("query") || undefined;
    const page = parseInt(url.searchParams.get("page") || "1", 10) ?? 1;

    const per_page = 20;

    if (!platform?.env.SEARCH) return error(500, "AI Search not configured");

    let items: string[];
    let pages = 1;

    if (query) {
        const response = await platform.env.SEARCH.search({
            messages: [
                {
                    content: query,
                    role: "user",
                },
            ],
        });

        items = [
            ...new Set(
                response.chunks.map((chunk) =>
                    chunk.item.key.replace(".html", ""),
                ),
            ),
        ];
    } else {
        const response = await platform.env.SEARCH.items.list({
            page,
            per_page,
        });

        items = response.result.map((item) => item.key.replace(".html", ""));
        pages = Math.ceil((response.result_info?.total_count ?? 1) / per_page);
    }

    const results = await getDocuments(platform.env.KV, items);

    return {
        current: page,
        pages,
        query,
        results,
    };
};
