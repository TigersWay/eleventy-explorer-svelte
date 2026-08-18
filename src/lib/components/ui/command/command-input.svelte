<script>
  import { Command as CommandPrimitive } from 'bits-ui';
  import * as InputGroup from '$lib/components/ui/input-group/index.js';
  import { IconSearch } from '@tabler/icons-svelte-runes';
  import { cn } from '$lib/utils.js';

  let { ref = $bindable(null), class: className, value = $bindable(''), ...restProps } = $props();
</script>

<div data-slot="command-input-wrapper" class="p-1 pb-0">
  <InputGroup.Root class="h-8! bg-input/20 dark:bg-input/30">
    <CommandPrimitive.Input
      {value}
      data-slot="command-input"
      class={cn('w-full text-xs/relaxed outline-hidden disabled:cursor-not-allowed disabled:opacity-50', className)}
      {...restProps}
    >
      {#snippet child({ props })}
        <InputGroup.Input {...props} bind:value bind:ref />
      {/snippet}
    </CommandPrimitive.Input>
    <InputGroup.Addon>
      <IconSearch class="size-3.5 shrink-0 opacity-50" />
    </InputGroup.Addon>
  </InputGroup.Root>
</div>
