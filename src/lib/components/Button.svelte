<script lang="ts">
    import { Button } from "bits-ui";

    let { children, class: className, ...props }: Button.RootProps = $props();
</script>

<Button.Root
    class={[
        "stat-number group inline-block bg-linear-to-br from-gold-5 via-gold-4 to-gold-1 bg-size-[200%_200%] p-0.5 text-grey-1 transition-all not-disabled:cursor-pointer hover:bg-position-[100%_100%] disabled:bg-grey-1.5 disabled:bg-none disabled:text-grey-2",
        className,
    ]}
    {...props}
>
    <span
        class="inline-block rounded-[inherit] bg-linear-to-bl from-blue-4 via-blue-5 to-blue-6 bg-size-[200%_200%] bg-position-[0%_100%] px-4 py-2 transition-all [corner-shape:inherit] group-hover:bg-position-[100%_0%] group-not-disabled:group-hover:text-gold-1 group-disabled:bg-grey-cool group-disabled:bg-none"
    >
        {@render children?.()}
    </span>
</Button.Root>
