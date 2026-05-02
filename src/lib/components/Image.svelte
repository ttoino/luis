<script lang="ts">
    import type { HTMLImgAttributes } from "svelte/elements";

    import { browser } from "$app/environment";
    import { onMount } from "svelte";

    let {url, ...props }: {
        alt: string;
        url: string;
    } & Omit<HTMLImgAttributes, "src"> = $props();

    let loaded = $state(false);
    let src = $derived(loaded ? url : `${url}?width=100`);

    onMount(() => {
        if (browser) {
            const img = new Image();
            img.onload = () => {
                loaded = true;
            };
            img.src = url;
        }
    });
</script>

<img
    class:blur-lg={!loaded}
    {src}
    {...props}
    class="blur-0 overflow-hidden transition {props.class}"
/>
