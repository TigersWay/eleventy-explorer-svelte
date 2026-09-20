/*
 * Fetches every repo tagged `eleventy`, `11ty` or `eleventy-plugin`
 * and writes a static JSON, consumed at runtime
 *
 * Run: bun run scripts/fetch-data.js
 */

import { Octokit } from '@octokit/core';
import { paginateGraphQL } from '@octokit/plugin-paginate-graphql';
import pAll from 'p-all';
import { green, red, yellow } from 'yoctocolors';

if (!process.env.GH_ACCESS_TOKEN) {
  console.error(red('Missing GH_ACCESS_TOKEN : add it to your .env and/or to tour workflow secrets.'));
  process.exit(1);
}

const octokit = new (Octokit.plugin(paginateGraphQL))({
  auth: process.env.GH_ACCESS_TOKEN
});

let repositoryCountError = false;

const wait = (s = 1, value = s) => new Promise((resolve) => setTimeout(() => resolve(value), s * 1000));

// GitHub's "secondary rate limit" comes back as a 403 with a specific message
// (NOT a 429, and NOT necessarily accompanied by the primary rate-limit headers).
// => It needs to be treated as transient too, or a single hiccup kills the fetch and so the whole build.

const isSecondaryRateLimit = (e) => e.status === 403 && /rate limit/i.test(e.response?.data?.message ?? e.message ?? '');

const isTransientError = (e) => [502, 503, 504].includes(e.status) || !e.status || isSecondaryRateLimit(e);

// Prefer GitHub's own 'Retry-After' header (when it gives us one), otherwise fall back
// to an increasing delay with a little jitter so concurrent queries don't all retry simultaneously.
const getRetryAfterSeconds = (e) => {
  const retryAfter = e.response?.headers?.['retry-after'];
  const parsed = retryAfter ? Number(retryAfter) : null;
  return Number.isFinite(parsed) ? parsed : null;
};

const getRepos = async (query, attempt = 1) => {
  try {
    /* cSpell:disable */
    const results = await octokit.graphql.paginate(
      `query ($queryStr: String!, $cursor: String) {
        search(query: $queryStr, type: REPOSITORY, first: 100, after: $cursor) {
          nodes {
            ...on Repository {
              nameWithOwner
              name
              description
              descriptionHTML
              url
              owner { login, url, avatarUrl }
              createdAt
              updatedAt
              pushedAt
              license: licenseInfo { name, spdxId }
              topics: repositoryTopics(first: 30) { nodes { topic { name } }, totalCount }
              languages(first:12, orderBy: {field: SIZE, direction: DESC}) { nodes { name, color }, totalCount }
              forkCount
              stargazerCount
              isFork
              isTemplate
              isArchived
              usesCustomOpenGraphImage
              openGraphImageUrl
            }
          }
          repositoryCount
          pageInfo {
            hasNextPage
            endCursor
          }
        }
        rateLimit { limit, cost, remaining, resetAt }
      }`,
      { queryStr: query }
    );
    /* cSpell:enable */
    console.log(`  "${query}" : ${results.search.nodes.length} (repositoryCount: ${results.search.repositoryCount})`);
    if (results.search.repositoryCount >= 1000) console.log(red(`  ⚠ "${query}" should get ${results.search.repositoryCount} repos : split needed.`));
    repositoryCountError ||= results.search.nodes.length != results.search.repositoryCount || results.search.repositoryCount > 1000;
    // await wait(12); // So far, impossible to be free of the "second rate limit", but ~= 2 seconds/page seems to make it work!
    return results.search.nodes;
  } catch (e) {
    if (isTransientError(e) && attempt < 6) {
      const retryAfter = getRetryAfterSeconds(e);
      const jitter = Math.random() * 5;
      const delay = retryAfter ?? attempt * 20 + jitter; // 20s, 40s, 60s, 80s, 100s (+ jitter) if no 'Retry-After' header
      const reason = isSecondaryRateLimit(e) ? 'secondary rate limit' : `status ${e.status ?? '?'}`;
      console.log(red(`  ⚠ "${query}" failed (${reason}, attempt ${attempt}), retry in ${Math.round(delay)}s...`));
      await wait(delay);
      return getRepos(query, attempt + 1);
    }
    throw new Error(`[${e.status ?? '?'}] ${e.response?.data?.message ?? e.message}`);
  }
};

const getAllRepos = async () => {
  // @octokit won't return more than 1000 objects, we need to split our request
  let repos = await pAll(
    [
      // v1.2.0
      // () => getRepos('topic:eleventy stars:>0 sort:updated'),
      // () => getRepos('topic:eleventy stars:<1 sort:updated'),
      // () => getRepos('topic:11ty -topic:eleventy sort:updated')
      // v1.3.0
      // () => getRepos('eleventy OR 11ty in:topics stars:>2 sort:updated'),
      // () => getRepos('eleventy OR 11ty in:topics stars:1..2 sort:updated'),
      // () => getRepos('eleventy OR 11ty in:topics stars:0 sort:updated'),
      // () => getRepos('topic:eleventy-plugin -topic:eleventy -topic:11ty sort:updated')
      // v2.0.0
      () => getRepos('eleventy OR 11ty in:topics stars:>2 sort:updated'),
      () => getRepos('eleventy OR 11ty in:topics stars:1..2 sort:updated'),
      () => getRepos('eleventy OR 11ty in:topics stars:0 license:MIT sort:updated'),
      () => getRepos('eleventy OR 11ty in:topics stars:0 -license:MIT sort:updated'),
      // () => getRepos('topic:eleventy-plugin -topic:eleventy -topic:11ty sort:updated')
      // v2.2.0
      () => getRepos('eleventy-website OR 11ty-website NOT eleventy NOT 11ty in:topics sort:updated'),
      () => getRepos('eleventy-plugin OR 11ty-plugin NOT eleventy NOT 11ty in:topics sort:updated'),
      () => getRepos('eleventy-template OR 11ty-template OR eleventy-starter OR 11ty-starter NOT eleventy NOT 11ty in:topics sort:updated')
    ],
    // { concurrency: 1 } // It seems impossible to run them simultaneously on Netlify! The famous "second rate limit".
    // { concurrency: 3 } // What about Cloudflare? It's working!! Going from +5mn to -2mn
    { concurrency: 2 } // Lowered from 3: the `search` endpoint's secondary rate limit is hit too often
  ).then((values) => values.flat());

  if (repositoryCountError) {
    console.error(red('--- At leat one request had an error on `repositoryCount`.'));
    process.exit(1);
  }

  // Duplicates: it seems github GraphQL gives back increasing number of duplicate
  // A sort option on the query seems to have solved that problem.
  const lookup = repos.reduce((a, e) => {
    a[e.nameWithOwner] = ++a[e.nameWithOwner] || 0;
    return a;
  }, {});
  const duplicates = repos.filter((e) => lookup[e.nameWithOwner]);
  if (duplicates.length) console.log(yellow(`--- ${duplicates.length / 2} duplicates.`));

  // And now: cleaning, flattening & sorting all these repositories
  repos = [...new Map(repos.map((repo) => [repo.nameWithOwner, repo])).values()];
  repos.forEach((repo) => {
    // Topics
    if (repo.topics.totalCount > 30) console.log(red(`  ⚠ ${repo.nameWithOwner} has ${repo.topics.totalCount} topics!`));
    repo.topics = repo.topics.nodes.map((o) => o.topic.name).sort();
    // Languages
    if (repo.languages.totalCount > 12) console.log(red(`  ⚠ ${repo.nameWithOwner} has ${repo.languages.totalCount} languages!`));
    repo.languages = repo.languages.nodes;
    // Search
    repo.search = repo.owner.login.toLowerCase() + ' ' + repo.topics.join(' ') + ' ' + (repo.description?.toLowerCase() ?? '');
  });
  // Back to default sorting: stargazerCount DESC + pushedAt DESC
  repos.sort((a, b) => b.stargazerCount - a.stargazerCount || -a.pushedAt.localeCompare(b.pushedAt));

  const languages = [...new Set(repos.map((r) => r.languages[0]?.name).filter(Boolean))].sort();
  const topics = [...new Set(repos.flatMap((r) => r.topics))].sort();

  return {
    fetchedAt: new Date().toISOString(),
    total: repos.length,
    languages,
    topics,
    repos
  };
};

console.log(green('--- Get Eleventy related repositories'));
const start = performance.now();
const results = await getAllRepos();
const seconds = (performance.now() - start) / 1000;
console.log(green(`--- ${results.total} repos (~=${Math.round(seconds)}s).`));

await Bun.write('./static/data/repos.json', JSON.stringify(results, null, 2));

console.log();
