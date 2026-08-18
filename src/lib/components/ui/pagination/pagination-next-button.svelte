<script>
  import { Pagination as PaginationPrimitive } from 'bits-ui';
  import { IconChevronRight } from '@tabler/icons-svelte-runes';
  import { cn } from '$lib/utils.js';
  import { buttonVariants } from '../button/index.js';

  let { ref = $bindable(null), class: className, children, ...restProps } = $props();
</script>

{#snippet Fallback()}
  <span>Next</span>
  <IconChevronRight class={cn('size-4', className)} />
{/snippet}

<PaginationPrimitive.NextButton bind:ref aria-label="Go to next page" class={cn(buttonVariants({ variant: 'ghost' }), 'pr-2!', className)} {...restProps}>
  {#if children}
    {@render children?.()}
  {:else}
    {@render Fallback()}
  {/if}
</PaginationPrimitive.NextButton>
