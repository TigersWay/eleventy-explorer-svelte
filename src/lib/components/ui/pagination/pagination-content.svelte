<script>
	import { cn } from "$lib/utils.js";
	let {
		ref = $bindable(null),
		class: className,
		children,
		...restProps
	} = $props();
</script>

<ul
	bind:this={ref}
	data-slot="pagination-content"
	class={cn("gap-0.5 flex items-center", className)}
	{...restProps}
>
	{@render children?.()}
</ul>