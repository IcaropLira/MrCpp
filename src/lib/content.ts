import type { Section, Status, Topic } from '../types';

const files = import.meta.glob('/content/**/*.md', { query: '?raw', import: 'default', eager: true }) as Record<string, string>;

function parse(src: string): { data: Record<string, string>; body: string } {
  const m = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/.exec(src);
  if (!m) return { data: {}, body: src };
  const data: Record<string, string> = {};
  for (const line of (m[1] ?? '').split(/\r?\n/)) {
    const i = line.indexOf(':');
    if (i > 0) data[line.slice(0, i).trim()] = line.slice(i + 1).trim();
  }
  return { data, body: m[2] ?? '' };
}

/** Separa "03-ordenacao" em { order: 3, slug: 'ordenacao' }. */
function splitName(name: string): { order: number; slug: string } {
  const m = /^(\d+)-(.+)$/.exec(name);
  return { order: m ? Number(m[1]) : 99, slug: m ? (m[2] ?? name) : name };
}

function build(): Section[] {
  const sections = new Map<string, Section>();
  const get = (dir: string): Section => {
    const { order, slug } = splitName(dir);
    let s = sections.get(slug);
    if (!s) { s = { slug, title: slug, part: '', summary: '', order, topics: [] }; sections.set(slug, s); }
    return s;
  };
  for (const [path, src] of Object.entries(files)) {
    const [, , dir = '', file = ''] = path.split('/');
    const name = file.replace(/\.md$/, '');
    const { data, body } = parse(src);
    const section = get(dir);
    if (name === '_section') {
      Object.assign(section, { title: data.title ?? section.title, part: data.part ?? '', summary: data.summary ?? '' });
      continue;
    }
    const { order, slug } = splitName(name);
    section.topics.push({
      section: section.slug, slug, order, body,
      title: data.title ?? slug,
      summary: data.summary ?? '',
      status: (data.status === 'done' ? 'done' : 'todo') as Status,
      complexity: data.complexity ?? '',
      tags: (data.tags ?? '').split(',').map((t) => t.trim()).filter(Boolean),
    });
  }
  const list = [...sections.values()].sort((a, b) => a.order - b.order);
  list.forEach((s) => s.topics.sort((a, b) => a.order - b.order));
  return list;
}

export const sections: Section[] = build();
export const allTopics: Topic[] = sections.flatMap((s) => s.topics);
export const getSection = (slug: string) => sections.find((s) => s.slug === slug);
export const getTopic = (section: string, slug: string) => getSection(section)?.topics.find((t) => t.slug === slug);
