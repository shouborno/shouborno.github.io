"""Print the /cv-print page to public/cv.pdf with headless Chromium.

Run after `npm run build`:
    python scripts/make_cv.py            # writes public/cv.pdf
    python scripts/make_cv.py --png DIR  # also writes page PNGs for checking
    python scripts/make_cv.py --page resume-print --out ~/applications/resume.pdf
Needs `pip install playwright pypdfium2` and `playwright install chromium`.
"""
import argparse, functools, http.server, threading
from pathlib import Path
from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parent.parent


class Quiet(http.server.SimpleHTTPRequestHandler):
    def log_message(self, *a):
        pass


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--png", type=Path)
    ap.add_argument("--page", default="cv-print", help="print page under /, e.g. resume-print")
    ap.add_argument("--out", type=Path, default=ROOT / "public" / "cv.pdf")
    args = ap.parse_args()

    srv = http.server.ThreadingHTTPServer(
        ("127.0.0.1", 0), functools.partial(Quiet, directory=str(ROOT / "dist")))
    threading.Thread(target=srv.serve_forever, daemon=True).start()
    out = args.out
    with sync_playwright() as p:
        b = p.chromium.launch()
        pg = b.new_page()
        pg.goto(f"http://127.0.0.1:{srv.server_port}/{args.page}/", wait_until="networkidle")
        pg.evaluate("document.fonts.ready")
        pg.emulate_media(media="print", color_scheme="light")
        pg.pdf(path=str(out), prefer_css_page_size=True, print_background=True,
               tagged=True, outline=True)
        b.close()
    srv.shutdown()

    import pypdfium2 as pdfium
    doc = pdfium.PdfDocument(str(out))
    print(f"{out} written, {len(doc)} pages")
    if args.png:
        args.png.mkdir(parents=True, exist_ok=True)
        for i, page in enumerate(doc):
            page.render(scale=1.6).to_pil().save(args.png / f"{args.page}-{i + 1}.png")


if __name__ == "__main__":
    main()
