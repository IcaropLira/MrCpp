import { Link } from 'react-router-dom';
import type { Topic } from '../types';

export default function TopicRow({ topic }: { topic: Topic }) {
  return (
    <Link className={`row ${topic.status}`} to={`/${topic.section}/${topic.slug}`}>
      <span className="dot" aria-hidden="true">{topic.status === 'done' ? '✦' : '·'}</span>
      <span className="rt"><b>{topic.title}</b><small>{topic.summary}</small></span>
      {topic.complexity && <code>{topic.complexity}</code>}
      {topic.status === 'todo' && <i className="soon">em breve</i>}
    </Link>
  );
}
