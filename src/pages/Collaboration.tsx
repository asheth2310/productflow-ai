import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { type CollabItem } from '../data/mockData';
import { MessageSquare, CheckCircle2, AlertTriangle, Bell, ThumbsUp, Check, Plus, X, Filter } from 'lucide-react';

const typeConfig = {
  comment: { icon: MessageSquare, color: 'var(--cyan)', label: 'Comment', badgeClass: 'badge-active' },
  approval: { icon: CheckCircle2, color: 'var(--emerald)', label: 'Approval', badgeClass: 'badge-validated' },
  blocker: { icon: AlertTriangle, color: 'var(--red)', label: 'Blocker', badgeClass: 'badge-rejected' },
  update: { icon: Bell, color: 'var(--amber)', label: 'Update', badgeClass: 'badge-medium' },
};

const AVATAR_COLORS: Record<string, string> = {
  SK: '#7c3aed', DP: '#06b6d4', MC: '#10b981', JW: '#f59e0b', PR: '#f43f5e',
};

function FeedItemRow({ item }: { item: CollabItem }) {
  const { toggleResolveCollab, likeCollabItem } = useApp();
  const cfg = typeConfig[item.type];
  const Icon = cfg.icon;
  const ts = new Date(item.timestamp);
  const timeStr = ts.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) + ' · ' + ts.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

  return (
    <div className={`feed-item type-${item.type}`} style={{ opacity: item.resolved ? 0.6 : 1 }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, paddingTop: 2 }}>
        <div className="avatar" style={{ background: AVATAR_COLORS[item.avatar] || '#7c3aed' }}>
          {item.avatar}
        </div>
        <div className="type-dot" style={{ background: cfg.color }} />
      </div>

      <div className="feed-body">
        <div className="feed-meta">
          <span className="feed-author">{item.author}</span>
          <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>·</span>
          <span className="feed-role">{item.role}</span>
          <span className={`badge ${cfg.badgeClass}`} style={{ fontSize: 10, padding: '1px 8px' }}>
            <Icon size={10} style={{ display: 'inline', marginRight: 3 }} />
            {cfg.label}
          </span>
          {item.resolved && (
            <span className="badge badge-validated" style={{ fontSize: 10, padding: '1px 8px' }}>✓ Resolved</span>
          )}
          <span className="feed-time">{timeStr}</span>
        </div>

        <p className="feed-content">{item.content}</p>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
          <span className="feed-feature">📌 {item.feature}</span>
          <div className="feed-actions">
            <button className="feed-action" onClick={() => likeCollabItem(item.id)}>
              <ThumbsUp size={12} /> {item.likes}
            </button>
            <button
              className="feed-action"
              onClick={() => toggleResolveCollab(item.id)}
              style={{ color: item.resolved ? 'var(--emerald)' : undefined }}
            >
              <Check size={12} />
              {item.resolved ? 'Unresolve' : 'Resolve'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function AddCommentModal({ onClose }: { onClose: () => void }) {
  const { addCollabItem } = useApp();
  const [form, setForm] = useState({
    content: '', feature: '', type: 'comment' as CollabItem['type'],
  });

  const submit = () => {
    if (!form.content.trim()) return;
    addCollabItem({
      id: `c-${Date.now()}`,
      author: 'Sara Kim',
      avatar: 'SK',
      role: 'Product Manager',
      type: form.type,
      content: form.content,
      feature: form.feature || 'General',
      timestamp: new Date().toISOString(),
      likes: 0,
      resolved: false,
    });
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title">New Post</div>
          <button className="icon-btn" onClick={onClose}><X size={16} /></button>
        </div>

        <div className="form-group">
          <label className="form-label">Type</label>
          <div style={{ display: 'flex', gap: 8 }}>
            {(Object.keys(typeConfig) as CollabItem['type'][]).map(t => (
              <button
                key={t}
                onClick={() => setForm(f => ({ ...f, type: t }))}
                className={`btn btn-sm ${form.type === t ? 'btn-primary' : 'btn-secondary'}`}
                style={{ textTransform: 'capitalize' }}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Related Feature</label>
          <input className="form-input" value={form.feature} onChange={e => setForm(f => ({ ...f, feature: e.target.value }))} placeholder="e.g. AI Search, Onboarding Flow" />
        </div>

        <div className="form-group">
          <label className="form-label">Message *</label>
          <textarea className="form-textarea" style={{ minHeight: 120 }} value={form.content} onChange={e => setForm(f => ({ ...f, content: e.target.value }))} placeholder="Share an update, comment, approval, or flag a blocker…" />
        </div>

        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
          <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={submit}>Post</button>
        </div>
      </div>
    </div>
  );
}

export default function Collaboration() {
  const { collabItems } = useApp();
  const [showModal, setShowModal] = useState(false);
  const [filter, setFilter] = useState<'All' | CollabItem['type'] | 'resolved'>('All');
  const [showResolved, setShowResolved] = useState(true);

  const filtered = collabItems.filter(item => {
    if (filter === 'resolved') return item.resolved;
    if (filter !== 'All') return item.type === filter;
    if (!showResolved) return !item.resolved;
    return true;
  });

  const counts = {
    All: collabItems.length,
    comment: collabItems.filter(c => c.type === 'comment').length,
    approval: collabItems.filter(c => c.type === 'approval').length,
    blocker: collabItems.filter(c => c.type === 'blocker').length,
    update: collabItems.filter(c => c.type === 'update').length,
    resolved: collabItems.filter(c => c.resolved).length,
  };

  return (
    <div>
      <div className="page-header">
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <div>
            <h1 className="page-title">Collaboration Feed</h1>
            <p className="page-desc">Stakeholder updates, approvals, blockers, and team comments</p>
          </div>
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>
            <Plus size={14} /> New Post
          </button>
        </div>
      </div>

      {/* Stats row */}
      <div style={{ display: 'flex', gap: 16, marginBottom: 24, flexWrap: 'wrap' }}>
        {[
          { label: 'Total Posts', value: collabItems.length, color: 'var(--violet-light)' },
          { label: 'Blockers', value: counts.blocker, color: 'var(--red)' },
          { label: 'Pending Approvals', value: collabItems.filter(c => c.type === 'approval' && !c.resolved).length, color: 'var(--amber)' },
          { label: 'Resolved', value: counts.resolved, color: 'var(--emerald)' },
        ].map(s => (
          <div key={s.label} style={{ flex: 1, minWidth: 120, background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: 12, padding: '14px 16px', backdropFilter: 'blur(8px)' }}>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>{s.label}</div>
            <div style={{ fontSize: 26, fontWeight: 800, color: s.color }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
        <Filter size={14} style={{ color: 'var(--text-muted)' }} />
        {(['All', 'comment', 'approval', 'blocker', 'update', 'resolved'] as const).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`btn btn-sm ${filter === f ? 'btn-primary' : 'btn-secondary'}`}
            style={{ textTransform: 'capitalize' }}
          >
            {f} {counts[f] !== undefined && <span style={{ opacity: 0.7 }}>({counts[f]})</span>}
          </button>
        ))}
        <button
          className={`btn btn-sm ${!showResolved ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setShowResolved(r => !r)}
          style={{ marginLeft: 'auto' }}
        >
          {showResolved ? 'Hide Resolved' : 'Show Resolved'}
        </button>
      </div>

      {/* Feed */}
      <div className="card" style={{ padding: '4px 20px' }}>
        {filtered.length === 0 ? (
          <div className="empty-state">
            <h3>No posts found</h3>
            <p>Try changing the filter or add a new post</p>
          </div>
        ) : (
          filtered.map(item => <FeedItemRow key={item.id} item={item} />)
        )}
      </div>

      {showModal && <AddCommentModal onClose={() => setShowModal(false)} />}
    </div>
  );
}
