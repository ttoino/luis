<script lang="ts">
    let {
        section = $bindable(),
        sections,
    }: {
        section: number;
        sections: number;
    } = $props();
</script>

<div class="flex flex-row gap-4">
    <!-- eslint-disable-next-line @typescript-eslint/no-unused-vars -->
    {#each { length: sections } as _, i (i)}
        <label class="-m-2 cursor-pointer p-2" for="section-{i}">
            <span class="sr-only">Section {i + 1}</span>
            <input
                id="section-{i}"
                name="section"
                class="peer sr-only"
                type="radio"
                value={i}
                bind:group={section}
            />
            <div
                class="size-2.5 rotate-45 border border-gold-4 bg-gold-7 from-blue-4 to-blue-5 peer-checked:bg-radial"
            ></div>
        </label>
    {/each}
</div>
