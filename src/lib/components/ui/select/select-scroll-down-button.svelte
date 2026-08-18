<script>
  import { Select as SelectPrimitive } from 'bits-ui';
  import { IconChevronDown } from '@tabler/icons-svelte-runes';
  import { cn } from '$lib/utils.js';

  let { ref = $bindable(null), class: className, ...restProps } = $props();
</script>

<SelectPrimitive.ScrollDownButton
  bind:ref
  data-slot="select-scroll-down-button"
  class={cn("bottom-0 z-10 flex w-full cursor-default items-center justify-center bg-popover py-1 [&_svg:not([class*='size-'])]:size-3.5", className)}
  {...restProps}
>
  <IconChevronDown />
</SelectPrimitive.ScrollDownButton>
