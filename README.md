# ProductFlow AI 🚀

**A modern Product Feature Hypothesis & Backlog Management System for high-performance product teams.**

![ProductFlow AI](https://img.shields.io/badge/ProductFlow-AI-7c3aed?style=for-the-badge&logo=react)
![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript)
![Vite](https://img.shields.io/badge/Vite-5-646CFF?style=flat-square&logo=vite)

---

## ✨ Features

### 📊 Executive Dashboard
Real-time KPI cards, sprint velocity charts, hypothesis success rates, and feature adoption tracking — all in a single glance.

### 📋 Backlog Board (Kanban)
4-column kanban board (To Do → In Progress → Testing → Done) with priority filtering, story point tracking, and move-to-column actions.

### 💡 Hypothesis Builder
Create and manage structured product hypotheses with:
- Hypothesis statements ("If we… then…")
- Expected impact metrics
- KPI tracking
- Confidence score meters
- Status lifecycle (Draft → Active → Validated → Rejected)

### 📄 PRD Generator
Template-based Product Requirements Document builder with:
- 2-step guided creation flow
- User stories & acceptance criteria
- Technical notes
- Expandable document viewer
- AI generation coming soon 🤖

### 🧪 Experiment Tracker
Track A/B tests and hypothesis validation with:
- Control vs. Variant comparison charts
- Statistical confidence bars
- Win/Loss/Inconclusive results
- Sample size tracking

### 📈 KPI Dashboard
Rich analytics with:
- Area charts (Engagement & Retention)
- Line chart (Conversion trend)
- Radar chart (Product Health)
- Horizontal bar chart (Feature Adoption)
- 1M/3M/6M time period toggles

### 💬 Collaboration Feed
Team communication hub with:
- Comments, Approvals, Blockers, Updates
- Like and Resolve actions
- Type-based filtering
- Real-time post creation

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 18 + TypeScript |
| Build | Vite 5 |
| Routing | React Router v6 |
| Charts | Recharts |
| Icons | Lucide React |
| State | React Context + LocalStorage |
| Styling | Custom CSS (dark glassmorphism) |

---

## 🚀 Getting Started

```bash
# Clone the repo
git clone https://github.com/YOUR_USERNAME/productflow-ai.git
cd productflow-ai

# Install dependencies
npm install

# Start dev server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 📁 Project Structure

```
src/
├── components/
│   └── layout/         # Sidebar, Header, Layout shell
├── context/
│   └── AppContext.tsx   # Global state + LocalStorage
├── data/
│   └── mockData.ts      # Seed data for all modules
├── pages/
│   ├── Dashboard.tsx
│   ├── Backlog.tsx
│   ├── Hypotheses.tsx
│   ├── PRDGenerator.tsx
│   ├── Experiments.tsx
│   ├── KPIDashboard.tsx
│   └── Collaboration.tsx
└── index.css            # Design system + tokens
```

---

## 🗺 Roadmap

- [ ] AI-generated PRDs via GPT-4
- [ ] Drag & drop Kanban with @dnd-kit
- [ ] Slack / Jira integration
- [ ] Real-time collaboration (WebSockets)
- [ ] Automatic KPI insights
- [ ] AI sprint recommendations
- [ ] PostgreSQL + Node.js backend

---

## 📄 License

MIT © 2026 ProductFlow AI
