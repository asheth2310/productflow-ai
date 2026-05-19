import { useApp } from '../context/AppContext';
import { kpiTrendData, sprintVelocityData, featureAdoptionData } from '../data/mockData';
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { TrendingUp, TrendingDown, Zap, Target, Layers, FlaskConical, CheckCircle2, Clock } from 'lucide-react';

const COLORS = ['#7c3aed', '#06b6d4', '#10b981', '#f59e0b', '#f43f5e', '#a855f7'];

function KPICard({ label, value, trend, trendVal, icon: Icon, accentColor }: {
  label: string; value: string; trend: 'up' | 'down'; trendVal: string;
  icon: React.ElementType; accentColor: string;
}) {
  return (
    <div className="kpi-card" style={{ '--accent-color': accentColor } as React.CSSProperties}>
      <div className="kpi-label">{label}</div>
      <div className="kpi-value" style={{ color: accentColor }}>{value}</div>
      <div className={`kpi-trend ${trend}`}>
        {trend === 'up' ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
        {trendVal} vs last month
      </div>
      <div className="kpi-icon"><Icon size={40} /></div>
    </div>
  );
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: 8, padding: '10px 14px' }}>
        <p style={{ fontSize: 12, fontWeight: 700, marginBottom: 6 }}>{label}</p>
        {payload.map((p: any) => (
          <p key={p.name} style={{ fontSize: 12, color: p.color }}>{p.name}: {p.value}</p>
        ))}
      </div>
    );
  }
  return null;
};

export default function Dashboard() {
  const { backlog, hypotheses, experiments, collabItems } = useApp();

  const completedItems = backlog.filter(b => b.status === 'done').length;
  const validatedHyps = hypotheses.filter(h => h.status === 'Validated').length;

  const recentActivity = collabItems.slice(0, 4);

  return (
    <div>
      <div className="page-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div>
            <h1 className="page-title">
              Good afternoon, Sara 👋
            </h1>
            <p className="page-desc">Here's your product overview for Sprint 23 · Week 20</p>
          </div>
          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 6 }}>
            <div className="live-dot" />
            <span style={{ fontSize: 12, color: 'var(--emerald)' }}>Live</span>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="kpi-grid">
        <KPICard label="Feature Completion" value={`${completedItems}/${backlog.length}`} trend="up" trendVal="+2 items" icon={CheckCircle2} accentColor="var(--emerald)" />
        <KPICard label="Hypothesis Success" value={`${Math.round(validatedHyps / hypotheses.length * 100)}%`} trend="up" trendVal="+8%" icon={Target} accentColor="var(--violet-light)" />
        <KPICard label="Sprint Velocity" value="48 pts" trend="up" trendVal="+6 pts" icon={Zap} accentColor="var(--cyan)" />
        <KPICard label="Experiments Running" value={`${experiments.filter(e => e.status === 'Running').length}`} trend="up" trendVal="+1 new" icon={FlaskConical} accentColor="var(--amber)" />
        <KPICard label="Feature Adoption" value="63.8%" trend="up" trendVal="+5.2%" icon={Layers} accentColor="var(--rose)" />
        <KPICard label="Backlog Items" value={`${backlog.filter(b => b.status === 'todo').length} pending`} trend="down" trendVal="-3 items" icon={Clock} accentColor="var(--text-secondary)" />
      </div>

      {/* Charts row */}
      <div className="grid-2" style={{ marginBottom: 24 }}>
        {/* KPI Trend */}
        <div className="card chart-card">
          <div className="chart-title">Product KPI Trends</div>
          <div className="chart-subtitle">Engagement & Retention over 6 months</div>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={kpiTrendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="month" tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Line type="monotone" dataKey="engagement" stroke="#7c3aed" strokeWidth={2.5} dot={false} name="Engagement %" />
              <Line type="monotone" dataKey="retention" stroke="#06b6d4" strokeWidth={2.5} dot={false} name="Retention %" />
              <Line type="monotone" dataKey="adoption" stroke="#10b981" strokeWidth={2.5} dot={false} name="Adoption %" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Sprint Velocity */}
        <div className="card chart-card">
          <div className="chart-title">Sprint Velocity</div>
          <div className="chart-subtitle">Planned vs Delivered story points</div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={sprintVelocityData} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="sprint" tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="planned" fill="rgba(124,58,237,0.3)" radius={[4,4,0,0]} name="Planned" />
              <Bar dataKey="delivered" fill="#7c3aed" radius={[4,4,0,0]} name="Delivered" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bottom row */}
      <div className="grid-2">
        {/* Feature Adoption */}
        <div className="card chart-card">
          <div className="chart-title">Feature Adoption Rate</div>
          <div className="chart-subtitle">% of users actively using each feature</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 8 }}>
            {featureAdoptionData.map((feat, i) => (
              <div key={feat.name}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{feat.name}</span>
                  <span style={{ fontSize: 12, fontWeight: 700, color: COLORS[i % COLORS.length] }}>{feat.value}%</span>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${feat.value}%`, background: COLORS[i % COLORS.length] }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="card">
          <div className="section-header" style={{ marginBottom: 16 }}>
            <div className="section-title">Recent Activity</div>
            <span style={{ fontSize: 12, color: 'var(--violet-light)', cursor: 'pointer' }}>View all →</span>
          </div>
          <div>
            {recentActivity.map(item => (
              <div key={item.id} className="feed-item" style={{ display: 'flex', gap: 10, padding: '10px 0', borderBottom: '1px solid var(--border-subtle)' }}>
                <div className="avatar" style={{ background: `hsl(${item.author.charCodeAt(0) * 20},60%,50%)`, fontSize: 11 }}>
                  {item.avatar}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                    <span style={{ fontSize: 13, fontWeight: 600 }}>{item.author}</span>
                    <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>·</span>
                    <span className={`badge badge-${item.type === 'blocker' ? 'rejected' : item.type === 'approval' ? 'validated' : item.type === 'update' ? 'active' : 'draft'}`} style={{ fontSize: 10, padding: '1px 6px' }}>
                      {item.type}
                    </span>
                  </div>
                  <p style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                    {item.content.length > 80 ? item.content.slice(0, 80) + '…' : item.content}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
