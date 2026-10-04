---
name: add-publication
description: Add a paper, preprint, thesis or patent to the website from a DOI, arXiv ID, BibTeX entry or title. Use when the user says a paper was accepted, published, posted to arXiv or submitted, or asks to add or update a publication on the site.
---

# Add a publication

All publications live in `src/data/publications.bib`. Pages read it at build time, so adding an entry there is the whole change.

## Steps

1. Get the metadata. In order of preference:
   - DOI: `curl -s https://api.crossref.org/works/<doi>` and read title, authors, container-title, pages, year.
   - arXiv ID: `curl -s "http://export.arxiv.org/api/query?id_list=<id>"`.
   - Pasted BibTeX: use it, but check the title and author list against the paper or Crossref.
   - Title only: search Crossref with `query.bibliographic=<title>` and confirm the match with the user.
   Never invent pages, DOIs or venues. Leave a field out rather than guess.
2. Write the entry in the existing style: aligned `=`, braces around every value, authors as `Last, First and Last, First`, page ranges with `--`. Key: `<firstauthorlast><year><shortword>`.
3. Add the site fields:
   - `topic`: one of `health`, `language`, `on-device`, `cps`, `other` (the ids of `directions` in `src/data/profile.yaml`). Older work that does not fit a current direction is `other`.
   - `code`: the repository URL, only if the repo is public (`gh api repos/<owner>/<repo> --jq .visibility`).
   - `status`: `under review` or `accepted` until it is published; remove it once there is a DOI.
   - `selected = {true}` and a one-sentence `note` only if the user wants it on the home page. At most four entries should be selected.
4. If the user's name appears in a new form, add that form to `self_names` in `profile.yaml` so it is highlighted.
5. Add a news item at the top of `news` in `profile.yaml`, dated `YYYY-MM`, one plain sentence.
6. Build and check: `npm run build`. Then open the Publications page in the built output and confirm the entry renders with the name highlighted.
7. Show the user the diff. Commit only when asked, with a plain message such as `Add <short title> (<venue> <year>)` and no AI attribution.

## Writing style

Plain sentences, no em dashes, no marketing words. Notes state what the paper does or finds, with a number when the abstract gives one.
