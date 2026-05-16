<script lang="ts">
    import { resolve } from "$app/paths";

    import SearchBar from "./SearchBar.svelte";

    let scrolled = $state(false);

    function scrollAttachment(element: HTMLElement) {
        const observer = new IntersectionObserver(
            ([entry]) => {
                scrolled = !entry.isIntersecting;
            },
            { threshold: 0 },
        );

        observer.observe(element);

        return () => observer.disconnect();
    }
</script>

<div class="absolute top-0 h-px w-full" {@attach scrollAttachment}></div>

<header
    class="fixed inset-0 bottom-auto z-50 flex flex-row flex-wrap items-center justify-between gap-x-4 self-stretch bg-linear-to-b from-transparent to-transparent p-4 transition-colors data-scrolled:from-blue-6 data-scrolled:to-blue-7 data-scrolled:shadow-xl sm:flex-nowrap"
    data-scrolled={scrolled || undefined}
>
    <h1 class="h3 relative mr-auto text-gold-3">
        <a class="absolute inset-0" href={resolve("/")}>
            <span class="sr-only">LoL Universe Indexing and Search</span>
        </a>
        <enhanced:img
            class="h-[1.5em] w-auto"
            alt=""
            src="$lib/images/logo.svg"
        />
    </h1>

    <SearchBar />
</header>
