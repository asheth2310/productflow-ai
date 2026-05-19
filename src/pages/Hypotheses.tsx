import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { type Hypothesis, type HypothesisStatus } from '../data/mockData';
import { Plus, X, ThumbsUp, Target, Users, ChevronDown, ChevronUp } from 'lucide-react';

function ConfidenceMeter({ value }: { value: number }) {
  const color = value >= 75 ? 'var(--emerald)' : value >= 50 ? 'var(--amber)' : 'var(--red)';
  return (
    <div className="confidence-bar" style={{ gap: 8, alignItems: 'center', display: 'flex' }}>
      <span className="confidence-label">Confidence</span>
      <div className="confidence-track">
        <div className="confidence-fill" style={{ width: `${value}%`, background: color }} />
      </div>
      <span style={{ fontSize: 12, fontWeight: 700, color, minWidth: 32 }}>{value}%</span>
    </div>
  );
}

function HypothesisCard({ hyp }: { hyp: Hypothesis }) {
  const [expanded, setExpanded] = useState(false);
  const { updateHypothesis } = useApp();

  const cycleStatus = () => {
    const cycle: HypothesisStatus[] = ['Draft', 'Active', 'Validated', 'Rejected'];
    const next = cycle[(cycle.indexOf(hyp.status) + 1) % cycle.length];
    updateHypothesis(hyp.id, { status: next });
  };

  return (
    <div className="hyp-card">
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, marginBottom: 8 }}>
        <div style={{ flex: 1 }}>
          <div className="hyp-title">{hyp.title}</div>
          <div className="hyp-statement">"{hyp.statement}"</div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, alignItems: 'flex-end', flexShrink: 0 }}>
          <span
            className={`badge badge-${hyp.status.toLowerCase()}`}
            style={{ cursor: 'pointer' }}
            onClick={cycleStatus}
            title="Click to cycle status"
          >
            {hyp.status}
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <ThumbsUp size={12} style={{ color: 'var(--text-muted)' }} />
            <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{hyp.votes}</span>
          </div>
        </div>
      </div>

      <ConfidenceMeter value={hyp.confidence} />

      <div className="hyp-meta" style={{ marginTop: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <Target size={12} style={{ color: 'var(--violet-light)' }} />
          <span style={{ fontSize: 12, color: 'var(--violet-light)', fontWeight: 600 }}>{hyp.expectedImpact}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <Users size={12} style={{ color: 'var(--text-muted)' }} />
          <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{hyp.createdBy}</span>
        </div>
        <span style={{ fontSize: 11, color: 'var(--text-muted)', marginLeft: 'auto' }}>{hyp.createdAt}</span>
        <button className="btn btn-ghost btn-sm" onClick={() => setExpanded(e => !e)} style={{ padding: '4px 8px' }}>
          {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>
      </div>

      {expanded && (
        <div style={{ marginTop: 16, padding: '14px', background: 'var(--bg-elevated)', borderRadius: 10, border: '1px solid var(--border-subtle)' }}>
          <div style={{ marginBottom: 10 }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>KPIs Being Tracked</div>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {hyp.kpis.map(k => <span key={k} className="tag">{k}</span>)}
            </div>
          </div>
          <div>
            <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>Experiment Goal</div>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>{hyp.experimentGoal}</p>
          </div>
        </div>
      )}
    </div>
  );
}

function AddHypothesisModal({ onClose }: { onClose: () => void }) {
  const { addHypothesis } = useApp();
  const [form, setForm] = useState({
    title: '', statement: '', expectedImpact: '',
    kpis: '', experimentGoal: '',
  });

  const submit = () => {
    if (!form.title || !form.statement) return;
    addHypothesis({
      id: `hyp-${Date.now()}`,
      title: form.title,
      statement: form.statement,
      expectedImpact: form.expectedImpact,
      kpis: form.kpis.split(',').map(k => k.trim()).filter(Boolean),
      experimentGoal: form.experimentGoal,
      status: 'Draft',
      confidence: 50,
      createdBy: 'Sara Kim',
      createdAt: new Date().toISOString().slice(0, 10),
      votes: 0,
    });
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title">New Hypothesis</div>
          <button className="icon-btn" onClick={onClose}><X size={16} /></button>
        </div>

        <div className="form-group">
          <label className="form-label">Hypothesis Title *</label>
          <input className="form-input" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="e.g. Simplified Onboarding → Retention" />
        </div>
        <div className="form-group">
          <label className="form-label">Hypothesis Statement *</label>
          <textarea className="form-textarea" style={{ minHeight: 100 }} value={form.statement} onChange={e => setForm(f => ({ ...f, statement: e.target.value }))} placeholder='e.g. "If we simplify onboarding, then user retention at Day 7 will increase by 20%."' />
        </div>
        <div className="form-group">
          <label className="form-label">Expected Impact</label>
          <input className="form-input" value={form.expectedImpact} onChange={e => setForm(f => ({ ...f, expectedImpact: e.target.value }))} placeholder="e.g. +20% Day-7 Retention" />
        </div>
        <div className="form-group">
          <label className="form-label">KPIs to Track (comma separated)</label>
          <input className="form-input" value={form.kpis} onChange={e => setForm(f => ({ ...f, kpis: e.target.value }))} placeholder="Day-7 Retention, Drop-off Rate" />
        </div>
        <div className="form-group">
          <label className="form-label">Experiment Goal</label>
          <textarea className="form-textarea" value={form.experimentGoal} onChange={e => setForm(f => ({ ...f, experimentGoal: e.target.value }))} placeholder="Describe the experiment approach and timeline…" />
        </div>

        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 8 }}>
          <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={submit}>Create Hypothesis</button>
        </div>
      </div>
    </div>
  );
}

export default function Hypotheses() {
  const { hypotheses } = useApp();
  const [showModal, setShowModal] = useState(false);
  const [filter, setFilter] = useState<HypothesisStatus | 'All'>('All');

  const filtered = filter === 'All' ? hypotheses : hypotheses.filter(h => h.status === filter);

  const counts = {
    All: hypotheses.length,
    Draft: hypotheses.filter(h => h.status === 'Draft').length,
    Active: hypotheses.filter(h => h.status === 'Active').length,
    Validated: hypotheses.filter(h => h.status === 'Validated').length,
    Rejected: hypotheses.filter(h => h.status === 'Rejected').length,
  };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Hypothesis Builder</h1>
        <p className="page-desc">Create, track, and validate product hypotheses with structured experiments</p>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 24, flexWrap: 'wrap' }}>
        {(['All', 'Draft', 'Active', 'Validated', 'Rejected'] as const).map(s => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`btn btn-sm ${filter === s ? 'btn-primary' : 'btn-secondary'}`}
          >
            {s} <span style={{ opacity: 0.7, marginLeft: 4 }}>({counts[s]})</span>
          </button>
        ))}
        <button className="btn btn-primary btn-sm" onClick={() => setShowModal(true)} style={{ marginLeft: 'auto' }}>
          <Plus size={14} /> New Hypothesis
        </button>
      </div>

      {filtered.length === 0 ? (
        <div className="empty-state">
          <h3>No hypotheses found</h3>
          <p>Create your first hypothesis to get started</p>
        </div>
      ) : (
        filtered.map(h => <HypothesisCard key={h.id} hyp={h} />)
      )}

      {showModal && <AddHypothesisModal onClose={() => setShowModal(false)} />}
    </div>
  );
}
