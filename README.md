# eleventy-explorer-svelte    ![GitHub tag (latest by date)](https://img.shields.io/github/v/tag/tigersway/eleventy-explorer-svelte?style=flat-square) ![GitHub last commit](https://img.shields.io/github/last-commit/tigersway/eleventy-explorer-svelte?style=flat-square) ![GitHub issues](https://img.shields.io/github/issues/tigersway/eleventy-explorer-svelte?style=flat-square)

## A little bit of history

The first [Eleventy-Explorer](https://github.com/TigersWay/eleventy-explorer) was written with eleventy-plugin-serverless — now defunct — and so only worked on Netlify, which I don't use anymore. A new — and of course different — version had to come!

This is now **eleventy-explorer-svelte**: no Eleventy at its core, but still focused on finding what others have been doing.

Built with Svelte v5 on the **Cloudflare Workers** platform, it's a simple SPA, but way faster to build:

- Cloudflare allows concurrency, while Netlify did not,
- the deploy hook to fetch all repos and rebuild everything is included in the same worker.

It's also faster and easier to use, with more filters and a URL that stays nearly the same, so you can bookmark a search.

- Search by developer name, repo name, any topic (even partial), or description,
- Filter by:
  - Topics,
  - Primary language,
  - Archived or not
- Sort by number of stars, number of forks, last push date, or name.

If you like it, if you read all this, if you found a bug, please leave me a comment or even a star. Anything is always welcome!

## Dependencies

- ![vite](https://img.shields.io/github/package-json/dependency-version/tigersway/eleventy-explorer-svelte/dev/vite)
- ![svelte](https://img.shields.io/github/package-json/dependency-version/tigersway/eleventy-explorer-svelte/dev/svelte)
- ![tailwindcss](https://img.shields.io/github/package-json/dependency-version/tigersway/eleventy-explorer-svelte/dev/tailwindcss)
- ![@octokit/core](https://img.shields.io/github/package-json/dependency-version/tigersway/eleventy-explorer-svelte/dev/@octokit/core)

## CHANGELOG

- **v2.1.2** 2026-08-22
  - Update README & dependencies

- **v2.1.1** 2026-08-18
  - Sort topics alphabetically, Github doesn't offer any order (fetch-data)
  - @tabler/icons-svelte => @tabler/icons-svelte-runes

- **v2.1.0** 2026-08-11 _URL routing_
  - sv-router (just easier)
  - hydrateFromUrl
  - syncToUrl

- **v2.0.0** 2026-08-10 _Let's start again_
