import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeSlug from "rehype-slug";
import rehypeHighlight from "rehype-highlight";
import rehypeStringify from "rehype-stringify";
import { visit } from "unist-util-visit";
import { toString as hastToString } from "hast-util-to-string";
import type { Element, Root } from "hast";

export interface TocItem {
  id: string;
  text: string;
  level: 2 | 3;
}

export interface RenderedMarkdown {
  html: string;
  toc: TocItem[];
}

/** Rehype plugin: walks the tree collecting h2/h3 headings (with the ids
 *  rehype-slug just assigned) into `toc`. Must run after rehypeSlug. */
function collectToc(toc: TocItem[]) {
  return (tree: Root) => {
    visit(tree, "element", (node: Element) => {
      if (node.tagName === "h2" || node.tagName === "h3") {
        const id = typeof node.properties?.id === "string" ? node.properties.id : undefined;
        if (id) {
          toc.push({ id, text: hastToString(node), level: node.tagName === "h2" ? 2 : 3 });
        }
      }
    });
  };
}

export async function markdownToHtml(markdown: string): Promise<RenderedMarkdown> {
  const toc: TocItem[] = [];

  const file = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype, { allowDangerousHtml: false })
    .use(rehypeSlug)
    .use(collectToc, toc)
    .use(rehypeHighlight)
    .use(rehypeStringify)
    .process(markdown);

  return { html: String(file), toc };
}
