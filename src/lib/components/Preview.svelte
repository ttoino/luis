<script lang="ts">
    import type { Snippet } from "svelte";

    import Image from "./Image.svelte";

    let {
        content,
        href,
        image,
        subtitle,
        title,
    }: {
        content: Snippet;
        href: string;
        image: string;
        subtitle?: Snippet;
        title: Snippet;
    } = $props();
</script>

<article
    class="group relative flex h-full flex-col gap-[2px] bg-linear-to-br from-gold-5 via-gold-4 to-gold-1 bg-size-[200%_200%] p-[4px] transition-all duration-300 hover:bg-position-[100%_100%] hover:shadow-lg"
>
    <Image class="aspect-video h-auto w-full object-cover" alt="" url={image} />

    <div
        class="flex-1 bg-linear-to-bl from-blue-4 via-blue-5 to-blue-6 bg-size-[200%_200%] bg-position-[0%_100%] p-4 transition-all duration-300 group-hover:bg-position-[100%_0%]"
    >
        <!-- eslint-disable-next-line svelte/no-navigation-without-resolve -->
        <a class="after:absolute after:inset-0" {href}>
            <h3
                class="h4 truncate text-gold-3 transition-colors duration-300 group-hover:text-gold-1"
            >
                {@render title()}
            </h3>
        </a>

        {#if subtitle}
            <p
                class="bold-label truncate transition-colors duration-300 group-hover:text-gold-3"
            >
                {@render subtitle()}
            </p>
        {/if}

        <section
            class="prose truncate whitespace-normal text-grey-1.5 transition-colors duration-300 group-hover:text-grey-1 prose-p:m-0 prose-a:hidden prose-img:hidden prose-hr:hidden"
            class:line-clamp-3={!!subtitle}
            class:line-clamp-4={!subtitle}
        >
            {@render content()}
        </section>
    </div>
</article>
