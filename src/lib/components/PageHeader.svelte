<script lang="ts">
    import type { Snippet } from "svelte";

    import Date from "./Date.svelte";
    import Image from "./Image.svelte";

    let {
        date,
        extra,
        image,
        subtitle,
        title,
    }: {
        date?: globalThis.Date;
        extra?: Snippet;
        image: string;
        subtitle?: Snippet | string;
        title: Snippet | string;
    } = $props();
</script>

<header class="-mt-8 flex max-h-screen flex-col md:-mt-16">
    <Image
        class="h-auto w-screen max-w-none flex-1 shrink object-cover"
        alt=""
        url={image}
    />

    <div class="flex flex-col items-center px-8 py-16 text-center md:px-16">
        <h2 class="h1 text-gold-1">
            {title}
        </h2>

        {#if subtitle}
            <p class="h3 text-grey-1.5">
                {subtitle}
            </p>
        {/if}

        {#if date}
            <p class="stat-number">
                <Date {date} format="long-date" />
            </p>
        {/if}

        {#if extra}
            <div class="mt-4">{@render extra()}</div>
        {/if}
    </div>
</header>
