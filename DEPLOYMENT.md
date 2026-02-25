# Deployment Guide (GitHub Pages)

## Current setup
- Static site files are in repository root.
- Auto deploy is configured in `.github/workflows/deploy-pages.yml`.
- Deployment runs on pushes to `main`.

## One-time GitHub setup
1. Open repository settings: `https://github.com/defolty/nesporov.dev/settings/pages`
2. In **Build and deployment**, choose **Source: GitHub Actions**.
3. Merge branch `codex/nesporov-dev-landing` into `main`.
4. Wait for workflow **Deploy static site to GitHub Pages** to finish.

## Custom domain (nesporov.dev)
1. In Pages settings, set **Custom domain** to `nesporov.dev`.
2. Add DNS records at your domain provider:
   - `A` record `@` -> `185.199.108.153`
   - `A` record `@` -> `185.199.109.153`
   - `A` record `@` -> `185.199.110.153`
   - `A` record `@` -> `185.199.111.153`
   - Optional `CNAME` record `www` -> `defolty.github.io`
3. Enable HTTPS in Pages after DNS is verified.

## Pending data to provide later
- App Store links for Bassport and SlowDown.
- Final ad network lines for `app-ads.txt`.
- Final logo/brand asset for replacing placeholder favicon/OG image.
