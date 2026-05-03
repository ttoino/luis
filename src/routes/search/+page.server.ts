import { error } from "@sveltejs/kit";
import { Document } from "$lib/schemas/documents";
import { type } from "arktype";

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
            query,
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

    const dataMap = await platform.env.KV.get(
        items.map((key) => key),
        "json",
    );
    const data = items.map((key) => dataMap.get(key));
    const results = Document.array()(data);

    if (results instanceof type.errors) {
        console.error(results.toString());
        return error(500, "Error retrieving data");
    }

    return {
        current: page,
        pages,
        query,
        results,
    };
};
