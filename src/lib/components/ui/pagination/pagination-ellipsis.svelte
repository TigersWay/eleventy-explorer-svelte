<script>
  import { IconDots } from '@tabler/icons-svelte-runes';
  import { cn } from '$lib/utils.js';
  let { ref = $bindable(null), class: className, ...restProps } = $props();
</script>

<span
  bind:this={ref}
  aria-hidden="true"
  data-slot="pagination-ellipsis"
  class={cn("flex size-7 items-center items-center justify-center justify-center [&_svg:not([class*='size-'])]:size-3.5", className)}
  {...restProps}
>
  <IconDots />
  <span class="sr-only">More pages</span>
</span>
