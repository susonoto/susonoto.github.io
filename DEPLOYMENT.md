# Deployment Guide

This guide covers publishing the static portfolio website.

## Before publishing

- [ ] `config.js` has the correct GitHub username and display name.
- [ ] `index.html` title and description reflect the portfolio.
- [ ] The site works at `http://localhost:8080`.
- [ ] Search, language filtering, sorting, and repository links work.
- [ ] No secrets or personal access tokens are present in the files.
- [ ] You have reviewed repository descriptions and pinned the strongest projects.

## GitHub Pages: branch deployment

1. Create a public repository. For a personal website, use `susonoto.github.io`.
2. Put the contents of this folder in the repository root.
3. Commit and push the default branch.
4. Open **Settings → Pages**.
5. Choose **Deploy from a branch**, then select the default branch and `/ (root)`.
6. Save and wait for deployment.
7. Verify the URL shown in Pages settings.

## GitHub Pages: Actions deployment

An optional workflow is included at `.github/workflows/pages.yml`.

1. Push the files to your repository.
2. In **Settings → Pages**, choose **GitHub Actions** as the source.
3. In **Settings → Actions → General**, ensure the repository allows workflows to run and has the permissions required to deploy Pages.
4. Push a commit to the default branch or manually run the workflow from the Actions tab.
5. Confirm the workflow completes successfully.

If you only want branch-based deployment, you do not need the Actions workflow.

## Other static hosts

For Netlify, Cloudflare Pages, or Vercel, use the folder containing `index.html` as the publish/output directory and leave the build command blank. There is no bundler or compilation step.

## Post-deployment verification

- Open the site in a private/incognito window.
- Confirm the repository list loads.
- Try a search term and a language filter.
- Open a project card and confirm the destination URL is correct.
- Test the mobile layout using browser responsive mode.
- Review the browser console and network requests for errors.
