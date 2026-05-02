<script lang="ts">
    import "./style.css";

    import { navigating } from "$app/state";
    import Footer from "$lib/components/Footer.svelte";
    import Header from "$lib/components/Header.svelte";
    import Loading from "$lib/components/Loading.svelte";

    let { children } = $props();
</script>

<div class="flex min-h-full flex-col items-center">
    <Header />

    <main
        class="flex w-full max-w-screen-2xl flex-1 flex-col items-center justify-center p-8 transition-opacity md:p-16"
        class:opacity-0={!!navigating.type}
    >
        {@render children?.()}
    </main>

    <Loading />

    <Footer />
</div>
