<script lang="ts">
    import Date from "$lib/components/Date.svelte";
    import Image from "$lib/components/Image.svelte";
    // import RelatedChampion from "$lib/components/RelatedChampion.svelte";
    // import Story from "$lib/components/Story.svelte";
    import { MetaTags } from "svelte-meta-tags";

    let { data } = $props();
</script>

{JSON.stringify(data)}

<MetaTags
    description=""
    openGraph={{
        article: {
            authors: [data.story.subtitle],
            publishedTime: data.story.releaseDate.toISOString(),
            // tags: data.story["related_champions.name"],
        },
        images: [
            {
                url: data.story.image,
            },
        ],
        siteName: "LUIS",
        title: data.story.title,
        type: "article",
    }}
    title={data.story.title}
    titleTemplate="%s - LUIS"
/>

<Image
    class="-mt-8 max-h-[calc(100vh-20rem)] w-screen max-w-none object-cover md:-mt-16"
    alt=""
    url={data.story.image}
/>

<h2 class="h1 mt-16 text-center text-gold-1">{data.story.title}</h2>
<p class="h3 text-center text-grey-1.5 before:content-['By_']">
    {data.story.subtitle}
</p>

<p class="stat-number">
    <Date date={data.story.releaseDate} format="long-date" />
</p>

{#each data.story.sections as section, i (i)}
    <section class="prose mt-16 prose-invert">
        <!-- eslint-disable-next-line svelte/no-at-html-tags -->
        {@html section.content}
    </section>
{/each}

<!-- {#if data.otherStories.length > 0}
    <h2 class="h1 mt-16 mb-8 text-center text-gold-1">More stories</h2>
    <div class="relative max-w-full">
        <div
            class="absolute top-0 bottom-0 left-0 z-10 w-16 bg-linear-to-r from-blue-6 to-transparent"
        ></div>
        <ol
            class="relative flex max-w-full snap-x flex-row gap-8 overflow-auto px-16"
        >
            {#each data.otherStories as story (story.id)}
                <li class="w-72 max-w-full shrink-0">
                    <Story {story} />
                </li>
            {/each}
        </ol>
        <div
            class="absolute top-0 right-0 bottom-0 z-10 w-16 bg-linear-to-l from-blue-6 to-transparent"
        ></div>
    </div>
{/if}

{#if data.story["related_champions.name"]?.length > 0}
    <h2 class="h1 mt-16 mb-8 text-center text-gold-1">Related Champions</h2>
    <ul class="flex flex-row flex-wrap justify-center gap-8">
        {#each data.story["related_champions.id"] as championId, i (championId)}
            <li>
                <RelatedChampion
                    name={data.story["related_champions.name"][i]}
                    image={data.story["related_champions.image"][i]}
                    title={data.story["related_champions.title"][i]}
                />
            </li>
        {/each}
    </ul>
{/if} -->
