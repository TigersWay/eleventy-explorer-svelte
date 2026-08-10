<script>
  import * as Card from '$lib/components/ui/card/index.js';
  import { IconGitFork, IconStarFilled } from '@tabler/icons-svelte';

  let { repo } = $props();

  const shortNumber = (value) => Intl.NumberFormat('en', { notation: 'compact' }).format(value);

  const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });

  const timeAgo = (iso) => {
    const days = Math.floor((Date.now() - new Date(iso).getTime()) / 86_400_000);
    if (days < 30) return rtf.format(-days, 'day');
    if (days < 365) return rtf.format(-Math.floor(days / 30), 'month');
    return rtf.format(-Math.floor(days / 365), 'year');
  };
</script>

<Card.Root class="[--card-spacing:--spacing(3)]">
  <Card.Header>
    <Card.Title>
      <img class="mr-1 inline rounded" src="{repo.owner.avatarUrl}&s=40" alt={repo.owner.login} width="20" height="20" loading="lazy" />
      <a href={repo.owner.url} target="_blank">{repo.owner.login}</a>
      /
      <a href={repo.url} target="_blank">{repo.name}</a>
    </Card.Title>
  </Card.Header>
  <Card.Content class="flex h-full flex-col gap-2">
    <div class="flex justify-between">
      <div class="inline-flex gap-3">
        {#if repo.stargazerCount}
          <div><IconStarFilled class="-mt-1 mr-0.5 inline-block size-4 text-yellow-300" />{shortNumber(repo.stargazerCount)}</div>
        {/if}
        {#if repo.forkCount}
          <div><IconGitFork stroke={1.5} class="-mt-1 mr-0.5 inline-block size-4 text-violet-300" />{shortNumber(repo.forkCount)}</div>
        {/if}
      </div>
      <ul class="flex gap-1 text-xs">
        {#if repo.isArchived}
          <li class="rounded border border-yellow-400/60 bg-yellow-300/20 px-1 dark:border-yellow-600/60">Archived</li>
        {/if}
        {#if repo.isTemplate}
          <li class="rounded border border-green-400/60 bg-green-300/20 px-1 dark:border-green-600/60">Template</li>
        {/if}
        {#if repo.isFork}
          <li class="rounded border border-blue-400/60 bg-blue-300/20 px-1 dark:border-blue-600/60">Fork</li>
        {/if}
      </ul>
    </div>
    <hr />
    <div class="flex-1">{@html repo.descriptionHTML}</div>
    <ul class="flex flex-wrap gap-1 text-xs">
      {#each repo.topics as topic}
        <li class="rounded border border-blue-400/60 bg-blue-300/20 px-1 dark:border-blue-600/60"><a href="https://github.com/topics/{topic}" target="_blank">{topic}</a></li>
      {/each}
    </ul>
    <hr />
    <div class="flex justify-between gap-4">
      <div>Pushed: <span datetime={repo.pushedAt}>{timeAgo(repo.pushedAt)}</span></div>
      {#if repo.languages.length}
        <div class="flex items-center gap-1">
          <div class="size-3 rounded-full" style="background-color:{repo.languages[0].color}">&nbsp;</div>
          {repo.languages[0].name}
        </div>
      {/if}
    </div>
  </Card.Content>
</Card.Root>
