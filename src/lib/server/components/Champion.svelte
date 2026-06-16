<script lang="ts">
    import type { Champion } from "$lib/schemas/documents.js";

    import Date from "$lib/components/Date.svelte";

    let champion: Champion = $props();
</script>

<h1>{champion.name}</h1>
<h2>{champion.title}</h2>

<blockquote>{champion.quote}</blockquote>

<p>Released in <Date date={champion.releaseDate} format="long-date" /></p>
{#if champion.region}
    <p>From {champion.region}</p>
{/if}

<h3>Races</h3>
<ul>
    {#each champion.races as race (race)}
        <li>{race}</li>
    {/each}
</ul>

<h3>Description</h3>
<!-- eslint-disable-next-line svelte/no-at-html-tags -->
<p>{@html champion.description}</p>

<h3>Biography</h3>
<!-- eslint-disable-next-line svelte/no-at-html-tags -->
{@html champion.bio}
