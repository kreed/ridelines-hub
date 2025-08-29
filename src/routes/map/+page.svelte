<script lang="ts">
import ActivityMap from "$lib/components/ActivityMap.svelte";
import AuthRequired from "$lib/components/AuthRequired.svelte";
import { config } from "$lib/stores/config.js";
import "maplibre-gl/dist/maplibre-gl.css";
</script>

<AuthRequired>
    <ActivityMap {config} />
</AuthRequired>

<svelte:head>
    <title>Ridelines - Activity Map</title>
</svelte:head>
