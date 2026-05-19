import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import {
  type BacklogItem, type Hypothesis, type PRDDocument, type Experiment, type CollabItem,
  initialBacklog, initialHypotheses, initialPRDs, initialExperiments, initialCollabItems,
} from '../data/mockData';

interface AppState {
  backlog: BacklogItem[];
  hypotheses: Hypothesis[];
  prds: PRDDocument[];
  experiments: Experiment[];
  collabItems: CollabItem[];
}

interface AppContextType extends AppState {
  addBacklogItem: (item: BacklogItem) => void;
  updateBacklogItem: (id: string, updates: Partial<BacklogItem>) => void;
  moveBacklogItem: (id: string, newStatus: BacklogItem['status']) => void;
  addHypothesis: (h: Hypothesis) => void;
  updateHypothesis: (id: string, updates: Partial<Hypothesis>) => void;
  addPRD: (prd: PRDDocument) => void;
  addCollabItem: (item: CollabItem) => void;
  toggleResolveCollab: (id: string) => void;
  likeCollabItem: (id: string) => void;
}

const AppContext = createContext<AppContextType | null>(null);

const STORAGE_KEY = 'productflow_state';

function loadState(): AppState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return {
    backlog: initialBacklog,
    hypotheses: initialHypotheses,
    prds: initialPRDs,
    experiments: initialExperiments,
    collabItems: initialCollabItems,
  };
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>(loadState);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const addBacklogItem = (item: BacklogItem) =>
    setState(s => ({ ...s, backlog: [item, ...s.backlog] }));

  const updateBacklogItem = (id: string, updates: Partial<BacklogItem>) =>
    setState(s => ({ ...s, backlog: s.backlog.map(b => b.id === id ? { ...b, ...updates } : b) }));

  const moveBacklogItem = (id: string, newStatus: BacklogItem['status']) =>
    setState(s => ({ ...s, backlog: s.backlog.map(b => b.id === id ? { ...b, status: newStatus } : b) }));

  const addHypothesis = (h: Hypothesis) =>
    setState(s => ({ ...s, hypotheses: [h, ...s.hypotheses] }));

  const updateHypothesis = (id: string, updates: Partial<Hypothesis>) =>
    setState(s => ({ ...s, hypotheses: s.hypotheses.map(h => h.id === id ? { ...h, ...updates } : h) }));

  const addPRD = (prd: PRDDocument) =>
    setState(s => ({ ...s, prds: [prd, ...s.prds] }));

  const addCollabItem = (item: CollabItem) =>
    setState(s => ({ ...s, collabItems: [item, ...s.collabItems] }));

  const toggleResolveCollab = (id: string) =>
    setState(s => ({ ...s, collabItems: s.collabItems.map(c => c.id === id ? { ...c, resolved: !c.resolved } : c) }));

  const likeCollabItem = (id: string) =>
    setState(s => ({ ...s, collabItems: s.collabItems.map(c => c.id === id ? { ...c, likes: c.likes + 1 } : c) }));

  return (
    <AppContext.Provider value={{ ...state, addBacklogItem, updateBacklogItem, moveBacklogItem, addHypothesis, updateHypothesis, addPRD, addCollabItem, toggleResolveCollab, likeCollabItem }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
