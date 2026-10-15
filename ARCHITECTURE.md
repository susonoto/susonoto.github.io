# Architecture

## Overview

This is a static, browser-only website. There is no server-side code, database, package manager, or build pipeline required for ordinary use.

## Files

- `index.html`: semantic page structure, headings, search controls, filters, and containers.
- `styles.css`: typography, color palette, layout, responsive behavior, and component states.
- `config.js`: small configuration object read by the main script.
- `script.js`: fetches repository metadata and renders the interactive repository list.

## Data flow

```text
Browser loads page
       |
       v
config.js exposes PORTFOLIO_CONFIG
       |
       v
script.js requests public repository metadata
       |
       v
Repository data is normalized and filtered
       |
       v
Cards are rendered in the page
       |
       +--> Search
       +--> Language filter
       +--> Sort order
       +--> Repository links
```

## API and limits

The website uses GitHub's public REST API for public repository metadata. Unauthenticated API requests have a rate limit. `perPage` is configured in `config.js` and the API allows up to 100 items per page. Pagination is needed to load more than one page of repositories.

## Extending the site

Ideas for future enhancements:

- Add API pagination for accounts with more than 100 public repositories.
- Add a manually curated “Featured projects” section with screenshots and demo links.
- Add project-specific case studies or a blog.
- Add Open Graph metadata and a custom social sharing image.
- Add automated accessibility checks to CI.
- Add a small test suite for filtering and sorting logic.

Keep client-side code free of credentials. Any secret embedded in JavaScript or HTML is visible to website visitors.
