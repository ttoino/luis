<script lang="ts">
    import type { Story } from "$lib/schemas/documents";
    import type { Story as RawStory } from "$lib/schemas/universe";

    import Date from "$lib/components/Date.svelte";

    let story: Omit<Story, "image" | "sections"> &
        Pick<RawStory, "story-sections"> = $props();
</script>

<h1 data-image={story["story-sections"][0]["background-image"]?.uri}>
    {story.title}
</h1>
<h2>{story.subtitle}</h2>

<p>Released in <Date date={story.releaseDate} format="long-date" /></p>

{#each story["story-sections"] as section, i (i)}
    <div class="section">
        <h3>Section {i + 1}</h3>
        <div class="content">
            {#each section["story-subsections"] as subsection, j (j)}
                {#if subsection["icon-image"]}
                    <!-- svelte-ignore a11y_missing_attribute -->
                    <img src={subsection["icon-image"].uri} />
                {/if}

                <!-- eslint-disable-next-line svelte/no-at-html-tags -->
                {@html subsection.content}
            {/each}
        </div>

        <h4>Champions</h4>
        <ul>
            {#each section["featured-champions"] as champion (champion.slug)}
                <li class="champion" data-slug={champion.slug}>
                    {champion.name}
                </li>
            {/each}
        </ul>
    </div>
{/each}
