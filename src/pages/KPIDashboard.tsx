import { useState } from 'react';
import { kpiTrendData, featureAdoptionData } from '../data/mockData';
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, AreaChart, Area, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from 'recharts';

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: 8, padding: '10px 14px' }}>
        <p style={{ fontSize: 12, fontWeight: 700, marginBottom: 6 }}>{label}</p>
        {payload.map((p: any) => (
          <p key={p.name} style={{ fontSize: 12, color: p.color || p.fill }}>{p.name}: {p.value}{typeof p.value === 'number' && p.value < 20 ? '%' : p.value > 20 ? '%' : ''}</p>
        ))}
      </div>
    );
  }
  return null;
};

const radarData = [
  { metric: 'Engagement', A: 82 },
  { metric: 'Conversion', A: 74 },
  { metric: 'Adoption', A: 64 },
  { metric: 'Retention', A: 84 },
  { metric: 'Velocity', A: 90 },
  { metric: 'Satisfaction', A: 77 },
];

export default function KPIDashboard() {
  const [period, setPeriod] = useState<'6M' | '3M' | '1M'>('6M');
  const data = period === '6M' ? kpiTrendData : period === '3M' ? kpiTrendData.slice(3) : kpiTrendData.slice(5);

  return (
    <div>
      <div className="page-header">
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <div>
            <h1 className="page-title">KPI Dashboard</h1>
            <p className="page-desc">Product metrics, engagement analytics, and performance insights</p>
          </div>
          <div style={{ display: 'flex', gap: 6 }}>
            {(['1M', '3M', '6M'] as const).map(p => (
              <button key={p} onClick={() => setPeriod(p)} className={`btn btn-sm ${period === p ? 'btn-primary' : 'btn-secondary'}`}>
                {p}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Summary KPIs */}
      <div className="kpi-grid" style={{ marginBottom: 24 }}>
        {[
          { label: 'Engagement Rate', value: '82%', delta: '+4.2%', color: 'var(--violet-light)' },
          { label: 'Conversion Rate', value: '4.5%', delta: '+0.7%', color: 'var(--cyan)' },
          { label: 'Feature Adoption', value: '51%', delta: '+13%', color: 'var(--emerald)' },
          { label: 'User Retention', value: '84%', delta: '+3%', color: 'var(--amber)' },
        ].map(k => (
          <div key={k.label} className="kpi-card" style={{ '--accent-color': k.color } as React.CSSProperties}>
            <div className="kpi-label">{k.label}</div>
            <div className="kpi-value" style={{ color: k.color, fontSize: 30 }}>{k.value}</div>
            <div className="kpi-trend up" style={{ color: 'var(--emerald)' }}>↑ {k.delta} vs last period</div>
          </div>
        ))}
      </div>

      {/* Area Chart - Engagement */}
      <div className="card chart-card" style={{ marginBottom: 20 }}>
        <div className="chart-title">Engagement & Retention Trend</div>
        <div className="chart-subtitle">Monthly active users engagement and Day-30 retention</div>
        <ResponsiveContainer width="100%" height={240}>
          <AreaChart data={data}>
            <defs>
              <linearGradient id="engGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#7c3aed" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="retGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis dataKey="month" tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Area type="monotone" dataKey="engagement" stroke="#7c3aed" fill="url(#engGrad)" strokeWidth={2.5} name="Engagement %" />
            <Area type="monotone" dataKey="retention" stroke="#06b6d4" fill="url(#retGrad)" strokeWidth={2.5} name="Retention %" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="grid-2" style={{ marginBottom: 20 }}>
        {/* Conversion Trend */}
        <div className="card chart-card">
          <div className="chart-title">Conversion Rate</div>
          <div className="chart-subtitle">Trial-to-paid conversion over time</div>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="month" tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Line type="monotone" dataKey="conversion" stroke="#10b981" strokeWidth={2.5} dot={{ fill: '#10b981', r: 4 }} name="Conversion %" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Radar chart */}
        <div className="card chart-card">
          <div className="chart-title">Product Health Radar</div>
          <div className="chart-subtitle">Composite score across 6 key dimensions</div>
          <ResponsiveContainer width="100%" height={200}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="rgba(255,255,255,0.08)" />
              <PolarAngleAxis dataKey="metric" tick={{ fill: 'var(--text-muted)', fontSize: 10 }} />
              <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
              <Radar name="Score" dataKey="A" stroke="#7c3aed" fill="#7c3aed" fillOpacity={0.25} strokeWidth={2} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Feature adoption bar chart */}
      <div className="card chart-card">
        <div className="chart-title">Feature Adoption Breakdown</div>
        <div className="chart-subtitle">% of active users engaging with each feature module</div>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={featureAdoptionData} layout="vertical" barSize={16}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={false} />
            <XAxis type="number" domain={[0, 100]} tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `${v}%`} />
            <YAxis type="category" dataKey="name" tick={{ fill: 'var(--text-secondary)', fontSize: 12 }} axisLine={false} tickLine={false} width={140} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="value" fill="#7c3aed" radius={[0, 4, 4, 0]} name="Adoption %" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
