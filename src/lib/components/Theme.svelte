<script>
  import { resetMode, mode, toggleMode, systemPrefersMode } from 'mode-watcher';
  import { Button } from '$lib/components/ui/button/index.js';

  import { IconMoon, IconSun } from '@tabler/icons-svelte-runes';

  const toggle = () => {
    if (mode.current === systemPrefersMode.current) {
      toggleMode();
    } else {
      resetMode();
    }
  };
</script>

<Button onclick={toggle} variant="outline" size="icon-lg" aria-label="Mode">
  {#if mode.current == 'light'}
    <IconMoon stroke={2} />
  {/if}
  {#if mode.current == 'dark'}
    <IconSun stroke={2} />
  {/if}
</Button>
