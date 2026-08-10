<script>
  import { ModeWatcher } from 'mode-watcher';
  import Theme from '$lib/components/Theme.svelte';
  import { repoStore as store, PAGE_SIZE } from '$lib/repoStore.svelte.js';
  import Filters from '$lib/components/Filters.svelte';
  import RepoCard from '$lib/components/RepoCard.svelte';
  import Pagination from '$lib/components/Pagination.svelte';
  import { IconBrandGithub } from '@tabler/icons-svelte';

  import favicon from '$assets/favicon.svg';
  import { version } from '../package.json';

  store.load();

  const formatDate = (iso) => {
    if (!iso) return null;
    return new Date(iso).toLocaleString('en-US', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  };
</script>

<svelte:head>
  <title>Eleventy Explorer v{version}</title>
  <link rel="icon" type="image/svg+xml" href={favicon} />
</svelte:head>

<ModeWatcher />

<header class="border-b border-primary px-4">
  <div class="mx-auto flex max-w-8xl place-content-between items-center py-4">
    <div>
      <h1 class="flex items-center gap-2"><img src={favicon} alt="logo" />Eleventy Explorer</h1>
      <p class="mt-1 text-sm text-muted-foreground">
        {#if store.loading}
          Loading catalog…
        {:else}
          {#if store.filtered.length == store.repos.length}
            {store.repos.length} repos
          {:else}
            {store.filtered.length} / {store.repos.length} repos
          {/if}
          {#if store.fetchedAt}
            <span> · fetched on {formatDate(store.fetchedAt)}</span>
          {/if}
        {/if}
      </p>
    </div>
    <Theme />
  </div>
</header>

<main class="flex flex-1 flex-col gap-y-4 p-4">
  <div class="mx-auto w-full max-w-8xl"><Filters /></div>

  <div class="mx-auto w-full max-w-8xl flex-1">
    {#if store.loading}
      <div class="grid h-full place-items-center">
        <p>Loading...</p>
      </div>
    {:else if store.filtered.length === 0}
      <div class="full grid place-items-center">
        <p>No repos match these filters.</p>
      </div>
    {:else}
      <div class="grid grid-cols-[repeat(auto-fill,minmax(320px,1fr))] gap-4">
        {#each store.pageItems as repo}
          <RepoCard {repo} />
        {/each}
      </div>
    {/if}
  </div>

  <div class="mx-auto w-full max-w-8xl"><Pagination /></div>
</main>

<footer class="border-t border-primary px-4">
  <div class="mx-auto max-w-8xl py-4">
    <div class="flex items-center gap-2">
      <a href="https://github.com/tigersway/eleventy-explorer-svelte" target="_blank" rel="noreferrer" class="flex items-center gap-1 hover:text-primary">
        <IconBrandGithub stroke={1.5} class="size-5" /> eleventy-explorer-svelte
      </a>
      <span class="text-sm text-muted-foreground"> - data refreshed automatically via Cloudflare Hooks</span>
    </div>
  </div>
</footer>
