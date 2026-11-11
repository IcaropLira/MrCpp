import { useMemo, useState } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import ReactMarkdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import remarkGfm from 'remark-gfm';
import type { Section, Topic } from '../types';
import { almanacSheets } from '../lib/almanac';

type Props = { sections: Section[]; onClose: () => void };

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const tex = (s: string) => s.replace(/[\\{}#$%&_~^]/g, (c) => ({ '\\': '\\textbackslash{}', '{': '\\{', '}': '\\}', '#': '\\#', '$': '\\$', '%': '\\%', '&': '\\&', '_': '\\_', '~': '\\textasciitilde{}', '^': '\\textasciicircum{}' }[c] ?? c));

function toLatex(topic: Topic) {
  const chunks = topic.body.split(/```cpp\n([\s\S]*?)```/g);
  return chunks.map((part, i) => i % 2
    ? `\\begin{lstlisting}\n${part.trim()}\n\\end{lstlisting}\n`
    : part.split('\n').map((line) => {
      if (line.startsWith('## ')) return `\\subsection{${tex(line.slice(3))}}\n`;
      if (line.startsWith('### ')) return `\\subsubsection{${tex(line.slice(4))}}\n`;
      if (line.startsWith('- ')) return `\\noindent\\textbullet\\ ${tex(line.slice(2))}\\\\\n`;
      if (/^\d+\. /.test(line)) return `\\noindent ${tex(line)}\\\\\n`;
      if (!line.trim()) return '\n';
      return `${tex(line.replace(/`/g, ''))}\\par\n`;
    }).join('')).join('');
}

function makeLatex(selected: Section[], title: string, author: string, orientation: 'landscape' | 'portrait', columns: string, fontSize: string) {
  const body = selected.map((s) => `\\section{${tex(s.title)}}\n\\textit{${tex(s.summary)}}\\par\\medskip\n${s.topics.map((t) => `\\subsection{${tex(t.title)}}\n\\textit{${tex(t.summary)}}\\par\\smallskip\n${toLatex(t)}`).join('\n')}`).join('\n');
  return `% Mr. C++ — biblioteca personalizada\n% Compile com XeLaTeX ou LuaLaTeX\n\\documentclass[${fontSize}pt,a4paper,${orientation}]{extarticle}\n\\usepackage[margin=12mm,headheight=14pt]{geometry}\n\\usepackage{fontspec}\n\\setmainfont{TeX Gyre Heros}\n\\usepackage{xcolor,multicol,listings,fancyhdr,hyperref}\n\\definecolor{codebg}{HTML}{F2F3F5}\n\\definecolor{codefg}{HTML}{20242B}\n\\lstset{language=C++,basicstyle=\\ttfamily\\footnotesize,backgroundcolor=\\color{codebg},commentstyle=\\color{gray},keywordstyle=\\color{blue!65!black},stringstyle=\\color{red!60!black},breaklines=true,showstringspaces=false,frame=single,rulecolor=\\color{black!12},columns=fullflexible,keepspaces=true,aboveskip=5pt,belowskip=8pt}\n\\pagestyle{fancy}\\fancyhf{}\\lhead{Mr. C++ — ${tex(title)}}\\rhead{\\thepage}\\renewcommand{\\headrulewidth}{0.3pt}\n\\setlength{\\columnsep}{8mm}\\setlength{\\parindent}{0pt}\\setlength{\\parskip}{3pt}\n\\begin{document}\n\\begin{center}{\\LARGE\\bfseries ${tex(title)}}\\\\[3pt]{\\small ${tex(author)} · Biblioteca de programação competitiva}\\end{center}\\vspace{4mm}\n\\begin{multicols}{${columns}}\n${body}\n\\end{multicols}\n\\end{document}\n`;
}

export default function ExportLibraryDialog({ sections, onClose }: Props) {
  const [selected, setSelected] = useState<string[]>(sections.map((s) => s.slug));
  const [orientation, setOrientation] = useState<'landscape' | 'portrait'>('landscape');
  const [columns, setColumns] = useState<'1' | '2' | '3'>('2');
  const [fontSize, setFontSize] = useState('9');
  const [title, setTitle] = useState('Mr. C++ — Minha biblioteca');
  const [author, setAuthor] = useState('Ícaro Pinto Lira');
  const [includeTodo, setIncludeTodo] = useState(true);
  const [format, setFormat] = useState<'library' | 'almanac'>('almanac');
  const chosen = useMemo(() => sections.filter((s) => selected.includes(s.slug)).map((s) => ({ ...s, topics: s.topics.filter((t) => includeTodo || t.status === 'done') })).filter((s) => s.topics.length), [sections, selected, includeTodo]);

  const toggle = (slug: string) => setSelected((old) => old.includes(slug) ? old.filter((x) => x !== slug) : [...old, slug]);
  const almanacHtml = () => {
    const contents = almanacSheets.map((sheet) => {
      const facts = sheet.facts.map((x) => '<li>' + esc(x) + '</li>').join('');
      const formulas = sheet.formula.map((x) => '<li>' + esc(x) + '</li>').join('');
      const entries = sheet.entries.map((entry, i) =>
        '<article class="fiche"><div class="fiche-k">VARIANTE ' + String(i + 1).padStart(2, '0') + '</div>' +
        '<h2>' + esc(entry.title) + '</h2><p class="purpose">' + esc(entry.purpose) + '</p>' +
        '<div class="fiche-grid"><div><b>UTILIDADE</b><p>' + esc(entry.when) + '</p></div>' +
        '<div><b>COMPLEXIDADE</b><p>' + esc(entry.complexity) + '</p></div></div>' +
        '<div class="notes"><b>OBSERVAÇÕES</b><ul>' + entry.notes.map((n) => '<li>' + esc(n) + '</li>').join('') + '</ul></div>' +
        '<h3>IMPLEMENTAÇÃO</h3><p class="implementation-note">Código essencial, compacto e pronto para copiar.</p>' +
        '<pre><code>' + esc(entry.code) + '</code></pre></article>'
      ).join('');
      return '<section class="reference"><h2>' + esc(sheet.title) + ' — Ficha de consulta</h2><p>' + esc(sheet.subtitle) +
        '</p><h3>COMPLEXIDADE E PROPRIEDADES</h3><ul>' + facts + '</ul><h3>FÓRMULAS E IDENTIDADES</h3><ul>' +
        formulas + '</ul><h3>VARIANTES E IMPLEMENTAÇÕES</h3><ul>' +
        sheet.entries.map((e) => '<li>' + esc(e.title) + '</li>').join('') + '</ul></section>' + entries;
    }).join('');
    return '<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><title>' + esc(title) + '</title><style>' +
      '@page{size:A4 portrait;margin:13mm 14mm 15mm}*{box-sizing:border-box}body{font:9pt/1.35 Arial,sans-serif;color:#17233b;margin:0}' +
      '.cover{height:260mm;display:flex;flex-direction:column;justify-content:center;border-left:6px solid #9c6b12;padding:18mm;background:linear-gradient(120deg,#eef2f9,#fff)}' +
      '.eyebrow,.fiche-k{font:8pt monospace;letter-spacing:.15em;color:#9c6b12;font-weight:bold}.cover h1{font-size:38pt;line-height:1.04;margin:12px 0}.cover p{font-size:13pt;color:#536078}' +
      '.reference{page-break-after:always}.reference h2{font-size:22pt;color:#16264a;border-bottom:2px solid #9c6b12;padding-bottom:5px}.reference h3{font-size:11pt;margin:14px 0 5px;color:#16264a}.reference li{margin:4px 0}.reference ul{padding-left:18px}' +
      '.fiche{break-before:page;page-break-before:always}.fiche h2{font-size:24pt;color:#16264a;margin:5px 0 8px;border-bottom:1px solid #c7d3e8;padding-bottom:7px}' +
      '.purpose{font-size:11pt;color:#35445e;margin:8px 0 14px}.fiche-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin:10px 0}.fiche-grid>div,.notes{border:1px solid #c7d3e8;background:#f5f7fb;padding:9px 11px}' +
      '.fiche-grid b,.notes>b{font:7.5pt monospace;letter-spacing:.1em;color:#9c6b12}.fiche-grid p{margin:4px 0 0}.notes ul{margin:5px 0;padding-left:17px}.notes li{margin:3px 0}.fiche h3{font-size:13pt;color:#16264a;margin:15px 0 2px}' +
      '.implementation-note{color:#536078;margin:2px 0 7px}pre{white-space:pre-wrap;overflow-wrap:anywhere;background:#f8f9fb;border:1px solid #d7dce6;border-left:3px solid #16264a;padding:9px;font:7pt/1.28 "DejaVu Sans Mono",monospace;color:#1b2540;break-inside:avoid}code{font-family:monospace}' +
      '@media screen{body{max-width:850px;margin:24px auto;padding:20px}.cover{height:620px}.reference,.fiche{padding:22px 0}}</style></head><body>' +
      '<header class="cover"><div class="eyebrow">MR. C++ · ALMANAQUE DE REFERÊNCIA</div><h1>' + esc(title) + '</h1><p>' +
      almanacSheets.length + ' estruturas · ' + almanacSheets.reduce((n,s) => n+s.entries.length,0) + ' implementações</p>' +
      '<p>Fórmulas, variantes e códigos essenciais para programação competitiva.</p></header>' + contents +
      '<footer>Mr. C++ · ' + esc(author) + '</footer><script>window.addEventListener("load",()=>setTimeout(()=>window.print(),350));</script></body></html>';
  };

  const almanacLatex = () => {
    const texAlmanac = (s: string) => {
      let out = tex(s);
      out = out.replaceAll('≤', '\\ensuremath{\\leq}');
      out = out.replaceAll('∞', '\\ensuremath{\\infty}');
      out = out.replaceAll('−', '\\ensuremath{-}');
      out = out.replaceAll('×', '\\ensuremath{\\times}');
      out = out.replaceAll('⁹', '\\ensuremath{^9}');
      out = out.replaceAll('·', '\\textbullet{}');
      return out;
    };
    const body = almanacSheets.map((sheet) => {
      const entries = sheet.entries.map((e) =>
        '\\clearpage\n\\subsection*{' + texAlmanac(e.title) + '}\n' +
        '\\textbf{Utilidade.} ' + texAlmanac(e.when) + '\\par\n' +
        '\\textbf{Finalidade.} ' + texAlmanac(e.purpose) + '\\par\n' +
        '\\textbf{Complexidade.} ' + texAlmanac(e.complexity) + '\\par\n' +
        '\\textbf{Observações.} ' + e.notes.map(texAlmanac).join(' · ') + '\\par\\medskip\n' +
        '\\textbf{Implementação}\\par\n\\begin{lstlisting}\n' + e.code.trim() + '\n\\end{lstlisting}\n'
      ).join('\n');
      return '\\clearpage\n\\section*{' + texAlmanac(sheet.title) + '}\n' +
        texAlmanac(sheet.subtitle) + '\\par\\medskip\n' +
        '\\textbf{Propriedades}\\begin{itemize}' + sheet.facts.map(x => '\\item ' + texAlmanac(x)).join('') + '\\end{itemize}\n' +
        '\\textbf{Fórmulas e identidades}\\begin{itemize}' + sheet.formula.map(x => '\\item ' + texAlmanac(x)).join('') + '\\end{itemize}\n' +
        entries;
    }).join('\n');
    return '% Mr. C++ — Almanaque de referência\n' +
      '\\documentclass[9pt,a4paper]{article}\n\\usepackage[margin=14mm]{geometry}\n' +
      '\\usepackage[T1]{fontenc}\\usepackage[utf8]{inputenc}\\usepackage{xcolor,amsmath,enumitem,listings,titlesec}\n' +
      '\\definecolor{navy}{HTML}{16264A}\\definecolor{gold}{HTML}{9C6B12}\n' +
      '\\titleformat{\\section}{\\Large\\bfseries\\color{navy}}{}{0pt}{}\n' +
      '\\lstset{language=C++,basicstyle=\\ttfamily\\footnotesize,breaklines=true,columns=fullflexible,keepspaces=true,showstringspaces=false,frame=single}\n' +
      '\\setlength{\\parindent}{0pt}\\setlength{\\parskip}{4pt}\\begin{document}\n' +
      '{\\Huge\\bfseries\\color{navy} ' + texAlmanac(title) + '}\\par' +
      '\\textit{' + texAlmanac(author) + '}\\par\\medskip\n' + body + '\\end{document}\n';
  };

  const html = () => {
    const contents = chosen.map((s) => `<section class="chapter"><h2>${esc(s.title)}</h2><p class="summary">${esc(s.summary)}</p>${s.topics.map((t) => `<article class="topic"><h3>${esc(t.title)}</h3><div class="meta">${esc(t.complexity)} · ${esc(t.tags.join(' / '))}</div><p class="summary">${esc(t.summary)}</p><div class="prose">${renderToStaticMarkup(<ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeHighlight]}>{t.body}</ReactMarkdown>)}</div></article>`).join('')}</section>`).join('');
    return `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><title>${esc(title)}</title><style>
      @page{size:A4 ${orientation};margin:11mm}*{box-sizing:border-box}body{font: ${fontSize}pt/1.38 Arial,sans-serif;color:#20242b;margin:0}.cover{height:175mm;display:flex;flex-direction:column;justify-content:center;page-break-after:always;border-left:5px solid #d41478;padding:18mm}.cover small{letter-spacing:.18em;text-transform:uppercase;color:#a10d5c}.cover h1{font-size:34pt;line-height:1.05;margin:12px 0}.cover p{color:#626975}.contents{page-break-after:always;columns:2}.contents h2{column-span:all}.contents li{margin:3px 0}.chapter{break-before:page}.chapter h2{font-size:21pt;border-bottom:2px solid #d41478;padding-bottom:5px;margin:0 0 5px}.topic{break-inside:avoid-column;margin:0 0 13px}.topic h3{font-size:13pt;margin:10px 0 2px;color:#9e105c}.meta{font:7.5pt monospace;color:#707782;margin-bottom:5px}.summary{color:#555e69;margin:3px 0 7px}.prose h2,.prose h3{font-size:10pt;margin:8px 0 3px}.prose p,.prose li{margin:3px 0}.prose ul,.prose ol{padding-left:17px}.code{margin:5px 0}.code button{display:none}pre{white-space:pre-wrap;overflow-wrap:anywhere;background:#f1f2f4;border:1px solid #d9dce1;border-radius:4px;padding:7px;font:7.1pt/1.3 'DejaVu Sans Mono',monospace;color:#20242b;break-inside:avoid}code{font-family:monospace}a{color:inherit;text-decoration:none}h2,h3{break-after:avoid}.chapter{columns:${columns};column-gap:9mm}.chapter>h2,.chapter>.summary{column-span:all}footer{position:fixed;bottom:-7mm;right:0;font-size:7pt;color:#888}
      @media screen{body{max-width:1100px;margin:24px auto;padding:24px;background:#fff}.cover{height:600px}.chapter{padding:20px 0}}
    </style></head><body><header class="cover"><small>Competitive programming notebook</small><h1>${esc(title)}</h1><p>${esc(author)} · ${chosen.length} seções · ${chosen.reduce((n,s)=>n+s.topics.length,0)} tópicos</p><p>Referência rápida, código e observações para contest.</p></header><section class="contents"><h2>Índice</h2><ol>${chosen.map((s)=>`<li>${esc(s.title)} — ${s.topics.length} tópicos</li>`).join('')}</ol></section>${contents}<footer>Mr. C++ · ${esc(author)}</footer><script>window.addEventListener('load',()=>setTimeout(()=>window.print(),350));</script></body></html>`;
  };

  const downloadTex = () => {
    const source = format === 'almanac' ? almanacLatex() : makeLatex(chosen, title, author, orientation, columns, fontSize);
    const url = URL.createObjectURL(new Blob([source], { type: 'application/x-tex;charset=utf-8' }));
    const a = document.createElement('a'); a.href = url; a.download = 'mr-cpp-biblioteca.tex'; a.click(); URL.revokeObjectURL(url);
  };
  const exportPdf = () => {
    const popup = window.open('', '_blank');
    if (!popup) { alert('Permita pop-ups para gerar o PDF.'); return; }
    popup.document.open(); popup.document.write(format === 'almanac' ? almanacHtml() : html()); popup.document.close();
  };

  return <div className="export-overlay" role="presentation" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
    <section className="export-dialog" role="dialog" aria-modal="true" aria-labelledby="export-title">
      <button className="export-close" onClick={onClose} aria-label="Fechar">×</button>
      <div className="k">~/lib $ make pdf</div><h2 id="export-title">Montar minha biblioteca</h2>
      <p className="export-intro">Escolha entre a biblioteca de tópicos e o novo formato de almanaque, com fichas de consulta e implementações independentes.</p>
      <label className="export-field">Formato de exportação<select value={format} onChange={(e) => setFormat(e.target.value as "library"|"almanac")}><option value="almanac">Almanaque de referência — piloto Segment Tree</option><option value="library">Biblioteca completa — formato anterior</option></select></label>
      <label className="export-field">Nome da biblioteca<input value={title} onChange={(e) => setTitle(e.target.value)} /></label>
      <label className="export-field">Autoria<input value={author} onChange={(e) => setAuthor(e.target.value)} /></label>
      {format === "library" && <div className="export-options">
        <label>Folha<select value={orientation} onChange={(e) => setOrientation(e.target.value as 'landscape'|'portrait')}><option value="landscape">A4 — paisagem</option><option value="portrait">A4 — retrato</option></select></label>
        <label>Colunas<select value={columns} onChange={(e) => setColumns(e.target.value as '1'|'2'|'3')}><option value="1">1 coluna</option><option value="2">2 colunas</option><option value="3">3 colunas</option></select></label>
        <label>Texto<select value={fontSize} onChange={(e) => setFontSize(e.target.value)}><option value="8">Compacto</option><option value="9">Padrão</option><option value="10">Confortável</option></select></label>
      </div>}
      {format === "library" && <label className="export-check"><input type="checkbox" checked={includeTodo} onChange={(e) => setIncludeTodo(e.target.checked)} /> Incluir tópicos em desenvolvimento</label>}
      {format === "library" && <div className="export-select-head"><b>Conteúdo</b><span>{chosen.reduce((n,s)=>n+s.topics.length,0)} tópicos selecionados</span><button onClick={() => setSelected(selected.length === sections.length ? [] : sections.map((s)=>s.slug))}>{selected.length === sections.length ? 'Limpar' : 'Selecionar tudo'}</button></div>}
      {format === "library" && <div className="export-sections">{sections.map((s) => <label key={s.slug}><input type="checkbox" checked={selected.includes(s.slug)} onChange={() => toggle(s.slug)} /><span>{String(s.order).padStart(2,'0')} · {s.title}</span><small>{s.topics.length}</small></label>)}</div>}
      <div className="export-actions"><button className="secondary" onClick={downloadTex} disabled={format === "library" && !chosen.length}>Baixar fonte LaTeX (.tex)</button><button className="primary" onClick={exportPdf} disabled={format === "library" && !chosen.length}>Gerar PDF ↗</button></div>
    </section>
  </div>;
}
