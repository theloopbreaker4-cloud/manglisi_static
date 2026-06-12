# Manglisi.VIP — Cottage Tati

Static website for **Cottage Tati** — a cosy mountain cottage for rent in Manglisi (Trialeti, Georgia), one hour drive from Tbilisi.

🌲 5★ on Google Maps
📞 contact owner · WhatsApp · Viber
📍 Manglisi, Tetritskaro, Kvemo Kartli, Georgia

## Stack

Plain static site — no build step required, no framework. Just HTML, CSS, vanilla JS.

- HTML5 + semantic markup
- CSS variables, custom properties, animations
- Vanilla JS (i18n, lightbox, language dropdown)
- Inline SVG (logo, icons, flags, animated background)
- 7 languages (RU, EN, KA, UK, BE, AZ, HY)
- Multilingual blog with hreflang
- Open Graph PNG previews
- JSON-LD structured data (LodgingBusiness)
- Sitemap + robots.txt + manifest.json

## Structure

```
/
├── index.html              # Homepage (i18n via JS)
├── 404.html                # Custom 404
├── sitemap.xml             # 70+ URLs across all languages
├── robots.txt
├── manifest.json
├── humans.txt
├── .htaccess               # Apache config (gzip, cache, security headers)
│
├── assets/
│   ├── style.css           # Single stylesheet
│   ├── i18n.js             # Translations for homepage (7 languages)
│   ├── app.js              # Front-end logic
│   ├── favicon.svg
│   ├── logo.svg            # Brand logo (light bg)
│   ├── logo-light.svg      # Brand logo (dark bg)
│   ├── icons.svg           # SVG icon sprite
│   ├── flags.svg           # SVG flag sprite
│   ├── bg-mountains.svg    # Animated forest/mountains background
│   └── og/                 # Open Graph PNGs (1200×630)
│       ├── og-main.png
│       ├── og-blog.png
│       └── og-<topic>.png  # one per blog article
│
├── img/
│   └── cottage-01..09.jpg  # Property photos
│
└── blog/
    ├── index.html          # RU blog index
    ├── <article>.html      # 9 RU articles
    ├── en/  ka/  uk/  be/  az/  hy/
    │   ├── index.html
    │   └── <article>.html  # 9 articles per language
```

## Local preview

No build step. Just serve the folder:

```sh
python -m http.server 8000
# open http://localhost:8000
```

Or open `index.html` directly in a browser (most things work via `file://` because all SVG sprites are inlined).

## Deploy

The site is fully static. Deploy options:

- **GitHub Pages** — push to `main`, enable Pages in repo settings
- **Netlify / Vercel** — drag-and-drop the folder
- **Cloudflare Pages** — connect the repo
- **Apache / nginx** — upload to `public_html`. Apache config is in `.htaccess`.

Set custom domain `manglisi.vip` in your hosting settings.

## License

Content (texts, photos) © Tati Gelashvili. All rights reserved.
Source code is provided as-is for the property owner.
