import type { SitemapGenerator } from "$lib/server/sitemap.js";

import { error } from "@sveltejs/kit";
import { getRegion } from "$lib/server/kv.js";

import type { PageServerLoad, RouteParams } from "./$types.js";

export const load: PageServerLoad = async ({ params, platform }) => {
    const { region: slug } = params;

    if (!platform?.env.KV) return error(500, "KV not configured");

    const region = await getRegion(platform.env.KV, slug);

    return {
        region,
    };
};

export const _sitemap: SitemapGenerator<RouteParams> = async ({ platform }) =>
    (await platform?.env.KV.list({ prefix: "/regions/" }))?.keys.map(
        ({ name }) => ({ region: name.replace("/regions/", "") }),
    ) ?? [];
