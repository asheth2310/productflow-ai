import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { type Experiment } from '../data/mockData';
import { FlaskConical, TrendingUp, TrendingDown, Users, Calendar } from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell
} from 'recharts';

const resultColors = {
  Win: 'var(--emerald)',
  Loss: 'var(--red)',
  Inconclusive: 'var(--amber)',
  Pending: 'var(--text-secondary)',
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: 8, padding: '10px 14px' }}>
        <p style={{ fontSize: 12, fontWeight: 700, marginBottom: 6 }}>{label}</p>
        {payload.map((p: any) => (
          <p key={p.name} style={{ fontSize: 12, color: p.color }}>{p.name}: {p.value}%</p>
        ))}
      </div>
    );
  }
  return null;
};

function ExperimentCard({ exp }: { exp: Experiment }) {
  const lift = exp.variantRate > 0 ? (((exp.variantRate - exp.controlRate) / exp.controlRate) * 100).toFixed(1) : '—';
  const isWin = exp.result === 'Win';
  const isLoss = exp.result === 'Loss';

  const chartData = [
    { name: 'Control', value: exp.controlRate, fill: 'rgba(148,163,184,0.6)' },
    { name: 'Variant', value: exp.variantRate, fill: isWin ? '#10b981' : isLoss ? '#ef4444' : '#7c3aed' },
  ];

  return (
    <div className="exp-card">
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 10 }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <FlaskConical size={16} style={{ color: 'var(--violet-light)' }} />
            <span style={{ fontSize: 15, fontWeight: 700 }}>{exp.name}</span>
          </div>
          <p style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.5 }}>{exp.hypothesis}</p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, alignItems: 'flex-end', marginLeft: 16 }}>
          <span className={`badge badge-${exp.status.toLowerCase()}`}>{exp.status}</span>
          <span style={{
            fontSize: 13, fontWeight: 800,
            color: resultColors[exp.result]
          }}>
            {exp.result === 'Win' ? '🏆 Win' : exp.result === 'Loss' ? '❌ Loss' : exp.result === 'Inconclusive' ? '⚠️ Inconclusive' : '⏳ Pending'}
          </span>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 16, marginBottom: 16, flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          <Users size={12} style={{ color: 'var(--text-muted)' }} />
          <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{exp.sampleSize.toLocaleString()} users</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          <Calendar size={12} style={{ color: 'var(--text-muted)' }} />
          <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{exp.startDate} → {exp.endDate}</span>
        </div>
        {exp.result !== 'Pending' && exp.result !== 'Inconclusive' && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginLeft: 'auto' }}>
            {isWin ? <TrendingUp size={14} style={{ color: 'var(--emerald)' }} /> : <TrendingDown size={14} style={{ color: 'var(--red)' }} />}
            <span style={{ fontSize: 13, fontWeight: 700, color: isWin ? 'var(--emerald)' : 'var(--red)' }}>
              {isWin ? '+' : ''}{lift}% lift
            </span>
          </div>
        )}
      </div>

      {/* Variant comparison chart */}
      {(exp.controlRate > 0 || exp.variantRate > 0) && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 200px', gap: 16, alignItems: 'center' }}>
          <div>
            <div style={{ display: 'flex', gap: 20, marginBottom: 8 }}>
              <div>
                <div style={{ fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 2 }}>Control</div>
                <div style={{ fontSize: 24, fontWeight: 800, color: 'var(--text-secondary)' }}>{exp.controlRate}%</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', color: 'var(--text-muted)', fontSize: 18, fontWeight: 700 }}>vs</div>
              <div>
                <div style={{ fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 2 }}>Variant</div>
                <div style={{ fontSize: 24, fontWeight: 800, color: isWin ? 'var(--emerald)' : isLoss ? 'var(--red)' : 'var(--violet-light)' }}>{exp.variantRate}%</div>
              </div>
            </div>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>
                <span>Statistical Confidence</span>
                <span style={{ fontWeight: 700, color: exp.confidence >= 75 ? 'var(--emerald)' : exp.confidence >= 50 ? 'var(--amber)' : 'var(--red)' }}>
                  {exp.confidence}%
                </span>
              </div>
              <div className="progress-bar">
                <div className="progress-fill" style={{
                  width: `${exp.confidence}%`,
                  background: exp.confidence >= 75 ? 'var(--emerald)' : exp.confidence >= 50 ? 'var(--amber)' : 'var(--red)'
                }} />
              </div>
            </div>
          </div>

          <ResponsiveContainer width="100%" height={80}>
            <BarChart data={chartData} barSize={32}>
              <XAxis dataKey="name" tick={{ fill: 'var(--text-muted)', fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis hide />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="value" radius={[4, 4, 0, 0]} name="Rate">
                {chartData.map((entry, i) => (
                  <Cell key={i} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}

export default function Experiments() {
  const { experiments } = useApp();
  const [filter, setFilter] = useState<'All' | 'Running' | 'Completed' | 'Paused'>('All');

  const filtered = filter === 'All' ? experiments : experiments.filter(e => e.status === filter);

  const wins = experiments.filter(e => e.result === 'Win').length;
  const total = experiments.filter(e => e.result !== 'Pending').length;

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Experiment Tracker</h1>
        <p className="page-desc">Monitor A/B tests, validate hypotheses, and track experiment outcomes</p>
      </div>

      <div className="kpi-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)', marginBottom: 24 }}>
        {[
          { label: 'Total Experiments', value: experiments.length, color: 'var(--violet-light)' },
          { label: 'Running Now', value: experiments.filter(e => e.status === 'Running').length, color: 'var(--cyan)' },
          { label: 'Win Rate', value: `${total > 0 ? Math.round(wins / total * 100) : 0}%`, color: 'var(--emerald)' },
          { label: 'Avg Confidence', value: `${Math.round(experiments.reduce((s, e) => s + e.confidence, 0) / experiments.length)}%`, color: 'var(--amber)' },
        ].map(stat => (
          <div key={stat.label} className="kpi-card" style={{ '--accent-color': stat.color } as React.CSSProperties}>
            <div className="kpi-label">{stat.label}</div>
            <div className="kpi-value" style={{ color: stat.color, fontSize: 28 }}>{stat.value}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
        {(['All', 'Running', 'Completed', 'Paused'] as const).map(s => (
          <button key={s} onClick={() => setFilter(s)} className={`btn btn-sm ${filter === s ? 'btn-primary' : 'btn-secondary'}`}>
            {s}
          </button>
        ))}
      </div>

      {filtered.map(exp => <ExperimentCard key={exp.id} exp={exp} />)}
    </div>
  );
}
