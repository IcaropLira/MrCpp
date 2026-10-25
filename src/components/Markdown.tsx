import { useRef, useState, type ComponentPropsWithoutRef } from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import remarkGfm from 'remark-gfm';

function Pre({ children }: ComponentPropsWithoutRef<'pre'>) {
  const ref = useRef<HTMLPreElement>(null);
  const [copied, setCopied] = useState(false);
  const copy = () => {
    void navigator.clipboard.writeText(ref.current?.innerText ?? '').then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  };
  return (
    <div className="code">
      <button type="button" onClick={copy}>{copied ? 'copiado ✓' : 'copiar'}</button>
      <pre ref={ref}>{children}</pre>
    </div>
  );
}

export default function Markdown({ children }: { children: string }) {
  return (
    <div className="prose">
      <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeHighlight]} components={{ pre: Pre }}>{children}</ReactMarkdown>
    </div>
  );
}
