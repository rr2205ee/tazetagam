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
static/               images, icons, JavaScript
CNAME                 the custom domain GitHub Pages serves
sitemap.xml           all 10 pages, both languages
```

Each page is a complete standalone HTML file with the CSS inlined in `<head>`.
To change wording, edit the file directly. Note that a change to the shared
header or footer has to be repeated in all 11 HTML files — that is the trade-off
for having no build step.

## The contact form is currently switched off

The contact pages show the director's phone and email directly instead of a
form. This is deliberate: the form posts to [Web3Forms](https://web3forms.com),
which needs an access key, and until that key exists every submission would
fail and the sender's message would be lost.

**To turn the form back on:**

1. Sign up at https://web3forms.com with the address that should receive
   enquiries. The access key is emailed to that address.
2. Restore the form markup on `contact/index.html` and `ru/contact/index.html`.
   Both pages are in this repository's git history from before the form was
   removed, along with the `<script src=".../contact.js">` tag each page had at
   the end. `static/js/contact.js` was kept in place for this.
3. Replace `PASTE_YOUR_WEB3FORMS_ACCESS_KEY_HERE` with the real key in both
   pages.
4. Send a real test message and confirm it arrives before relying on it.

The key is meant to be public - it only permits sending mail to your own
address.

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

Form validation (required fields, email format, minimum message length) still
runs, now in the browser.

## Language handling

The Flask version switched languages with a cookie and a `/lang/xx` route. The
static version uses separate URLs (`/about/` and `/ru/about/`) with `hreflang`
tags, so each language is indexable by search engines.
