---
title: "Jailbreak — Escaping the Vault via XXE"
date: "2026-06-20"
ctf: "Fallout-themed CTF"
category: web
difficulty: medium
tags: ["xxe", "xml", "injection", "web"]
summary: "An XML external entity injection let me read arbitrary files off the server by hijacking a field that reflected parsed XML values back in the response."
status: solved
---

> **This is a starter template — replace every bracketed note below with your
> actual writeup.** The frontmatter above (title, date, category, tags) is
> already filled in based on what you've told me about this challenge; the
> body is a standard XXE writeup skeleton for you to fill with your real
> payloads, screenshots, and findings.

## Challenge overview

[One or two sentences: what the challenge gave you — a web app, an API
endpoint, a file upload form — and what the objective was.]

- **Category:** Web / Injection
- **Points:** [xxx]
- **Files/links provided:** [xxx]

## Recon

[What did the target look like? Any endpoints that accepted XML? How did you
find the injection point — burp history, a content-type header, a file
upload that silently parsed XML under the hood?]

```
[ request / response snippet ]
```

## Identifying the vulnerability

[Which field in the response reflected parsed XML values back to you? This
is usually the tell for XXE — you send an entity, and something in the app's
output changes to match what that entity resolved to.]

```xml
<?xml version="1.0"?>
<!DOCTYPE data [
  <!ENTITY xxe "test">
]>
<data>&xxe;</data>
```

## Exploitation

[Walk through the payloads you iterated on, and why each one moved you
closer to reading a file. Show the failed attempts too — they're often the
most useful part of a writeup for readers hitting the same walls.]

```xml
<?xml version="1.0"?>
<!DOCTYPE data [
  <!ENTITY xxe SYSTEM "file:///etc/passwd">
]>
<data>&xxe;</data>
```

## Getting the flag

[What did the final response look like? Where was the flag hiding —
filesystem, environment variable, internal service reachable via SSRF-style
XXE?]

## Lessons learned

[What would you tell someone defending against this? E.g. disable external
entity resolution in the XML parser, use an allowlist parser configuration,
avoid parsing untrusted XML entirely where possible.]
