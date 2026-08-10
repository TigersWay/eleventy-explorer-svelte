<script module>
	import { tv } from "tailwind-variants";
	export const inputGroupAddonVariants = tv({
		base: "h-auto gap-1 py-2 text-xs/relaxed font-medium text-muted-foreground group-data-[disabled=true]/input-group:opacity-50 **:data-[slot=kbd]:rounded-[calc(var(--radius-sm)-2px)] **:data-[slot=kbd]:bg-muted-foreground/10 **:data-[slot=kbd]:px-1 **:data-[slot=kbd]:text-[0.625rem] [&>svg:not([class*='size-'])]:size-3.5 flex cursor-text items-center justify-center select-none",
		variants: {
			align: {
				"inline-start": "pl-2 has-[>button]:ml-[-0.275rem] has-[>kbd]:ml-[-0.275rem] order-first",
				"inline-end": "pr-2 has-[>button]:mr-[-0.275rem] has-[>kbd]:mr-[-0.275rem] order-last",
				"block-start": "px-2 pt-2 group-has-[>input]/input-group:pt-2 [.border-b]:pb-2 order-first w-full justify-start",
				"block-end": "px-2 pb-2 group-has-[>input]/input-group:pb-2 [.border-t]:pt-2 order-last w-full justify-start",
			},
		},
		defaultVariants: {
			align: "inline-start",
		},
	});
</script>

<script>
	import { cn } from "$lib/utils.js";
	let {
		ref = $bindable(null),
		class: className,
		children,
		align = "inline-start",
		...restProps
	} = $props();
</script>

<div
	bind:this={ref}
	role="group"
	data-slot="input-group-addon"
	data-align={align}
	class={cn(inputGroupAddonVariants({ align }), className)}
	onclick={(e) => {
		if ((e.target).closest("button")) {
			return;
		}
		e.currentTarget.parentElement?.querySelector("input")?.focus();
	}}
	{...restProps}
>
	{@render children?.()}
</div>