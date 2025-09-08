<script lang="ts">
import type { HTMLAttributes } from "svelte/elements";
import { cn, type WithElementRef } from "$lib/utils.js";

let {
  ref = $bindable(null),
  class: className,
  children,
  variant = "default",
  ...restProps
}: WithElementRef<HTMLAttributes<HTMLDivElement> & { variant?: "default" | "glass" }> = $props();
</script>

<div
	bind:this={ref}
	data-slot="card"
	class={cn(
		variant === "glass"
			? "bg-white/10 backdrop-blur-md border-white/20 text-white flex flex-col gap-6 rounded-xl py-6 shadow-sm"
			: "bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm",
		className
	)}
	{...restProps}
>
	{@render children?.()}
</div>
