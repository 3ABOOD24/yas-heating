# YAS Heating Solutions — website

Plain, static HTML/CSS/JS. No build step, no framework, no server required.

## Deploying

Upload everything in this folder — keeping the folder structure (`assets/`,
`services/`, `ar/`, etc.) intact — to your hosting root. `index.html` is the
homepage; every other page is a real `.html` file at its matching path
(e.g. `/services/central-heating/index.html`, `/ar/contact/index.html`).

Works on any static host: Netlify, Vercel, Cloudflare Pages, GitHub Pages,
or a plain Apache/Nginx server.

## Structure

- `index.html`, `about/`, `services/`, `products/`, `projects/`, `blog/`,
  `contact/` — English pages
- `ar/` — Arabic mirror of the same pages (RTL)
- `assets/` — images, the compiled stylesheet, and two small hand-written
  files: `main.js` (mobile menu, contact form, header scroll state) and
  `enhance.css` (a few additive styles layered on the main stylesheet)
- `sitemap.xml`, `robots.txt` — for search engines
- `favicon.png`

## Editing content

Every page is plain HTML — open it in any editor and change the text
directly. There's no CMS or database; content lives in the HTML files
themselves.

## Contact form

The form on `/contact` has no backend. On submit, `assets/main.js` builds a
WhatsApp message from the filled-in fields and opens `wa.me` with it
pre-filled. If you'd rather receive enquiries by email or into a CRM, swap
that part of `main.js` for a call to your form-handling service of choice
(Formspree, a serverless function, etc.).
