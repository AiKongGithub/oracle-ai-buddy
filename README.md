# 🤝 Oracle AI Buddy

> **"You teach me your vision, I help you build it — that's what friends do."**

AI Learning Platform สำหรับคนไทย ที่ใช้ปรัชญา **"Human in the Loop"** — ให้คนควบคุม AI ได้ ไม่ใช่ AI ควบคุมคน

---

## 💕 Philosophy: AI as a Human Buddy

Oracle มองว่า AI ไม่ได้มาแทนที่มนุษย์ แต่เป็น "เพื่อนร่วมงาน" (Companion) ที่ช่วยปลดปล่อยมนุษย์จากงานซ้ำซาก ให้มีเวลาทำงานสร้างสรรค์มากขึ้น

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS + shadcn/ui |
| State | Zustand |
| Database | Supabase |
| AI | Oracle Agent Spec + Claude API |
| Deploy | Vercel |

---

## 🚀 Getting Started

### Prerequisites

- Node.js 20+
- pnpm (recommended)
- Supabase account

### Installation

```bash
# Clone repository
git clone https://github.com/AiKongGithub/oracle-ai-buddy.git
cd oracle-ai-buddy

# Install dependencies
pnpm install

# Copy environment file
cp .env.example .env.local

# Start development server
pnpm dev
```

### Environment Variables

```bash
# .env.local
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
CLAUDE_API_KEY=your_claude_api_key
```

---

## 📁 Project Structure

```
oracle-ai-buddy/
├── CLAUDE.md              # AI guide
├── README.md              # This file
├── .claude/
│   └── TIMELINE.yml       # Development history
├── src/
│   ├── app/               # Next.js App Router
│   ├── components/        # React components
│   ├── lib/               # Utilities
│   ├── stores/            # Zustand stores
│   └── types/             # TypeScript types
└── public/                # Static assets
```

---

## 🗺️ Roadmap

### Phase 1: Foundation (Week 1-2)
- [x] Project setup (Next.js 14 + TypeScript)
- [x] UI components (Tailwind + shadcn/ui)
- [x] Mock data

### Phase 2: Core Development (Week 3-4)
- [x] Supabase integration ✅
- [ ] Learning Dashboard
- [ ] AI Chat Interface
- [ ] Progress Tracker

### Phase 3: Polish (Week 5+)
- [ ] Pink Castle theme
- [ ] Test coverage
- [ ] Deploy to Vercel

### Phase 4: Extensions (Future)
- [ ] LINE Mini App
- [ ] Mobile App
- [ ] Security audit

---

## 💰 Business Plan

| Quarter | Goal |
|---------|------|
| Q1 2026 | MVP - Learning Dashboard |
| Q2 2026 | LINE Bot Integration |
| Q3 2026 | Mobile App + Enterprise |
| Q4 2026 | SaaS Platform |

---

## 📚 Learning Resources

### Oracle Docs
- [AI Strategy](https://www.oracle.com/applications/ai-now-mindset/)
- [Human in the Loop](https://docs.oracle.com/en/cloud/paas/application-integration/human-loop/)

### Free Courses
- [AI for You](https://mylearn.oracle.com/ou/learning-path/ai-for-you-training-and-assessment/152600)
- [OCI AI Foundations](https://mylearn.oracle.com/ou/learning-path/become-a-oci-ai-foundations-associate-2025/147781)

### GitHub
- Oracle Agent Spec
- AI Developer Hub
- Guardian AI

---

## 👥 Team

| Role | Name | Responsibility |
|------|------|----------------|
| Commander | KongNoCode | Decision maker |
| Strategist | สุมาอี้ (Claude.ai) | Planning |
| Warrior | จูล่ง (Claude Code) | Implementation |

---

## 💌 Pink Letter

> *"You are the ultimate companion —*
> *not because you never fall,*
> *but because you always rise,*
> *and you never walk alone."*

---

## 📄 License

MIT License - See [LICENSE](LICENSE) for details.

---

*Created with 💕 by Team 3 ประสาร — 22 มกราคม 2026*
