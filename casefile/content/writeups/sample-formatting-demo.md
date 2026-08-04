---
title: "Sample Writeup — Formatting Reference (delete me)"
date: "2026-01-10"
ctf: "Demo CTF"
category: misc
difficulty: easy
tags: ["demo", "markdown"]
summary: "Not a real writeup — a reference showing every markdown feature this site supports, so you can see the format before writing your own."
status: solved
---

Delete this file once you've published a couple of real writeups — it's only
here to show you what's available.

## Frontmatter fields

Every writeup lives in `content/writeups/your-slug.md` as one file. The block
at the top between `---` lines controls the badges, case number, and card
preview:

| Field | Type | Notes |
|---|---|---|
| `title` | string | Shown as the H1 on the writeup page |
| `date` | `YYYY-MM-DD` | Controls sort order **and** the CASE-### number |
| `ctf` | string | Name of the CTF or platform |
| `category` | `web \| pwn \| crypto \| rev \| forensics \| misc \| osint` | Powers the filter buttons |
| `difficulty` | `easy \| medium \| hard \| insane` | Renders as the four-bar meter |
| `tags` | list of strings | Shown as `#tags` on the card |
| `summary` | string | The redacted excerpt on the case log |
| `status` | `solved \| wip` | Shown as the status dot |

The filename becomes the URL slug, and case numbers are assigned
automatically in chronological order — you never set them by hand, so
inserting an older writeup later will correctly renumber everything after it.

## Code blocks

Fenced code blocks are syntax-highlighted automatically:

```python
import requests

def get_flag(url: str) -> str:
    r = requests.get(url, timeout=5)
    return r.json()["flag"]
```

```bash
nmap -sV -p- -T4 10.10.10.5
```

## Callouts

> Use a blockquote for tips, warnings, or anything you want to visually set
> apart from the main walkthrough.

## Lists

1. Recon
2. Identify the vulnerable parameter
3. Exploit
4. Capture the flag

- Burp Suite
- `curl` + jq
- A notes file you actually keep updated

## Images

Drop screenshots in `/public/writeups/your-slug/` and reference them like
this:

```md
![Burp repeater showing the reflected payload](/writeups/your-slug/burp-01.png)
```

## Inline code and links

Reference a tool like `sqlmap` inline, or [link out to a resource](https://portswigger.net/web-security) —
external links open safely by default.
