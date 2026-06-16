import type { SitemapGenerator } from "$lib/server/sitemap.js";

import { error } from "@sveltejs/kit";
import { getChampion } from "$lib/server/kv.js";

import type { PageServerLoad, RouteParams } from "./$types.js";

export const load: PageServerLoad = async ({ params, platform }) => {
    const { champion: slug } = params;

    if (!platform?.env.KV) return error(500, "KV not configured");

    const champion = await getChampion(platform.env.KV, slug);

    return {
        champion,
    };
};

export const _sitemap: SitemapGenerator<RouteParams> = async ({ platform }) =>
    (await platform?.env.KV.list({ prefix: "/champions/" }))?.keys.map(
        ({ name }) => ({ champion: name.replace("/champions/", "") }),
    ) ?? [];
