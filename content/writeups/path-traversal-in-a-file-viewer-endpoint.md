---
title: "Path Traversal in a File Viewer Endpoint"
date: "2026-07-30"
ctf: "demoCTF 2026"
category: web
difficulty: medium
tags: ["path-traversal", "lfi", "web"]
summary: "A file-viewer feature that trusted the filename parameter let me climb out of the intended folder and read arbitrary files on the server, flag included."
status: solved
---

> Another fully worked **demo** — same deal as the SQLi one, here to show
> exactly how image references work. Replace the content, images, and
> frontmatter with your real writeup when you're ready.

## Challenge overview

The app exposed a "view report" feature: `/reports?file=quarterly.txt`
rendered the contents of a text file in the browser. The description just
said *"reports are meant to stay in one folder."*

- **Category:** Web
- **Points:** 75
- **Provided:** target URL only

## Recon

First step was just watching how the `file` parameter behaved. Requesting
`quarterly.txt` returned its contents fine, and swapping in a nonexistent
filename returned a clean `404 - report not found` — so the app was doing
*some* validation, but the question was whether that validation checked the
path itself or just checked "does a file exist at the end result."


![banner-reddit.png](/writeups/path-traversal-in-a-file-viewer-endpoint/banner-reddit.png)


That 404 behavior (rather than a generic 500) told me the backend was
almost certainly doing a raw filesystem read — `open(base_dir + filename)`
— which is exactly the shape of code that's vulnerable to path traversal if
`filename` isn't sanitized.

## Exploitation

Classic first move: walk up out of the reports directory with `../`
sequences and try to land on a file I know exists on any Linux box.

```
GET /reports?file=../../../../etc/passwd HTTP/1.1
Host: demo-ctf.local
```

That came back with a 200 and the full contents of `/etc/passwd` rendered
straight into the page — confirming the app concatenates the parameter
directly into a filesystem path with no normalization or allowlist.


![banner-reddit.png](/writeups/path-traversal-in-a-file-viewer-endpoint/banner-reddit.png)


| Payload | Result |
|---|---|
| `../../../etc/passwd` | Too few `../` — resolved back inside the app dir, 404 |
| `../../../../etc/passwd` | Correct depth — full file contents returned |
| `..%2f..%2f..%2f..%2fetc/passwd` | URL-encoded variant, useful if a WAF is stripping literal `../` |

> **Note:** if the straightforward `../` chain gets blocked or stripped,
> URL-encoding the slashes (`%2f`) or doubling the sequence
> (`....//....//`) is worth trying before assuming the path is patched —
> a lot of traversal filters only strip one pass of `../`, not encoded or
> nested variants.

## Getting the flag

Once the traversal was confirmed against `/etc/passwd`, the next question
was just *where* the flag actually lived. The challenge hinted at
`/opt/app/`, so I pointed the same payload there instead:

```
GET /reports?file=../../../../opt/app/flag.txt HTTP/1.1
```

![banner-reddit.png](/writeups/path-traversal-in-a-file-viewer-endpoint/banner-reddit.png)


```
demoCTF{n3v3r_trust_a_f1l3n4m3_p4r4m}
```

## Lessons learned

- **Never build a file path from raw user input.** Resolve the requested
  path, then verify it's still inside the intended base directory before
  opening it — don't just try to strip `../` (that's an incomplete
  blocklist, not a fix).
- **Prefer an allowlist over a blocklist.** If the app only ever needs to
  serve a known, small set of report files, map filenames to an internal
  ID or lookup table instead of trusting a path fragment at all.
- **A clean 404 vs. a generic error is a real signal.** The distinct "file
  not found" response here is what suggested a raw filesystem check in the
  first place — worth paying attention to error message shape, not just
  status codes.

