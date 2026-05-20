import type { RequestEvent } from "@sveltejs/kit";

export type SitemapGenerator<RouteParams> = (
    req: RequestEvent,
) => Promise<RouteParams[]>;
