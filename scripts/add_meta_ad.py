import os, re

BLOG_DIR = r"C:\Users\HP\Desktop\PROJ1\pdf-tools\blog"

ADSTERRA_SCRIPT = '<script async src="https://pl30098202.effectivecpmnetwork.com/adf6bd92e5f3361c799bee4b22ba5781/invoke.js"></script>'
ADSTERRA_CONTAINER = '<div id="container-adf6bd92e5f3361c799bee4b22ba5781"></div>'
AD_META = (
    '<div class="ad-container" aria-label="Publicite">'
    '<div class="ad-label">Publicite</div>'
    f'{ADSTERRA_SCRIPT}{ADSTERRA_CONTAINER}'
    '</div>'
)

for root, dirs, files in os.walk(BLOG_DIR):
    if "index.html" not in files:
        continue
    fp = os.path.join(root, "index.html")
    with open(fp, "r", encoding="utf-8") as f:
        html = f.read()

    count = html.count('id="container-adf6bd92e5f3361c799bee4b22ba5781"')
    if count >= 3:
        print(f"  ~ {os.path.basename(root)}: already {count} ads, skipping")
        continue

    m = re.search(r'(<div class="meta[^>]*>.*?</div>\s*)', html, re.DOTALL)
    if m:
        after_meta = m.end()
        html = html[:after_meta] + "\n\n" + AD_META + html[after_meta:]
        with open(fp, "w", encoding="utf-8") as f:
            f.write(html)
        print(f"  + {os.path.basename(root)}: added meta ad")
    else:
        print(f"  ! {os.path.basename(root)}: no meta div found")
