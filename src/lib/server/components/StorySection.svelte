<script lang="ts">
    import type { StorySection } from "$lib/schemas/universe.js";

    let section: StorySection = $props();
</script>

{#each section["story-subsections"] as subsection, j (j)}
    {#if subsection["icon-image"]}
        <!-- svelte-ignore a11y_missing_attribute -->
        <img src={subsection["icon-image"].uri} />
    {/if}

    <!-- eslint-disable-next-line svelte/no-at-html-tags -->
    {@html subsection.content}
{/each}
