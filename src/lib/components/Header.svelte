<script lang="ts">
    import { resolve } from "$app/paths";
    import { Home, Icon } from "svelte-hero-icons";

    import SearchBar from "./SearchBar.svelte";
</script>

<header
    class="sticky top-0 z-50 flex flex-row flex-wrap items-center justify-between gap-x-4 self-stretch bg-linear-to-b from-blue-6 to-blue-7 p-4 shadow-xl sm:flex-nowrap"
>
    <a class="p-2 text-gold-3" href={resolve("/")}><Icon class="h-8 w-8" src={Home} /></a>

    <h1 class="h3 mr-auto text-gold-3">
        <span class="sr-only">LoL Universe Indexing and Search</span>
        <enhanced:img
            class="h-[1.5em] w-auto"
            alt=""
            src="$lib/images/logo.svg"
        />
    </h1>

    <SearchBar />
</header>
