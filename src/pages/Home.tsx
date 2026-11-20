import { useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import Reveal from '../components/Reveal';
import TopicRow from '../components/TopicRow';
import { allTopics, kindOf, sections } from '../lib/content';
import type { Kind } from '../types';

const norm = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

const KINDS: { kind: Kind; label: string; hint: string }[] = [
  { kind: 'codigo', label: 'Material de código', hint: 'Implementações prontas para colar, com os problemas das aulas resolvidos e testados.' },
  { kind: 'teoria', label: 'Material teórico', hint: 'Fórmulas, conceitos, macetes, paradigmas, pegadinhas e checklists de prova.' },
];

export default function Home() {
  const [q, setQ] = useState('');
  const [params, setParams] = useSearchParams();
  const kind: Kind = params.get('material') === 'teoria' ? 'teoria' : 'codigo';
  const setKind = (k: Kind) => setParams(k === 'teoria' ? { material: 'teoria' } : {}, { replace: true });

  const codeTopics = allTopics.filter((t) => kindOf(t) === 'codigo');
  const done = codeTopics.filter((t) => t.status === 'done').length;
  const theory = allTopics.length - codeTopics.length;
  const results = useMemo(() => {
    const n = norm(q.trim());
    if (!n) return [];
    return allTopics.filter((t) => norm(`${t.title} ${t.summary} ${t.tags.join(' ')}`).includes(n)).slice(0, 12);
  }, [q]);
  const visible = sections.filter((s) => s.kind === kind);
  const parts = [...new Set(visible.map((s) => s.part))];
  const current = KINDS.find((k) => k.kind === kind)!;

  return (
    <>
      <section className="hero">
        <div className="glow" />
        <div className="w hero-in">
          <img className="logo up" src="/assets/mrcpp-logo.svg" alt="Logo do Mr. C++" width={240} height={200} />
          <div className="tag up" style={{ '--d': 1 } as React.CSSProperties}>~/lib $ ls algoritmos/</div>
          <h1 className="up" style={{ '--d': 2 } as React.CSSProperties}>Mr. <em>C++</em></h1>
          <p className="sub up" style={{ '--d': 3 } as React.CSSProperties}>Biblioteca de algoritmos para programação competitiva</p>
          <p className="lead up" style={{ '--d': 4 } as React.CSSProperties}>Minha Lib visualmente estruturada. {done} de {codeTopics.length} tópicos com código · {theory} fichas teóricas.</p>
          <div className="search up" style={{ '--d': 5 } as React.CSSProperties}>
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar: dijkstra, segment tree, kmp, fórmulas…" aria-label="Buscar algoritmo" />
            {results.length > 0 && <div className="results">{results.map((t) => <TopicRow key={`${t.section}/${t.slug}`} topic={t} />)}</div>}
          </div>
          <div className="kind-tabs up" role="tablist" aria-label="Tipo de material" style={{ '--d': 6 } as React.CSSProperties}>
            {KINDS.map((k) => (
              <button key={k.kind} role="tab" aria-selected={kind === k.kind} className={kind === k.kind ? 'on' : ''} onClick={() => setKind(k.kind)}>
                {k.label}
              </button>
            ))}
          </div>
          <p className="kind-hint">{current.hint}</p>
        </div>
      </section>

      {parts.map((part) => (
        <section key={`${kind}-${part}`}><div className="w"><Reveal>
          <div className="k">{part}</div>
          <div className="cards">
            {visible.filter((s) => s.part === part).map((s, i) => {
              const d = s.topics.filter((t) => t.status === 'done').length;
              return (
                <div key={s.slug} className="st" style={{ '--i': i } as React.CSSProperties}>
                  <Link className="card" to={`/${s.slug}`}>
                    <span className="num">{String(s.order).padStart(2, '0')}</span>
                    <h3>{s.title}</h3>
                    <p>{s.summary}</p>
                    <div className="bar2"><span style={{ width: `${(d / Math.max(s.topics.length, 1)) * 100}%` }} /></div>
                    <small>{d}/{s.topics.length} {kind === 'teoria' ? 'fichas' : 'com código'}</small>
                  </Link>
                </div>
              );
            })}
          </div>
        </Reveal></div></section>
      ))}
    </>
  );
}
