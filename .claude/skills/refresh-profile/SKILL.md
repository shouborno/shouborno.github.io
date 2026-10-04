---
name: refresh-profile
description: Update the website from a new CV PDF or LinkedIn profile PDF. Use when the user uploads a new CV or LinkedIn export, changes jobs or titles, or asks whether the site is out of date.
---

# Refresh the site from a CV or LinkedIn export

The scrapers live outside this repo, in `~/site-sources/scrapers`, so raw personal documents never land in the public repo.

## Steps

1. Parse the new source:
   - LinkedIn "Save to PDF": `~/site-sources/.venv/bin/python ~/site-sources/scrapers/linkedin_pdf.py <pdf> ~/site-sources/raw/linkedin.json`
   - CV PDF: read it directly (the Read tool handles PDFs).
2. Compare with `src/data/profile.yaml` and `src/data/publications.bib`. List each difference as a row: field, what the site says, what the new source says.
3. Ask the user which differences to apply. Newer is not always right: LinkedIn titles are often informal, and a CV may omit recent papers.
4. Apply only the approved changes. New papers go through the add-publication skill.
5. If the user gave a new CV PDF, copy it to `public/cv.pdf`.
6. `npm run build`, then screenshot the changed pages with `~/site-sources/.venv/bin/python ~/site-sources/scrapers/screenshot.py <paths>` and look at them before reporting back.
7. Commit only when asked, with no AI attribution.
