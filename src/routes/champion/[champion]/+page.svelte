<script lang="ts">
    import PageHeader from "$lib/components/PageHeader.svelte";
    import { MetaTags } from "svelte-meta-tags";

    let { data } = $props();
</script>

<MetaTags
    description={data.champion.description}
    openGraph={{
        article: {
            publishedTime: data.champion.releaseDate.toISOString(),
        },
        images: [
            {
                url: data.champion.image,
            },
        ],
        siteName: "LUIS",
        title: data.champion.name,
        type: "article",
    }}
    title={data.champion.name}
    titleTemplate="%s - LUIS"
/>

<PageHeader
    date={data.champion.releaseDate}
    image={data.champion.image}
    subtitle={data.champion.title}
    title={data.champion.name}
/>

<section
    class="prose transition-[font-size,line-height] xl:prose-lg prose-img:mx-auto"
>
    <!-- eslint-disable-next-line svelte/no-at-html-tags -->
    {@html data.champion.description}

    <hr class="my-8!" />

    <!-- eslint-disable-next-line svelte/no-at-html-tags -->
    {@html data.champion.bio}
</section>
