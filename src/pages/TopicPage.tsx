import { Link, useParams } from 'react-router-dom';
import Markdown from '../components/Markdown';
import { getSection, getTopic } from '../lib/content';
import { usePageTitle } from '../lib/usePageTitle';

export default function TopicPage() {
  const { section: sSlug = '', topic: tSlug = '' } = useParams<{ section: string; topic: string }>();
  const section = getSection(sSlug);
  const topic = getTopic(sSlug, tSlug);
  usePageTitle(topic?.title ?? 'Tópico não encontrado');
  if (!section || !topic) return <div className="w page"><h1>Tópico não encontrado</h1><Link to="/">Voltar</Link></div>;
  const i = section.topics.indexOf(topic);
  const prev = section.topics[i - 1];
  const next = section.topics[i + 1];

  return (
    <div className="w topic">
      <aside>
        <Link className="back" to={`/${section.slug}`}>← {section.title}</Link>
        {section.topics.map((t) => (
          <Link key={t.slug} to={`/${section.slug}/${t.slug}`} className={t.slug === topic.slug ? 'cur' : ''}>{t.title}</Link>
        ))}
      </aside>
      <article>
        <div className="k">{section.title}</div>
        <h1>{topic.title}</h1>
        <div className="meta">
          {topic.complexity && <code>{topic.complexity}</code>}
          {topic.tags.map((t) => <span key={t}>{t}</span>)}
        </div>
        {topic.status === 'todo' && <div className="notice">Este tópico ainda não tem código. Edite <code>content/{`${String(section.order).padStart(2, '0')}-${section.slug}`}/</code> para adicioná-lo.</div>}
        <Markdown>{topic.body}</Markdown>
        <nav className="pn">
          {prev ? <Link to={`/${section.slug}/${prev.slug}`}>← {prev.title}</Link> : <span />}
          {next ? <Link to={`/${section.slug}/${next.slug}`}>{next.title} →</Link> : <span />}
        </nav>
      </article>
    </div>
  );
}
