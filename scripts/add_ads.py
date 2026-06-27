import os
import re

BLOG_DIR = r"C:\Users\HP\Desktop\PROJ1\pdf-tools\blog"
ADSTERRA_SCRIPT = '<script async src="https://pl30098202.effectivecpmnetwork.com/adf6bd92e5f3361c799bee4b22ba5781/invoke.js"></script>'
ADSTERRA_CONTAINER = '<div id="container-adf6bd92e5f3361c799bee4b22ba5781"></div>'

PRECONNECT = """<link rel="preconnect" href="https://pl30098202.effectivecpmnetwork.com" crossorigin>
<link rel="dns-prefetch" href="https://pl30098202.effectivecpmnetwork.com">
<link rel="preconnect" href="https://pl30098201.effectivecpmnetwork.com" crossorigin>
<link rel="dns-prefetch" href="https://pl30098201.effectivecpmnetwork.com">"""

AD_CSS = """<style>
.ad-container{text-align:center;margin:32px 0;padding:16px;background:#f8fafc;border-radius:12px;min-height:90px;display:flex;align-items:center;justify-content:center;border:1px solid #e2e8f0}
.ad-label{font-size:.65rem;color:#94a3b8;text-transform:uppercase;letter-spacing:1px;margin-bottom:8px}
.ad-sticky{position:sticky;top:88px}
@media(max-width:1024px){.ad-sidebar{display:none}}
.ad-inline{margin:24px 0}
.ad-footer{margin:40px 0 0;padding:24px;background:#f8fafc;border-radius:12px;text-align:center;border:1px solid #e2e8f0}
</style>"""

AD_AFTER_META = f'<div class="ad-container" aria-label="Publicite"><div class="ad-label">Publicite</div>{ADSTERRA_SCRIPT}{ADSTERRA_CONTAINER}</div>'

AD_IN_CONTENT = f'<div class="ad-container ad-inline" aria-label="Publicite"><div class="ad-label">Publicite</div>{ADSTERRA_SCRIPT}{ADSTERRA_CONTAINER}</div>'

AD_BEFORE_FOOTER = f'<div class="ad-container ad-footer" aria-label="Publicite"><div class="ad-label">Publicite</div>{ADSTERRA_SCRIPT}{ADSTERRA_CONTAINER}</div>'

def process_article(filepath):
    with open(filepath, "r", encoding="utf-8") as f:
        html = f.read()

    # Add preconnect before </head>
    if "effectivecpmnetwork" not in html:
        html = html.replace("</head>", f"{PRECONNECT}\n</head>")
        print(f"  + Added preconnect to head")
    else:
        print(f"  ~ Preconnect already exists")

    # Add ad CSS before </head>
    if "ad-container" not in html:
        html = html.replace("</head>", f"{AD_CSS}\n</head>")
        print(f"  + Added ad CSS")
    else:
        print(f"  ~ Ad CSS already exists")

    # Add ad after meta div (before first <p>)
    ad_div_count = html.count('id="container-adf6bd92e5f3361c799bee4b22ba5781"')
    if ad_div_count < 1:
        meta_pattern = r'(<div class="meta[^>]*>.*?</div>)'
        if re.search(meta_pattern, html, re.DOTALL):
            html = re.sub(meta_pattern, r'\1\n\n' + AD_AFTER_META, html, count=1, flags=re.DOTALL)
            print(f"  + Added ad after meta")

    # Add in-content ad after 2nd or 3rd <h2>
    h2_positions = [m.start() for m in re.finditer(r'<h2>', html)]
    if len(h2_positions) >= 2:
        insert_pos = h2_positions[min(2, len(h2_positions)-1)]
        # Find the end of that h2 section (next </p> after h2 content)
        section_end = html.find('</p>', insert_pos)
        if section_end > 0:
            section_end += 4  # after </p>
            # Find the beginning of the next line
            next_section = html.find('\n', section_end)
            if next_section > 0:
                # Count how many ad containers already exist
                ad_count = html.count("container-adf6bd92e5f3361c799bee4b22ba5781")
                if ad_count < 2:
                    html = html[:next_section] + '\n\n' + AD_IN_CONTENT + html[next_section:]
                    print(f"  + Added in-content ad after h2 #{min(2, len(h2_positions)-1)+1}")
                else:
                    print(f"  ~ Skipped in-content ad (already {ad_count} ads)")

    # Add ad before footer/nav-links
    if "container-adf6bd92e5f3361c799bee4b22ba5781" in html:
        ad_count = html.count("container-adf6bd92e5f3361c799bee4b22ba5781")
        if ad_count < 3:
            if '<div class="nav-links"' in html:
                html = html.replace('<div class="nav-links"', AD_BEFORE_FOOTER + '\n\n<div class="nav-links"')
                print(f"  + Added ad before nav-links")
            elif '<footer' in html:
                html = html.replace('</main>', AD_BEFORE_FOOTER + '\n</main>')
                print(f"  + Added ad before footer")

    with open(filepath, "w", encoding="utf-8") as f:
        f.write(html)

def main():
    articles = sorted([d for d in os.listdir(BLOG_DIR) if os.path.isdir(os.path.join(BLOG_DIR, d))])
    print(f"Found {len(articles)} blog articles\n")

    for article in articles:
        index_path = os.path.join(BLOG_DIR, article, "index.html")
        if os.path.exists(index_path):
            print(f"Processing: {article}")
            process_article(index_path)
            print()
        else:
            print(f"SKIP: {article}/index.html not found")

    print("Done!")

if __name__ == "__main__":
    main()
