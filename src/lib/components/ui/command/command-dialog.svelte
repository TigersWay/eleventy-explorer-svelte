<script>
	import * as Dialog from "$lib/components/ui/dialog/index.js";
	import { cn } from "$lib/utils.js";
	import Command from "./command.svelte";
	let {
		open = $bindable(false),
		ref = $bindable(null),
		value = $bindable(""),
		title = "Command Palette",
		description = "Search for a command to run...",
		showCloseButton = false,
		portalProps,
		children,
		class: className,
		...restProps
	} = $props();
</script>

<Dialog.Root bind:open {...restProps}>
	<Dialog.Header class="sr-only">
		<Dialog.Title>{title}</Dialog.Title>
		<Dialog.Description>{description}</Dialog.Description>
	</Dialog.Header>
	<Dialog.Content
		class={cn("rounded-xl! p-0 top-1/3 translate-y-0 overflow-hidden p-0", className)}
		{showCloseButton}
		{portalProps}
	>
		<Command {...restProps} bind:value bind:ref {children} />
	</Dialog.Content>
</Dialog.Root>