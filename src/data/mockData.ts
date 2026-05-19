// mockData.ts - Comprehensive seed data for ProductFlow AI

export type Priority = 'High' | 'Medium' | 'Low';
export type Status = 'todo' | 'inprogress' | 'testing' | 'done';
export type HypothesisStatus = 'Draft' | 'Active' | 'Validated' | 'Rejected';
export type ExperimentStatus = 'Running' | 'Completed' | 'Paused';

export interface BacklogItem {
  id: string;
  title: string;
  description: string;
  priority: Priority;
  status: Status;
  assignee: string;
  avatar: string;
  tags: string[];
  points: number;
  createdAt: string;
}

export interface Hypothesis {
  id: string;
  title: string;
  statement: string;
  expectedImpact: string;
  kpis: string[];
  experimentGoal: string;
  status: HypothesisStatus;
  confidence: number;
  createdBy: string;
  createdAt: string;
  votes: number;
}

export interface PRDDocument {
  id: string;
  featureName: string;
  goal: string;
  userStories: string[];
  acceptanceCriteria: string[];
  technicalNotes: string;
  owner: string;
  createdAt: string;
}

export interface Experiment {
  id: string;
  name: string;
  hypothesis: string;
  status: ExperimentStatus;
  startDate: string;
  endDate: string;
  controlRate: number;
  variantRate: number;
  sampleSize: number;
  confidence: number;
  result: 'Win' | 'Loss' | 'Inconclusive' | 'Pending';
}

export interface KPIDataPoint {
  month: string;
  engagement: number;
  conversion: number;
  adoption: number;
  retention: number;
}

export interface CollabItem {
  id: string;
  author: string;
  avatar: string;
  role: string;
  type: 'comment' | 'approval' | 'blocker' | 'update';
  content: string;
  feature: string;
  timestamp: string;
  likes: number;
  resolved: boolean;
}

// ── Backlog ─────────────────────────────────────────────────────────────────
export const initialBacklog: BacklogItem[] = [
  {
    id: 'bl-001', title: 'Simplify Onboarding Flow', description: 'Reduce onboarding steps from 7 to 3 with a guided wizard UX.', priority: 'High', status: 'todo',
    assignee: 'Sara Kim', avatar: 'SK', tags: ['UX', 'Retention'], points: 8, createdAt: '2026-05-01',
  },
  {
    id: 'bl-002', title: 'Dark Mode Support', description: 'Implement system-aware dark/light theme toggle across all pages.', priority: 'Medium', status: 'todo',
    assignee: 'Dev Patel', avatar: 'DP', tags: ['UI', 'A11y'], points: 5, createdAt: '2026-05-03',
  },
  {
    id: 'bl-003', title: 'AI-Powered Search', description: 'Integrate semantic search to surface relevant features and PRDs instantly.', priority: 'High', status: 'inprogress',
    assignee: 'Mia Chen', avatar: 'MC', tags: ['AI', 'Search'], points: 13, createdAt: '2026-04-28',
  },
  {
    id: 'bl-004', title: 'Slack Notifications', description: 'Send real-time sprint and hypothesis updates directly to Slack channels.', priority: 'Medium', status: 'inprogress',
    assignee: 'James Wright', avatar: 'JW', tags: ['Integration'], points: 5, createdAt: '2026-05-05',
  },
  {
    id: 'bl-005', title: 'KPI Export to CSV', description: 'Allow PMs to export KPI dashboard data to CSV for stakeholder reporting.', priority: 'Low', status: 'inprogress',
    assignee: 'Sara Kim', avatar: 'SK', tags: ['Analytics'], points: 3, createdAt: '2026-05-06',
  },
  {
    id: 'bl-006', title: 'Mobile Responsive Layout', description: 'Ensure all dashboard views are fully responsive on tablet and mobile.', priority: 'High', status: 'testing',
    assignee: 'Dev Patel', avatar: 'DP', tags: ['UI', 'Mobile'], points: 8, createdAt: '2026-04-20',
  },
  {
    id: 'bl-007', title: 'Feature Flag System', description: 'Build flag management to toggle features per user segment without deployment.', priority: 'High', status: 'testing',
    assignee: 'Mia Chen', avatar: 'MC', tags: ['Engineering'], points: 13, createdAt: '2026-04-18',
  },
  {
    id: 'bl-008', title: 'User Role Management', description: 'Add Admin, PM, and Developer role access control with permission scopes.', priority: 'Medium', status: 'done',
    assignee: 'James Wright', avatar: 'JW', tags: ['Auth', 'Security'], points: 8, createdAt: '2026-04-10',
  },
  {
    id: 'bl-009', title: 'Hypothesis Version History', description: 'Track hypothesis iterations and allow PM to revert to previous versions.', priority: 'Low', status: 'done',
    assignee: 'Sara Kim', avatar: 'SK', tags: ['Core'], points: 5, createdAt: '2026-04-08',
  },
  {
    id: 'bl-010', title: 'Sprint Auto-Planning', description: 'Automatically suggest sprint items based on priority score and velocity.', priority: 'Medium', status: 'todo',
    assignee: 'Mia Chen', avatar: 'MC', tags: ['AI', 'Sprint'], points: 8, createdAt: '2026-05-12',
  },
];

// ── Hypotheses ───────────────────────────────────────────────────────────────
export const initialHypotheses: Hypothesis[] = [
  {
    id: 'hyp-001', title: 'Simplified Onboarding → Retention', statement: 'If we simplify the onboarding flow from 7 steps to 3, then user retention at Day 7 will increase by 20%.', expectedImpact: '+20% Day-7 Retention',
    kpis: ['Day-7 Retention', 'Onboarding Completion Rate', 'Drop-off Rate'], experimentGoal: 'A/B test new 3-step onboarding vs current 7-step for 2 weeks.', status: 'Active', confidence: 78, createdBy: 'Sara Kim', createdAt: '2026-05-01', votes: 14,
  },
  {
    id: 'hyp-002', title: 'AI Search → Feature Discovery', statement: 'If we add semantic search, then feature discovery rate will increase by 35% for power users.', expectedImpact: '+35% Discovery Rate',
    kpis: ['Search Usage Rate', 'Feature Adoption', 'Session Duration'], experimentGoal: 'Enable AI search for 50% of users over 3 weeks.', status: 'Active', confidence: 65, createdBy: 'Mia Chen', createdAt: '2026-04-28', votes: 9,
  },
  {
    id: 'hyp-003', title: 'In-App Notifications → Engagement', statement: 'If we send personalized in-app nudges at optimal times, user engagement will increase by 15%.', expectedImpact: '+15% DAU',
    kpis: ['DAU', 'Notification CTR', 'Session Frequency'], experimentGoal: 'Test personalized vs generic notifications on 30% of users.', status: 'Validated', confidence: 91, createdBy: 'James Wright', createdAt: '2026-04-10', votes: 22,
  },
  {
    id: 'hyp-004', title: 'Pricing Page Redesign → Conversion', statement: 'If we redesign the pricing page with social proof and clearer CTAs, conversion rate will improve by 10%.', expectedImpact: '+10% Conversion',
    kpis: ['Pricing Page CVR', 'Trial Sign-ups', 'Bounce Rate'], experimentGoal: 'Run full-page A/B test for 4 weeks.', status: 'Rejected', confidence: 41, createdBy: 'Dev Patel', createdAt: '2026-03-20', votes: 5,
  },
  {
    id: 'hyp-005', title: 'Collaborative PRD Editing → Alignment', statement: 'If teams co-edit PRDs in real time, requirement revision rate will drop by 30%.', expectedImpact: '-30% Requirement Revisions',
    kpis: ['Revision Rate', 'PRD Sign-off Time', 'Stakeholder Satisfaction'], experimentGoal: 'Pilot real-time editing with 3 teams over 1 sprint.', status: 'Draft', confidence: 55, createdBy: 'Sara Kim', createdAt: '2026-05-14', votes: 3,
  },
];

// ── PRD Documents ─────────────────────────────────────────────────────────────
export const initialPRDs: PRDDocument[] = [
  {
    id: 'prd-001', featureName: 'AI-Powered Search', goal: 'Implement semantic search using embeddings to surface features, PRDs, and experiments by intent rather than keyword.', 
    userStories: ['As a PM, I want to search for any feature by description so I can find related work quickly.', 'As a developer, I want autocomplete suggestions as I type so I save time navigating.', 'As a stakeholder, I want to search experiment outcomes so I can make data-driven decisions.'],
    acceptanceCriteria: ['Search returns results within 200ms', 'Results ranked by relevance score', 'Supports natural language queries', 'Filters by item type (Feature, PRD, Experiment)'],
    technicalNotes: 'Use OpenAI embeddings API with pgvector in PostgreSQL. Debounce input at 300ms.', owner: 'Mia Chen', createdAt: '2026-05-01',
  },
  {
    id: 'prd-002', featureName: 'Sprint Auto-Planning', goal: 'Automatically suggest the optimal set of backlog items for a sprint based on team velocity, priority scores, and dependencies.',
    userStories: ['As a PM, I want the system to recommend sprint items so I spend less time on planning.', 'As a dev lead, I want to override suggestions so I maintain control over capacity.'],
    acceptanceCriteria: ['Suggestions generated in under 5 seconds', 'Respects team velocity from last 3 sprints', 'Allows one-click acceptance or rejection of items', 'Shows reasoning for each suggestion'],
    technicalNotes: 'Scoring algorithm: priority weight (40%) + story points fit (30%) + dependency order (30%).', owner: 'James Wright', createdAt: '2026-05-08',
  },
];

// ── Experiments ───────────────────────────────────────────────────────────────
export const initialExperiments: Experiment[] = [
  { id: 'exp-001', name: 'Onboarding Flow A/B', hypothesis: 'Simplified 3-step onboarding improves Day-7 retention', status: 'Running', startDate: '2026-05-10', endDate: '2026-05-24', controlRate: 42.1, variantRate: 51.8, sampleSize: 4200, confidence: 78, result: 'Pending' },
  { id: 'exp-002', name: 'Pricing Page Redesign', hypothesis: 'Redesigned pricing page increases conversion', status: 'Completed', startDate: '2026-03-20', endDate: '2026-04-17', controlRate: 3.4, variantRate: 3.1, sampleSize: 12500, confidence: 41, result: 'Loss' },
  { id: 'exp-003', name: 'In-App Notifications', hypothesis: 'Personalized notifications increase DAU', status: 'Completed', startDate: '2026-04-01', endDate: '2026-04-22', controlRate: 38.5, variantRate: 45.2, sampleSize: 8900, confidence: 91, result: 'Win' },
  { id: 'exp-004', name: 'AI Search Beta', hypothesis: 'Semantic search improves feature discovery rate', status: 'Running', startDate: '2026-05-12', endDate: '2026-06-02', controlRate: 22.0, variantRate: 29.5, sampleSize: 2100, confidence: 65, result: 'Pending' },
  { id: 'exp-005', name: 'Dark Mode Launch', hypothesis: 'Dark mode reduces eye strain complaints by 25%', status: 'Paused', startDate: '2026-05-01', endDate: '2026-05-31', controlRate: 0, variantRate: 0, sampleSize: 500, confidence: 30, result: 'Inconclusive' },
];

// ── KPI Trend Data ────────────────────────────────────────────────────────────
export const kpiTrendData: KPIDataPoint[] = [
  { month: 'Jan', engagement: 62, conversion: 3.1, adoption: 28, retention: 71 },
  { month: 'Feb', engagement: 65, conversion: 3.4, adoption: 31, retention: 73 },
  { month: 'Mar', engagement: 61, conversion: 3.2, adoption: 33, retention: 70 },
  { month: 'Apr', engagement: 70, conversion: 3.8, adoption: 38, retention: 75 },
  { month: 'May', engagement: 78, conversion: 4.2, adoption: 45, retention: 81 },
  { month: 'Jun', engagement: 82, conversion: 4.5, adoption: 51, retention: 84 },
];

export const sprintVelocityData = [
  { sprint: 'S-18', planned: 38, delivered: 34 },
  { sprint: 'S-19', planned: 42, delivered: 41 },
  { sprint: 'S-20', planned: 40, delivered: 38 },
  { sprint: 'S-21', planned: 45, delivered: 44 },
  { sprint: 'S-22', planned: 48, delivered: 47 },
  { sprint: 'S-23', planned: 50, delivered: 48 },
];

export const featureAdoptionData = [
  { name: 'Hypothesis Builder', value: 68 },
  { name: 'Backlog Board', value: 85 },
  { name: 'PRD Generator', value: 54 },
  { name: 'Experiment Tracker', value: 47 },
  { name: 'KPI Dashboard', value: 73 },
  { name: 'Collaboration Feed', value: 61 },
];

// ── Collaboration Feed ────────────────────────────────────────────────────────
export const initialCollabItems: CollabItem[] = [
  { id: 'c-001', author: 'Sara Kim', avatar: 'SK', role: 'Product Manager', type: 'approval', content: '✅ Onboarding A/B test results look great! Approving move to full rollout.', feature: 'Simplified Onboarding', timestamp: '2026-05-19T13:45:00Z', likes: 8, resolved: false },
  { id: 'c-002', author: 'Dev Patel', avatar: 'DP', role: 'Senior Engineer', type: 'blocker', content: '🚧 Blocker: The semantic search integration is blocked on API key provisioning. Need DevOps to unblock.', feature: 'AI-Powered Search', timestamp: '2026-05-19T11:20:00Z', likes: 2, resolved: false },
  { id: 'c-003', author: 'Mia Chen', avatar: 'MC', role: 'Associate PM', type: 'comment', content: 'The experiment tracking dashboard is looking 🔥. Should we add a confidence interval visualization?', feature: 'Experiment Tracker', timestamp: '2026-05-18T16:30:00Z', likes: 5, resolved: false },
  { id: 'c-004', author: 'James Wright', avatar: 'JW', role: 'Tech Lead', type: 'update', content: '📦 Sprint 23 velocity: 48/50 points delivered. Team capacity next sprint is 52 points.', feature: 'Sprint Planning', timestamp: '2026-05-18T09:00:00Z', likes: 12, resolved: false },
  { id: 'c-005', author: 'Priya Rao', avatar: 'PR', role: 'Stakeholder', type: 'comment', content: 'Can we get a stakeholder demo of the KPI dashboard before the board meeting on June 2?', feature: 'KPI Dashboard', timestamp: '2026-05-17T14:15:00Z', likes: 3, resolved: true },
  { id: 'c-006', author: 'Dev Patel', avatar: 'DP', role: 'Senior Engineer', type: 'approval', content: '✅ Mobile responsive layout passed QA on all 3 target breakpoints. Ready for release.', feature: 'Mobile Layout', timestamp: '2026-05-17T10:45:00Z', likes: 7, resolved: true },
];
