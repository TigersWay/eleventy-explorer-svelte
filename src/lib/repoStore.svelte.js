export const PAGE_SIZE = 32;

class RepoStore {
  repos = $state([]);
  languages = $state([]);
  topics = $state([]);
  fetchedAt = $state(null);
  loading = $state(true);
  error = $state(null);

  // filters
  search = $state(''); // nameWithOwner || description || topics
  language = $state('all');
  topic = $state('all');
  sort = $state('stars'); // stars | forks | pushed | name
  hideArchived = $state(false);
  page = $state(1);

  filtered = $derived.by(() => {
    const words = this.search.trim().toLowerCase().split(/\s+/).filter(Boolean);
    let list = this.repos;

    if (words) {
      list = list.filter((r) =>
        words.every(
          (word) => r.nameWithOwner.toLowerCase().includes(word) || (r.description ?? '').toLowerCase().includes(word) || r.topics.some((t) => t.toLowerCase().includes(word))
        )
      );
    }
    if (this.language !== 'all') {
      list = list.filter((r) => r.languages[0]?.name === this.language);
    }
    if (this.topic !== 'all') {
      list = list.filter((r) => r.topics.includes(this.topic));
    }
    if (this.hideArchived) {
      list = list.filter((r) => !r.isArchived);
    }

    const sorted = [...list];
    switch (this.sort) {
      case 'forks':
        sorted.sort((a, b) => b.forkCount - a.forkCount);
        break;
      case 'pushed':
        sorted.sort((a, b) => new Date(b.pushedAt) - new Date(a.pushedAt));
        break;
      case 'name':
        sorted.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        sorted.sort((a, b) => b.stargazerCount - a.stargazerCount);
    }
    return sorted;
  });

  totalPages = $derived(Math.max(1, Math.ceil(this.filtered.length / PAGE_SIZE)));

  pageItems = $derived.by(() => {
    const start = (this.page - 1) * PAGE_SIZE;
    return this.filtered.slice(start, start + PAGE_SIZE);
  });

  resetPage() {
    this.page = 1;
  }

  setSearch(v) {
    this.search = v;
    this.resetPage();
  }

  setLanguage(v) {
    this.language = v;
    this.resetPage();
  }

  setTopic(v) {
    this.topic = v;
    this.resetPage();
  }

  setSort(v) {
    this.sort = v;
    this.resetPage();
  }

  setArchived(v) {
    this.hideArchived = v;
    this.resetPage();
  }

  clearFilters() {
    this.search = '';
    this.topic = 'all';
    this.language = 'all';
    this.sort = 'stars';
    this.hideArchived = false;
    this.resetPage();
  }

  goToPage(n) {
    this.page = Math.min(Math.max(1, n), this.totalPages);
  }

  async load() {
    try {
      const res = await fetch('/data/repos.json');
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      this.repos = data.repos;
      this.languages = data.languages;
      this.topics = data.topics;
      this.fetchedAt = data.fetchedAt;
    } catch (err) {
      this.error = err.message;
    } finally {
      this.loading = false;
    }
  }
}

export const repoStore = new RepoStore();
