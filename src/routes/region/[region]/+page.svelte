<script lang="ts">
    import PageHeader from "$lib/components/PageHeader.svelte";
    import { MetaTags } from "svelte-meta-tags";

    let { data } = $props();
</script>

<MetaTags
    description=""
    openGraph={{
        images: [
            {
                url: data.region.image,
            },
        ],
        siteName: "LUIS",
        title: data.region.name,
        type: "article",
    }}
    title={data.region.name}
    titleTemplate="%s - LUIS"
/>

<PageHeader image={data.region.image} title={data.region.name} />

<section
    class="prose transition-[font-size,line-height] xl:prose-lg prose-img:mx-auto"
>
    <!-- eslint-disable-next-line svelte/no-at-html-tags -->
    {@html data.region.description}
</section>
