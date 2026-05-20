import { text } from "@sveltejs/kit";
import { resolve } from "$app/paths";
import { SitemapStream, streamToPromise } from "sitemap";

import type { RequestHandler } from "./$types";

export const GET: RequestHandler = async (req) => {
    const stream = new SitemapStream({
        hostname: "https://luis.toino.pt",
    });

    try {
        const routes = import.meta.glob("../**/+page.svelte");
        for (const route in routes) {
            const base = route.replace("/+page.svelte", "");
            const id = base.replace("..", "") || "/";

            if (route.includes("[")) {
                const entries =
                    (await (
                        await import(base + "/+page.server.ts")
                    )._sitemap?.(req)) ?? [];

                for (const entry of entries)
                    // @ts-expect-error: Typescript can't narrow this
                    stream.write({ url: resolve(id, entry) });
            } else {
                // @ts-expect-error: Typescript can't narrow this
                stream.write({ url: resolve(id) });
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
