import type { Section, Topic } from '../types';
import { almanacDiagrams } from './almanacDiagrams';
import { almanacSheets } from './almanac';

type Note = { title: string; lines: string[] };
type CodeSample = { language: string; code: string };

function esc(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function texText(s: string): string {
  const slash = String.fromCharCode(92);
  const roots: string[] = [];
  s = s.replace(/√\(([^)]+)\)/g, (_, value: string) => {
    roots.push(value);
    return 'ROOTPH' + (roots.length - 1) + 'END';
  });
  s = s.replace(/√([A-Za-z0-9]+)/g, (_, value: string) => {
    roots.push(value);
    return 'ROOTPH' + (roots.length - 1) + 'END';
  });
  const replacements: Record<string, string> = {
    [slash]: slash + 'textbackslash{}',
    '{': slash + '{',
    '}': slash + '}',
    '#': slash + '#',
    '$': slash + '$',
    '%': slash + '%',
    '&': slash + '&',
    '_': slash + '_',
    '~': slash + 'textasciitilde{}',
    '^': slash + 'textasciicircum{}',
    '∞': slash + 'ensuremath{\\infty}',
    '−': slash + 'ensuremath{-}',
    '·': slash + 'ensuremath{\\cdot}',
    '≤': slash + 'ensuremath{\\le}',
    '≥': slash + 'ensuremath{\\ge}',
    '≈': slash + 'ensuremath{\\approx}',
    '×': slash + 'ensuremath{\\times}',
    '√': slash + 'ensuremath{\\surd}',
    'α': slash + 'ensuremath{\\alpha}',
    'β': slash + 'ensuremath{\\beta}',
    'π': slash + 'ensuremath{\\pi}',
    'θ': slash + 'ensuremath{\\theta}',
    'ε': slash + 'ensuremath{\\varepsilon}',
    '⊕': slash + 'ensuremath{\\oplus}',
    '→': slash + 'ensuremath{\\to}',
    '←': slash + 'ensuremath{\\leftarrow}',
    '↔': slash + 'ensuremath{\\leftrightarrow}',
    '²': slash + 'ensuremath{^2}',
    '³': slash + 'ensuremath{^3}',
    '≠': slash + 'ensuremath{\\ne}',
    '∑': slash + 'ensuremath{\\sum}',
    '∏': slash + 'ensuremath{\\prod}',
    '∈': slash + 'ensuremath{\\in}',
    '∉': slash + 'ensuremath{\\notin}',
    '∪': slash + 'ensuremath{\\cup}',
    '∩': slash + 'ensuremath{\\cap}',
    '∝': slash + 'ensuremath{\\propto}',
    '±': slash + 'ensuremath{\\pm}',
    '–': '--',
    '—': '---',
    '⁹': slash + 'ensuremath{^9}'
  };
  const escaped = s.replace(/[\\{}#$%&_~^∞−·≤≥≈×√αβπθε⊕→←↔²³≠∑∏∈∉∪∩∝±–—⁹]/g, (ch) => replacements[ch] ?? ch);
  return escaped.replace(/ROOTPH(\\d+)END/g, (_, index: string) =>
    slash + 'ensuremath{\\sqrt{' + roots[Number(index)] + '}}');
}

function texMath(s: string): string {
  return s
    .replace(/√\(([^)]+)\)/g, '\\sqrt{$1}')
    .replace(/√([A-Za-z0-9]+)/g, '\\sqrt{$1}')
    .replace(/≈/g, '\\approx')
    .replace(/≤/g, '\\le')
    .replace(/≥/g, '\\ge')
    .replace(/≠/g, '\\ne')
    .replace(/·/g, '\\cdot')
    .replace(/×/g, '\\times')
    .replace(/∞/g, '\\infty')
    .replace(/→/g, '\\to')
    .replace(/←/g, '\\leftarrow')
    .replace(/↔/g, '\\leftrightarrow')
    .replace(/⊕/g, '\\oplus')
    .replace(/α/g, '\\alpha')
    .replace(/β/g, '\\beta')
    .replace(/π/g, '\\pi')
    .replace(/θ/g, '\\theta')
    .replace(/ε/g, '\\varepsilon')
    .replace(/²/g, '^2')
    .replace(/³/g, '^3')
    .replace(/−/g, '-')
    .replace(/±/g, '\\pm')
    .replace(/∝/g, '\\propto')
    .replace(/∑/g, '\\sum')
    .replace(/∏/g, '\\prod')
    .replace(/∈/g, '\\in')
    .replace(/∉/g, '\\notin')
    .replace(/∪/g, '\\cup')
    .replace(/∩/g, '\\cap')
    .replace(/⁹/g, '^9')
    .replace(/[–—]/g, '-');
}

function texInline(s: string): string {
  return s.split(/(\$[^$]+\$)/g).map((part) => {
    if (part.startsWith('$') && part.endsWith('$')) return '$' + texMath(part.slice(1, -1)) + '$';
    const clean = part.replace(/[*]/g, '').split(String.fromCharCode(96)).join('');
    return texText(clean);
  }).join('');
}

function sectionsOf(body: string): Array<{ title: string; body: string }> {
  const matches = [...body.matchAll(/^##\s+(.+)$/gm)];
  return matches.map((m, i) => {
    const next = matches[i + 1];
    const end = next?.index ?? body.length;
    return {
      title: (m[1] || '').trim(),
      body: body.slice((m.index ?? 0) + m[0].length, end).trim()
    };
  });
}

function notesOf(topic: Topic): Note[] {
  const wanted = /f[oó]rmula|propriedade|uso|aplica|observa|complexidade|limite|cuidado/i;
  const notes = sectionsOf(topic.body).filter((s) => wanted.test(s.title) && !/^c[oó]digo$/i.test(s.title))
    .map((s) => {
      const plain = s.body.replace(/\x60{3}[\s\S]*?\x60{3}/g, '');
      return {
        title: s.title,
        lines: plain.split(/\r?\n/).map((x) => x.replace(/^\s*[-*]\s*/, '').trim())
          .filter((x) => x && !x.startsWith('#'))
          .map((x) => x.replace(/[\x60]([^\x60]+)[\x60]/g, '$1').replace(/\*\*/g, ''))
          .slice(0, 2)
      };
    }).filter((s) => s.lines.length);
  const formulas = sectionsOf(topic.body).flatMap((s) => s.body.replace(/\x60{3}[\s\S]*?\x60{3}/g, '')
    .split(/\r?\n/).map((x) => x.trim()).filter((x) => /\$[^$]+\$/.test(x)))
    .slice(0, 2).map((x) => x.replace(/^[*-]\s*/, '').replace(/[\x60]/g, ''));
  if (formulas.length && !notes.some((n) => /f[oó]rmula/i.test(n.title))) {
    notes.unshift({ title: 'Fórmulas', lines: formulas });
  }
  return notes.slice(0, 3);
}

function codeOf(topic: Topic): CodeSample[] {
  const out: CodeSample[] = [];
  const re = /\x60{3}([a-zA-Z0-9_+-]*)\s*\r?\n([\s\S]*?)\x60{3}/g;
  for (const m of topic.body.matchAll(re)) {
    const lang = (m[1] || 'text').toLowerCase();
    if (['cpp', 'c++', 'c', 'python', 'text'].includes(lang)) {
      out.push({ language: lang, code: (m[2] || '').trim() });
    }
  }
  const cpp = out.filter((x) => ['cpp', 'c++', 'c'].includes(x.language));
  if (cpp.length) return cpp.slice(0, 2);
  const python = out.filter((x) => x.language === 'python');
  if (python.length) return python.slice(0, 1);
  return out.filter((x) => x.language === 'text').slice(0, 1);
}

function diagramFor(topic: Topic) {
  return almanacDiagrams.filter((d) => d.key === topic.section + '/' + topic.slug);
}

function svgFor(key: string): string {
  const common = 'xmlns="http://www.w3.org/2000/svg" viewBox="0 0 420 118" role="img"';
  const base = '<svg ' + common + '>';
  const end = '</svg>';
  const axis = '<path d="M24 94H396 M52 108V12" stroke="#64748b" stroke-width="1.5" fill="none"/>';
  if (key.includes('04-fft-e-ntt')) return base +
    '<g fill="#eef2f9" stroke="#16264a" stroke-width="1.5"><rect x="12" y="34" width="78" height="34" rx="5"/><rect x="116" y="34" width="78" height="34" rx="5"/><rect x="220" y="34" width="78" height="34" rx="5"/><rect x="324" y="34" width="84" height="34" rx="5"/></g><g fill="#16264a" font-size="11" text-anchor="middle"><text x="51" y="55">A, B</text><text x="155" y="55">FFT</text><text x="259" y="55">A · B</text><text x="366" y="55">FFT⁻¹</text></g><g stroke="#9c6b12" stroke-width="2" fill="none"><path d="M90 51H112l-5 -4m5 4l-5 4M194 51H216l-5 -4m5 4l-5 4M298 51H320l-5 -4m5 4l-5 4"/></g>' + end;
  if (key.includes('01-numeros-complexos-como-pontos')) return base + axis +
    '<path d="M70 82L330 26" stroke="#1857b8" stroke-width="3"/><circle cx="70" cy="82" r="4" fill="#9c6b12"/><circle cx="330" cy="26" r="4" fill="#9c6b12"/><g fill="#16264a" font-size="12"><text x="55" y="99">A</text><text x="338" y="24">B</text><text x="185" y="45">AB</text></g>' + end;
  if (key.includes('02-cross')) return base + axis +
    '<path d="M52 94L330 94 M52 94L218 18" stroke="#1857b8" stroke-width="3" fill="none"/><path d="M52 94L260 25" stroke="#9c6b12" stroke-width="3" fill="none"/><circle cx="52" cy="94" r="4" fill="#16264a"/><g fill="#16264a" font-size="12"><text x="334" y="98">u</text><text x="222" y="15">v</text><text x="276" y="24">cross</text></g>' + end;
  if (key.includes('03-area')) return base +
    '<path d="M68 90L145 90L220 28L340 50L295 100Z" fill="#eef2f9" stroke="#1857b8" stroke-width="2.5"/><g fill="#9c6b12"><circle cx="68" cy="90" r="4"/><circle cx="145" cy="90" r="4"/><circle cx="220" cy="28" r="4"/><circle cx="340" cy="50" r="4"/><circle cx="295" cy="100" r="4"/></g><text x="204" y="72" font-size="13" fill="#16264a">A = |Σ cross| / 2</text>' + end;
  if (key.includes('05-fecho')) return base +
    '<path d="M60 80L115 95L300 92L360 42L235 12L80 24Z" fill="#eef2f9" stroke="#1857b8" stroke-width="2.5" stroke-dasharray="5 3"/><g fill="#9c6b12"><circle cx="60" cy="80" r="4"/><circle cx="115" cy="95" r="4"/><circle cx="300" cy="92" r="4"/><circle cx="360" cy="42" r="4"/><circle cx="235" cy="12" r="4"/></g><g fill="#94a3b8"><circle cx="160" cy="55" r="3"/><circle cx="230" cy="70" r="3"/><circle cx="285" cy="50" r="3"/></g>' + end;
  if (key.includes('02-intersecao-de-segmentos')) return base +
    '<path d="M65 18L355 100M65 100L355 18" stroke="#1857b8" stroke-width="3" fill="none"/><circle cx="210" cy="59" r="5" fill="#c2413b"/><text x="221" y="51" fill="#16264a" font-size="12">interseção</text>' + end;
  if (key.includes('01-par-de-pontos-mais-proximos')) return base +
    '<path d="M210 10V108" stroke="#c2413b" stroke-dasharray="4 4"/><rect x="150" y="10" width="120" height="98" fill="#fef3c7" opacity=".55"/><g fill="#1857b8"><circle cx="172" cy="38" r="4"/><circle cx="238" cy="73" r="4"/><circle cx="194" cy="88" r="4"/></g><path d="M172 38L238 73" stroke="#1857b8" stroke-width="2"/><g fill="#16264a" font-size="11"><text x="214" y="17">xₘ</text><text x="276" y="60">faixa</text></g>' + end;
  if (key.includes('04-distancias')) return base +
    '<path d="M40 92L375 25" stroke="#64748b" stroke-width="3"/><circle cx="125" cy="75" r="4" fill="#1857b8"/><circle cx="300" cy="40" r="4" fill="#1857b8"/><circle cx="220" cy="12" r="4" fill="#9c6b12"/><path d="M220 12L230 55" stroke="#c2413b" stroke-width="2" stroke-dasharray="4 3"/><text x="238" y="36" fill="#c2413b" font-size="12">d</text>' + end;
  if (key === '08-consultas-em-intervalo/04-segment-tree') return base +
    '<g stroke="#64748b" stroke-width="1.5"><path d="M210 18L115 52M210 18L305 52M115 52L65 88M115 52L165 88M305 52L255 88M305 52L355 88"/></g><g fill="#eef2f9" stroke="#16264a"><rect x="184" y="5" width="52" height="25" rx="5"/><rect x="89" y="40" width="52" height="25" rx="5"/><rect x="279" y="40" width="52" height="25" rx="5"/><rect x="43" y="78" width="44" height="24" rx="4"/><rect x="143" y="78" width="44" height="24" rx="4"/><rect x="233" y="78" width="44" height="24" rx="4"/><rect x="333" y="78" width="44" height="24" rx="4"/></g><g fill="#16264a" font-size="11" text-anchor="middle"><text x="210" y="22">10</text><text x="115" y="57">3</text><text x="305" y="57">7</text><text x="65" y="94">1</text><text x="165" y="94">2</text><text x="255" y="94">3</text><text x="355" y="94">4</text></g>' + end;
  if (key.includes('03-fenwick')) return base +
    '<g fill="#eef2f9" stroke="#16264a"><rect x="18" y="30" width="42" height="24"/><rect x="65" y="30" width="42" height="24"/><rect x="112" y="30" width="42" height="24"/><rect x="159" y="30" width="42" height="24"/><rect x="206" y="30" width="42" height="24"/><rect x="253" y="30" width="42" height="24"/><rect x="300" y="30" width="42" height="24"/><rect x="347" y="30" width="42" height="24"/></g><g fill="#16264a" font-size="11" text-anchor="middle"><text x="39" y="46">1</text><text x="86" y="46">2</text><text x="133" y="46">3</text><text x="180" y="46">4</text><text x="227" y="46">5</text><text x="274" y="46">6</text><text x="321" y="46">7</text><text x="368" y="46">8</text></g><g stroke="#9c6b12" stroke-width="3"><path d="M18 70H60M65 80H107M159 70H201M159 90H248M347 70H389"/></g><text x="210" y="112" text-anchor="middle" fill="#16264a" font-size="10">blocos de tamanho lowbit(i)</text>' + end;
  if (key.includes('02-sparse-table')) return base +
    '<g fill="#eef2f9" stroke="#16264a"><rect x="18" y="18" width="42" height="22"/><rect x="65" y="18" width="42" height="22"/><rect x="112" y="18" width="42" height="22"/><rect x="159" y="18" width="42" height="22"/><rect x="206" y="18" width="42" height="22"/><rect x="253" y="18" width="42" height="22"/><rect x="300" y="18" width="42" height="22"/><rect x="347" y="18" width="42" height="22"/></g><g stroke="#1857b8" stroke-width="4"><path d="M65 58H248"/></g><g stroke="#9c6b12" stroke-width="4"><path d="M65 75H201M159 91H295"/></g><text x="210" y="112" text-anchor="middle" fill="#16264a" font-size="10">blocos pré-computados de 2^k</text>' + end;
  if (key.includes('01-lazy')) return base +
    '<g stroke="#64748b" stroke-width="2"><path d="M210 20L110 64M210 20L310 64"/></g><rect x="170" y="5" width="80" height="28" rx="5" fill="#fbf3d9" stroke="#9c6b12"/><rect x="70" y="54" width="80" height="28" rx="5" fill="#eef2f9" stroke="#16264a"/><rect x="270" y="54" width="80" height="28" rx="5" fill="#eef2f9" stroke="#16264a"/><g fill="#16264a" font-size="11" text-anchor="middle"><text x="210" y="23">tag +5</text><text x="110" y="72">filho L</text><text x="310" y="72">filho R</text></g><g stroke="#9c6b12" stroke-width="2" fill="none"><path d="M175 36L130 51M245 36L290 51"/></g><text x="210" y="108" text-anchor="middle" fill="#16264a" font-size="10">push quando descer</text>' + end;
  if (key.includes('04-segment-tree-persistente')) return base +
    '<g stroke="#64748b" stroke-width="1.5"><path d="M100 20L60 60M100 20L140 60M300 20L260 60M300 20L340 60"/></g><g fill="#eef2f9" stroke="#16264a"><rect x="78" y="8" width="44" height="24" rx="5"/><rect x="38" y="48" width="44" height="24" rx="5"/><rect x="118" y="48" width="44" height="24" rx="5"/><rect x="278" y="8" width="44" height="24" rx="5"/><rect x="238" y="48" width="44" height="24" rx="5"/><rect x="318" y="48" width="44" height="24" rx="5"/></g><g fill="#16264a" font-size="11" text-anchor="middle"><text x="100" y="24">v0</text><text x="60" y="64">A</text><text x="140" y="64">B</text><text x="300" y="24">v1</text><text x="260" y="64">A′</text><text x="340" y="64">B</text></g><path d="M140 75L340 75" stroke="#9c6b12" stroke-dasharray="4 3" stroke-width="2"/><text x="210" y="104" text-anchor="middle" fill="#16264a" font-size="10">compartilha nós não alterados</text>' + end;
  if (key === '14-percurso-em-grafos/01-dfs') return base +
    '<g stroke="#64748b" stroke-width="2"><path d="M210 20L110 55M210 20L310 55M110 55L60 95M110 55L160 95M310 55L260 95M310 55L360 95"/></g><g fill="#eef2f9" stroke="#16264a"><circle cx="210" cy="18" r="14"/><circle cx="110" cy="55" r="14"/><circle cx="310" cy="55" r="14"/><circle cx="60" cy="95" r="14"/><circle cx="160" cy="95" r="14"/><circle cx="260" cy="95" r="14"/><circle cx="360" cy="95" r="14"/></g><g fill="#16264a" font-size="10" text-anchor="middle"><text x="210" y="22">1</text><text x="110" y="59">2</text><text x="310" y="59">3</text><text x="60" y="99">4</text><text x="160" y="99">5</text><text x="260" y="99">6</text><text x="360" y="99">7</text></g>' + end;
  if (key === '14-percurso-em-grafos/02-bfs') return base +
    '<g stroke="#64748b" stroke-width="2"><path d="M210 22L110 62M210 22L310 62M110 62L60 102M110 62L160 102M310 62L260 102M310 62L360 102"/></g><g fill="#fbf3d9" stroke="#9c6b12"><circle cx="210" cy="20" r="15"/></g><g fill="#eef2f9" stroke="#16264a"><circle cx="110" cy="62" r="15"/><circle cx="310" cy="62" r="15"/><circle cx="60" cy="102" r="13"/><circle cx="160" cy="102" r="13"/><circle cx="260" cy="102" r="13"/><circle cx="360" cy="102" r="13"/></g><g fill="#16264a" font-size="10" text-anchor="middle"><text x="210" y="24">0</text><text x="110" y="66">1</text><text x="310" y="66">1</text><text x="60" y="106">2</text><text x="160" y="106">2</text><text x="260" y="106">2</text><text x="360" y="106">2</text></g>' + end;
  if (key === '15-caminhos-minimos/03-dijkstra') return base +
    '<g stroke="#64748b" stroke-width="2"><path d="M65 58L190 25L340 58L190 92L65 58M190 25L190 92"/></g><g fill="#eef2f9" stroke="#16264a"><circle cx="65" cy="58" r="17"/><circle cx="190" cy="25" r="17"/><circle cx="190" cy="92" r="17"/><circle cx="340" cy="58" r="17"/></g><g fill="#16264a" font-size="10" text-anchor="middle"><text x="65" y="62">s</text><text x="190" y="29">a</text><text x="190" y="96">b</text><text x="340" y="62">t</text></g><g fill="#9c6b12" font-size="10"><text x="118" y="32">2</text><text x="118" y="82">5</text><text x="265" y="32">3</text><text x="265" y="82">1</text></g>' + end;
  if (key === '16-arvores-geradoras/01-kruskal') return base +
    '<g stroke-width="3" fill="none"><path d="M70 60L185 24L335 60" stroke="#9c6b12"/><path d="M70 60L185 96" stroke="#9c6b12"/><path d="M185 96L335 60" stroke="#94a3b8" stroke-dasharray="5 4"/></g><g fill="#eef2f9" stroke="#16264a"><circle cx="70" cy="60" r="16"/><circle cx="185" cy="24" r="16"/><circle cx="185" cy="96" r="16"/><circle cx="335" cy="60" r="16"/></g><g fill="#16264a" font-size="11" text-anchor="middle"><text x="70" y="64">A</text><text x="185" y="28">B</text><text x="185" y="100">C</text><text x="335" y="64">D</text></g><g fill="#9c6b12" font-size="10"><text x="120" y="31">1</text><text x="260" y="31">2</text><text x="120" y="86">3</text><text x="270" y="88">4</text></g>' + end;
  if (key === '18-conexidade/03-pontes') return base +
    '<path d="M75 60L165 22L165 98Z" fill="none" stroke="#1857b8" stroke-width="3"/><path d="M165 22L335 60" stroke="#9c6b12" stroke-width="4"/><g fill="#eef2f9" stroke="#16264a"><circle cx="75" cy="60" r="15"/><circle cx="165" cy="22" r="15"/><circle cx="165" cy="98" r="15"/><circle cx="335" cy="60" r="15"/></g><g fill="#16264a" font-size="11" text-anchor="middle"><text x="75" y="64">1</text><text x="165" y="26">2</text><text x="165" y="102">3</text><text x="335" y="64">4</text></g><text x="250" y="43" fill="#9c6b12" font-size="11">ponte</text>' + end;
  if (key === '19-arvores/04-euler-tour-e-subarvores') return base +
    '<g stroke="#64748b" stroke-width="2"><path d="M210 20L110 55M210 20L310 55M110 55L60 95M110 55L160 95"/></g><g fill="#eef2f9" stroke="#16264a"><circle cx="210" cy="20" r="14"/><circle cx="110" cy="55" r="14" fill="#fbf3d9" stroke="#9c6b12"/><circle cx="310" cy="55" r="14"/><circle cx="60" cy="95" r="14"/><circle cx="160" cy="95" r="14"/></g><g fill="#16264a" font-size="10" text-anchor="middle"><text x="210" y="24">1</text><text x="110" y="59">2</text><text x="310" y="59">3</text><text x="60" y="99">4</text><text x="160" y="99">5</text></g><path d="M35 112H185" stroke="#9c6b12" stroke-width="3"/><text x="210" y="114" fill="#9c6b12" font-size="10">subárvore = [tin, tout)</text>' + end;
  if (key === '19-arvores/05-lca') return base +
    '<g stroke="#64748b" stroke-width="2"><path d="M210 18L110 55M210 18L310 55M110 55L60 95M110 55L160 95M310 55L360 95"/></g><g fill="#eef2f9" stroke="#16264a"><circle cx="210" cy="18" r="14"/><circle cx="110" cy="55" r="14" fill="#fbf3d9" stroke="#9c6b12"/><circle cx="310" cy="55" r="14"/><circle cx="60" cy="95" r="14" fill="#eff6f1"/><circle cx="160" cy="95" r="14"/><circle cx="360" cy="95" r="14" fill="#eff6f1"/></g><g fill="#16264a" font-size="10" text-anchor="middle"><text x="210" y="22">1</text><text x="110" y="59">2</text><text x="310" y="59">3</text><text x="60" y="99">4</text><text x="160" y="99">5</text><text x="360" y="99">6</text></g><text x="210" y="114" fill="#9c6b12" font-size="10">LCA(4,6) = 1</text>' + end;
  if (key === '11-dp-classica/03-mochila') return base +
    '<g fill="#eef2f9" stroke="#16264a"><rect x="30" y="25" width="100" height="34" rx="4"/><rect x="290" y="25" width="100" height="34" rx="4"/><rect x="30" y="75" width="100" height="34" rx="4"/></g><g fill="#16264a" font-size="11" text-anchor="middle"><text x="80" y="46">dp[i−1][w]</text><text x="340" y="46">dp[i][w]</text><text x="80" y="96">dp[i−1][w−p]+v</text></g><g stroke="#1857b8" stroke-width="2.5" fill="none"><path d="M130 42H285l-6 -5m6 5l-6 5"/></g><g stroke="#9c6b12" stroke-width="2.5" fill="none"><path d="M130 92L210 92L285 58"/></g>' + end;
  if (key === '11-dp-classica/02-lis') return base +
    '<g fill="#eef2f9" stroke="#16264a"><rect x="38" y="35" width="58" height="30" rx="4"/><rect x="130" y="35" width="58" height="30" rx="4"/><rect x="222" y="35" width="58" height="30" rx="4"/><rect x="314" y="35" width="58" height="30" rx="4"/></g><g fill="#16264a" font-size="12" text-anchor="middle"><text x="67" y="54">1</text><text x="159" y="54">2</text><text x="251" y="54">4</text><text x="343" y="54">7</text></g><g stroke="#9c6b12" stroke-width="2.5" fill="none"><path d="M96 50H126l-5 -4m5 4l-5 4M188 50H218l-5 -4m5 4l-5 4M280 50H310l-5 -4m5 4l-5 4"/></g><text x="210" y="94" fill="#16264a" font-size="11" text-anchor="middle">tails[k] = menor final para tamanho k+1</text>' + end;
  if (key === '13-fundamentos-de-grafos/01-listas-de-adjacencia') return base +
    '<g stroke="#1857b8" stroke-width="2" fill="none"><path d="M60 58L180 25M60 58L180 91M180 25L320 58"/></g><g fill="#eef2f9" stroke="#16264a"><rect x="28" y="43" width="64" height="30" rx="5"/><rect x="148" y="10" width="64" height="30" rx="5"/><rect x="148" y="76" width="64" height="30" rx="5"/><rect x="288" y="43" width="64" height="30" rx="5"/></g><g fill="#16264a" font-size="11" text-anchor="middle"><text x="60" y="62">1</text><text x="180" y="29">2</text><text x="180" y="95">3</text><text x="320" y="62">4</text></g><text x="385" y="25" text-anchor="end" fill="#9c6b12" font-size="10">g[1]={2,3}</text>' + end;
  if (key === '12-dp-avancada/03-dp-em-arvores') return base +
    '<g stroke="#64748b" stroke-width="2"><path d="M210 20L90 70M210 20L210 70M210 20L330 70"/></g><g fill="#fbf3d9" stroke="#9c6b12"><rect x="170" y="5" width="80" height="28" rx="5"/></g><g fill="#eef2f9" stroke="#16264a"><rect x="50" y="57" width="80" height="28" rx="5"/><rect x="170" y="57" width="80" height="28" rx="5"/><rect x="290" y="57" width="80" height="28" rx="5"/></g><g fill="#16264a" font-size="11" text-anchor="middle"><text x="210" y="23">dp[v]</text><text x="90" y="75">dp[u₁]</text><text x="210" y="75">dp[u₂]</text><text x="330" y="75">dp[u₃]</text></g><text x="210" y="108" text-anchor="middle" fill="#9c6b12" font-size="10">agregar filhos → pai</text>' + end;
  return '';
}

function compactTopicHtml(topic: Topic): string {
  const notes = notesOf(topic);
  const codes = codeOf(topic);
  const diagrams = diagramFor(topic);
  const notesHtml = notes.map((n) =>
    '<div class="note"><b>' + esc(n.title.toUpperCase()) + '</b><span>' +
    n.lines.map((x) => esc(x)).join(' · ') + '</span></div>'
  ).join('');
  const codeHtml = codes.map((c) => '<div class="implementation"><b>IMPLEMENTAÇÃO</b><pre><code>' + esc(c.code) + '</code></pre></div>').join('');
  const firstDiagram = diagrams[0];
  const diagramHtml = firstDiagram ? '<div class="diagram"><span>' + esc(firstDiagram.caption) + '</span>' +
    svgFor(topic.section + '/' + topic.slug) + '</div>' : '';
  return '<article class="entry"><header><h3>' + esc(topic.title) + '</h3><small>' +
    esc(topic.complexity || '—') + '</small></header><p class="summary">' + esc(topic.summary) +
    '</p>' + notesHtml + diagramHtml + codeHtml + '</article>';
}

function referenceSheetsHtml(): string {
  return almanacSheets.map((sheet) => {
    const facts = sheet.facts.map((x) => '<li>' + esc(x) + '</li>').join('');
    const formulas = sheet.formula.map((x) => '<li><code>' + esc(x) + '</code></li>').join('');
    const entries = sheet.entries.map((entry) =>
      '<article class="reference-entry"><header><h3>' + esc(entry.title) + '</h3><small>' + esc(entry.complexity) + '</small></header>' +
      '<p class="summary">' + esc(entry.purpose) + '</p><p class="when"><b>QUANDO</b> ' + esc(entry.when) + '</p>' +
      '<ul class="reference-notes">' + entry.notes.map((x) => '<li>' + esc(x) + '</li>').join('') + '</ul>' +
      '<div class="implementation"><b>IMPLEMENTAÇÃO</b><pre><code>' + esc(entry.code) + '</code></pre></div></article>'
    ).join('');
    return '<section class="chapter reference-sheet"><h2>' + esc(sheet.title) + '</h2><p class="summary">' + esc(sheet.subtitle) +
      '</p><div class="reference-facts"><b>LEMBRETES</b><ul>' + facts + '</ul></div><div class="reference-formulas"><b>FÓRMULAS</b><ul>' +
      formulas + '</ul></div><div class="entries">' + entries + '</div></section>';
  }).join('');
}

export function buildAlmanacHtml(sections: Section[], title: string, author: string): string {
  const topics = sections.reduce((n, s) => n + s.topics.length, 0);
  const toc = '<section class="contents"><h2>Índice</h2><ol>' + sections.map((s) => '<li>' + esc(s.title) + '</li>').join('') + almanacSheets.map((s) => '<li>' + esc(s.title) + ' — fichas e variantes</li>').join('') + '</ol></section>';
  const body = sections.map((s) => '<section class="chapter"><h2>' + esc(s.title) + '</h2>' +
    '<div class="entries">' + s.topics.map(compactTopicHtml).join('') + '</div></section>').join('');
  return '<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><title>' + esc(title) +
    '</title><style>@page{size:A4 portrait;margin:10mm 11mm 12mm}*{box-sizing:border-box}body{font:8pt/1.24 Arial,sans-serif;color:#17233b;margin:0}' +
    '.cover{height:274mm;display:flex;flex-direction:column;justify-content:center;padding:15mm;border-left:5px solid #9c6b12;page-break-after:always}.contents{page-break-after:always;columns:2}.contents h2{column-span:all;color:#16264a}.contents li{margin:3px 0;color:#35445e}.cover small{font:8pt monospace;letter-spacing:.15em;color:#9c6b12}.cover h1{font-size:30pt;line-height:1.04;margin:10px 0}.cover p{color:#536078}' +
    '.chapter{page-break-before:always}.chapter h2{font-size:17pt;color:#16264a;border-bottom:1.5px solid #9c6b12;padding-bottom:4px;margin:0 0 8px}.entries{columns:2;column-gap:7mm}' +
    '.entry{break-inside:avoid;border-bottom:1px solid #d7dce6;padding:0 0 6px;margin:0 0 7px}.entry header{display:flex;align-items:baseline;gap:8px}.entry h3{font-size:10pt;margin:0;color:#16264a}.entry header small{font:7pt monospace;color:#9c6b12;white-space:nowrap}.summary{font-size:7.5pt;color:#536078;margin:2px 0 4px}' +
    '.note{display:flex;gap:5px;margin:2px 0;font-size:7pt}.note b{font:6.2pt monospace;color:#9c6b12;min-width:55px}.note span{color:#35445e}.implementation>b{font:6.2pt monospace;letter-spacing:.08em;color:#9c6b12}.diagram{margin:4px 0 5px;border:1px solid #e1e6ef;padding:3px 5px;break-inside:avoid}.diagram span{font:6pt monospace;color:#64748b}.diagram svg{display:block;width:100%;height:54px}.entry pre{white-space:pre-wrap;overflow-wrap:anywhere;background:#f8f9fb;border-left:2px solid #16264a;padding:5px;margin:4px 0;font:6.2pt/1.17 monospace;color:#1b2540;break-inside:avoid}.entry code{font-family:monospace}footer{position:fixed;bottom:-7mm;right:0;font-size:6pt;color:#888}' +
    '@media screen{body{max-width:850px;margin:20px auto;padding:20px}.cover{height:650px}.chapter{padding:16px 0}}</style></head><body><header class="cover"><small>MR. C++ · ALMANAQUE DE REFERÊNCIA</small><h1>' +
    esc(title) + '</h1><p>' + esc(author) + ' · ' + sections.length + ' seções · ' + topics + ' tópicos</p><p>Fórmulas, diagramas e implementações essenciais.</p></header>' +
    toc + body + referenceSheetsHtml() + '<footer>Mr. C++ · ' + esc(author) + '</footer><script>window.addEventListener("load",()=>setTimeout(()=>window.print(),350));</script></body></html>';
}

function referenceSheetsLatex(): string {
  return almanacSheets.map((sheet) => {
    const facts = sheet.facts.map((x) => '\\item ' + texText(x)).join('\n');
    const formulas = sheet.formula.map((x) => '\\item \\texttt{' + texText(x) + '}').join('\n');
    const entries = sheet.entries.map((entry) =>
      '\\begin{tcolorbox}[breakable,colback=white,colframe=paleblueborder,boxrule=0.35pt,left=4pt,right=4pt,top=3pt,bottom=3pt,before skip=4pt,after skip=4pt]' +
      '\\noindent\\textbf{\\color{navy}' + texText(entry.title) + '}\\hfill{\\scriptsize\\color{gold}' + texText(entry.complexity) + '}\\\\[-2pt]\n' +
      '{\\footnotesize ' + texText(entry.purpose) + '}\\par{\\scriptsize\\textbf{QUANDO:} ' + texText(entry.when) + '}\\par' +
      entry.notes.map((x) => '{\\scriptsize\\textbullet\\ ' + texText(x) + '}\\par').join('') +
      '\\textbf{IMPLEMENTAÇÃO}\\par\\begin{lstlisting}[basicstyle=\\ttfamily\\tiny]\n' + entry.code + '\n\\end{lstlisting}\\end{tcolorbox}'
    ).join('\n');
    return '\\section{' + texText(sheet.title) + '}\\textit{' + texText(sheet.subtitle) + '}\\par\\smallskip' +
      '\\begin{minipage}[t]{0.49\\linewidth}\\textbf{LEMBRETES}\\begin{itemize}\\scriptsize' + facts + '\\end{itemize}\\end{minipage}' +
      '\\begin{minipage}[t]{0.49\\linewidth}\\textbf{FÓRMULAS}\\begin{itemize}\\scriptsize' + formulas + '\\end{itemize}\\end{minipage}\\par\\medskip' + entries;
  }).join('\\clearpage\n');
}

export function buildAlmanacLatex(sections: Section[], title: string, author: string): string {
  const body = sections.map((s) => {
    const entries = s.topics.map((topic) => {
      const notes = notesOf(topic).map((n) => '\\textbf{' + texText(n.title) + ':} ' +
        n.lines.map(texInline).join(' · ') + '\\par\n').join('');
      const diagrams = diagramFor(topic).map((d) => '\\begin{center}\n' + d.tikz + '\n\\end{center}\n').join('');
      const codes = codeOf(topic).map((c) => { const lang = c.language === 'python' ? '[language=Python]' : c.language === 'text' ? '' : '[language=C++]'; return '\\textbf{IMPLEMENTAÇÃO}\\par\\begin{lstlisting}' + lang + '\n' + c.code + '\n\\end{lstlisting}\n'; }).join('');
      return '\\begin{tcolorbox}[breakable,colback=white,colframe=paleblueborder,boxrule=0.35pt,left=4pt,right=4pt,top=3pt,bottom=3pt,before skip=4pt,after skip=4pt]\n' +
        '\\noindent\\textbf{\\color{navy}' + texText(topic.title) + '}\\hfill{\\scriptsize\\color{gold}' + texText(topic.complexity || '—') + '}\\\\[-2pt]\n' +
        '{\\footnotesize ' + texInline(topic.summary) + '}\\par\n' + notes + diagrams + codes + '\\end{tcolorbox}\n';
    }).join('\n');
    return '\\section{' + texText(s.title) + '}\n' + entries;
  }).join('\n\\medskip\n');
  const preamble = '\\documentclass[9pt,a4paper]{extarticle}\n' +
    '\\usepackage[utf8]{inputenc}\n\\usepackage[T1]{fontenc}\n' +
    '\\usepackage[margin=12mm,top=14mm,bottom=15mm]{geometry}\n' +
    '\\usepackage{amsmath,amssymb,xcolor,tikz}\n' +
    '\\usetikzlibrary{shapes.geometric,arrows.meta,positioning}\n' +
    '\\usepackage[most,breakable,skins,listings]{tcolorbox}\n\\usepackage{listings,multicol,fancyhdr,titlesec}\n' +
    '\\definecolor{navy}{HTML}{16264A}\\definecolor{navylight}{HTML}{2E4C7A}\\definecolor{gold}{HTML}{9C6B12}\\definecolor{paleblue}{HTML}{EEF2F9}\\definecolor{paleblueborder}{HTML}{C7D3E8}\\definecolor{cream}{HTML}{FBF3D9}\\definecolor{optimbg}{HTML}{EFF6F1}\\definecolor{codebg}{HTML}{F8F9FB}\\definecolor{codefg}{HTML}{1B2540}\\definecolor{codekeyword}{HTML}{1857B8}\\definecolor{codestring}{HTML}{8A5A00}\\definecolor{codecomment}{HTML}{6B7280}\n' +
    '\\pagestyle{fancy}\\fancyhf{}\\fancyhead[L]{\\small\\color{navy}Mr. C++ · Almanaque}\\fancyhead[R]{\\small\\color{gold}\\leftmark}\\fancyfoot[R]{\\small Página \\thepage}\\renewcommand{\\headrulewidth}{0.3pt}\n' +
    '\\setlength{\\parindent}{0pt}\\setlength{\\parskip}{2pt}\\setlength{\\columnsep}{7mm}\n' +
    '\\lstset{language=C++,basicstyle=\\ttfamily\\scriptsize\\color{codefg},keywordstyle=\\color{codekeyword}\\bfseries,stringstyle=\\color{codestring},commentstyle=\\color{codecomment}\\itshape,breaklines=true,showstringspaces=false,tabsize=2,columns=fullflexible,keepspaces=true,frame=single,rulecolor=\\color{paleblueborder},backgroundcolor=\\color{codebg},aboveskip=3pt,belowskip=3pt,extendedchars=true,literate={á}{{\\\'a}}1 {ã}{{\\~a}}1 {é}{{\\\'e}}1 {í}{{\\\'i}}1 {ó}{{\\\'o}}1 {õ}{{\\~o}}1 {ú}{{\\\'u}}1 {ç}{{\\c c}}1 {Á}{{\\\'A}}1 {É}{{\\\'E}}1 {Í}{{\\\'I}}1 {Ó}{{\\\'O}}1 {Ú}{{\\\'U}}1 {à}{{\\`a}}1 {â}{{\\^a}}1 {ê}{{\\^e}}1 {ô}{{\\^o}}1 {À}{{\\`A}}1 {Â}{{\\^A}}1 {Ã}{{\\~A}}1 {Ç}{{\\c C}}1 {Ê}{{\\^E}}1 {Ô}{{\\^O}}1 {Õ}{{\\~O}}1 {⁹}{{\\ensuremath{^9}}}1 {–}{{--}}1 {—}{{---}}1 {≈}{{\\ensuremath{\\approx}}}1 {≤}{{\\ensuremath{\\le}}}1 {≥}{{\\ensuremath{\\ge}}}1 {×}{{\\ensuremath{\\times}}}1 {·}{{\\ensuremath{\\cdot}}}1 {→}{{\\ensuremath{\\to}}}1 {∞}{{\\ensuremath{\\infty}}}1 {√}{{\\ensuremath{\\surd}}}1}\n' +
    '\\titleformat{\\section}{\\Large\\bfseries\\color{navy}}{}{0pt}{}\\titlespacing*{\\section}{0pt}{8pt}{5pt}\n' +
    '\\begin{document}\n';
  return preamble + '\\begin{center}{\\Huge\\bfseries\\color{navy}' + texText(title) +
    '}\\\\[3pt]{\\small\\color{gold}' + texText(author) + '}\\\\[5pt]{\\footnotesize ' +
    sections.length + ' seções · ' + sections.reduce((n, s) => n + s.topics.length, 0) +
    ' tópicos · fórmulas · diagramas vetoriais · códigos essenciais}\\end{center}\\hrule\\vspace{6pt}\n' +
    '\\tableofcontents\\clearpage\n\\begin{multicols}{2}\\raggedcolumns\n' + body + '\n\\end{multicols}\n\\clearpage\n' + referenceSheetsLatex() + '\n\\end{document}\n';
}
