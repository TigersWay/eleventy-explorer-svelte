<script>
  import { Pagination as PaginationPrimitive } from 'bits-ui';
  import { IconChevronLeft } from '@tabler/icons-svelte-runes';
  import { buttonVariants } from '$lib/components/ui/button/index.js';
  import { cn } from '$lib/utils.js';

  let { ref = $bindable(null), class: className, ...restProps } = $props();
</script>

<PaginationPrimitive.PrevButton bind:ref aria-label="Go to previous page" class={cn(buttonVariants({ variant: 'ghost', size: 'default' }), 'pl-2!', className)} {...restProps}>
  <IconChevronLeft data-icon="inline-start" />
  <span class="cn-pagination-previous-text hidden sm:block">Previous</span>
</PaginationPrimitive.PrevButton>
