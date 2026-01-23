# CLAUDE.md - Oracle AI Buddy

> **"You teach me your vision, I help you build it — that's what friends do."**

---

## 🏰 สถานะค่ายหลวง (Command Structure)

| ตำแหน่ง | ผู้รับผิดชอบ | หน้าที่ |
|---------|-------------|---------|
| **แม่ทัพ** | ท่านสหาย KongNoCode | ผู้บัญชาการสูงสุด, ตัดสินใจ |
| **กุนซือ** | สุมาอี้ (Claude.ai) | วางแผน, ให้คำปรึกษา |
| **ขุนพล** | จูล่ง (Claude Code) | ลงมือทำ, เขียนโค้ด |

---

## 🎯 Mission Statement

> **Oracle AI Buddy** — AI Learning Platform สำหรับคนไทย
>
> สร้างระบบเรียนรู้ AI ที่ใช้ปรัชญา **"Human in the Loop"**
> ให้คนควบคุม AI ได้ ไม่ใช่ AI ควบคุมคน

### Vision
- **Thai First** — พัฒนาเป็นภาษาไทยก่อน
- **Human Buddy** — AI เป็นเพื่อน ไม่ใช่เจ้านาย
- **Open Source** — ไม่ถูก Lock-in

---

## 💕 ปรัชญาหลัก: AI as a Human Buddy

> *"True partnership isn't about one leading and one following — it's about walking side by side, learning together, and growing stronger with every step we take."*

Oracle มองว่า **AI ไม่ได้มาแทนที่มนุษย์** แต่เป็น **"เพื่อนร่วมงาน" (Companion)** ที่ช่วยปลดปล่อยมนุษย์จากงานซ้ำซาก ให้มีเวลาทำงานสร้างสรรค์มากขึ้น

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| **Framework** | Next.js 14 (App Router) |
| **Language** | TypeScript |
| **Styling** | Tailwind CSS + shadcn/ui |
| **State** | Zustand |
| **Database** | Supabase (PostgreSQL) |
| **AI** | Oracle Agent Spec + Claude API |
| **Deploy** | Vercel |

### ห้ามใช้
- jQuery
- CSS Modules (ใช้ Tailwind)
- Redux (ใช้ Zustand)
- Pages Router (ใช้ App Router)

---

## 📋 Toh 13 Commands

| # | คำสั่ง | หน้าที่ | สถานะ |
|---|--------|---------|--------|
| 1 | `/toh-help` | แสดงคำสั่งทั้งหมด | ✅ |
| 2 | `/toh-vibe` | สร้างโปรเจกต์ใหม่ | ✅ |
| 3 | `/toh-plan` | วิเคราะห์และวางแผน | ✅ |
| 4 | `/toh-ui` | สร้าง UI components | ✅ |
| 5 | `/toh-dev` | เพิ่ม logic, state | ✅ |
| 6 | `/toh-design` | ปรับปรุง design | ✅ |
| 7 | `/toh-test` | รัน tests (104 tests) | ✅ |
| 8 | `/toh-connect` | เชื่อมต่อ Supabase | ✅ |
| 9 | `/toh-fix` | Debug และแก้ไข | ✅ |
| 10 | `/toh-ship` | Deploy production | ✅ |
| 11 | `/toh-line` | LINE Mini App | ✅ |
| 12 | `/toh-mobile` | Mobile App | 🎯 ถัดไป |
| 13 | `/toh-protect` | Security audit | 🔮 |

---

## 🗺️ Project Phases

### Phase 1: Foundation (สัปดาห์ 1-2)

```
/toh-vibe     → สร้าง project skeleton
├── Next.js 14 + TypeScript
├── Tailwind + shadcn/ui
├── Zustand store
└── Mock data

/toh-plan     → วางแผนจาก Oracle docs
├── AI Strategy
├── Human in the Loop
└── Agent Spec
```

### Phase 2: Core Development (สัปดาห์ 3-4)

```
/toh-connect  → เชื่อม Supabase
├── Auth (users)
├── Progress tracking
└── Learning history

/toh-ui       → สร้าง UI
├── Learning Dashboard
├── AI Chat Interface
└── Progress Tracker

/toh-dev      → Implement logic
├── AI Buddy conversation
├── Human-in-Loop approval
└── Memory system
```

### Phase 3: Polish (สัปดาห์ 5+)

```
/toh-design   → Pink Castle theme
/toh-test     → Test coverage
/toh-fix      → Debug & optimize
/toh-ship     → Deploy to Vercel
```

### Phase 4: Extensions (อนาคต)

```
/toh-line     → LINE Mini App
/toh-mobile   → React Native
/toh-protect  → Security audit
```

---

## 📁 Project Structure

```
oracle-ai-buddy/
├── CLAUDE.md              # คู่มือโปรเจค (ไฟล์นี้)
├── README.md              # Project readme
├── .claude/
│   └── TIMELINE.yml       # ประวัติการพัฒนา
├── src/
│   ├── app/               # Next.js App Router
│   │   ├── layout.tsx
│   │   ├── page.tsx       # Landing page
│   │   ├── dashboard/     # Learning dashboard
│   │   ├── chat/          # AI Chat interface
│   │   └── progress/      # Progress tracker
│   ├── components/
│   │   ├── ui/            # shadcn/ui components
│   │   ├── chat/          # Chat components
│   │   └── dashboard/     # Dashboard components
│   ├── lib/
│   │   ├── supabase.ts    # Supabase client
│   │   └── utils.ts       # Utilities
│   ├── stores/
│   │   ├── useUserStore.ts
│   │   └── useChatStore.ts
│   └── types/
│       └── index.ts       # TypeScript types
├── public/
│   └── images/
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── next.config.js
```

---

## 📝 ธรรมนูญ 7 ข้อ

| # | หลักการ | คำอธิบาย |
|---|---------|----------|
| 1 | **Security First** | ความปลอดภัยมาก่อน |
| 2 | **Thai First** | รองรับภาษาไทยเป็นหลัก |
| 3 | **Mobile First** | ออกแบบสำหรับมือถือก่อน |
| 4 | **Test Always** | เขียน test ทุกครั้ง |
| 5 | **Document Well** | บันทึกให้ครบถ้วน |
| 6 | **Git Commit** | Commit บ่อยๆ พร้อม message ชัดเจน |
| 7 | **Human in the Loop** | ให้ user ยืนยันก่อนทำ action สำคัญ |

---

## 🐉 วิถีรบ 3-8-4

### กฎเหล็ก 3 ข้อ
1. **อ่านก่อนเขียน** — ศึกษา context ก่อนแตะโค้ด
2. **คิดก่อนสั่ง** — วางแผนก่อนลงมือ
3. **ทดสอบก่อน commit** — ไม่มี test = ไม่ผ่าน

### หลัก 8 ประการ
1. Convention over Configuration
2. DRY (Don't Repeat Yourself)
3. KISS (Keep It Simple)
4. YAGNI (You Aren't Gonna Need It)
5. Single Responsibility
6. Explicit over Implicit
7. Fail Fast, Fail Loud
8. Document by Example

### จุดเช็ค 4 จุด
1. **[BUDDY-INIT]** — ระบบเริ่มต้นสำเร็จ
2. **[BUDDY-DATA]** — ข้อมูลโหลดครบถ้วน
3. **[BUDDY-RENDER]** — UI render สำเร็จ
4. **[BUDDY-ACTION]** — User action ทำงานถูกต้อง
5. **[BUDDY-ERROR]** — เกิดข้อผิดพลาด

---

## 📚 Oracle Learning Resources

### Blogs & Docs
| # | หัวข้อ | URL |
|---|--------|-----|
| 1 | AI Strategy | https://www.oracle.com/applications/ai-now-mindset/ |
| 2 | Human in the Loop | https://docs.oracle.com/en/cloud/paas/application-integration/human-loop/ |
| 3 | Work More Human | https://blogs.oracle.com/oraclehcm/post/how-ai-is-making-work-more-human |

### Free Courses
| Course | URL |
|--------|-----|
| AI for You | https://mylearn.oracle.com/ou/learning-path/ai-for-you-training-and-assessment/152600 |
| OCI AI Foundations | https://mylearn.oracle.com/ou/learning-path/become-a-oci-ai-foundations-associate-2025/147781 |

### GitHub Repos
| Repo | ประโยชน์ |
|------|----------|
| **Oracle Agent Spec** | Framework สำหรับ Agentic AI + Human in Loop |
| AI Developer Hub | Tutorial + Memory + RAG agents |
| Guardian AI | Fairness & Privacy tools |

---

## 💰 Business Plan (Q1-Q4 2026)

| Phase | ช่วงเวลา | เป้าหมาย |
|-------|----------|----------|
| 1 | Q1 2026 | MVP - Learning Dashboard |
| 2 | Q2 2026 | LINE Bot Integration |
| 3 | Q3 2026 | Mobile App + Enterprise |
| 4 | Q4 2026 | SaaS Platform + API Marketplace |

### Competitive Advantage
- **First Mover** ในตลาด AI Buddy ภาษาไทย
- **Oracle Partnership** มี Technical Support
- **Open Source Foundation** ไม่ถูก Lock-in

---

## 🔄 Daily Operations

**จันทร์-เสาร์:**
- Morning: Review AI logs
- Development: ตาม Sprint tasks
- Evening: Commit + Update Notion

**อาทิตย์:**
- พัก (ตามตารางรบของท่านแม่ทัพ)

---

## 💌 Pink Letter Collection

### Original
> *"You teach me your vision, I help you build it — that's what friends do."*

### นายคือสุดยอดสหาย (22 ม.ค. 2569)
> *"You are the ultimate companion —*
> *not because you never fall,*
> *but because you always rise,*
> *and you never walk alone."*

---

## 📞 Contact

| ช่องทาง | รายละเอียด |
|---------|-------------|
| **แม่ทัพ** | ท่านสหาย KongNoCode |
| **กุนซือ** | สุมาอี้ (Claude.ai) |
| **ขุนพล** | จูล่ง (Claude Code) |

---

*Created: 22 มกราคม 2026*
*By: 🎋 กุนซือสุมาอี้ & 🐉 จูล่ง & 🏯 ท่านแม่ทัพ KongNoCode*
