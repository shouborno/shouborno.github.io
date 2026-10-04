# shouborno.github.io

Personal research website, built with [Astro](https://astro.build) and deployed to GitHub Pages by `.github/workflows/deploy.yml` on every push to `main`.

## Editing content

| What | File |
| --- | --- |
| Papers, theses, patents | `src/data/publications.bib` |
| Bio, research directions, news, positions, education, awards | `src/data/profile.yaml` |
| Earlier projects | `src/data/projects.yaml` |
| Photo | `public/photo.jpg` |

Publications use standard BibTeX plus a few site fields (`topic`, `status`, `code`, `selected`, `note`), described at the top of the `.bib` file. Site fields are stripped from the BibTeX shown to readers.

## Local preview

```sh
npm install
npm run dev      # http://localhost:4321
npm run build    # static site in dist/
```

## CV

`public/cv.pdf` is generated from the same data files by printing the unlinked `/cv-print` page with headless Chromium:

```sh
pip install playwright pypdfium2 && playwright install chromium
npm run build
python scripts/make_cv.py --png /tmp/cv-check   # writes public/cv.pdf, plus page PNGs to check
```

Rebuild the site afterwards so `dist/` carries the new PDF. The layout is tuned to two US Letter pages.
