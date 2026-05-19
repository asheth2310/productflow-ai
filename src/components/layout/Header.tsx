import { useLocation } from 'react-router-dom';
import { Search, Bell, Plus } from 'lucide-react';

const routeTitles: Record<string, { title: string; subtitle: string }> = {
  '/': { title: 'Dashboard', subtitle: 'Sprint 23 · May 2026' },
  '/backlog': { title: 'Backlog Board', subtitle: '10 items across 4 stages' },
  '/hypotheses': { title: 'Hypothesis Builder', subtitle: 'Feature experiment management' },
  '/prd': { title: 'PRD Generator', subtitle: 'AI-assisted requirements documentation' },
  '/experiments': { title: 'Experiment Tracker', subtitle: 'A/B tests & outcome validation' },
  '/kpis': { title: 'KPI Dashboard', subtitle: 'Product metrics & analytics' },
  '/collaboration': { title: 'Collaboration Feed', subtitle: 'Team updates & stakeholder comms' },
};

export default function Header() {
  const location = useLocation();
  const info = routeTitles[location.pathname] ?? { title: 'ProductFlow AI', subtitle: '' };

  return (
    <header className="header">
      <div style={{ flex: 1 }}>
        <span className="header-title">{info.title}</span>
        {info.subtitle && <span className="header-subtitle">— {info.subtitle}</span>}
      </div>

      <div className="search-box">
        <Search size={14} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
        <input placeholder="Search features, PRDs, experiments…" />
      </div>

      <div className="header-actions">
        <button className="icon-btn" title="Notifications" style={{ position: 'relative' }}>
          <Bell size={16} />
          <span style={{
            position: 'absolute', top: 4, right: 4,
            width: 7, height: 7, background: 'var(--red)',
            borderRadius: '50%', border: '1px solid var(--bg-surface)'
          }} />
        </button>

        <button className="btn btn-primary btn-sm" style={{ gap: 6 }}>
          <Plus size={14} />
          New Item
        </button>
      </div>
    </header>
  );
}
