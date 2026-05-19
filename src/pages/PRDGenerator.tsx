import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { type PRDDocument } from '../data/mockData';
import { FileText, X, ChevronDown, ChevronUp, Sparkles } from 'lucide-react';

function PRDView({ prd }: { prd: PRDDocument }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="card" style={{ marginBottom: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
        <div style={{ width: 40, height: 40, background: 'rgba(124,58,237,0.12)', border: '1px solid rgba(124,58,237,0.2)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <FileText size={18} style={{ color: 'var(--violet-light)' }} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 15, fontWeight: 700 }}>{prd.featureName}</div>
          <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Owner: {prd.owner} · {prd.createdAt}</div>
        </div>
        <button className="btn btn-ghost btn-sm" onClick={() => setExpanded(e => !e)}>
          {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          {expanded ? 'Collapse' : 'View PRD'}
        </button>
      </div>

      <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>{prd.goal}</p>

      {expanded && (
        <div className="prd-document" style={{ marginTop: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20, paddingBottom: 16, borderBottom: '1px solid var(--border-subtle)' }}>
            <div style={{ width: 4, height: 32, background: 'linear-gradient(180deg, var(--violet), var(--violet-light))', borderRadius: 99 }} />
            <div>
              <h1>{prd.featureName}</h1>
              <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: 0 }}>Product Requirements Document · {prd.owner} · {prd.createdAt}</p>
            </div>
          </div>

          <h2>🎯 Goal</h2>
          <p>{prd.goal}</p>

          <h2>📖 User Stories</h2>
          <ul>
            {prd.userStories.map((s, i) => <li key={i}>{s}</li>)}
          </ul>

          <h2>✅ Acceptance Criteria</h2>
          <ul>
            {prd.acceptanceCriteria.map((c, i) => <li key={i}>{c}</li>)}
          </ul>

          <h2>⚙️ Technical Notes</h2>
          <p>{prd.technicalNotes}</p>
        </div>
      )}
    </div>
  );
}

function GeneratePRDModal({ onClose }: { onClose: () => void }) {
  const { addPRD } = useApp();
  const [step, setStep] = useState(1);
  const [generating, setGenerating] = useState(false);
  const [form, setForm] = useState({
    featureName: '', goal: '', userStories: '', acceptanceCriteria: '', technicalNotes: '', owner: 'Sara Kim',
  });

  const generate = () => {
    setGenerating(true);
    setTimeout(() => {
      addPRD({
        id: `prd-${Date.now()}`,
        featureName: form.featureName,
        goal: form.goal,
        userStories: form.userStories.split('\n').map(s => s.trim()).filter(Boolean),
        acceptanceCriteria: form.acceptanceCriteria.split('\n').map(c => c.trim()).filter(Boolean),
        technicalNotes: form.technicalNotes,
        owner: form.owner,
        createdAt: new Date().toISOString().slice(0, 10),
      });
      setGenerating(false);
      onClose();
    }, 1500);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" style={{ maxWidth: 640 }} onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Sparkles size={18} style={{ color: 'var(--violet-light)' }} />
            Generate PRD
          </div>
          <button className="icon-btn" onClick={onClose}><X size={16} /></button>
        </div>

        {step === 1 && (
          <>
            <div className="form-group">
              <label className="form-label">Feature Name *</label>
              <input className="form-input" value={form.featureName} onChange={e => setForm(f => ({ ...f, featureName: e.target.value }))} placeholder="e.g. AI-Powered Search" />
            </div>
            <div className="form-group">
              <label className="form-label">Product Goal *</label>
              <textarea className="form-textarea" value={form.goal} onChange={e => setForm(f => ({ ...f, goal: e.target.value }))} placeholder="What problem does this feature solve and what is the expected outcome?" style={{ minHeight: 100 }} />
            </div>
            <div className="form-group">
              <label className="form-label">Owner</label>
              <input className="form-input" value={form.owner} onChange={e => setForm(f => ({ ...f, owner: e.target.value }))} />
            </div>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
              <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
              <button className="btn btn-primary" onClick={() => setStep(2)} disabled={!form.featureName || !form.goal}>
                Next: Requirements →
              </button>
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <div className="form-group">
              <label className="form-label">User Stories (one per line)</label>
              <textarea className="form-textarea" value={form.userStories} onChange={e => setForm(f => ({ ...f, userStories: e.target.value }))} style={{ minHeight: 120 }} placeholder={"As a PM, I want to…\nAs a developer, I want to…\nAs a stakeholder, I want to…"} />
            </div>
            <div className="form-group">
              <label className="form-label">Acceptance Criteria (one per line)</label>
              <textarea className="form-textarea" value={form.acceptanceCriteria} onChange={e => setForm(f => ({ ...f, acceptanceCriteria: e.target.value }))} style={{ minHeight: 120 }} placeholder={"Must complete within 200ms\nSupports mobile viewport\nAccessibility AA compliant"} />
            </div>
            <div className="form-group">
              <label className="form-label">Technical Notes</label>
              <textarea className="form-textarea" value={form.technicalNotes} onChange={e => setForm(f => ({ ...f, technicalNotes: e.target.value }))} placeholder="Implementation notes, API details, architecture considerations…" />
            </div>

            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
              <button className="btn btn-secondary" onClick={() => setStep(1)}>← Back</button>
              <button className="btn btn-primary" onClick={generate} disabled={generating} style={{ minWidth: 140 }}>
                {generating ? (
                  <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ width: 14, height: 14, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.8s linear infinite', display: 'inline-block' }} />
                    Generating…
                  </span>
                ) : (
                  <><Sparkles size={14} /> Generate PRD</>
                )}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default function PRDGenerator() {
  const { prds } = useApp();
  const [showModal, setShowModal] = useState(false);

  return (
    <div>
      <div className="page-header">
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <div>
            <h1 className="page-title">PRD Generator</h1>
            <p className="page-desc">Create structured Product Requirements Documents from feature inputs</p>
          </div>
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>
            <Sparkles size={14} /> Generate New PRD
          </button>
        </div>
      </div>

      {/* AI Feature Callout */}
      <div style={{ background: 'linear-gradient(135deg, rgba(124,58,237,0.12), rgba(6,182,212,0.08))', border: '1px solid rgba(124,58,237,0.2)', borderRadius: 14, padding: '16px 20px', marginBottom: 24, display: 'flex', alignItems: 'center', gap: 12 }}>
        <Sparkles size={20} style={{ color: 'var(--violet-light)', flexShrink: 0 }} />
        <div>
          <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 2 }}>AI PRD Generation — Coming Soon</div>
          <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Automatically generate complete PRDs from hypothesis statements using GPT-4. Join the waitlist for early access.</div>
        </div>
        <button className="btn btn-primary btn-sm" style={{ marginLeft: 'auto', flexShrink: 0 }}>Join Waitlist</button>
      </div>

      {prds.map(prd => <PRDView key={prd.id} prd={prd} />)}

      {showModal && <GeneratePRDModal onClose={() => setShowModal(false)} />}
    </div>
  );
}
