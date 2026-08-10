<script>
	import { cn } from "$lib/utils.js";
	let {
		ref = $bindable(null),
		class: className,
		children,
		...restProps
	} = $props();
</script>

<span
	bind:this={ref}
	data-slot="command-shortcut"
	class={cn("ml-auto text-[0.625rem] tracking-widest text-muted-foreground group-data-selected/command-item:text-foreground", className)}
	{...restProps}
>
	{@render children?.()}
</span>