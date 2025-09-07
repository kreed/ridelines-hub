<script lang="ts">
import AuthRequired from "$lib/components/auth-required.svelte";
import ActivityMap from "$lib/components/map/activity-map.svelte";
import { config } from "$lib/stores/config.js";
import "maplibre-gl/dist/maplibre-gl.css";
import "$lib/styles/maplibre-overrides.css";
</script>

<ActivityMap {config} />
<AuthRequired/>

<svelte:head>
    <title>ridelines.xyz - Activity Map</title>
</svelte:head>
