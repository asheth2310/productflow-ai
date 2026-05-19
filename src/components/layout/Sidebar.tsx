import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, ListTodo, Lightbulb, FileText,
  FlaskConical, BarChart3, MessageSquare, Settings
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard', section: 'main' },
  { to: '/backlog', icon: ListTodo, label: 'Backlog', section: 'main' },
  { to: '/hypotheses', icon: Lightbulb, label: 'Hypotheses', section: 'main' },
  { to: '/prd', icon: FileText, label: 'PRD Generator', section: 'main' },
  { to: '/experiments', icon: FlaskConical, label: 'Experiments', section: 'analytics' },
  { to: '/kpis', icon: BarChart3, label: 'KPI Dashboard', section: 'analytics' },
  { to: '/collaboration', icon: MessageSquare, label: 'Collaboration', section: 'team' },
];

export default function Sidebar() {
  const location = useLocation();
  const { backlog, hypotheses, collabItems } = useApp();

  const todoBadge = backlog.filter(b => b.status === 'todo').length;
  const activeBadge = hypotheses.filter(h => h.status === 'Active').length;
  const unresolvedBadge = collabItems.filter(c => !c.resolved).length;

  const getBadge = (label: string) => {
    if (label === 'Backlog') return todoBadge;
    if (label === 'Hypotheses') return activeBadge;
    if (label === 'Collaboration') return unresolvedBadge;
    return null;
  };

  const sections: Record<string, string> = {
    main: 'Workspace',
    analytics: 'Analytics',
    team: 'Team',
  };

  const grouped = navItems.reduce<Record<string, typeof navItems>>((acc, item) => {
    if (!acc[item.section]) acc[item.section] = [];
    acc[item.section].push(item);
    return acc;
  }, {});

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="logo-icon">PF</div>
        <div className="logo-text">
          ProductFlow AI
          <span>v2.4.1 · Beta</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        {Object.entries(grouped).map(([section, items]) => (
          <div key={section}>
            <div className="nav-section-label">{sections[section]}</div>
            {items.map(({ to, icon: Icon, label }) => {
              const badge = getBadge(label);
              const isActive = to === '/'
                ? location.pathname === '/'
                : location.pathname.startsWith(to);

              return (
                <NavLink
                  key={to}
                  to={to}
                  className={`nav-item ${isActive ? 'active' : ''}`}
                >
                  <Icon size={16} />
                  {label}
                  {badge !== null && badge > 0 && (
                    <span className="nav-badge">{badge}</span>
                  )}
                </NavLink>
              );
            })}
          </div>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="user-avatar">PF</div>
        <div className="user-info">
          <div className="user-name">Sara Kim</div>
          <div className="user-role">Product Manager</div>
        </div>
        <Settings size={14} style={{ color: 'var(--text-muted)', cursor: 'pointer', marginLeft: 4 }} />
      </div>
    </aside>
  );
}
