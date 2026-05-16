<script lang="ts">
    /* eslint-disable svelte/no-navigation-without-resolve */
    import { page } from "$app/state";
    import { ChevronLeft, ChevronRight, Icon } from "svelte-hero-icons";

    let { current, pages }: { current: number; pages: number } = $props();

    let hrefToPage = $derived((to: number) => {
        // eslint-disable-next-line svelte/prefer-svelte-reactivity
        const params = new URLSearchParams(page.url.searchParams);
        params.set("page", to.toString());
        return `?${params.toString()}`;
    });
</script>

{#if pages > 1}
    <div class="mt-8 max-w-full snap-x snap-mandatory overflow-auto">
        <nav
            class="stat-number grid w-max auto-cols-[1fr] grid-flow-col items-stretch justify-center leading-none"
        >
            {#if current > 1}
                <a
                    class="inline-flex snap-center items-center justify-center border-2 border-l-0 border-gold-4 p-2 text-gold-1 first:border-l-2"
                    href={hrefToPage(current - 1)}
                >
                    <Icon class="h-[1em] w-[1em]" src={ChevronLeft} />
                </a>
            {/if}

            {#each Array(pages).keys() as page (page)}
                <a
                    class="inline-flex snap-center items-center justify-center border-2 border-l-0 border-gold-4 p-2 text-gold-1 first:border-l-2"
                    class:text-gold-1={page + 1 === current}
                    href={hrefToPage(page + 1)}
                >
                    {page + 1}
                </a>
            {/each}

            {#if current < pages}
                <a
                    class="inline-flex snap-center items-center justify-center border-2 border-l-0 border-gold-4 p-2 text-gold-1 first:border-l-2"
                    href={hrefToPage(current + 1)}
                >
                    <Icon class="h-[1em] w-[1em]" src={ChevronRight} />
                </a>
            {/if}
        </nav>
    </div>
{/if}
