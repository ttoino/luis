<script lang="ts">
    import type { Story } from "$lib/schemas/documents.js";

    import Date from "$lib/components/Date.svelte";

    let story: Story = $props();
</script>

<h1>{story.title}</h1>
<h2>{story.subtitle}</h2>

<p>Released in <Date date={story.releaseDate} format="long-date" /></p>

{#each story.sections as section, i (i)}
    <div class="section">
        <h3>Section {i + 1}</h3>
        <!-- eslint-disable-next-line svelte/no-at-html-tags -->
        {@html section.content}

        <h4>Champions</h4>
        <ul>
            {#each section.champions as champion (champion.slug)}
                <li>{champion.name}</li>
            {/each}
        </ul>
    </div>
{/each}
