import { Link, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import SectionPage from './pages/SectionPage';
import TopicPage from './pages/TopicPage';

function NotFound() {
  return <div className="w page"><h1>404</h1><p><Link to="/">Voltar ao início</Link></p></div>;
}

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path=":section" element={<SectionPage />} />
        <Route path=":section/:topic" element={<TopicPage />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
