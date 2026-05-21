import type { SitemapGenerator } from "$lib/server/sitemap";

import { text } from "@sveltejs/kit";
import { resolve } from "$app/paths";
import { SitemapStream, streamToPromise } from "sitemap";

import type { RequestHandler } from "./$types";

export const GET: RequestHandler = async (req) => {
    const stream = new SitemapStream({
        hostname: "https://luis.toino.pt",
    });

    try {
        const staticRoutes = import.meta.glob("../**/+page.svelte");
        for (const route in staticRoutes) {
            const id =
                route.replace("..", "").replace("/+page.svelte", "") || "/";

            if (!id.includes("[")) {
                // @ts-expect-error: Typescript can't narrow this
                stream.write({ url: resolve(id) });
            }
        }

        const dynamicRoutes: Record<
            string,
            { _sitemap?: SitemapGenerator<unknown> }
        > = import.meta.glob("../**/+page.server.ts", {
            eager: true,
        });
        for (const route in dynamicRoutes) {
            const id =
                route.replace("..", "").replace("/+page.server.ts", "") || "/";

            if (id.includes("[")) {
                const entries =
                    (await dynamicRoutes[route]._sitemap?.(req)) ?? [];

                for (const entry of entries)
                    // @ts-expect-error: Typescript can't narrow this
                    stream.write({ url: resolve(id, entry) });
            }
        }
    } finally {
        stream.end();
    }

    const sitemap = await streamToPromise(stream);

    return text(sitemap.toString(), {
        headers: { "Content-Type": "application/xml" },
    });
};

export const prerender = false;
