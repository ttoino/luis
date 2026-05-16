import { error } from "@sveltejs/kit";
import { getChampion } from "$lib/server/kv";

import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ params, platform }) => {
    const { champion: slug } = params;

    if (!platform?.env.KV) return error(500, "KV not configured");

    const champion = await getChampion(platform.env.KV, slug);

    return {
        champion,
    };
};
