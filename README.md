# Mostofa Najmus Sakib — personal website

Primary website address: **https://mostofa-najmus-sakib.github.io/**

The portfolio is maintained on `main` in
`Mostofa-Najmus-Sakib/Mostofa-Najmus-Sakib.github.io`. The repository's older
`gem`, `master`, and `gh-pages` branches retain their original content and history.

A responsive professional and research portfolio focused on AI, machine learning,
and computer science. Its full-screen photographic header, circular portrait,
blue sections, project grid, and alternating timeline follow the visual direction
of Eric Wadkins's classic portfolio. Built with semantic HTML, CSS, and JavaScript. There are no
runtime dependencies, external APIs, or required secrets.

## Develop locally

Use Node.js 20 or newer; Node.js 24 is used by the deployment workflow. No package
installation is necessary.

```sh
cd /workspace/Mostofa-Najmus-Sakib.github.io
npm run dev -- --host 0.0.0.0 --port 5173
```

The development server serves only the website and its public assets.

## Validate and build

```sh
npm run check
npm test
npm run build
npm run preview -- --host 0.0.0.0 --port 4173
```

The generated `dist/` folder can be deployed to any static host. Asset paths are
relative. This repository publishes at the GitHub Pages domain root, so the
primary preview needs no `--base` option. The server can also verify a project
path if needed:

```sh
npm run preview -- --base /Personal_Profile --port 4173
```

## Edit content

- `index.html`: biography, work, publications, experience, education, contact,
  social links, and search metadata.
- `assets/style.css`: layout, typography, colors, and responsive styles.
- `assets/main.js`: interactive controls and any associated content.
- `assets/resume.pdf`: downloadable résumé; replace when the résumé changes.
- `assets/`: public images, icons, and other website files.

Content is based on the owner's provided résumé, LinkedIn PDF, Google Scholar
PDF, and public GitHub profile. The source PDFs are not part of the published
website, except the résumé intentionally provided as a download. Retain the
Ph.D. candidate wording until the degree's completion is confirmed. Keep
publication titles, metrics, dates, and repository links aligned with their
original sources.

The portrait comes from the owner's existing public portfolio repository:
`Mostofa-Najmus-Sakib/mostofa-najmus-sakib-portfolio`,
`assets/mostofa_image.jpg`. Publication links were taken from the supplied
Scholar PDF and verified public research repositories. Research artifacts and
datasets are labeled separately from runnable software; industry projects do
not imply public access to internal code.

Montserrat and Source Sans Pro are self-hosted, with their SIL Open Font License
files in `assets/fonts/`. Visitors do not need to contact a font or image CDN.

The riverside hero background is original generated decorative artwork inspired
by the Boise area, not a documentary photograph. The project thumbnails are
original SVG illustrations, not screenshots of proprietary applications or
measured model outputs. The design reference was inspected through its public
source at `ewadkins/ericwadkins.com` and a public theme screenshot; Eric Wadkins's
photographs, biography, affiliations, and project content are not used here.

## Publish on GitHub Pages

The included workflow builds and deploys pushes to `main`, and can also be run
manually. In the repository's **Settings → Pages**, choose **GitHub Actions** as
the build and deployment source. Push the website files to `main`, then check the
**Deploy portfolio to GitHub Pages** workflow in Actions.

This repository contains deployment configuration; creating these files does
not itself push or publish the website.

The root address uses GitHub's reserved `<username>.github.io` repository name;
changing the default branch is not required when Pages uses GitHub Actions.
