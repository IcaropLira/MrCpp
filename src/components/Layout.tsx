import { Link, Outlet } from 'react-router-dom';

export default function Layout() {
  return (
    <>
      <header>
        <div className="w bar">
          <Link className="brand" to="/"><img src="/assets/mrcpp-logo.svg" alt="Logo do Mr. C++" />Mr. <em>C++</em></Link>
          <nav><Link to="/">Seções</Link><a href="https://github.com/IcaropLira" target="_blank" rel="noopener noreferrer">GitHub ↗</a></nav>
        </div>
      </header>
      <main><Outlet /></main>
      <footer><div className="w"><span>Criado por <em>Ícaro Pinto Lira</em></span><span>Baseado no Competitive Programmer's Handbook (CC BY-NC-SA 4.0)</span></div></footer>
    </>
  );
}
