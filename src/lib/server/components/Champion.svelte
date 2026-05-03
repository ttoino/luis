<script lang="ts">
    import type { Champion } from "$lib/schemas/documents";

    import Date from "$lib/components/Date.svelte";

    let champion: Champion = $props();
</script>

<h1 data-image={champion.image} data-slug={champion.slug}>{champion.name}</h1>
<h2>{champion.title}</h2>

<blockquote>{champion.quote}</blockquote>

<p>Released in <Date date={champion.releaseDate} format="long-date" /></p>
{#if champion.region}
    <p>From <span id="region">{champion.region}</span></p>
{/if}

<h3>Races</h3>
<ul>
    {#each champion.races as race (race)}
        <li class="race">{race}</li>
    {/each}
</ul>

<h3>Description</h3>
<!-- eslint-disable-next-line svelte/no-at-html-tags -->
<p id="description">{@html champion.description}</p>

<h3>Biography</h3>
<!-- eslint-disable-next-line svelte/no-at-html-tags -->
<div id="bio">{@html champion.bio}</div>
