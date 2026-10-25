import { Link, useParams } from 'react-router-dom';
import TopicRow from '../components/TopicRow';
import { getSection } from '../lib/content';
import { usePageTitle } from '../lib/usePageTitle';

export default function SectionPage() {
  const { section: slug = '' } = useParams<{ section: string }>();
  const section = getSection(slug);
  usePageTitle(section?.title ?? 'Seção não encontrada');
  if (!section) return <div className="w page"><h1>Seção não encontrada</h1><Link to="/">Voltar</Link></div>;
  return (
    <div className="w page">
      <Link className="back" to="/">← Todas as seções</Link>
      <div className="k">{section.part}</div>
      <h1>{section.title}</h1>
      <p className="lead">{section.summary}</p>
      <div className="rows">{section.topics.map((t) => <TopicRow key={t.slug} topic={t} />)}</div>
    </div>
  );
}
