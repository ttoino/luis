<script lang="ts">
    import { resolve } from "$app/paths";
    import logoImage from "$lib/images/logo.svg";
    import { MetaTags } from "svelte-meta-tags";
</script>

<MetaTags
    description="Discover the League of Legends Universe"
    openGraph={{
        images: [
            {
                url: logoImage,
            },
        ],
        siteName: "LUIS",
        title: "Home",
        type: "website",
    }}
    title="Home"
    titleTemplate="%s - LUIS"
/>

<enhanced:img class="h-auto w-32 md:w-64" alt="" src="$lib/images/home.webp" />
<h1 class="h3 text-gold-4">
    <span>Discover the League of Legends Universe</span>
</h1>
<h2 class="h4 mb-10 text-gold-2">
    <span>Dive into this magical world full of wonders and fantasy...</span>
</h2>

<a
    class="h3 group bg-linear-to-br from-gold-5 via-gold-4 to-gold-1 bg-size-[200%_200%] p-[4px] transition-all duration-300 hover:bg-position-[100%_100%] hover:shadow-lg"
    href={resolve("/search")}
>
    <span
        class="inline-block bg-linear-to-bl from-blue-4 via-blue-5 to-blue-6 bg-size-[200%_200%] bg-position-[0%_100%] px-12 py-2 text-gold-1 transition-all duration-300 group-hover:bg-position-[100%_0%] group-hover:text-gold-4"
    >
        All stories
    </span>
</a>
