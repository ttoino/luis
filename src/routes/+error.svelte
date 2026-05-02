<script lang="ts">
    import { page } from "$app/state";
    import errorImage from "$lib/images/error.webp";
</script>

<img class="h-auto w-32 md:w-64" alt="Error" src={errorImage} />
<h2 class="h1 text-gold-1">{page.status}</h2>
<h3 class="h2">{page.error?.message}</h3>
