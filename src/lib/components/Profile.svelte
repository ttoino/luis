<script lang="ts">
    import type { Champion } from "$lib/schemas/documents.js";

    import { resolve } from "$app/paths";

    import Image from "./Image.svelte";

    export let profile: { content: string } & Champion;
</script>

<article
    class="group relative flex h-full flex-row gap-0.5 bg-linear-to-br from-gold-5 via-gold-4 to-gold-1 bg-size-[200%_200%] p-1 transition-all duration-300 hover:bg-position-[100%_100%] hover:shadow-lg"
>
    <Image
        class="h-full w-96 object-cover"
        alt="{profile.name} icon"
        url={profile.image}
    />

    <div
        class="flex-1 bg-linear-to-bl from-blue-4 via-blue-5 to-blue-6 bg-size-[200%_200%] bg-position-[0%_100%] p-4 transition-all duration-300 group-hover:bg-position-[100%_0%]"
    >
        <a
            class="after:absolute after:inset-0"
            href={resolve("/champion/[champion]", { champion: profile.slug })}
        >
            <h3
                class="h4 truncate text-gold-3 transition-colors duration-300 group-hover:text-gold-1"
            >
                {profile.name}, {profile.title}
            </h3>
        </a>

        <blockquote
            class="bold-label italic transition-colors duration-300 group-hover:text-gold-3"
        >
            {profile.quote}
        </blockquote>

        {#if profile.races?.length > 0}
            <ul class="inline-flex flex-row flex-wrap gap-x-[1ch]">
                {#each profile.races as race, i (i)}
                    <li
                        class="bold-label transition-colors duration-300 group-hover:text-gold-3 before:text-grey-1.5 before:transition-colors before:duration-300 group-hover:before:text-grey-1 after:text-grey-1.5 after:transition-colors after:duration-300 after:content-[','] group-hover:after:text-grey-1 first:before:content-['is_'] last:after:content-none"
                    >
                        {race}
                    </li>
                {/each}
            </ul>
        {/if}

        {#if profile.region}
            <p
                class="bold-label transition-colors duration-300 group-hover:text-gold-3 before:text-grey-1.5 before:transition-colors before:duration-300 before:content-['from_'] group-hover:before:text-grey-1"
            >
                {profile.region}
            </p>
        {/if}

        <section
            class="prose line-clamp-3 truncate whitespace-normal text-grey-1.5 transition-colors duration-300 group-hover:text-grey-1 prose-p:m-0 prose-hr:hidden"
        >
            <!-- eslint-disable-next-line svelte/no-at-html-tags -->
            {@html profile.content}
        </section>
    </div>
</article>
