// Minimal BibTeX reader for src/data/publications.bib.
// Handles @type{key, field = {braced {nested}} or "quoted" or bare}, and
// %-comments between entries. Enough for a hand-kept publication list.

export function parseBib(src) {
  const entries = [];
  let i = 0;
  while ((i = src.indexOf("@", i)) !== -1) {
    const open = src.indexOf("{", i);
    const type = src.slice(i + 1, open).trim().toLowerCase();
    const close = matchBrace(src, open);
    const body = src.slice(open + 1, close);
    const comma = body.indexOf(",");
    const entry = { type, key: body.slice(0, comma).trim(), raw: src.slice(i, close + 1) };
    Object.assign(entry, parseFields(body.slice(comma + 1)));
    entries.push(entry);
    i = close + 1;
  }
  return entries;
}

function matchBrace(s, open) {
  let depth = 0;
  for (let j = open; j < s.length; j++) {
    if (s[j] === "{") depth++;
    else if (s[j] === "}" && --depth === 0) return j;
  }
  throw new Error(`Unbalanced braces in BibTeX near: ${s.slice(open, open + 60)}`);
}

function parseFields(s) {
  const fields = {};
  let j = 0;
  while (j < s.length) {
    const eq = s.indexOf("=", j);
    if (eq === -1) break;
    const name = s.slice(j, eq).replace(/[,\s]/g, "").toLowerCase();
    let k = eq + 1;
    while (/\s/.test(s[k])) k++;
    let value;
    if (s[k] === "{") {
      const end = matchBrace(s, k);
      value = s.slice(k + 1, end);
      j = end + 1;
    } else if (s[k] === '"') {
      const end = s.indexOf('"', k + 1);
      value = s.slice(k + 1, end);
      j = end + 1;
    } else {
      const end = s.slice(k).search(/[,\n]/);
      value = s.slice(k, end === -1 ? undefined : k + end);
      j = end === -1 ? s.length : k + end;
    }
    fields[name] = clean(value);
  }
  return fields;
}

const clean = (v) => v.replace(/[{}]/g, "").replace(/--/g, "–").replace(/\s+/g, " ").trim();

// "Last, First and Last, First" -> ["First Last", ...] with a flag for self.
export function authors(entry, selfNames) {
  return entry.author.split(/\s+and\s+/).map((a) => {
    const [last, first] = a.split(",").map((x) => x.trim());
    const isSelf = selfNames.some((n) => n.split(",")[0].trim() === last &&
      (first ?? "").startsWith(n.split(",")[1].trim().slice(0, 1)));
    return { name: first ? `${first} ${last}` : last, self: isSelf };
  });
}

export function venue(e) {
  if (e.type === "mastersthesis") return `M.S. thesis, ${e.school}`;
  if (e.type === "phdthesis") return `Ph.D. dissertation, ${e.school}`;
  return e.booktitle || e.journal || e.howpublished || "";
}

// BibTeX shown to readers: drop the site-only fields.
const SITE_FIELDS = ["status", "topic", "code", "codelabel", "selected", "note", "arxiv"];
export function citation(e) {
  return e.raw
    .split("\n")
    .filter((line) => !SITE_FIELDS.some((f) => new RegExp(`^\\s*${f}\\s*=`).test(line)))
    .join("\n")
    .replace(/,\s*\n}$/, "\n}");
}
