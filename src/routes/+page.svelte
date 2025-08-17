<script lang="ts">
import ActivityMap from "$lib/components/ActivityMap.svelte";
import { config } from "$lib/stores/config.js";
import "mapbox-gl/dist/mapbox-gl.css";
</script>

<ActivityMap config={$config} />

<svelte:head>
    <title>Ridelines - intervals.icu activity mapper</title>
</svelte:head>
