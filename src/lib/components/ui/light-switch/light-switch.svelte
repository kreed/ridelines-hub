<!--
	Installed from @ieedan/shadcn-svelte-extras
-->

<script lang="ts">
import MoonIcon from "@lucide/svelte/icons/moon";
import SunIcon from "@lucide/svelte/icons/sun";
import { toggleMode } from "mode-watcher";
import { Button } from "$lib/components/ui/button/index.js";
import type { LightSwitchProps } from "./types";

let { variant = "outline" }: LightSwitchProps = $props();
</script>

<Button onclick={toggleMode} variant={variant === "glass" ? "ghost" : variant} size="icon" class={variant === "glass" ? "backdrop-blur-md border-black/10 bg-white/60 text-black hover:bg-white/70 dark:border-white/20 dark:bg-black/20 dark:text-white dark:hover:bg-black/30" : ""}>
	<SunIcon class="scale-100 rotate-0 !transition-all dark:scale-0 dark:-rotate-90" />
	<MoonIcon class="absolute scale-0 rotate-90 !transition-all dark:scale-100 dark:rotate-0" />
	<span class="sr-only">Toggle theme</span>
</Button>
