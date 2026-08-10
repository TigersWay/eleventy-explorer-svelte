<script>
  import { repoStore as store, PAGE_SIZE } from '$lib/repoStore.svelte.js';
  import * as Pagination from '$lib/components/ui/pagination/index.js';
</script>

<Pagination.Root count={store.filtered.length} perPage={PAGE_SIZE} bind:page={store.page}>
  {#snippet children({ pages, currentPage })}
    <Pagination.Content>
      <Pagination.Item><Pagination.Previous /></Pagination.Item>
      {#each pages as page (page.key)}
        {#if page.type === 'ellipsis'}
          <Pagination.Item><Pagination.Ellipsis /></Pagination.Item>
        {:else}
          <Pagination.Item>
            <Pagination.Link {page} isActive={currentPage === page.value}>
              {page.value}
            </Pagination.Link>
          </Pagination.Item>
        {/if}
      {/each}
      <Pagination.Item><Pagination.Next /></Pagination.Item>
    </Pagination.Content>
  {/snippet}
</Pagination.Root>
