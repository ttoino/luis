<script lang="ts">
    import type { Story } from "$lib/documents";

    import { resolve } from "$app/paths";

    import Image from "./Image.svelte";

    let { story }: { story: { highlighting?: string } & Story } = $props();
</script>

<article
    class="group relative flex h-full flex-col gap-[2px] bg-linear-to-br from-gold-5 via-gold-4 to-gold-1 bg-size-[200%_200%] p-[4px] transition-all duration-300 hover:bg-position-[100%_100%] hover:shadow-lg"
>
    <Image
        class="aspect-video h-auto w-full object-cover"
        alt={story.title}
        url={story.image}
    />

    <div
        class="flex-1 bg-linear-to-bl from-blue-4 via-blue-5 to-blue-6 bg-size-[200%_200%] bg-position-[0%_100%] p-4 transition-all duration-300 group-hover:bg-position-[100%_0%]"
    >
        <a
            class="after:absolute after:inset-0"
            href={resolve("/story/[story]", { story: story.id })}
        >
            <h3
                class="h4 truncate text-gold-3 transition-colors duration-300 group-hover:text-gold-1"
            >
                {story.title}
            </h3>
        </a>

        {#if story.author}
            <p
                class="bold-label truncate transition-colors duration-300 group-hover:text-gold-3 before:content-['By_']"
            >
                {story.author}
            </p>
        {/if}

        <section
            class="prose truncate whitespace-normal text-grey-1.5 transition-colors duration-300 group-hover:text-grey-1 prose-p:m-0 prose-a:hidden prose-hr:hidden"
            class:line-clamp-3={story.author}
            class:line-clamp-4={!story.author}
        >
            <!-- eslint-disable-next-line svelte/no-at-html-tags -->
            {@html story.highlighting || story.content}
        </section>
    </div>
</article>
