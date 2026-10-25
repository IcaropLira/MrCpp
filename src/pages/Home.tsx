import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import Reveal from '../components/Reveal';
import TopicRow from '../components/TopicRow';
import { allTopics, sections } from '../lib/content';

const norm = (s: string) => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

export default function Home() {
  const [q, setQ] = useState('');
  const done = allTopics.filter((t) => t.status === 'done').length;
  const results = useMemo(() => {
    const n = norm(q.trim());
    if (!n) return [];
    return allTopics.filter((t) => norm(`${t.title} ${t.summary} ${t.tags.join(' ')}`).includes(n)).slice(0, 12);
  }, [q]);
  const parts = [...new Set(sections.map((s) => s.part))];

  return (
    <>
      <section className="hero">
        <div className="glow" />
        <div className="w hero-in">
          <img className="logo up" src="/assets/mrcpp-logo.svg" alt="Logo do Mr. C++" width={240} height={200} />
          <div className="tag up" style={{ '--d': 1 } as React.CSSProperties}>~/lib $ ls algoritmos/</div>
          <h1 className="up" style={{ '--d': 2 } as React.CSSProperties}>Mr. <em>C++</em></h1>
          <p className="sub up" style={{ '--d': 3 } as React.CSSProperties}>Biblioteca de algoritmos para programação competitiva</p>
          <p className="lead up" style={{ '--d': 4 } as React.CSSProperties}>Minha Lib visualmente estruturada. {done} de {allTopics.length} tópicos já têm código.</p>
          <div className="search up" style={{ '--d': 5 } as React.CSSProperties}>
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar: dijkstra, segment tree, kmp…" aria-label="Buscar algoritmo" />
            {results.length > 0 && <div className="results">{results.map((t) => <TopicRow key={`${t.section}/${t.slug}`} topic={t} />)}</div>}
          </div>
        </div>
      </section>

      {parts.map((part) => (
        <section key={part}><div className="w"><Reveal>
          <div className="k">{part}</div>
          <div className="cards">
            {sections.filter((s) => s.part === part).map((s, i) => {
              const d = s.topics.filter((t) => t.status === 'done').length;
              return (
                <div key={s.slug} className="st" style={{ '--i': i } as React.CSSProperties}>
                  <Link className="card" to={`/${s.slug}`}>
                    <span className="num">{String(s.order).padStart(2, '0')}</span>
                    <h3>{s.title}</h3>
                    <p>{s.summary}</p>
                    <div className="bar2"><span style={{ width: `${(d / Math.max(s.topics.length, 1)) * 100}%` }} /></div>
                    <small>{d}/{s.topics.length} com código</small>
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
