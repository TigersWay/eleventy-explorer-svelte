<script>
	import { Select as SelectPrimitive } from "bits-ui";
	import { IconChevronUp } from '@tabler/icons-svelte';
	import { cn } from "$lib/utils.js";

	let {
		ref = $bindable(null),
		class: className,
		...restProps
	} = $props();
</script>

<SelectPrimitive.ScrollUpButton
	bind:ref
	data-slot="select-scroll-up-button"
	class={cn("z-10 flex cursor-default items-center justify-center bg-popover py-1 [&_svg:not([class*='size-'])]:size-3.5 top-0 w-full", className)}
	{...restProps}
>
	<IconChevronUp  />
</SelectPrimitive.ScrollUpButton>