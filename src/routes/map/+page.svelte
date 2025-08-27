<script lang="ts">
import { onMount } from "svelte";
import ActivityMap from "$lib/components/ActivityMap.svelte";
import { config } from "$lib/stores/config.js";
import { requireAuth } from "$lib/utils/auth-guard.js";
import "maplibre-gl/dist/maplibre-gl.css";

// Protect this route
onMount(async () => {
	await requireAuth();
});
</script>

<ActivityMap config={$config} />

<svelte:head>
    <title>Ridelines - Activity Map</title>
</svelte:head>