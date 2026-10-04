# shouborno.github.io

Personal research website, built with [Astro](https://astro.build) and deployed to GitHub Pages by `.github/workflows/deploy.yml` on every push to `main`.

## Editing content

| What | File |
| --- | --- |
| Papers, theses, patents | `src/data/publications.bib` |
| Bio, research directions, news, positions, education, awards | `src/data/profile.yaml` |
| Earlier projects | `src/data/projects.yaml` |
| CV and photo | `public/cv.pdf`, `public/photo.jpg` |

Publications use standard BibTeX plus a few site fields (`topic`, `status`, `code`, `selected`, `note`), described at the top of the `.bib` file. Site fields are stripped from the BibTeX shown to readers.

## Local preview

```sh
npm install
npm run dev      # http://localhost:4321
npm run build    # static site in dist/
```
