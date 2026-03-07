<p align="center">
  <img src="./n_logo.png" alt="nesporov.dev logo" width="96" />
</p>

<h1 align="center">nesporov.dev</h1>

<p align="center">
  Personal website and app showcase for iOS engineer Nikita Nesporov.
</p>

<p align="center">
  <a href="https://nesporov.dev">Website</a> •
  <a href="https://github.com/defolty">GitHub</a> •
  <a href="https://linkedin.com/in/nikitanesporov">LinkedIn</a> •
  <a href="http://t.me/nikitanesporov/">Telegram</a>
</p>

## About

This repository contains the source code for [nesporov.dev](https://nesporov.dev), a static landing page focused on:

- iOS engineering profile and experience
- public portfolio of shipped and in-progress apps
- direct contact and support links

## Featured Apps

| App | Status | Platform | Links |
| --- | --- | --- | --- |
| Calendarity | Live | iOS | [Website](https://calendarity.app), [App Store](https://apps.apple.com/us/app/calendarity/id6747371890) |
| Bassport Pro | Live | iOS | Privacy: `/apps/bassport-pro/privacy-policy.html`, Support: `/apps/bassport-pro/support.html` |
| Bassport | Legacy | iOS | [App Store](https://apps.apple.com/am/app/bassport/id1573554303) |
| Calendar Workdays | Legacy | iOS | [App Store](https://apps.apple.com/us/app/calendar-workdays/id6475014070) |
| SlowDown | In development | watchOS | Privacy: `/apps/slowdown/privacy-policy.html`, Support: `/apps/slowdown/support.html` |

## Tech Stack

- HTML5
- CSS3
- Vanilla JavaScript
- GitHub Pages (hosting)
- GitHub Actions (deployment)

## Local Development

Run with any static server. Example:

```bash
python3 -m http.server 8080
```

Then open `http://localhost:8080`.

## Deployment

Deployment is automated via GitHub Actions on push to `main`.

- Workflow: `.github/workflows/deploy-pages.yml`
- Pages settings: `Source = GitHub Actions`
- Production domain: `https://nesporov.dev`

Full notes are available in `DEPLOYMENT.md`.

## Project Structure

```text
.
├── index.html
├── styles.css
├── script.js
├── n_logo.png
├── me.jpeg
├── apps/
└── .github/workflows/deploy-pages.yml
```

## Contact

- Telegram: [@nikitanesporov](http://t.me/nikitanesporov/)
- LinkedIn: [nikitanesporov](https://linkedin.com/in/nikitanesporov)
- GitHub: [defolty](https://github.com/defolty)
