<script lang="ts">
    import Button from "$lib/components/Button.svelte";
    import PageHeader from "$lib/components/PageHeader.svelte";
    import RelatedChampion from "$lib/components/RelatedChampion.svelte";
    import Sections from "$lib/components/Sections.svelte";
    // import Story from "$lib/components/Story.svelte";
    import { MetaTags } from "svelte-meta-tags";
    import { fly } from "svelte/transition";

    let { data } = $props();

    let sentinel: HTMLDivElement;
    let section = $state(0);

    const setSection = (newSection: number) => {
        section = newSection;
        window.scroll({ behavior: "smooth", top: sentinel.offsetTop - 96 });
    };
</script>

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

{#snippet sections()}
    <div bind:this={sentinel}></div>
    <Sections
        sections={data.story.sections.length}
        bind:section={() => section, setSection}
    />
{/snippet}

<PageHeader
    date={data.story.releaseDate}
    extra={data.story.sections.length > 1 ? sections : undefined}
    image={data.story.image}
    subtitle={data.story.subtitle}
    title={data.story.title}
/>

<div class="grid">
    {#key section}
        <section
            class="col-start-1 row-start-1 prose transition-[font-size,line-height] xl:prose-lg prose-img:mx-auto"
            in:fly={{ x: 48 }}
            out:fly={{ x: -48 }}
        >
            <!-- eslint-disable-next-line svelte/no-at-html-tags -->
            {@html data.story.sections[section].content}
        </section>
    {/key}
</div>

{#if data.story.sections.length > 1}
    <div class="mt-4 flex w-full max-w-prose flex-row justify-around">
        <Button
            class="[corner-shape:bevel] supports-corner-shape:rounded-l-full supports-corner-shape:pl-1 supports-corner-shape:*:pl-6"
            disabled={section === 0}
            onclick={() => setSection(section - 1)}
            type="button">Go back</Button
        >
        <Button
            class="[corner-shape:bevel] supports-corner-shape:rounded-r-full supports-corner-shape:pr-1 supports-corner-shape:*:pr-6"
            disabled={section === data.story.sections.length - 1}
            onclick={() => setSection(section + 1)}
            type="button"
        >
            Keep reading
        </Button>
    </div>
{/if}

{#await data.relatedChampions then champions}
    {@const sectionChampions = champions[section]}
    {#if sectionChampions}
        <h3 class="h2 mt-8 mb-8 text-center text-gold-1">Featuring</h3>
        <div class="grid" in:fly={{ x: 48 }} out:fly={{ x: -48 }}>
            {#key section}
                <ul
                    class="col-start-1 row-start-1 flex flex-row flex-wrap justify-center gap-8"
                    in:fly={{ x: 48 }}
                    out:fly={{ x: -48 }}
                >
                    {#each sectionChampions as champion (champion.slug)}
                        <li><RelatedChampion {champion} /></li>
                    {/each}
                </ul>
            {/key}
        </div>
    {/if}
{/await}

<!-- TODO: Use AI Search to get other stories -->
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
{/if} -->
