import type { Section } from '../types';

export type DirectPdfOptions = {
  page: 'A4' | 'A5' | 'Letter';
  orientation: 'portrait' | 'landscape';
  columns: 1 | 2 | 3;
  margin: number;
  fontSize: number;
  cover: boolean;
  index: boolean;
  pageNumbers: boolean;
};

const sizes = { A4: [595.28, 841.89], A5: [419.53, 595.28], Letter: [612, 792] } as const;
const join = (...parts: Uint8Array[]) => {
  const out = new Uint8Array(parts.reduce((n, p) => n + p.length, 0));
  let at = 0;
  for (const p of parts) { out.set(p, at); at += p.length; }
  return out;
};

function pdf(images: Uint8Array[], w: number, h: number, pxW: number, pxH: number) {
  const enc = new TextEncoder(), chunks: Uint8Array[] = [];
  let offset = 0;
  const offsets: number[] = [];
  const put = (v: string | Uint8Array) => {
    const b = typeof v === 'string' ? enc.encode(v) : v;
    chunks.push(b); offset += b.length;
  };
  const obj = (id: number, body: string | Uint8Array) => {
    offsets[id] = offset; put(id + ' 0 obj\n'); put(body); put('\nendobj\n');
  };
  const n = images.length, pageIds = images.map((_, i) => 3 + i * 3);
  put('%PDF-1.4\n');
  obj(1, '<< /Type /Catalog /Pages 2 0 R >>');
  obj(2, '<< /Type /Pages /Count ' + n + ' /Kids [' + pageIds.map(x => x + ' 0 R').join(' ') + '] >>');
  images.forEach((bytes, i) => {
    const p = pageIds[i]!;
    const c = p + 1, im = p + 2;
    obj(p, '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ' + w + ' ' + h + '] /Resources << /XObject << /Im0 ' + im + ' 0 R >> >> /Contents ' + c + ' 0 R >>');
    const stream = enc.encode('q\n' + w + ' 0 0 ' + h + ' 0 0 cm\n/Im0 Do\nQ');
    obj(c, join(enc.encode('<< /Length ' + stream.length + ' >>\nstream\n'), stream, enc.encode('\nendstream')));
    obj(im, join(enc.encode('<< /Type /XObject /Subtype /Image /Width ' + pxW + ' /Height ' + pxH + ' /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ' + bytes.length + ' >>\nstream\n'), bytes, enc.encode('\nendstream')));
  });
  const xref = offset, total = 3 + n * 3;
  put('xref\n0 ' + total + '\n0000000000 65535 f \n');
  for (let i = 1; i < total; i++) put(String(offsets[i]).padStart(10, '0') + ' 00000 n \n');
  put('trailer\n<< /Size ' + total + ' /Root 1 0 R >>\nstartxref\n' + xref + '\n%%EOF');
  return new Blob([join(...chunks)], { type: 'application/pdf' });
}

/* ───────────────────────── Markdown ───────────────────────── */

type Run = { text: string; bold?: boolean; italic?: boolean; code?: boolean; link?: boolean };
type Align = 'l' | 'r' | 'c';
type ListItem = { t: 'li'; depth: number; marker: string; box?: 'open' | 'done'; runs: Run[] };
type TableBlock = { t: 'table'; head: Run[][]; rows: Run[][][]; align: Align[] };
type CodeBlock = { t: 'code'; lang: string; lines: string[] };
type Block =
  | { t: 'h'; level: number; runs: Run[] }
  | { t: 'p'; runs: Run[] }
  | ListItem
  | CodeBlock
  | TableBlock
  | { t: 'hr' };

const LINK = /^\[([^\]]+)\]\(((?:https?:\/\/|\/|#|\.\/|mailto:)[^)\s]*)\)/;
const FENCE = /^\s{0,3}(`{3,}|~{3,})\s*([\w+#.-]*)/;
const HEADING = /^\s{0,3}(#{1,6})\s+(.*?)(?:\s+#+)?\s*$/;
const RULE = /^\s{0,3}([-*_])(?:\s*\1){2,}\s*$/;
const ITEM = /^(\s*)([-*+]|\d{1,3}[.)])\s+(.*)$/;
const TABLE_SEP = /^\s*\|?\s*:?-+:?\s*(?:\|\s*:?-+:?\s*)*\|?\s*$/;

/** Converte **negrito**, *itálico*, `código` e [links](url) em trechos estilizados. */
function parseInline(src: string): Run[] {
  const out: Run[] = [];
  let bold = false, italic = false, buf = '';
  const flush = () => { if (buf) { out.push({ text: buf, bold, italic }); buf = ''; } };
  let i = 0;
  while (i < src.length) {
    const c = src[i]!;
    if (c === '`') {
      const end = src.indexOf('`', i + 1);
      if (end > i) {
        flush();
        out.push({ text: src.slice(i + 1, end), bold, italic, code: true });
        i = end + 1;
        continue;
      }
    }
    if (c === '*' && src[i + 1] === '*' && (bold || (src[i + 2] !== ' ' && src.indexOf('**', i + 2) > 0))) {
      flush(); bold = !bold; i += 2; continue;
    }
    if (c === '*' && (italic ? src[i - 1] !== ' ' : src[i + 1] !== ' ' && src[i + 1] !== '*' && src.indexOf('*', i + 1) > 0)) {
      flush(); italic = !italic; i += 1; continue;
    }
    if (c === '[') {
      const m = LINK.exec(src.slice(i));
      if (m) { flush(); out.push({ text: m[1] ?? '', bold, italic, link: true }); i += m[0].length; continue; }
    }
    if (c === '\\' && i + 1 < src.length && '\\`*_{}[]()#+-.!|<>$'.includes(src[i + 1]!)) {
      buf += src[i + 1]; i += 2; continue;
    }
    buf += c; i++;
  }
  flush();
  return out;
}

function splitRow(line: string): string[] {
  const out: string[] = [];
  let cur = '', s = line.trim();
  if (s.startsWith('|')) s = s.slice(1);
  for (let i = 0; i < s.length; i++) {
    const ch = s[i]!;
    if (ch === '\\' && s[i + 1] === '|') { cur += '|'; i++; }
    else if (ch === '|') { out.push(cur.trim()); cur = ''; }
    else cur += ch;
  }
  if (cur.trim()) out.push(cur.trim());
  return out;
}

function parseMarkdown(src: string): Block[] {
  const lines = src.replace(/\r\n?/g, '\n').split('\n');
  const out: Block[] = [];
  type Pending = { kind: 'p' | 'li'; text: string; depth: number; marker: string; box?: 'open' | 'done' };
  let cur = null as Pending | null;
  const flush = () => {
    if (!cur) return;
    if (cur.kind === 'p') out.push({ t: 'p', runs: parseInline(cur.text) });
    else out.push({ t: 'li', depth: cur.depth, marker: cur.marker, box: cur.box, runs: parseInline(cur.text) });
    cur = null;
  };
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i] ?? '';

    const fence = FENCE.exec(line);
    if (fence) {
      flush();
      const mark = fence[1] ?? '```';
      const body: string[] = [];
      for (i++; i < lines.length; i++) {
        const l = (lines[i] ?? '').trim();
        if (l.length >= mark.length && l.split('').every((ch) => ch === mark[0])) break;
        body.push(lines[i] ?? '');
      }
      out.push({ t: 'code', lang: (fence[2] ?? '').toLowerCase(), lines: body });
      continue;
    }
    if (!line.trim()) { flush(); continue; }

    const head = HEADING.exec(line);
    if (head) { flush(); out.push({ t: 'h', level: (head[1] ?? '##').length, runs: parseInline(head[2] ?? '') }); continue; }
    if (RULE.test(line)) { flush(); out.push({ t: 'hr' }); continue; }

    const next = lines[i + 1];
    if (line.includes('|') && next && next.includes('|') && TABLE_SEP.test(next)) {
      flush();
      const align = splitRow(next).map((c): Align => (c.endsWith(':') ? (c.startsWith(':') ? 'c' : 'r') : 'l'));
      const rows: Run[][][] = [];
      let j = i + 2;
      for (; j < lines.length; j++) {
        const l = lines[j] ?? '';
        if (!l.trim() || !l.includes('|')) break;
        rows.push(splitRow(l).map((cell) => parseInline(cell)));
      }
      out.push({ t: 'table', head: splitRow(line).map((cell) => parseInline(cell)), rows, align });
      i = j - 1;
      continue;
    }

    const item = ITEM.exec(line);
    if (item) {
      flush();
      let text = item[3] ?? '';
      let box: 'open' | 'done' | undefined;
      const cb = /^\[( |x|X)\]\s+/.exec(text);
      if (cb) { box = cb[1] === ' ' ? 'open' : 'done'; text = text.slice(cb[0].length); }
      const marker = item[2] ?? '-';
      cur = { kind: 'li', depth: Math.min(3, Math.floor((item[1] ?? '').length / 2)), marker: /^[-*+]$/.test(marker) ? '•' : marker, text, box };
      continue;
    }

    const text = line.replace(/^\s*>\s?/, '').trim();
    if (cur) cur.text += ' ' + text;
    else cur = { kind: 'p', depth: 0, marker: '', text };
  }
  flush();
  return out;
}

/* ───────────────────── Código (realce + quebra) ───────────────────── */

const CODE = { plain: '#20242b', keyword: '#0b57d0', type: '#0f766e', string: '#b42318', number: '#b45309', comment: '#6b7280', pre: '#a10d5c' };
const KEYWORDS = new Set(('alignas alignof and auto break case catch class const consteval constexpr continue decltype default delete do else enum explicit extern false final for friend goto if inline namespace new noexcept not nullptr operator or override private protected public register return sizeof static static_assert struct switch template this throw true try typedef typename union using virtual volatile while').split(' '));
const TYPES = new Set(('bool char double float int long short signed unsigned void size_t ll ull ld i128 vector string pair map set multiset unordered_map unordered_set deque queue stack priority_queue bitset array tuple complex function int8_t int16_t int32_t int64_t uint8_t uint16_t uint32_t uint64_t').split(' '));
const PLAIN_LANGS = new Set(['text', 'txt', 'plain', 'output', 'input', 'console']);

/** Cor de cada caractere da linha (um realce simples de C++). `st` carrega comentários de bloco entre linhas. */
function colorize(line: string, st: { block: boolean }): string[] {
  const colors = new Array<string>(line.length).fill(CODE.plain);
  const paint = (from: number, to: number, color: string) => { for (let k = from; k < to; k++) colors[k] = color; };
  let i = 0;
  while (i < line.length) {
    if (st.block) {
      const end = line.indexOf('*/', i);
      const stop = end < 0 ? line.length : end + 2;
      paint(i, stop, CODE.comment);
      i = stop;
      if (end >= 0) st.block = false;
      continue;
    }
    const c = line[i]!, d = line[i + 1];
    if (c === '/' && d === '/') { paint(i, line.length, CODE.comment); break; }
    if (c === '/' && d === '*') { st.block = true; paint(i, i + 2, CODE.comment); i += 2; continue; }
    if (c === '"') {
      let k = i + 1;
      while (k < line.length && line[k] !== '"') k += line[k] === '\\' ? 2 : 1;
      k = Math.min(line.length, k + 1);
      paint(i, k, CODE.string);
      i = k;
      continue;
    }
    if (c === "'") {
      const m = /^'(?:\\.[^']*|[^'\\])'/.exec(line.slice(i));
      if (m) { paint(i, i + m[0].length, CODE.string); i += m[0].length; continue; }
    }
    if (c === '#' && !line.slice(0, i).trim()) {
      const m = /^#\s*[A-Za-z_]+/.exec(line.slice(i));
      if (m) {
        paint(i, i + m[0].length, CODE.pre);
        i += m[0].length;
        const inc = /^\s*(<[^>]*>|"[^"]*")/.exec(line.slice(i));
        if (inc && m[0].includes('include')) {
          paint(i + inc[0].length - (inc[1] ?? '').length, i + inc[0].length, CODE.string);
          i += inc[0].length;
        }
        continue;
      }
    }
    if (c >= '0' && c <= '9') {
      const m = /^(?:0[xX][0-9a-fA-F']+|0[bB][01']+|\d[\d']*(?:\.\d*)?(?:[eE][+-]?\d+)?)[uUlLfF]*/.exec(line.slice(i));
      if (m) { paint(i, i + m[0].length, CODE.number); i += m[0].length; continue; }
    }
    if (/[A-Za-z_]/.test(c)) {
      const m = /^[A-Za-z_][A-Za-z0-9_]*/.exec(line.slice(i));
      const word = m ? m[0] : c;
      if (KEYWORDS.has(word)) paint(i, i + word.length, CODE.keyword);
      else if (TYPES.has(word)) paint(i, i + word.length, CODE.type);
      i += word.length;
      continue;
    }
    i++;
  }
  return colors;
}

type Row = { text: string; colors: string[]; cont: boolean };

/** Prepara as linhas do bloco: expande tabs, realça e quebra linhas largas preservando a indentação. */
function codeRows(lines: string[], lang: string, maxCols: number): Row[] {
  const hl = !PLAIN_LANGS.has(lang);
  const st = { block: false };
  const rows: Row[] = [];
  const src = lines.map((l) => l.replace(/\t/g, '    ').trimEnd());
  while (src.length && !src[0]) src.shift();
  while (src.length && !src[src.length - 1]) src.pop();
  for (const line of src) {
    const colors = hl ? colorize(line, st) : new Array<string>(line.length).fill(CODE.plain);
    if (line.length <= maxCols) { rows.push({ text: line, colors, cont: false }); continue; }
    const indent = (/^ */.exec(line) ?? [''])[0].length;
    const contIndent = Math.min(indent + 4, Math.floor(maxCols / 3));
    let start = 0, first = true;
    while (start < line.length) {
      const room = maxCols - (first ? 0 : contIndent);
      if (line.length - start <= room) {
        rows.push({ text: ' '.repeat(first ? 0 : contIndent) + line.slice(start), colors: [...new Array<string>(first ? 0 : contIndent).fill(CODE.plain), ...colors.slice(start)], cont: !first });
        break;
      }
      let cut = start + room;
      for (let p = cut; p > start + Math.floor(room / 2); p--) {
        const prev = line[p - 1];
        if (prev === ' ' || prev === ',' || prev === ';' || prev === '{' || prev === '(') { cut = p; break; }
      }
      const seg = line.slice(start, cut).trimEnd();
      rows.push({ text: ' '.repeat(first ? 0 : contIndent) + seg, colors: [...new Array<string>(first ? 0 : contIndent).fill(CODE.plain), ...colors.slice(start, start + seg.length)], cont: !first });
      start = cut;
      while (line[start] === ' ') start++;
      first = false;
    }
  }
  return rows;
}

/* ───────────────────────── Fontes e layout ───────────────────────── */

const SANS = 'Arial, "Helvetica Neue", Helvetica, sans-serif';
const MONO = '"Fira Code", Consolas, "SF Mono", Menlo, "DejaVu Sans Mono", "Liberation Mono", "Courier New", monospace';

type Face = { size: number; bold?: boolean; italic?: boolean; mono?: boolean };
type Atom = { text: string; face: Face; color: string; code: boolean; gap: boolean; w: number; x: number };

/** Quebra os trechos em palavras estilizadas; `gap` diz se havia espaço antes (onde a linha pode quebrar). */
function atomsOf(runs: Run[], size: number, color: string, baseBold = false): Atom[] {
  const atoms: Atom[] = [];
  let pendingGap = false;
  for (const r of runs) {
    const face: Face = r.code ? { size: size * 0.92, mono: true } : { size, bold: baseBold || !!r.bold, italic: !!r.italic };
    const col = r.code ? CODE.plain : r.link ? '#1d4ed8' : color;
    for (const part of r.text.split(/(\s+)/)) {
      if (!part) continue;
      if (/^\s+$/.test(part)) { pendingGap = true; continue; }
      atoms.push({ text: part, face, color: col, code: !!r.code, gap: pendingGap && atoms.length > 0, w: 0, x: 0 });
      pendingGap = false;
    }
  }
  return atoms;
}

async function loadFonts() {
  try { await document.fonts?.load('400 10px "Fira Code"'); } catch { /* segue com as fontes do sistema */ }
}

export async function downloadDirectPdf(sections: Section[], title: string, author: string, o: DirectPdfOptions) {
  const raw = sizes[o.page];
  const pageWidth = raw[0] ?? 595.28;
  const pageHeight = raw[1] ?? 841.89;
  const w = o.orientation === 'landscape' ? pageHeight : pageWidth;
  const h = o.orientation === 'landscape' ? pageWidth : pageHeight;
  const scale = 2, canvas = document.createElement('canvas');
  canvas.width = Math.round(w * scale); canvas.height = Math.round(h * scale);
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas indisponível para gerar o PDF.');
  await loadFonts();

  const fs = o.fontSize;
  const margin = Math.max(24, Math.min(60, o.margin * 2.8346));
  const gap = 16, cw = (w - margin * 2 - gap * (o.columns - 1)) / o.columns;
  const top = margin + 10, bottom = h - margin;
  const pages: Uint8Array[] = [];
  let y = top, col = 0, page = 0;

  /* — primitivas de desenho (tudo em pontos; o canvas é desenhado a `scale`x) — */
  const setFace = (f: Face) => {
    ctx.font = (f.italic ? 'italic ' : '') + (f.bold ? 'bold ' : '') + f.size * scale + 'px ' + (f.mono ? MONO : SANS);
  };
  const width = (s: string) => ctx.measureText(s).width / scale;
  const fill = (s: string, x: number, baseline: number, color: string, maxW?: number) => {
    ctx.fillStyle = color;
    if (maxW) ctx.fillText(s, x * scale, baseline * scale, maxW * scale);
    else ctx.fillText(s, x * scale, baseline * scale);
  };
  const roundRect = (x: number, yy: number, rw: number, rh: number, r: number) => {
    const X = x * scale, Y = yy * scale, W = rw * scale, H = rh * scale, R = r * scale;
    ctx.beginPath();
    ctx.moveTo(X + R, Y);
    ctx.arcTo(X + W, Y, X + W, Y + H, R);
    ctx.arcTo(X + W, Y + H, X, Y + H, R);
    ctx.arcTo(X, Y + H, X, Y, R);
    ctx.arcTo(X, Y, X + W, Y, R);
    ctx.closePath();
  };
  const hline = (x1: number, x2: number, yy: number, color: string, lw: number) => {
    ctx.strokeStyle = color; ctx.lineWidth = lw * scale;
    ctx.beginPath(); ctx.moveTo(x1 * scale, yy * scale); ctx.lineTo(x2 * scale, yy * scale); ctx.stroke();
  };

  /* — páginas e colunas — */
  const startPage = () => {
    page++; y = top; col = 0;
    ctx.save();
    ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, canvas.width, canvas.height);
    setFace({ size: 8 });
    fill(title, margin, 15, '#737985', w - margin * 2);
    hline(margin, w - margin, 21, '#d41478', 0.8);
    ctx.restore();
  };
  const finishPage = () => {
    ctx.save();
    if (o.pageNumbers) {
      setFace({ size: 8 });
      const label = String(page);
      fill(label, w - margin - width(label), h - 14, '#777');
    }
    ctx.restore();
    const b64 = canvas.toDataURL('image/jpeg', 0.92).split(',')[1];
    if (!b64) throw new Error('Não foi possível codificar a página do PDF.');
    const bin = atob(b64), bytes = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
    pages.push(bytes);
  };
  const left = () => margin + col * (cw + gap);
  const newColumn = () => {
    col++;
    if (col >= o.columns) { finishPage(); startPage(); } else y = top;
  };
  /** Garante `need` pontos livres na coluna; senão vai para a próxima. */
  const ensure = (need: number) => { if (y + need > bottom && y > top + 1) newColumn(); };

  /* — texto corrido com estilos inline — */
  const spaceW = (f: Face) => { setFace({ ...f, bold: false, italic: false }); return width(' '); };
  const layout = (atoms: Atom[], maxW: number): Atom[][] => {
    const lines: Atom[][] = [];
    let cur: Atom[] = [], x = 0;
    const queue = [...atoms];
    while (queue.length) {
      const a = queue.shift()!;
      setFace(a.face);
      a.w = width(a.text);
      if (a.w > maxW && a.text.length > 1) {
        let n = a.text.length - 1;
        while (n > 1 && width(a.text.slice(0, n)) > maxW) n--;
        if (cur.length) { lines.push(cur); cur = []; x = 0; }
        const head: Atom = { ...a, text: a.text.slice(0, n), x: 0, w: width(a.text.slice(0, n)) };
        lines.push([head]);
        queue.unshift({ ...a, text: a.text.slice(n), gap: false });
        continue;
      }
      let sp = cur.length && a.gap ? spaceW(a.face) : 0;
      if (cur.length && a.gap && x + sp + a.w > maxW) { lines.push(cur); cur = []; x = 0; sp = 0; }
      a.x = x + sp; x = a.x + a.w;
      cur.push(a);
    }
    if (cur.length) lines.push(cur);
    return lines;
  };
  const lineWidth = (line: Atom[]) => { const last = line[line.length - 1]; return last ? last.x + last.w : 0; };
  const drawLine = (line: Atom[], x0: number, top0: number, lh: number, size: number) => {
    const base = top0 + lh / 2 + size * 0.35;
    line.forEach((a, k) => {
      if (!a.code) return;
      const nx = line[k + 1];
      const right = nx && nx.code && nx.gap ? nx.x : a.x + a.w;
      roundRect(x0 + a.x - 1.5, top0 + lh * 0.1, right - a.x + 3, lh * 0.8, 2.5);
      ctx.fillStyle = '#eceff3'; ctx.fill();
    });
    line.forEach((a) => { setFace(a.face); fill(a.text, x0 + a.x, base, a.color); });
  };
  const para = (runs: Run[], size: number, color: string, opt: { bold?: boolean; keep?: number } = {}) => {
    const lh = size * 1.45;
    const lines = layout(atomsOf(runs, size, color, opt.bold), cw);
    ensure(Math.min(lines.length, opt.keep ?? 2) * lh);
    for (const line of lines) {
      ensure(lh);
      drawLine(line, left(), y, lh, size);
      y += lh;
    }
  };
  const plain = (text: string, italic = false): Run[] => [{ text, italic }];

  /* — listas — */
  const item = (b: ListItem) => {
    const size = fs, lh = size * 1.45;
    const indent = b.depth * 11;
    let hang = 9;
    if (b.box) hang = size * 1.35;
    else if (b.marker !== '•') { setFace({ size, bold: true }); hang = Math.max(11, width(b.marker) + 4); }
    const lines = layout(atomsOf(b.runs, size, '#303642'), cw - indent - hang);
    ensure(Math.min(lines.length, 2) * lh);
    lines.forEach((line, k) => {
      ensure(lh);
      const x = left() + indent;
      if (k === 0) {
        const mid = y + lh / 2;
        if (b.box) {
          const side = size * 0.72, bx = x, by = mid - side / 2;
          roundRect(bx, by, side, side, 1.2);
          if (b.box === 'done') { ctx.fillStyle = '#d41478'; ctx.fill(); }
          ctx.strokeStyle = b.box === 'done' ? '#d41478' : '#6b7280'; ctx.lineWidth = 0.8 * scale; ctx.stroke();
          if (b.box === 'done') {
            ctx.strokeStyle = '#fff'; ctx.lineWidth = 1 * scale;
            ctx.beginPath();
            ctx.moveTo((bx + side * 0.22) * scale, (by + side * 0.52) * scale);
            ctx.lineTo((bx + side * 0.43) * scale, (by + side * 0.74) * scale);
            ctx.lineTo((bx + side * 0.8) * scale, (by + side * 0.28) * scale);
            ctx.stroke();
          }
        } else if (b.marker === '•') {
          ctx.fillStyle = '#d41478';
          ctx.beginPath(); ctx.arc((x + 2.5) * scale, mid * scale, size * 0.14 * scale, 0, Math.PI * 2); ctx.fill();
        } else {
          setFace({ size, bold: true });
          fill(b.marker, x, y + lh / 2 + size * 0.35, '#a10d5c');
        }
      }
      drawLine(line, x + hang, y, lh, size);
      y += lh;
    });
  };

  /* — blocos de código — */
  const code = (b: CodeBlock) => {
    const size = Math.max(5.5, fs - 1.5), lh = size * 1.4;
    const padX = 8, padY = 5;
    setFace({ size, mono: true });
    const charW = width('MMMMMMMMMM') / 10;
    const maxCols = Math.max(12, Math.floor((cw - padX - 5) / charW));
    const rows = codeRows(b.lines, b.lang, maxCols);
    if (!rows.length) return;
    let idx = 0;
    while (idx < rows.length) {
      const remaining = rows.length - idx;
      const fit = Math.floor((bottom - y - padY * 2) / lh);
      if (fit < Math.min(remaining, 3) && y > top + 1) { newColumn(); continue; }
      let n = Math.max(1, Math.min(remaining, fit));
      if (remaining - n === 1 && n > 2) n--;
      const x = left(), boxH = n * lh + padY * 2;
      roundRect(x, y, cw, boxH, 3.5);
      ctx.fillStyle = '#f4f5f8'; ctx.fill();
      ctx.strokeStyle = '#d5d9e0'; ctx.lineWidth = 0.7 * scale; ctx.stroke();
      ctx.save();
      roundRect(x, y, cw, boxH, 3.5); ctx.clip();
      ctx.fillStyle = '#d41478'; ctx.fillRect(x * scale, y * scale, 2.2 * scale, boxH * scale);
      ctx.restore();
      for (let k = 0; k < n; k++) {
        const row = rows[idx + k]!;
        const base = y + padY + k * lh + lh / 2 + size * 0.35;
        if (row.cont) { setFace({ size: size * 0.7, mono: true }); fill('↪', x + 3.4, base, '#9aa1ad'); }
        setFace({ size, mono: true });
        let i = 0;
        while (i < row.text.length) {
          let j = i + 1;
          while (j < row.text.length && row.colors[j] === row.colors[i]) j++;
          const seg = row.text.slice(i, j);
          if (seg.trim()) fill(seg, x + padX + i * charW, base, row.colors[i] ?? CODE.plain);
          i = j;
        }
      }
      y += boxH;
      idx += n;
      if (idx < rows.length) newColumn();
    }
  };

  /* — tabelas — */
  const table = (b: TableBlock) => {
    const size = Math.max(6, fs - 0.5), lh = size * 1.4, padX = 4, padY = 2.5;
    const n = b.head.length;
    const grid = [b.head, ...b.rows].map((row) => Array.from({ length: n }, (_, c) => row[c] ?? []));
    const natural = Array.from({ length: n }, (_, c) => {
      const widest = grid.map((row, r) => lineWidth(layout(atomsOf(row[c] ?? [], size, '#000', r === 0), 1e6)[0] ?? []));
      return Math.max(...widest) + padX * 2;
    });
    const total = natural.reduce((a, v) => a + v, 0);
    let widths = total <= cw ? natural : natural.map((v) => Math.max(24, (v * cw) / total));
    const sum = widths.reduce((a, v) => a + v, 0);
    if (sum > cw) widths = widths.map((v) => (v * cw) / sum);
    const cells = grid.map((row, r) => row.map((runs, c) => layout(atomsOf(runs, size, r === 0 ? '#171923' : '#303642', r === 0), (widths[c] ?? 24) - padX * 2)));
    const tw = widths.reduce((a, v) => a + v, 0);
    cells.forEach((row, r) => {
      const rowH = Math.max(...row.map((lines) => lines.length)) * lh + padY * 2;
      ensure(rowH + (r === 0 ? lh + padY * 2 : 0));
      const x = left();
      if (r === 0) { ctx.fillStyle = '#f1f2f4'; ctx.fillRect(x * scale, y * scale, tw * scale, rowH * scale); }
      let cx = x;
      row.forEach((lines, c) => {
        const colW = widths[c] ?? 24, inner = colW - padX * 2;
        lines.forEach((line, k) => {
          const lw = lineWidth(line), al = b.align[c] ?? 'l';
          const off = al === 'r' ? inner - lw : al === 'c' ? (inner - lw) / 2 : 0;
          drawLine(line, cx + padX + off, y + padY + k * lh, lh, size);
        });
        cx += colW;
      });
      hline(x, x + tw, y + rowH, r === 0 ? '#b8bec8' : '#e0e3e8', 0.6);
      if (r === 0) hline(x, x + tw, y, '#b8bec8', 0.6);
      y += rowH;
    });
  };

  /* — corpo de um tópico — */
  const minHeight = (b: Block | undefined) => {
    if (!b) return 0;
    if (b.t === 'code') return Math.max(5.5, fs - 1.5) * 1.4 * 3 + 10;
    return fs * 1.45 * 2;
  };
  const body = (src: string) => {
    const blocks = parseMarkdown(src);
    blocks.forEach((b, idx) => {
      const next = blocks[idx + 1];
      switch (b.t) {
        case 'h': {
          const size = b.level <= 2 ? fs + 0.5 : fs;
          if (y > top + 1) y += size * 0.4;
          ensure(size * 1.45 + minHeight(next));
          para(b.runs, size, b.level <= 2 ? '#a10d5c' : '#252b36', { bold: true, keep: 1 });
          y += size * 0.2;
          break;
        }
        case 'p': para(b.runs, fs, '#303642'); y += fs * 0.6; break;
        case 'li': item(b); y += next?.t === 'li' ? fs * 0.2 : fs * 0.6; break;
        case 'code': code(b); y += fs * 0.7; break;
        case 'table': table(b); y += fs * 0.7; break;
        case 'hr': ensure(8); hline(left(), left() + cw, y + 3, '#d9dce1', 0.6); y += 9; break;
      }
    });
  };

  /* — montagem do documento — */
  startPage();
  if (o.cover) {
    const maxW = w - margin * 2 - 32, ts = 44, tlh = ts * 1.15;
    const titleLines = layout(atomsOf(plain(title), ts, '#171923', true), maxW);
    const barTop = h * 0.25, kicker = h * 0.25 + 36;
    const titleTop = kicker + 22, authorY = titleTop + titleLines.length * tlh + 26;
    ctx.fillStyle = '#d41478'; ctx.fillRect(margin * scale, barTop * scale, 5 * scale, (authorY + 14 - barTop) * scale);
    setFace({ size: 14, bold: true }); fill('COMPETITIVE PROGRAMMING NOTEBOOK', margin + 16, kicker, '#a10d5c');
    titleLines.forEach((line, k) => drawLine(line, margin + 16, titleTop + k * tlh, tlh, ts));
    setFace({ size: 20 }); fill(author, margin + 16, authorY, '#606774', maxW);
    finishPage(); startPage();
  }
  if (o.index) {
    para(plain('ÍNDICE'), fs + 10, '#a10d5c', { bold: true });
    y += 4;
    sections.forEach((s) => para(plain(String(s.order).padStart(2, '0') + ' · ' + s.title + ' (' + s.topics.length + ')'), fs, '#252a33', { keep: 1 }));
    finishPage(); startPage();
  }
  for (const section of sections) {
    if (y > top + 1) newColumn();
    para(plain(section.title), fs + 6, '#a10d5c', { bold: true });
    y += 1; hline(left(), left() + cw, y, '#d41478', 1); y += 6;
    if (section.summary) { para(plain(section.summary, true), fs, '#626975'); y += fs * 0.5; }
    for (const topic of section.topics) {
      if (y > top + 1) y += fs * 0.8;
      ensure((fs + 2.5) * 1.45 + fs * 1.45 * 3);
      para(plain(topic.title), fs + 2.5, '#171923', { bold: true, keep: 2 });
      const meta = [topic.complexity, topic.tags.join(' / ')].filter((s) => s && !/^(tags:?|---)$/i.test(s.trim())).join(' · ');
      if (meta) para(plain(meta), Math.max(6, fs - 2), '#777f8b', { keep: 1 });
      if (topic.summary) para(plain(topic.summary, true), fs, '#626975');
      y += fs * 0.5;
      body(topic.body);
    }
  }
  finishPage();
  const blob = pdf(pages, w, h, canvas.width, canvas.height);
  const url = URL.createObjectURL(blob), a = document.createElement('a');
  a.href = url; a.download = 'mr-cpp-biblioteca.pdf'; a.click();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}
