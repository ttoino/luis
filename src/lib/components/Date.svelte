<script lang="ts" module>
    const FORMATS = {
        long: {
            day: "numeric",
            hour: "numeric",
            minute: "numeric",
            month: "long",
            year: "numeric",
        },
        "long-date": {
            day: "numeric",
            month: "long",
            year: "numeric",
        },

        short: {
            day: "numeric",
            hour: "numeric",
            minute: "numeric",
            month: "short",
            year: "numeric",
        },
        "short-date": {
            day: "numeric",
            month: "short",
            year: "numeric",
        },
    } as const satisfies Record<string, Parameters<Date["toLocaleString"]>[1]>;
</script>

<script lang="ts">
    let {
        date,
        format,
    }: {
        date: ConstructorParameters<typeof Date>[0];
        format: keyof typeof FORMATS;
    } = $props();

    let dateObj = $derived(new Date(date));
    let formattedDate = $derived(
        dateObj.toLocaleDateString(undefined, FORMATS[format]),
    );
</script>

<time datetime={dateObj.toISOString()}>{formattedDate}</time>
