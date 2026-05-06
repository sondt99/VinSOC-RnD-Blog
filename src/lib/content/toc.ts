export type TocItem = {
  id: string;
  text: string;
  depth: 2 | 3 | 4;
};

const HEADING_RE = /^#{2,4}\s+(.+)$/gm;

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

export function extractToc(markdown: string): TocItem[] {
  const items: TocItem[] = [];
  const seen = new Map<string, number>();

  let match: RegExpExecArray | null;
  HEADING_RE.lastIndex = 0;

  while ((match = HEADING_RE.exec(markdown)) !== null) {
    const raw = match[0];
    const depth = (raw.match(/^#+/)![0].length) as 2 | 3 | 4;
    const text = match[1].replace(/`[^`]+`/g, (m) => m.slice(1, -1)).trim();
    const base = slugify(text);
    const count = seen.get(base) ?? 0;
    const id = count === 0 ? base : `${base}-${count}`;
    seen.set(base, count + 1);
    items.push({ id, text, depth });
  }

  return items;
}
