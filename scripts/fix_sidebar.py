import os, re

BLOG_DIR = r"C:\Users\HP\Desktop\PROJ1\pdf-tools\blog"
count = 0

for root, dirs, files in os.walk(BLOG_DIR):
    if "index.html" not in files:
        continue
    fp = os.path.join(root, "index.html")
    with open(fp, "r", encoding="utf-8") as f:
        html = f.read()

    # Fix broken pattern: <main\n ...sidebar... id="main" class="...
    pattern = r'(<main)\s*\n(\s*<div class="ad-sidebar-desktop"[^>]*>.*?</div>\s*<style>.*?</style>\s*) (id="main" class="blog-article"[^>]*>)'
    m = re.search(pattern, html, re.DOTALL)
    if m:
        replacement = r'\1 \3\n\2'
        new_html = re.sub(pattern, replacement, html, count=1, flags=re.DOTALL)
        if new_html != html:
            with open(fp, "w", encoding="utf-8") as f:
                f.write(new_html)
            print(f"  Fixed: {os.path.basename(root)}")
            count += 1
    else:
        if "ad-sidebar-desktop" in html:
            print(f"  Already fixed or different: {os.path.basename(root)}")
        else:
            print(f"  No sidebar: {os.path.basename(root)}")

print(f"\nFixed {count} articles")
