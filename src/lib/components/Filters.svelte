<script>
  import { repoStore as store } from '$lib/repoStore.svelte.js';
  import * as Card from '$lib/components/ui/card/index.js';
  import * as InputGroup from '$lib/components/ui/input-group/index.js';
  import * as Command from '$lib/components/ui/command/index.js';
  import * as Popover from '$lib/components/ui/popover/index.js';
  import * as Select from '$lib/components/ui/select/index.js';
  import { Checkbox } from '$lib/components/ui/checkbox/index.js';
  import { Label } from '$lib/components/ui/label/index.js';
  import { Button } from '$lib/components/ui/button/index.js';
  import { tick } from 'svelte';
  import { cn } from '$lib/utils.js';
  import { IconCheck, IconSearch, IconSelector, IconX } from '@tabler/icons-svelte';

  const CHUNK_SIZE = 50;

  // Topics
  let topicOptions = $derived([{ value: 'all', label: 'All topics' }, ...store.topics.map((t) => ({ value: t, label: t }))]);
  const topicTrigger = $derived(topicOptions.find((o) => o.value === store.topic)?.label ?? 'All topics');
  let topicOpen = $state(false);
  let topicTriggerRef = $state(null);
  let topicSearch = $state('');
  let topicDisplayLimit = $state(CHUNK_SIZE);
  let topicActiveValue = $state('');
  let topicListRef = $state(null);
  const filteredTopics = $derived.by(() => {
    const q = topicSearch.trim().toLowerCase();
    if (!q) return topicOptions;
    return topicOptions.filter((o) => o.label.toLowerCase().includes(q));
  });
  const visibleTopics = $derived(filteredTopics.slice(0, topicDisplayLimit));
  $effect(() => {
    if (topicOpen) {
      const q = topicSearch.trim().toLowerCase();
      const selectedIndex = topicOptions.findIndex((o) => o.value === store.topic);
      if (q) {
        // Typing a new search: start with a fresh window.
        topicDisplayLimit = CHUNK_SIZE;
      } else if (selectedIndex !== -1) {
        // No search: make sure the current selection is mounted, then scroll to it.
        topicDisplayLimit = Math.max(CHUNK_SIZE, selectedIndex + 10);
        tick().then(() => {
          if (!topicListRef) return;
          const el = topicListRef.querySelector(`[data-value="${store.topic}"]`);
          el?.scrollIntoView({ block: 'nearest', behavior: 'auto' });
        });
      }
    } else {
      // Reset transient state when the popover closes.
      topicSearch = '';
      topicDisplayLimit = CHUNK_SIZE;
    }
  });
  function handleTopicKeydown(e) {
    if (e.key !== 'ArrowDown') return;
    const currentIndex = filteredTopics.findIndex((o) => o.value === topicActiveValue);
    if (currentIndex >= topicDisplayLimit - 5 && topicDisplayLimit < filteredTopics.length) {
      topicDisplayLimit = Math.min(filteredTopics.length, topicDisplayLimit + CHUNK_SIZE);
    }
  }
  function topicInfiniteScroll(node) {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          topicDisplayLimit = Math.min(filteredTopics.length, topicDisplayLimit + CHUNK_SIZE);
        }
      },
      { root: node.closest('[data-radix-scroll-area-viewport], .overflow-y-auto') || null, threshold: 0.1 }
    );
    observer.observe(node);
    return { destroy: () => observer.disconnect() };
  }
  function selectTopic(v) {
    store.setTopic(v);
    topicOpen = false;
    // Send focus back to the trigger so keyboard users can keep tabbing through the form.
    tick().then(() => topicTriggerRef?.focus());
  }

  // Languages
  let languageOptions = $derived([{ value: 'all', label: 'All languages' }, ...store.languages.map((l) => ({ value: l, label: l }))]);
  const languageTrigger = $derived(languageOptions.find((o) => o.value === store.language)?.label);

  // Sort
  const sortOptions = [
    { value: 'stars', label: 'Stars' },
    { value: 'forks', label: 'Forks' },
    { value: 'pushed', label: 'Pushed' },
    { value: 'name', label: 'Name' }
  ];
  const sortTrigger = $derived(sortOptions.find((f) => f.value === store.sort)?.label);

  // Reset filters
  let hasActiveFilters = $derived(store.search || store.topic !== 'all' || store.language !== 'all' || store.sort != 'stars' || store.hideArchived);
</script>

<Card.Root class="[--card-spacing:--spacing(3)]">
  <Card.Header>
    <Card.Title>Filters</Card.Title>
  </Card.Header>
  <Card.Content class="flex flex-col gap-4">
    <!-- nameWithOwner || description || topics -->
    <div class="flex flex-col gap-2">
      <Label for="search">Search among <i>"nameWithOwner"</i>, <i>"description"</i> and <i>"topics"</i></Label>
      <InputGroup.Root>
        <InputGroup.Input id="search" placeholder="Search..." bind:value={store.search} oninput={(e) => store.setSearch(e.currentTarget.value)} />
        <InputGroup.Addon>
          <IconSearch />
        </InputGroup.Addon>
      </InputGroup.Root>
    </div>

    <div class="flex flex-wrap items-end gap-3">
      <!-- Topics -->
      <div class="flex flex-col gap-2">
        <Label for="topics">Topics</Label>
        <Popover.Root bind:open={topicOpen}>
          <Popover.Trigger id="topics">
            {#snippet child({ props })}
              <Button {...props} bind:ref={topicTriggerRef} variant="outline" role="combobox" aria-expanded={topicOpen} class="w-60 justify-between">
                {topicTrigger}
                <IconSelector class="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            {/snippet}
          </Popover.Trigger>
          <Popover.Content class="w-60 p-0" onkeydown={handleTopicKeydown}>
            <!-- shouldFilter={false}: we filter ourselves in filteredTopics so we can also
               control how many items are actually mounted (topicDisplayLimit). -->
            <Command.Root shouldFilter={false} bind:value={topicActiveValue}>
              <Command.Input placeholder="Search topics..." bind:value={topicSearch} />
              <Command.List bind:ref={topicListRef}>
                {#if visibleTopics.length === 0}
                  <Command.Empty>No topic found.</Command.Empty>
                {/if}
                <Command.Group>
                  {#each visibleTopics as topic (topic.value)}
                    <Command.Item value={topic.value} onSelect={() => selectTopic(topic.value)}>
                      <IconCheck class={cn('mr-2 h-4 w-4', store.topic !== topic.value && 'text-transparent')} />
                      {topic.label}
                    </Command.Item>
                  {/each}
                </Command.Group>
                {#if visibleTopics.length < filteredTopics.length}
                  <div use:topicInfiniteScroll class="h-2 w-full opacity-0"></div>
                {/if}
              </Command.List>
            </Command.Root>
          </Popover.Content>
        </Popover.Root>
      </div>

      <!-- Languages -->
      <div class="flex flex-col gap-2">
        <Label for="languages">Language</Label>
        <Select.Root type="single" bind:value={store.language} onValueChange={(v) => store.setLanguage(v)}>
          <Select.Trigger id="languages" class="w-40">{languageTrigger}</Select.Trigger>
          <Select.Content class="max-h-60 overflow-y-auto">
            {#each languageOptions as option}
              <Select.Item value={option.value}>{option.label}</Select.Item>
            {/each}
          </Select.Content>
        </Select.Root>
      </div>

      <!-- Sort -->
      <div class="flex flex-col gap-2">
        <Label for="sort-by">Sort by</Label>
        <Select.Root type="single" bind:value={store.sort} onValueChange={(v) => store.setSort(v)}>
          <Select.Trigger id="sort-by" class="w-20">{sortTrigger}</Select.Trigger>
          <Select.Content>
            {#each sortOptions as option}
              <Select.Item value={option.value}>{option.label}</Select.Item>
            {/each}
          </Select.Content>
        </Select.Root>
      </div>

      <!-- Archived -->
      <div class="flex items-end">
        <div class="mb-1.5 flex gap-2">
          <Checkbox id="archived" bind:checked={store.hideArchived} onCheckedChange={(v) => store.setArchived(v)} />
          <Label for="archived">Hide "Archived"</Label>
        </div>
      </div>

      {#if hasActiveFilters}
        <div class="flex items-end">
          <Button variant="outline" onclick={() => store.clearFilters()}>
            <IconX size={14} class="text-destructive" />
            Reset
          </Button>
        </div>
      {/if}
    </div>
  </Card.Content>
</Card.Root>
