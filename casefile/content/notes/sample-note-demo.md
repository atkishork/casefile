---
title: "Sample Field Note (delete me)"
date: "2026-08-01"
tags: ["meta", "demo"]
summary: "Not a real note — shows the frontmatter format for Field Notes, which is simpler than a writeup: no category, difficulty, or CTF fields."
draft: false
---

Delete this file once you've published a real note or two — it's only
here to show the format.

Field Notes use the exact same markdown features as writeups — code
blocks, images, tables, blockquotes, all syntax-highlighted the same way:

```python
print("Field Notes support code blocks too")
```

> Use a blockquote for a remark or aside you want to visually set apart
> from the main text.

Reference an image like this, after uploading it via the admin portal
(or dropping it in `public/notes/your-slug/` by hand):

```md
![Description](/notes/your-slug/image.png)
```

The frontmatter is intentionally lighter than a writeup's — just
`title`, `date`, `tags`, `summary`, and `draft`. No category, difficulty,
CTF name, or solved/wip status, since those are specific to CTF case
files.
