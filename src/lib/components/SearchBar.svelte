<script lang="ts">
    import type { FormEventHandler } from "svelte/elements";

    import { browser } from "$app/environment";
    import { onNavigate } from "$app/navigation";
    import { Icon, MagnifyingGlass, XMark } from "svelte-hero-icons";

    let query = browser
        ? new URLSearchParams(window.location.search).get("query")
        : "";

    let open = false;

    let timeout: number | undefined;

    const onInput: FormEventHandler<HTMLInputElement> = (e) => {
        clearTimeout(timeout);

        timeout = setTimeout(
            () => (e.target as HTMLInputElement).form?.requestSubmit(),
            200,
        );
    };

    onNavigate((event) => {
        // Don't update the query if the user is submitting a form
        if (event.type === "form") return;

        const routeQuery = new URLSearchParams(event.to?.url.search).get(
            "query",
        );
        if (routeQuery) query = routeQuery;
    });
</script>

<button
    class="p-2 sm:hidden"
    aria-hidden="true"
    onclick={() => (open = !open)}
    type="button"
>
    <Icon class="h-6 w-6" src={open ? XMark : MagnifyingGlass} />
</button>

<form
    class="grid w-full overflow-hidden transition-[grid-template-rows] sm:w-96 sm:grid-rows-1 {open
        ? 'grid-rows-[1fr]'
        : 'grid-rows-[0fr]'}"
    action="/search"
    data-sveltekit-keepfocus
>
    <div class="min-h-0">
        <div
            class="relative mt-4 bg-linear-to-tl from-gold-4 to-gold-5 p-[2px] sm:m-0"
        >
            <label class="sr-only" for="query">Query</label>
            <input
                id="query"
                name="query"
                class="min-h-0 w-full bg-linear-to-bl from-blue-5 to-blue-6 p-2 pr-12 outline-none! placeholder:text-grey-1.5"
                oninput={onInput}
                placeholder="Search"
                type="search"
                value={query}
            />
            <button
                class="absolute top-0 right-0 bottom-0 flex aspect-square h-full items-center justify-center text-gold-4"
                type="submit"
            >
                <span class="sr-only"> Search </span>
                <Icon class="h-6 w-6" src={MagnifyingGlass} />
            </button>
        </div>
    </div>
</form>
