# tazetagam.com

Static website for TAZE TAGAM — plain HTML, CSS and JavaScript. No server, no build
step, no dependencies. Converted from the previous Flask application so it can be
hosted free on GitHub Pages.

## Structure

```
index.html            English home         ->  /
about/index.html      English about        ->  /about/
products/             ...                  ->  /products/
export/                                    ->  /export/
contact/                                   ->  /contact/
ru/                   Russian versions     ->  /ru/, /ru/about/, ...
404.html              shown for unknown URLs
static/css/site.css   ALL the styling: colours, fonts, spacing, layout
static/js/main.js     menu, scroll effects, number counters, certificate viewer
static/img/           photos, logos, certificates, QR code
static/img/sizes/     smaller copies of the photos for phones (made from the originals)
static/img/og-image.jpg  picture shown when the site is shared on WhatsApp, Telegram etc.
static/fonts/         the two fonts (Fraunces for headings, Inter for text)
sitemap.xml           all 10 pages, both languages
```

## How to change things

**Wording.** Open the page's `index.html` and change the text. English pages
are in the top folders; Russian pages are in `ru/`. Change both languages.

**Colours, sizes, spacing.** Everything is in `static/css/site.css`. The brand
colours are the first lines under `:root` (for example `--green-800` and
`--gold-500`). Change a colour there and it changes on every page.

**Phone number or email.** These appear on every page (header, footer, contact
buttons, WhatsApp links). Use "find and replace in all files" in your editor
for `+993 63 80 50 00`, `+99363805000`, `99363805000` (WhatsApp) and
`pena.gapurov@gmail.com`.

**Menu and footer.** They are repeated in all 11 HTML files, so a change there
has to be made in every file. This is the price of having no build step.

## Uploading to GitHub

Upload changed files to the repository on github.com in the same folders they
are in here. GitHub Pages publishes them within a minute or two. Upload every
file that changed. For example, a change to `site.css` only needs that one
file, but a change to the footer needs all 11 HTML files.

After uploading, if the site still looks old, press Ctrl+F5 to reload without
the browser's saved copy.

## The contact form is switched off

The contact pages show the director's phone, WhatsApp and email directly
instead of a form. The old form used [Web3Forms](https://web3forms.com), which
needs an access key, and until that key exists every submission would fail and
the sender's message would be lost.

`static/js/contact.js` is still in the folder from that form. If you want a
form again, it has to be redesigned to match the new pages. After adding it,
send a real test message and check that it arrives.

## Deploying to GitHub Pages

```bash
git init
git add .
git commit -m "Static site"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/tazetagam.git
git push -u origin main
```

Then in the repository: **Settings → Pages → Source: Deploy from a branch →
`main` / `/ (root)`**. Tick **Enforce HTTPS** once the certificate is issued
(can take up to an hour).

## DNS (at your domain registrar — no extra cost)

Set the domain under **Settings -> Pages -> Custom domain** (`www.tazetagam.com`),
which creates the `CNAME` file for you. Then replace the records currently
pointing at PythonAnywhere with these:

| Type  | Host | Value                  |
|-------|------|------------------------|
| A     | @    | 185.199.108.153        |
| A     | @    | 185.199.109.153        |
| A     | @    | 185.199.110.153        |
| A     | @    | 185.199.111.153        |
| CNAME | www  | YOUR_USERNAME.github.io |

GitHub redirects the bare `tazetagam.com` to `www.tazetagam.com` automatically.
Changes usually take effect within an hour.

## Previewing locally

```bash
python -m http.server 5500
```

Then open http://localhost:5500. Any static file server works — Python is used
here only to serve files, the site itself contains no Python.

## What was removed from the Flask version

GitHub Pages serves files and cannot run code, so these were dropped:

- **Admin panel** (`/admin`, `/login`, staff accounts, contact inbox, CSV export).
  Enquiries now arrive by email instead.
- **Server-side storage** of messages in `contacts.json`.
- **CSRF tokens, rate limiting, login lockout** — no longer applicable without a
  server or a login.
- **Security response headers.** GitHub Pages sends its own and does not allow
  custom ones. HTTPS and HSTS still apply.

## Language handling

The Flask version switched languages with a cookie and a `/lang/xx` route. The
static version uses separate URLs (`/about/` and `/ru/about/`) with `hreflang`
tags, so each language is indexable by search engines.
