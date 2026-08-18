<script>
  import { Select as SelectPrimitive } from 'bits-ui';
  import { IconChevronUp } from '@tabler/icons-svelte-runes';
  import { cn } from '$lib/utils.js';

  let { ref = $bindable(null), class: className, ...restProps } = $props();
</script>

<SelectPrimitive.ScrollUpButton
  bind:ref
  data-slot="select-scroll-up-button"
  class={cn("top-0 z-10 flex w-full cursor-default items-center justify-center bg-popover py-1 [&_svg:not([class*='size-'])]:size-3.5", className)}
  {...restProps}
>
  <IconChevronUp />
</SelectPrimitive.ScrollUpButton>
