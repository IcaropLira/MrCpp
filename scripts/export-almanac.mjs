import { createServer } from 'vite';
import { readdir, readFile, mkdir, writeFile } from 'node:fs/promises';
import { resolve, relative } from 'node:path';

const root = resolve('content');
const output = resolve('artifacts');
const server = await createServer({
  configFile: resolve('vite.config.ts'),
  server: { middlewareMode: true },
  appType: 'custom',
  logLevel: 'error'
});

function splitName(name) {
  const match = /^(\d+)-(.+)$/.exec(name);
  return { order: match ? Number(match[1]) : 99, slug: match ? match[2] : name };
}

function parseMarkdown(source) {
  const match = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/.exec(source);
  const data = {};
  if (match) {
    for (const line of match[1].split(/\r?\n/)) {
      const i = line.indexOf(':');
      if (i > 0) data[line.slice(0, i).trim()] = line.slice(i + 1).trim();
    }
  }
  return { data, body: match?.[2] ?? source };
}

async function walk(dir) {
  const out = [];
  for (const item of await readdir(dir, { withFileTypes: true })) {
    const path = resolve(dir, item.name);
    if (item.isDirectory()) out.push(...await walk(path));
    else if (item.isFile() && item.name.endsWith('.md')) out.push(path);
  }
  return out;
}

try {
  const { buildAlmanacLatex, buildAlmanacHtml } = await server.ssrLoadModule('/src/lib/almanacExport.ts');
  const files = await walk(root);
  const sections = new Map();
  const audit = [];
  for (const path of files) {
    const rel = relative(root, path).replaceAll('\\\\', '/');
    const [dir, file] = rel.split('/');
    const sectionName = splitName(dir);
    if (!sections.has(sectionName.slug)) {
      sections.set(sectionName.slug, {
        slug: sectionName.slug, title: sectionName.slug, part: '', summary: '',
        order: sectionName.order, topics: []
      });
    }
    const section = sections.get(sectionName.slug);
    const parsed = parseMarkdown(await readFile(path, 'utf8'));
    if (file === '_section.md') {
      Object.assign(section, {
        title: parsed.data.title ?? section.title,
        part: parsed.data.part ?? '',
        summary: parsed.data.summary ?? ''
      });
      continue;
    }
    const topicName = splitName(file.replace(/\.md$/, ''));
    const summary = parsed.data.summary ?? '';
    const complexity = parsed.data.complexity ?? '';
    const placeholder = summary === 'Em breve.' || complexity === 'tags:' ||
      /é uma técnica\/estrutura que aparece quando o problema tem a seguinte necessidade/i.test(parsed.body);
    const topic = {
      section: section.slug, slug: topicName.slug, order: topicName.order,
      title: parsed.data.title ?? topicName.slug,
      summary,
      status: parsed.data.status === 'done' && !placeholder ? 'done' : 'todo',
      complexity,
      tags: (parsed.data.tags ?? '').split(',').map(x => x.trim()).filter(Boolean),
      body: parsed.body
    };
    section.topics.push(topic);
    if (!topic.title || !topic.summary || !topic.complexity || topic.complexity === 'tags:' ||
        topic.summary === 'Em breve.' || /é uma técnica\/estrutura que aparece quando o problema tem a seguinte necessidade/i.test(topic.body)) {
      audit.push({ path: rel, summary: topic.summary, complexity: topic.complexity, status: topic.status });
    }
  }

  const selected = [...sections.values()].sort((a,b)=>a.order-b.order)
    .map(s => ({ ...s, topics: s.topics.sort((a,b)=>a.order-b.order).filter(t=>t.status==='done') }))
    .filter(s=>s.topics.length);
  const count = selected.reduce((sum,s)=>sum+s.topics.length,0);
  await mkdir(output, { recursive: true });
  await writeFile(resolve(output,'mrcpp-almanac.tex'),
    buildAlmanacLatex(selected, 'Mr. C++ — Almanaque de Referência', 'Ícaro Pinto Lira'), 'utf8');
  await writeFile(resolve(output,'mrcpp-almanac.html'),
    buildAlmanacHtml(selected, 'Mr. C++ — Almanaque de Referência', 'Ícaro Pinto Lira'), 'utf8');
  const report = [
    '# Auditoria automática de conteúdo',
    '',
    '- Arquivos Markdown encontrados: ' + files.length,
    '- Seções exportadas: ' + selected.length,
    '- Tópicos concluídos incluídos: ' + count,
    '- Fichas com metadados incompletos ou texto genérico detectado: ' + audit.length,
    '',
    ...audit.map(x => '- ' + x.path + ' — ' + (x.summary || 'sem resumo') + '; complexidade: ' + (x.complexity || 'ausente'))
  ].join('\n');
  await writeFile(resolve(output,'content-audit.md'), report, 'utf8');
  console.log('Exportados ' + count + ' tópicos de ' + selected.length + ' seções.');
  console.log('Fichas sinalizadas para revisão: ' + audit.length + '.');
} finally {
  await server.close();
}
