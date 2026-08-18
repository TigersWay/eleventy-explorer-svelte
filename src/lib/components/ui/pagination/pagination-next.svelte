<script>
  import { Pagination as PaginationPrimitive } from 'bits-ui';
  import { IconChevronRight } from '@tabler/icons-svelte-runes';
  import { buttonVariants } from '$lib/components/ui/button/index.js';
  import { cn } from '$lib/utils.js';

  let { ref = $bindable(null), class: className, ...restProps } = $props();
</script>

<PaginationPrimitive.NextButton bind:ref aria-label="Go to next page" class={cn(buttonVariants({ variant: 'ghost', size: 'default' }), 'pr-2!', className)} {...restProps}>
  <span class="cn-pagination-next-text hidden sm:block">Next</span>
  <IconChevronRight data-icon="inline-end" />
</PaginationPrimitive.NextButton>
