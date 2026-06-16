<script lang="ts">
    import type { Story } from "$lib/schemas/documents.js";

    import { resolve } from "$app/paths";

    import Date from "./Date.svelte";
    import Preview from "./Preview.svelte";

    let { story }: { story: Story } = $props();
</script>

<Preview
    href={resolve("/story/[story]", { story: story.slug })}
    image={story.image}
>
    {#snippet title()}{story.title}{/snippet}
    {#snippet subtitle()}
        {#if story.subtitle}
            {story.subtitle},
        {/if}
        <Date date={story.releaseDate} format="short-date" />
    {/snippet}
    <!-- eslint-disable-next-line svelte/no-at-html-tags -->
    {#snippet content()}{@html story.sections[0].content}{/snippet}
</Preview>
