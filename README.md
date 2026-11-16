# atrams.cc — Vedant Atram's portfolio

A plain static site: HTML, CSS and a little JavaScript. No build step.

## Structure

- `index.html`: home (work)
- `about.html`: about
- `thinking.html`: writing
- `invisible-obstacles.html`: case study
- `cerave.html`: case study
- `prototypes/invisible-obstacles/`: coded form prototype
- `prototypes/cerave/`: coded CeraVe prototype
- `assets/`, `vid/`: images and videos
- `Vedant-Atram-Resume.pdf`: resume (opens in a new tab)
- `CNAME`: tells GitHub Pages to serve the site at atrams.cc

## Edit in VS Code

1. Install VS Code and the **Live Server** extension.
2. Clone this repository (Source Control → Clone Repository), or open the folder.
3. Right-click `index.html` → **Open with Live Server** to preview changes as you save.
4. Commit and push. GitHub Pages republishes the site in about a minute.

## Hosting (GitHub Pages)

Repository → Settings → Pages:
- Source: **Deploy from a branch**, branch `main`, folder `/ (root)`
- Custom domain: `atrams.cc`, then tick **Enforce HTTPS** once it's available

DNS at your domain registrar:

| Type  | Host / Name | Value                 |
|-------|-------------|-----------------------|
| A     | @           | 185.199.108.153       |
| A     | @           | 185.199.109.153       |
| A     | @           | 185.199.110.153       |
| A     | @           | 185.199.111.153       |
| CNAME | www         | YOUR-GITHUB-USERNAME.github.io |

Remove any other A, AAAA or CNAME records for `@` and `www` (for example, ones from your previous site builder).
