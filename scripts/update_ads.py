import os, re

BLOG_DIR = r"C:\Users\HP\Desktop\PROJ1\pdf-tools\blog"
ROOT_HTML = r"C:\Users\HP\Desktop\PROJ1\pdf-tools\index.html"
EN_HTML = r"C:\Users\HP\Desktop\PROJ1\pdf-tools\en\index.html"

# ===== NEW ADSTERRA CODES =====

POPUNDER = '<script src="https://pl30100834.effectivecpmnetwork.com/ae/46/a4/ae46a4e5cf311d70d42224e8012cc7ed.js"></script>'

NATIVE_SCRIPT = '<script async="async" data-cfasync="false" src="https://pl30100835.effectivecpmnetwork.com/66dcbf7dcef502f80961df1b7f825d1a/invoke.js"></script>'
NATIVE_CONTAINER = '<div id="container-66dcbf7dcef502f80961df1b7f825d1a"></div>'

SMARTLINK_URL = "https://www.effectivecpmnetwork.com/gxhgb0fk96?key=d021dd79dce04efc928fd3b3266d1c40"

SOCIAL_BAR = '<script src="https://pl30100837.effectivecpmnetwork.com/37/11/cd/3711cd1b377cd95f2bd7a188d1ebd0f5.js"></script>'

BANNER_160x600_SCRIPT = """<script>
  atOptions = {
    'key' : '6acd777b0d95d67dc3799dd818c185a1',
    'format' : 'iframe',
    'height' : 600,
    'width' : 160,
    'params' : {}
  };
</script>
<script src="https://www.highperformanceformat.com/6acd777b0d95d67dc3799dd818c185a1/invoke.js"></script>"""

# ===== OLD CODES TO REPLACE =====
OLD_NATIVE_SCRIPT = 'src="https://pl30098202.effectivecpmnetwork.com/adf6bd92e5f3361c799bee4b22ba5781/invoke.js"'
OLD_NATIVE_CONTAINER = 'id="container-adf6bd92e5f3361c799bee4b22ba5781"'
OLD_PRECONNECT_1 = "pl30098202.effectivecpmnetwork.com"
OLD_PRECONNECT_2 = "pl30098201.effectivecpmnetwork.com"
OLD_POPUNDER = "pl30098201.effectivecpmnetwork.com/7f/b7/51/7fb751e43693df41c4545d5466a4310a.js"
OLD_SMARTLINK_URL = "sdwu3t1mf9?key=c0e7a5cf0e9e4ff61b2192891c7c4a36"
OLD_BANNER_KEY = "92b04a33ccc74a739adedf65c64ef41a"

# ===== NEW PRECONNECT =====
NEW_PRECONNECT = """<link rel="preconnect" href="https://pl30100835.effectivecpmnetwork.com" crossorigin>
<link rel="dns-prefetch" href="https://pl30100835.effectivecpmnetwork.com">
<link rel="preconnect" href="https://pl30100834.effectivecpmnetwork.com" crossorigin>
<link rel="dns-prefetch" href="https://pl30100834.effectivecpmnetwork.com">
<link rel="preconnect" href="https://pl30100837.effectivecpmnetwork.com" crossorigin>
<link rel="dns-prefetch" href="https://pl30100837.effectivecpmnetwork.com">
<link rel="preconnect" href="https://www.highperformanceformat.com" crossorigin>
<link rel="dns-prefetch" href="https://www.highperformanceformat.com">"""

# ===== AD BUILDERS =====
def native_ad(label="Publicite", extra_class=""):
    cls = f'ad-container {extra_class}'.strip()
    return f'<div class="{cls}" aria-label="{label}"><div class="ad-label">{label}</div>{NATIVE_SCRIPT}{NATIVE_CONTAINER}</div>'

def sidebar_ad():
    return f'<div class="ad-sidebar-sticky" style="position:sticky;top:88px;text-align:center;margin:16px 0">{BANNER_160x600_SCRIPT}</div>'

def smartlink_ad():
    return f'<div class="ad-container ad-smartlink" aria-label="Publicite"><div class="ad-label">Publicite</div><a href="{SMARTLINK_URL}" rel="nofollow sponsored" target="_blank" style="display:block;padding:12px 24px;background:linear-gradient(135deg,#2563eb,#7c3aed);color:#fff;border-radius:8px;font-weight:600;text-decoration:none;text-align:center">📄 Outils PDF gratuits →</a></div>'


def process_blog_article(filepath):
    with open(filepath, "r", encoding="utf-8") as f:
        html = f.read()

    changed = False

    # 1. Replace preconnect
    if OLD_PRECONNECT_1 in html or OLD_PRECONNECT_2 in html:
        # Remove old preconnect lines
        html = re.sub(
            r'<link rel="preconnect" href="https://pl30098202\.effectivecpmnetwork\.com".*?\n',
            "", html
        )
        html = re.sub(
            r'<link rel="dns-prefetch" href="https://pl30098202\.effectivecpmnetwork\.com".*?\n',
            "", html
        )
        html = re.sub(
            r'<link rel="preconnect" href="https://pl30098201\.effectivecpmnetwork\.com".*?\n',
            "", html
        )
        html = re.sub(
            r'<link rel="dns-prefetch" href="https://pl30098201\.effectivecpmnetwork\.com".*?\n',
            "", html
        )
        # Add new preconnect
        if "pl30100835.effectivecpmnetwork.com" not in html:
            html = html.replace("</head>", f"{NEW_PRECONNECT}\n</head>")
        changed = True
        print("    ~ Replaced preconnect")

    # 2. Replace old Native Banner script src
    if OLD_NATIVE_SCRIPT in html:
        html = html.replace(OLD_NATIVE_SCRIPT,
            'src="https://pl30100835.effectivecpmnetwork.com/66dcbf7dcef502f80961df1b7f825d1a/invoke.js"')
        changed = True
        print("    ~ Updated Native Banner script src")

    # 3. Replace old container ID
    if OLD_NATIVE_CONTAINER in html:
        html = html.replace(OLD_NATIVE_CONTAINER,
            'id="container-66dcbf7dcef502f80961df1b7f825d1a"')
        changed = True
        print("    ~ Updated Native Banner container ID")

    # 5. Replace old Popunder with new Popunder, or add if missing
    if OLD_POPUNDER in html:
        html = html.replace(OLD_POPUNDER,
            "pl30100834.effectivecpmnetwork.com/ae/46/a4/ae46a4e5cf311d70d42224e8012cc7ed.js")
        changed = True
        print("    ~ Replaced Popunder URL")
    elif "pl30100834.effectivecpmnetwork.com/ae/46/a4" not in html:
        html = html.replace("</body>", f"{POPUNDER}\n</body>")
        changed = True
        print("    + Added Popunder")

    # 4. Add Social Bar if missing (before </body>)
    if "pl30100837.effectivecpmnetwork.com/37/11/cd" not in html:
        html = html.replace("</body>", f"{SOCIAL_BAR}\n</body>")
        changed = True
        print("    + Added Social Bar")

    # 6. Replace old Banner 728x90 with new Banner 160x600
    if OLD_BANNER_KEY in html:
        html = html.replace(OLD_BANNER_KEY, "6acd777b0d95d67dc3799dd818c185a1")
        changed = True
        print("    ~ Replaced Banner 728x90 key with 160x600")
    if "6acd777b0d95d67dc3799dd818c185a1" not in html:
        sidebar = f'\n<div class="ad-sidebar-desktop" style="float:right;margin:0 0 16px 24px;max-width:160px">\n{sidebar_ad()}\n</div>\n<style>\n@media(min-width:1024px){{.ad-sidebar-desktop{{display:block !important}}}}\n</style>\n'
        # Insert sidebar right after the opening <main ...> tag
        html = re.sub(r'(<main[^>]*>)', r'\1' + sidebar, html, count=1)
        changed = True
        print("    + Added Banner 160x600 sidebar")

    # 7. Add Smartlink before nav-links if not present
    if "gxhgb0fk96" not in html:
        if '<div class="nav-links"' in html:
            html = html.replace('<div class="nav-links"',
                smartlink_ad() + '\n\n<div class="nav-links"')
            changed = True
            print("    + Added Smartlink before nav-links")

    if changed:
        with open(filepath, "w", encoding="utf-8") as f:
            f.write(html)
        return True
    return False


def process_main_page(filepath, lang="fr"):
    with open(filepath, "r", encoding="utf-8") as f:
        html = f.read()

    changed = False

    # Replace preconnect
    if OLD_PRECONNECT_1 in html:
        html = re.sub(
            r'<link rel="preconnect" href="https://pl30098202\.effectivecpmnetwork\.com".*?\n',
            "", html
        )
        html = re.sub(
            r'<link rel="dns-prefetch" href="https://pl30098202\.effectivecpmnetwork\.com".*?\n',
            "", html
        )
        changed = True

    if "pl30100835.effectivecpmnetwork.com" not in html:
        html = html.replace("</head>", f"{NEW_PRECONNECT}\n</head>")
        changed = True

    # Replace old Native Banner
    if OLD_NATIVE_SCRIPT in html:
        html = html.replace(OLD_NATIVE_SCRIPT,
            'src="https://pl30100835.effectivecpmnetwork.com/66dcbf7dcef502f80961df1b7f825d1a/invoke.js"')
        changed = True
    if OLD_NATIVE_CONTAINER in html:
        html = html.replace(OLD_NATIVE_CONTAINER,
            'id="container-66dcbf7dcef502f80961df1b7f825d1a"')
        changed = True

    # Replace old Smartlink URL with new
    if OLD_SMARTLINK_URL in html:
        html = html.replace(OLD_SMARTLINK_URL,
            "gxhgb0fk96?key=d021dd79dce04efc928fd3b3266d1c40")
        changed = True
        print("    ~ Replaced Smartlink URL")

    # Replace old Popunder URL with new
    if OLD_POPUNDER in html:
        html = html.replace(OLD_POPUNDER,
            "pl30100834.effectivecpmnetwork.com/ae/46/a4/ae46a4e5cf311d70d42224e8012cc7ed.js")
        changed = True
        print("    ~ Replaced Popunder URL")

    # Replace old Banner 728x90 key with new 160x600
    if OLD_BANNER_KEY in html:
        html = html.replace(OLD_BANNER_KEY, "6acd777b0d95d67dc3799dd818c185a1")
        changed = True
        print("    ~ Replaced Banner 728x90 key with 160x600")

    # Add Social Bar if not present (before </body>)
    if "pl30100837.effectivecpmnetwork.com/37/11/cd" not in html:
        html = html.replace("</body>", f"{SOCIAL_BAR}\n</body>")
        changed = True
        print("    + Added Social Bar")

    # Add Popunder if not present (before </body>)
    if "pl30100834.effectivecpmnetwork.com/ae/46/a4" not in html:
        html = html.replace("</body>", f"{POPUNDER}\n</body>")
        changed = True
        print("    + Added Popunder")

    if changed:
        with open(filepath, "w", encoding="utf-8") as f:
            f.write(html)
        return True
    return False


def main():
    # === Process blog articles ===
    articles = sorted([d for d in os.listdir(BLOG_DIR) if os.path.isdir(os.path.join(BLOG_DIR, d))])
    print(f"=== Processing {len(articles)} blog articles ===\n")

    for article in articles:
        fp = os.path.join(BLOG_DIR, article, "index.html")
        if not os.path.exists(fp):
            continue
        print(f"  {article}:")
        process_blog_article(fp)
        print()

    # === Process main pages ===
    print("=== Processing main pages ===")
    for path, label in [(ROOT_HTML, "index.html (FR)"), (EN_HTML, "en/index.html (EN)")]:
        if os.path.exists(path):
            print(f"  {label}:")
            process_main_page(path)
            print()

    print("Done!")

if __name__ == "__main__":
    main()
