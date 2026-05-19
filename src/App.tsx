import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import Backlog from './pages/Backlog';
import Hypotheses from './pages/Hypotheses';
import PRDGenerator from './pages/PRDGenerator';
import Experiments from './pages/Experiments';
import KPIDashboard from './pages/KPIDashboard';
import Collaboration from './pages/Collaboration';
import './index.css';

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="backlog" element={<Backlog />} />
            <Route path="hypotheses" element={<Hypotheses />} />
            <Route path="prd" element={<PRDGenerator />} />
            <Route path="experiments" element={<Experiments />} />
            <Route path="kpis" element={<KPIDashboard />} />
            <Route path="collaboration" element={<Collaboration />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}
