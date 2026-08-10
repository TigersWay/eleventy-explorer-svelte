<script>
	import { IconDots } from '@tabler/icons-svelte';
	import { cn } from "$lib/utils.js";
	let {
		ref = $bindable(null),
		class: className,
		...restProps
	} = $props();
</script>

<span
	bind:this={ref}
	aria-hidden="true"
	data-slot="pagination-ellipsis"
	class={cn("size-7 items-center justify-center [&_svg:not([class*='size-'])]:size-3.5 flex items-center justify-center", className)}
	{...restProps}
>
	<IconDots  />
	<span class="sr-only">More pages</span>
</span>