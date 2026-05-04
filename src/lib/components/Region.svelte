<script lang="ts">
    import type { Region } from "$lib/schemas/documents";

    import { resolve } from "$app/paths";

    import Preview from "./Preview.svelte";

    let { region }: { region: Region } = $props();
</script>

<Preview
    href={resolve("/region/[region]", { region: region.slug })}
    image={region.image}
>
    {#snippet title()}{region.name}{/snippet}
    <!-- eslint-disable-next-line svelte/no-at-html-tags -->
    {#snippet content()}{@html region.description}{/snippet}
</Preview>
