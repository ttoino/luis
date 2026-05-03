<script lang="ts">
    import Pagination from "$lib/components/Pagination.svelte";
    // import Profile from "$lib/components/Profile.svelte";
    import Story from "$lib/components/Story.svelte";
    import logoImage from "$lib/images/logo.svg";
    import { MetaTags } from "svelte-meta-tags";
    import { fly } from "svelte/transition";

    let { data } = $props();
</script>

<MetaTags
    description="Search results for {data.query}"
    openGraph={{
        images: [
            {
                url: logoImage,
            },
        ],
        siteName: "LUIS",
        title: data.query || "Search",
        type: "website",
    }}
    title={data.query || "Search"}
    titleTemplate="%s - LUIS"
/>

<h2 class="h1 mb-4 self-start">
    {#if data.query}
        Search results for <span class="italic">{data.query}</span>
    {:else}
        All stories
    {/if}
</h2>

<!-- {#if data.spellcheck && data.spellcheck.length > 0}
    <p class="mb-4 self-start">
        Did you mean
        {#each data.spellcheck as spellcheck, i (i)}
            {i > 0 ? " or " : ""}
            <a
                class="text-gold-3 italic"
                href="?query={encodeURIComponent(spellcheck)}"
            >
                {spellcheck}</a
            >{/each}?
    </p>
{/if} -->

<ol
    class="grid grid-cols-[repeat(auto-fill,minmax(min(--spacing(72),100%),1fr))] gap-4 self-stretch"
>
    <!-- {#if data.profile != null}
        <li class="col-span-full border-b-2 border-gold-4 pb-4">
            <Profile profile={data.profile} />
        </li>
    {/if} -->

    {#each data.results.filter((story) => story.type === "story") as story, i (story.slug)}
        <li
            in:fly={{
                delay: 100 * i,
                y: 100,
            }}
        >
            <Story {story} />
        </li>
    {:else}
        <p>No results found</p>
    {/each}
</ol>

<Pagination current={data.current} pages={data.pages} />
