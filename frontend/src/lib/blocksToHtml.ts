// my-portfolio/frontend/src/lib/blocksToHtml.ts
// Převod Strapi v5 Rich Text (Blocks) -> HTML, podporuje:
// - paragraphs, headings (h1–h6), unordered/ordered lists, list-item
// - odkazy, tučné/kurzíva/kód (na textových uzlech)

type TextLeaf = {
  type: "text";
  text: string;
  bold?: boolean;
  italic?: boolean;
  code?: boolean;
  underline?: boolean;
  strikethrough?: boolean;
};

type ParagraphNode = {
  type: "paragraph";
  children: Array<TextLeaf | InlineLinkNode>;
};

type HeadingNode = {
  type: "heading";
  level?: number; // 1..6
  children: Array<TextLeaf | InlineLinkNode>;
};

type ListNode = {
  type: "list";
  format?: "ordered" | "unordered";
  children: ListItemNode[];
};

type ListItemNode = {
  type: "list-item";
  children: Array<ParagraphNode | TextLeaf | InlineLinkNode>;
};

type InlineLinkNode = {
  type: "link";
  url: string;
  newTab?: boolean;
  children: Array<TextLeaf>;
};

type AnyNode = ParagraphNode | HeadingNode | ListNode | ListItemNode | InlineLinkNode | TextLeaf | { type: string; [k: string]: any };

export function blocksToHtml(blocks: unknown): string {
  if (!Array.isArray(blocks)) return "";
  return blocks.map(renderNode).join("");
}

// ---------- renderery uzlů ----------

function renderNode(node: AnyNode): string {
  if (!node || typeof node !== "object") return "";

  switch (node.type) {
    case "paragraph": {
      const inner = renderChildren((node as ParagraphNode).children);
      return inner.trim() ? `<p>${inner}</p>` : "";
    }
    case "heading": {
      const h = clampHeading((node as HeadingNode).level);
      const inner = renderChildren((node as HeadingNode).children);
      return `<h${h}>${inner}</h${h}>`;
    }
    case "list": {
      const format = (node as ListNode).format === "ordered" ? "ol" : "ul";
      const items = (node as ListNode).children?.map(renderNode).join("") ?? "";
      return `<${format}>${items}</${format}>`;
    }
    case "list-item": {
      const inner = renderChildren((node as ListItemNode).children);
      return `<li>${inner}</li>`;
    }
    case "link": {
      const { url, newTab } = node as InlineLinkNode;
      const inner = renderChildren((node as InlineLinkNode).children);
      const safeUrl = escapeHtmlAttr(url || "#");
      const target = newTab ? ` target="_blank" rel="noopener noreferrer"` : "";
      return `<a href="${safeUrl}"${target}>${inner}</a>`;
    }
    case "text": {
      return renderLeaf(node as TextLeaf);
    }
    default: {
      // neznámé typy ignorujeme, ale zkusíme vykreslit děti (pokud existují)
      const children = (node as any).children;
      return Array.isArray(children) ? renderChildren(children) : "";
    }
  }
}

function renderChildren(children: Array<AnyNode | undefined> = []): string {
  return children.map((c) => (c ? renderNode(c as AnyNode) : "")).join("");
}

function renderLeaf(leaf: TextLeaf): string {
  let out = escapeHtml(leaf.text ?? "");
  if (!out) return "";

  if (leaf.code) out = `<code>${out}</code>`;
  if (leaf.bold) out = `<strong>${out}</strong>`;
  if (leaf.italic) out = `<em>${out}</em>`;
  if (leaf.underline) out = `<u>${out}</u>`;
  if (leaf.strikethrough) out = `<s>${out}</s>`;

  return out;
}

// ---------- utility ----------

function clampHeading(level?: number) {
  const n = typeof level === "number" ? level : 2;
  if (n < 1) return 1;
  if (n > 6) return 6;
  return n;
}

function escapeHtml(s: string) {
  return s
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function escapeHtmlAttr(s: string) {
  return escapeHtml(String(s)).replaceAll("'", "&#39;");
}