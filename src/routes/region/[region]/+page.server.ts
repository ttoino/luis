import { error } from "@sveltejs/kit";
import { getRegion } from "$lib/server/kv";

import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ params, platform }) => {
    const { region: slug } = params;

    if (!platform?.env.KV) return error(500, "KV not configured");

    const region = await getRegion(platform.env.KV, slug);

    return {
        region,
    };
};
