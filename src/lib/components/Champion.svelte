<script lang="ts">
    import type { Champion } from "$lib/schemas/documents.js";

    import { resolve } from "$app/paths";

    import Date from "./Date.svelte";
    import Preview from "./Preview.svelte";

    let { champion }: { champion: Champion } = $props();
</script>

<Preview
    href={resolve("/champion/[champion]", { champion: champion.slug })}
    image={champion.image}
>
    {#snippet title()}{champion.name}{/snippet}
    {#snippet subtitle()}
        {champion.title}, <Date
            date={champion.releaseDate}
            format="short-date"
        />
    {/snippet}
    <!-- eslint-disable-next-line svelte/no-at-html-tags -->
    {#snippet content()}{@html champion.description}{/snippet}
</Preview>
