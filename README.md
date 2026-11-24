# k1ttyf-page
My website: https://k1ttyf.xyz/

# Structure
```
index.html, 404.html      pages (GitHub Pages serves from the repo root)
CNAME, robots.txt,
sitemap.xml, _config.yml  site config (_config.yml keeps worker/ off the site)
assets/css/               styles
assets/js/                scripts: main, lastfm (Listening now), copy (Discord toast),
                          smooth-scroll, sparkle
assets/img/               images and cursor
assets/media/             background video and music
worker/                   Cloudflare Worker: last.fm proxy at api.k1ttyf.xyz
```

Local preview: `python -m http.server 8000` from the repo root, then open http://localhost:8000/.

# Abuse
If you find any content that infringes on your rights, please contact us at: admin@k1ttyf.xyz

# Usage
Some materials were taken from vile.sh
Background video was taken from https://pixabay.com/videos/lofi-cat-night-window-rain-cute-246243/