import type { Champion, Story } from "$lib/documents";
import type { QueryResponse } from "$lib/query";

import { error } from "@sveltejs/kit";
import { solrUrl } from "$lib/solr";

import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ fetch, url }) => {
    const query = url.searchParams.get("query") || "*:*";
    const page = url.searchParams.get("page") || "1";

    const limit = 20;
    const offset = (parseInt(page) - 1) * limit;

    const urlParams = new URLSearchParams({
        defType: "edismax",
        df: "content",
        fl: "*,score",
        hl: "true",
        "hl.fl": "content",
        "hl.fragsize": "100",
        "hl.tag.post": "</mark>",
        "hl.tag.pre":
            '<mark class="bg-blue-4 rounded-sm px-1 group-hover:bg-blue-3 transition-colors duration-300 text-grey-4">',
        indent: "true",
        mm: "2",
        pf: "content^3",
        pf2: "content^3",
        pf3: "content^3",
        ps: "3",
        q: query,
        "q.alt": "*",
        "q.op": "OR",
        qf: "content^5 title^0.1 author",

        qs: "1",

        rows: limit.toString(),
        sort: "score desc",
        spellcheck: "true",
        start: offset.toString(),
        tie: "0.1",
    });
    const searchUrl = solrUrl("select", urlParams);

    try {
        const response = await fetch(searchUrl, {
            headers: {
                Accept: "application/json",
            },
            method: "GET",
        });

        if (!response.ok) error(response.status, response.statusText);

        const data: QueryResponse<Story> = await response.json();

        const results: ({
            highlighting?: string;
        } & Story)[] = data.response.docs;
        const maxPage = Math.ceil(data.response.numFound / limit);

        if (data.highlighting)
            for (const result of results) {
                result.highlighting =
                    data.highlighting[result.id]?.content?.[0];

                if (!result.highlighting) continue;

                result.highlighting = result.highlighting.replace(
                    /^<\/\w+>/,
                    "",
                );

                const tags = result.highlighting.match(/(<\w+>)|(<\/\w+>)/g);

                const tagStack: string[] = [];

                for (const tag of tags ?? []) {
                    if (tag.match(/mark|br/)) continue;

                    if (tag.startsWith("</")) {
                        if (tagStack.length === 0)
                            result.highlighting =
                                tag.replace("/", "") + result.highlighting;

                        tagStack.pop();
                    } else {
                        tagStack.push(tag);
                    }
                }

                for (const tag of tagStack)
                    result.highlighting += tag.replace("<", "</");
            }

        let profile: ({ content: string } & Champion) | null = null;

        for (let i = 0; i < results.length; i++) {
            if (
                query.toLowerCase().replaceAll(/[^a-z]/g, "") + "-bio" ==
                results[i].id
            ) {
                profile = {
                    aliases: results[i]["related_champions.aliases"],
                    content: results[i].content,
                    id: results[i]["related_champions.id"][0],
                    image: results[i]["related_champions.image"][0],
                    name: results[i]["related_champions.name"][0],
                    quote: results[i]["related_champions.quote"][0],
                    races: results[i]["related_champions.races"],
                    related_champions:
                        results[i]["related_champions.related_champions"],
                    release_date:
                        results[i]["related_champions.release_date"][0],
                    roles: results[i]["related_champions.roles"],
                    skins: results[i]["related_champions.skins"],
                    title: results[i]["related_champions.title"][0],

                    type: "champion",
                };

                if (results[i]["related_champions.origin.id"])
                    profile.origin = {
                        associated_champions:
                            results[i][
                                "related_champions.origin.associated_champions"
                            ],
                        description:
                            results[i][
                                "related_champions.origin.description"
                            ][0],
                        description_raw:
                            results[i][
                                "related_champions.origin.description_raw"
                            ][0],
                        id: results[i]["related_champions.origin.id"][0],
                        image: results[i]["related_champions.origin.image"][0],
                        name: results[i]["related_champions.origin.name"][0],
                        type: "region",
                    };

                results.splice(i, 1);
                break;
            }
        }

        const spellcheck = data.spellcheck?.collations
            .filter((_, i) => i % 2 === 1)
            .map((s) => s.toLowerCase());

        return {
            current: parseInt(page),
            pages: maxPage,
            profile,
            query: url.searchParams.get("query"),
            results,
            spellcheck,
        };
    } catch (e) {
        console.error(e);
        error(500, "Failed to fetch results");
    }
};
