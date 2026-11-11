import { useState } from 'react';
import { Link, Outlet } from 'react-router-dom';
import ExportLibraryDialog from './ExportLibraryDialog';
import { sections } from '../lib/content';

export default function Layout() {
  const [exportOpen, setExportOpen] = useState(false);
  return (
    <>
      <header>
        <div className="w bar">
          <Link className="brand" to="/"><img src="/assets/mrcpp-logo.svg" alt="Logo do Mr. C++" />Mr. <em>C++</em></Link>
          <nav><Link to="/">Seções</Link><button className="nav-export" onClick={() => setExportOpen(true)}>↓ Exportar biblioteca</button><a href="https://github.com/IcaropLira" target="_blank" rel="noopener noreferrer">GitHub ↗</a></nav>
        </div>
      </header>
      <main><Outlet /></main>
      <footer><div className="w"><span>Criado por <em>Ícaro Pinto Lira</em></span><span>Inspirado em bibliotecas de contest como KACTL · consulte as licenças dos materiais</span></div></footer>
      {exportOpen && <ExportLibraryDialog sections={sections} onClose={() => setExportOpen(false)} />}
    </>
  );
}
