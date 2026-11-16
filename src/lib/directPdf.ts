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
    const p = pageIds[i], c = p + 1, im = p + 2;
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

function clean(s: string) {
  return s.replace(/```[a-zA-Z0-9_+-]*\n([\s\S]*?)```/g, '\n$1\n')
    .replace(/^#{1,6}\s*/gm, '').replace(/\*\*|__|~~|\*/g, '')
    .replace(/\$([^$]+)\$/g, '$1').replace(/^`|`$/gm, '')
    .replace(/^\s*[-*+]\s+/gm, '• ').trim();
}

export async function downloadDirectPdf(sections: Section[], title: string, author: string, o: DirectPdfOptions) {
  const raw = sizes[o.page];
  const w = o.orientation === 'landscape' ? raw[1] : raw[0];
  const h = o.orientation === 'landscape' ? raw[0] : raw[1];
  const scale = 2, canvas = document.createElement('canvas');
  canvas.width = Math.round(w * scale); canvas.height = Math.round(h * scale);
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas indisponível para gerar o PDF.');
  const margin = Math.max(24, Math.min(60, o.margin * 2.8346));
  const gap = 16, cw = (w - margin * 2 - gap * (o.columns - 1)) / o.columns;
  const pages: Uint8Array[] = [];
  let y = margin, col = 0, page = 0;
  const begin = () => {
    ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, canvas.width, canvas.height);
    page++; y = margin; col = 0;
    ctx.fillStyle = '#737985'; ctx.font = 14 * scale + 'px Arial';
    ctx.fillText(title, margin * scale, 14 * scale);
    ctx.strokeStyle = '#d41478'; ctx.beginPath(); ctx.moveTo(margin * scale, 20 * scale); ctx.lineTo((w - margin) * scale, 20 * scale); ctx.stroke();
    y = margin + 26;
  };
  const save = () => {
    if (o.pageNumbers) {
      ctx.fillStyle = '#777'; ctx.font = 13 * scale + 'px Arial'; ctx.textAlign = 'right';
      ctx.fillText(String(page), (w - margin) * scale, (h - 12) * scale); ctx.textAlign = 'left';
    }
    const b64 = canvas.toDataURL('image/jpeg', .9).split(',')[1], bin = atob(b64), bytes = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
    pages.push(bytes);
  };
  const advance = () => { col++; if (col >= o.columns) { save(); begin(); } else y = margin + 26; };
  const text = (value: string, size: number, color = '#252a33', bold = false, mono = false) => {
    ctx.font = (bold ? 'bold ' : '') + size * scale + 'px ' + (mono ? 'monospace' : 'Arial');
    ctx.fillStyle = color;
    const max = (cw - 8) * scale, lh = size * 1.35;
    for (const para of value.split('\n')) {
      const words = para.split(/\s+/); let line = '';
      for (const word of words) {
        const next = line ? line + ' ' + word : word;
        if (line && ctx.measureText(next).width > max) {
          if (y + lh > h - margin) advance();
          ctx.fillText(line, (margin + col * (cw + gap)) * scale, y * scale); y += lh; line = word;
        } else line = next;
      }
      if (line) {
        if (y + lh > h - margin) advance();
        ctx.fillText(line, (margin + col * (cw + gap)) * scale, y * scale); y += lh;
      } else y += lh * .5;
    }
    y += size * .25;
  };
  begin();
  if (o.cover) {
    ctx.fillStyle = '#d41478'; ctx.fillRect(margin * scale, h * .25 * scale, 5 * scale, h * .35 * scale);
    ctx.fillStyle = '#a10d5c'; ctx.font = 18 * scale + 'px Arial'; ctx.fillText('COMPETITIVE PROGRAMMING NOTEBOOK', (margin + 16) * scale, h * .34 * scale);
    ctx.fillStyle = '#171923'; ctx.font = 'bold ' + 58 * scale + 'px Arial'; ctx.fillText(title, (margin + 16) * scale, h * .43 * scale, (w - margin * 2 - 32) * scale);
    ctx.fillStyle = '#606774'; ctx.font = 22 * scale + 'px Arial'; ctx.fillText(author, (margin + 16) * scale, h * .49 * scale);
    save(); begin();
  }
  if (o.index) {
    text('ÍNDICE', 20, '#a10d5c', true);
    sections.forEach(s => text(String(s.order).padStart(2, '0') + ' · ' + s.title + ' (' + s.topics.length + ')', o.fontSize));
    save(); begin();
  }
  for (const section of sections) {
    if (y > margin + 28) advance();
    text(section.title, o.fontSize + 5, '#a10d5c', true);
    if (section.summary) text(section.summary, o.fontSize, '#626975');
    for (const topic of section.topics) {
      text(topic.title, o.fontSize + 1, '#252b36', true);
      text([topic.complexity, topic.tags.join(' / ')].filter(Boolean).join(' · '), Math.max(6, o.fontSize - 2), '#777f8b');
      if (topic.summary) text(topic.summary, o.fontSize, '#4b5563');
      const blocks = topic.body.split(/```(?:cpp|c\+\+|c|python)?\s*\n/);
      blocks.forEach((block, i) => {
        const value = i % 2 ? block.split(/```/)[0].trim() : clean(block);
        if (value) text(value, i % 2 ? Math.max(5, o.fontSize - 2) : o.fontSize, i % 2 ? '#263445' : '#303642', false, i % 2 === 1);
      });
      y += 4;
    }
  }
  save();
  const blob = pdf(pages, w, h, canvas.width, canvas.height);
  const url = URL.createObjectURL(blob), a = document.createElement('a');
  a.href = url; a.download = 'mr-cpp-biblioteca.pdf'; a.click();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}
