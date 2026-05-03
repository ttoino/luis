<script lang="ts">
    import type { Region } from "$lib/schemas/documents";

    let region: Region = $props();
</script>

<h1>{region.name}</h1>

<!-- eslint-disable-next-line svelte/no-at-html-tags -->
<div>{@html region.description}</div>

<h3>Champions</h3>
<ul>
    {#each region.champions as champion (champion.slug)}
        <li>{champion.name}</li>
    {/each}
</ul>
