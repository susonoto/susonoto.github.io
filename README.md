# susonoto — GitHub Repositories Marketing Website

A responsive, static portfolio website that turns your public GitHub repositories into a searchable project showcase. The site is configured for **[github.com/susonoto](https://github.com/susonoto)** and retrieves repository metadata directly from GitHub's public REST API.

> **No build step and no API token are required** for basic public repository discovery. Serve the files over HTTP, or publish them using GitHub Pages or another static host.

## Contents

- [Features](#features)
- [Quick start](#quick-start)
- [Configuration](#configuration)
- [Run locally](#run-locally)
- [Deployment](#deployment)
- [Project structure](#project-structure)
- [How repository loading works](#how-repository-loading-works)
- [Troubleshooting](#troubleshooting)
- [Accessibility and browser support](#accessibility-and-browser-support)
- [Security and privacy](#security-and-privacy)
- [Contributing](#contributing)
- [License](#license)

## Features

- Loads public repositories for the configured GitHub account.
- Search across repository names, descriptions, and language metadata.
- Language filtering and sorting options.
- Repository cards with links, stars, forks, and last-updated information.
- Optional featured repositories and settings to include forks or archived repositories.
- Responsive desktop and mobile layouts.
- Keyboard shortcut `/` to focus the search field and `Escape` to leave it.
- Static hosting compatible: no server-side application or database.
- MIT open-source license and contribution guidance included.

## Quick start

1. Download and extract this ZIP archive.
2. Open the `github-portfolio-site` folder.
3. Confirm that `config.js` contains your GitHub username (`susonoto`).
4. Start a local web server using the steps below.
5. Open the local URL in your browser.

## Run locally

Python 3 is sufficient; there are no package installations or build commands.

```bash
cd github-portfolio-site
python3 -m http.server 8080
```

Then visit <http://localhost:8080>.

Alternatively, use the **Live Server** extension in Visual Studio Code. Serving the site over HTTP is recommended instead of opening `index.html` directly using a `file://` URL.

## Configuration

Edit `config.js`. Example:

```js
window.PORTFOLIO_CONFIG = {
  githubUsername: "susonoto",
  ownerName: "susonoto",
  tagline: "Building tools, exploring ideas, sharing code.",
  featuredRepos: ["repository-name", "another-project"],
  includeForks: false,
  includeArchived: true,
  perPage: 100
};
```

| Setting | Purpose | Guidance |
|---|---|---|
| `githubUsername` | GitHub account whose public repositories are loaded | Required. Use the exact username, without `@` or a URL. |
| `ownerName` | Display name used in the website copy | Change to your preferred public/portfolio name. |
| `tagline` | Short hero statement | Keep it concise and relevant to your work. |
| `featuredRepos` | Repository names to prioritize/highlight | Use repository names, not full URLs. Leave empty to disable pinning. |
| `includeForks` | Whether forked repositories appear in the grid | `false` hides forks; `true` includes them. |
| `includeArchived` | Whether archived repositories appear in the grid | `true` includes archived projects. |
| `perPage` | Maximum repositories requested in one API response | GitHub's REST API permits up to 100 per page. Accounts with more than 100 repositories may need pagination. |

After changing `config.js`, refresh the page. If you customize the HTML, CSS, or JavaScript, keep a backup or use Git to track changes.

## Deployment

### Option A — GitHub Pages (recommended)

1. Create a repository to host the site. For a user site, the repository name should be `susonoto.github.io`. For a project site, any repository name can be used.
2. Upload the **contents** of the `github-portfolio-site` folder to the repository root. Do not upload the ZIP itself as the site content.
3. Commit and push the files to your default branch.
4. Open the repository on GitHub and go to **Settings → Pages**.
5. Under the build/deployment settings, select **Deploy from a branch**, choose your default branch and the `/ (root)` folder, then save.
6. Wait for the Pages deployment to finish. GitHub will show the published URL in the Pages settings.
7. Open the published URL and check that repository cards load.

A GitHub Actions workflow is also included in `.github/workflows/pages.yml`. If you prefer the Actions deployment route, select **GitHub Actions** as the Pages source and make sure the repository has permission to deploy Pages.

### Option B — Netlify

1. Push the site files to a Git repository.
2. Import that repository into Netlify.
3. Choose no build command.
4. Set the publish directory to `github-portfolio-site` if the repository contains the parent project folder, or `.` if the site files are at repository root.
5. Deploy.

### Option C — Cloudflare Pages

1. Connect your Git repository to Cloudflare Pages.
2. Choose no framework preset.
3. Leave the build command empty.
4. Set the build output directory to the directory containing `index.html`.
5. Deploy.

### Option D — Vercel

1. Import the repository into Vercel.
2. Choose the static/no-framework option.
3. Leave the build command empty.
4. Set the output directory to the folder containing `index.html`.
5. Deploy.

### Custom domain

Configure the custom domain with your hosting provider first, then follow that provider's DNS and HTTPS instructions. Do not commit private credentials, API tokens, or account secrets to this public repository.

## Project structure

```text
github-portfolio-site/
├── index.html                  # Page structure and portfolio copy
├── styles.css                  # Layout, theme, and responsive styles
├── script.js                   # GitHub API requests, filters, and cards
├── config.js                   # Username and display options
├── LICENSE                     # MIT license
├── README.md                   # Main setup and usage guide
├── DEPLOYMENT.md               # Hosting instructions and checklist
├── ARCHITECTURE.md              # Code overview and data flow
├── CONTRIBUTING.md              # Contribution guidelines
├── CODE_OF_CONDUCT.md           # Community participation guidelines
├── SECURITY.md                  # Security reporting guidance
├── CHANGELOG.md                 # Version history
├── .nojekyll                    # Prevents Jekyll processing on Pages
└── .github/
    ├── PULL_REQUEST_TEMPLATE.md
    ├── ISSUE_TEMPLATE/
    │   ├── bug_report.md
    │   └── feature_request.md
    └── workflows/
        └── pages.yml            # Optional GitHub Pages Actions deployment
```

## How repository loading works

1. The browser loads `index.html`, `styles.css`, `config.js`, and `script.js`.
2. `script.js` reads the configured username.
3. The browser requests public repository metadata from GitHub's REST API.
4. The JavaScript builds project cards and populates search, language filters, and sorting.
5. Visitors open repository links directly on GitHub.

The site does not clone repositories, read private repositories, or modify repository contents. It is a front-end presentation layer over public GitHub metadata.

## Troubleshooting

### No repositories appear

- Check that `githubUsername` is spelled correctly in `config.js`.
- Check that the account has public repositories.
- Open browser Developer Tools → **Console** and **Network** to inspect API errors.
- Try refreshing after a short wait if GitHub rate limits have been reached.

### The site works locally but not after deployment

- Confirm that `index.html`, `script.js`, `styles.css`, and `config.js` are in the published output directory.
- Check the Pages/hosting deployment log.
- Use relative asset paths if you move the site into a subdirectory.
- Check the browser console for missing-file or JavaScript errors.

### API rate limit message

Unauthenticated requests to GitHub's API are rate-limited. Avoid repeated refresh loops, and try again later. If you need a higher quota, review GitHub's current REST API authentication documentation. Never put a personal access token in client-side JavaScript for a public website; visitors could read it.

### More than 100 repositories

`perPage: 100` requests up to 100 repositories. If the account has more than that, add API pagination to `script.js` before expecting all repositories to appear.

### Wrong featured order

Ensure `featuredRepos` contains exact repository names, without the owner prefix or URL. Repository names are case-sensitive in the configuration logic unless the implementation explicitly normalizes them.

## Accessibility and browser support

The site is designed to use semantic HTML and responsive CSS. Test it with keyboard-only navigation, a screen reader if available, and current versions of Firefox, Chrome, Edge, and Safari. If you change colors or fonts, preserve readable contrast and visible focus states.

## Security and privacy

- Only public repository metadata is requested.
- No backend, database, or analytics service is included by default.
- Do not add passwords, tokens, private keys, or other secrets to `config.js`.
- Review third-party dependencies before adding any; the base site does not require a package manager.
- See [SECURITY.md](SECURITY.md) for reporting security issues.

## Contributing

Issues and pull requests are welcome. Please read [CONTRIBUTING.md](CONTRIBUTING.md), use the included issue templates, and keep changes focused.

## License

This project is distributed under the **MIT License**. See [LICENSE](LICENSE) for the full license text.
