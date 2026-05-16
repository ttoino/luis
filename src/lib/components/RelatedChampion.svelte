<script lang="ts">
    import type { Champion } from "$lib/schemas/documents";

    import { resolve } from "$app/paths";

    import Image from "./Image.svelte";

    let { champion }: { champion: Champion } = $props();
</script>

<a
    class="flex w-36 flex-col items-center"
    href={resolve("/champion/[champion]", { champion: champion.slug })}
>
    <Image
        class="h-36 w-36 rounded-full border-4 border-gold-3 object-cover"
        alt=""
        url={champion.image}
    />

    <h4 class="h4 text-gold-1.5 mt-2 text-center text-nowrap">
        {champion.name}
    </h4>
    <p class="bold-label text-center text-nowrap text-grey-1.5">
        {champion.title}
    </p>
</a>
