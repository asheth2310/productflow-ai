import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { type BacklogItem, type Priority } from '../data/mockData';
import { Plus, GripVertical, Filter, X } from 'lucide-react';

const COLUMNS: { id: BacklogItem['status']; label: string; color: string }[] = [
  { id: 'todo', label: 'To Do', color: 'var(--text-secondary)' },
  { id: 'inprogress', label: 'In Progress', color: 'var(--amber)' },
  { id: 'testing', label: 'Testing', color: 'var(--cyan)' },
  { id: 'done', label: 'Completed', color: 'var(--emerald)' },
];

const AVATARS: Record<string, string> = {
  'SK': '#7c3aed', 'DP': '#06b6d4', 'MC': '#10b981', 'JW': '#f59e0b',
};

function BacklogCard({ item, onMove }: { item: BacklogItem; onMove: (id: string, status: BacklogItem['status']) => void }) {
  return (
    <div className="kanban-card" style={{ position: 'relative' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 6, marginBottom: 6 }}>
        <GripVertical size={14} style={{ color: 'var(--text-muted)', marginTop: 2, flexShrink: 0 }} />
        <div style={{ flex: 1 }}>
          <div className="kanban-card-title">{item.title}</div>
        </div>
        <span className={`badge badge-${item.priority.toLowerCase()}`}>{item.priority}</span>
      </div>
      <div className="kanban-card-desc">{item.description}</div>
      <div className="kanban-card-tags" style={{ marginBottom: 8 }}>
        {item.tags.map(t => <span key={t} className="tag">{t}</span>)}
      </div>
      <div className="kanban-card-meta">
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <div className="avatar" style={{ width: 24, height: 24, fontSize: 9, background: AVATARS[item.avatar] || '#7c3aed' }}>
            {item.avatar}
          </div>
          <span style={{ fontSize: 11, color: 'var(--text-secondary)' }}>{item.assignee}</span>
        </div>
        <span className="points-badge">{item.points} pts</span>
      </div>

      {/* Move buttons */}
      <div style={{ display: 'flex', gap: 4, marginTop: 10, flexWrap: 'wrap' }}>
        {COLUMNS.filter(c => c.id !== item.status).map(c => (
          <button
            key={c.id}
            onClick={() => onMove(item.id, c.id)}
            className="btn btn-secondary btn-sm"
            style={{ fontSize: 10, padding: '3px 8px' }}
          >
            → {c.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function AddItemModal({ onClose, defaultStatus }: { onClose: () => void; defaultStatus: BacklogItem['status'] }) {
  const { addBacklogItem } = useApp();
  const [form, setForm] = useState({
    title: '', description: '', priority: 'Medium' as Priority,
    assignee: 'Sara Kim', tags: '', points: 5, status: defaultStatus,
  });

  const submit = () => {
    if (!form.title.trim()) return;
    addBacklogItem({
      id: `bl-${Date.now()}`,
      title: form.title,
      description: form.description,
      priority: form.priority,
      status: form.status,
      assignee: form.assignee,
      avatar: form.assignee.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase(),
      tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
      points: form.points,
      createdAt: new Date().toISOString().slice(0, 10),
    });
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title">Add Backlog Item</div>
          <button className="icon-btn" onClick={onClose}><X size={16} /></button>
        </div>

        <div className="form-group">
          <label className="form-label">Title *</label>
          <input className="form-input" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="Feature title…" />
        </div>
        <div className="form-group">
          <label className="form-label">Description</label>
          <textarea className="form-textarea" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="What does this feature do?" />
        </div>
        <div className="grid-2">
          <div className="form-group">
            <label className="form-label">Priority</label>
            <select className="form-select" value={form.priority} onChange={e => setForm(f => ({ ...f, priority: e.target.value as Priority }))}>
              <option>High</option><option>Medium</option><option>Low</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Story Points</label>
            <input className="form-input" type="number" value={form.points} onChange={e => setForm(f => ({ ...f, points: +e.target.value }))} />
          </div>
        </div>
        <div className="form-group">
          <label className="form-label">Assignee</label>
          <input className="form-input" value={form.assignee} onChange={e => setForm(f => ({ ...f, assignee: e.target.value }))} placeholder="Full name" />
        </div>
        <div className="form-group">
          <label className="form-label">Tags (comma separated)</label>
          <input className="form-input" value={form.tags} onChange={e => setForm(f => ({ ...f, tags: e.target.value }))} placeholder="UX, AI, Mobile" />
        </div>
        <div className="form-group">
          <label className="form-label">Initial Status</label>
          <select className="form-select" value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value as BacklogItem['status'] }))}>
            {COLUMNS.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
          </select>
        </div>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 8 }}>
          <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={submit}>Add to Backlog</button>
        </div>
      </div>
    </div>
  );
}

export default function Backlog() {
  const { backlog, moveBacklogItem } = useApp();
  const [showModal, setShowModal] = useState(false);
  const [filterPriority, setFilterPriority] = useState<Priority | 'All'>('All');

  const filtered = filterPriority === 'All' ? backlog : backlog.filter(b => b.priority === filterPriority);

  const totalPoints = (status: BacklogItem['status']) =>
    filtered.filter(b => b.status === status).reduce((s, b) => s + b.points, 0);

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Backlog Board</h1>
        <p className="page-desc">Drag and move features across sprint stages</p>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <Filter size={14} style={{ color: 'var(--text-muted)' }} />
          <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Priority:</span>
        </div>
        {(['All', 'High', 'Medium', 'Low'] as const).map(p => (
          <button
            key={p}
            onClick={() => setFilterPriority(p)}
            className={`btn btn-sm ${filterPriority === p ? 'btn-primary' : 'btn-secondary'}`}
            style={{ padding: '5px 12px' }}
          >
            {p}
          </button>
        ))}
        <button className="btn btn-primary btn-sm" onClick={() => setShowModal(true)} style={{ marginLeft: 'auto' }}>
          <Plus size={14} /> Add Item
        </button>
      </div>

      <div className="kanban-board">
        {COLUMNS.map(col => {
          const items = filtered.filter(b => b.status === col.id);
          return (
            <div key={col.id} className="kanban-column">
              <div className="kanban-col-header">
                <div className="kanban-col-title">
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: col.color, display: 'inline-block' }} />
                  {col.label}
                </div>
                <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                  <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{totalPoints(col.id)} pts</span>
                  <span className="kanban-col-count">{items.length}</span>
                </div>
              </div>
              {items.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '24px 0', color: 'var(--text-muted)', fontSize: 13 }}>
                  No items
                </div>
              ) : (
                items.map(item => (
                  <BacklogCard key={item.id} item={item} onMove={moveBacklogItem} />
                ))
              )}
            </div>
          );
        })}
      </div>

      {showModal && <AddItemModal onClose={() => setShowModal(false)} defaultStatus="todo" />}
    </div>
  );
}
