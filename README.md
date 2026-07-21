# Ustaad AI (پاکستان اے آئی) — Pakistan AI Education Portal

Ustaad AI is a highly optimized, full-stack educational platform dedicated to democratizing artificial intelligence and academic prep across Pakistan. Built using **React**, **Vite**, **Express**, and the official **Google GenAI SDK**, it leverages advanced Gemini models to deliver customized, bilingual mentorship, curriculum-aligned exam prep, and local-dialect concept explanations.

Live Demo here : http://pakistan-ai-education-empowerment-production.up.railway.app

The platform is beautifully styled with a **Sophisticated Dark** visual aesthetic, incorporating elegant typography, slate backgrounds, and emerald/indigo highlights.

---

## 🌟 Key Features

### 1. 💬 Ustaad AI Mentor Chat
- **Localized Bilingual Tutor**: Speak naturally in English, Urdu (اردو), or Roman Urdu.
- **Board Alignment**: Personalized guidance tailored to Federal, Punjab, Sindh, KPK, and Balochistan curriculum boards.
- **Active Dialogue**: Real-time academic help with complex calculations, historical events, science questions, and grammar exercises.

### 2. 📝 Exam Quiz Prep Simulator
- **Standardized MCQs**: Dynamic generation of 5-question multiple choice tests for **Matric**, **FSc Pre-Engineering**, **MDCAT**, **ECAT**, or **CSS** exams.
- **Dual Explanations**: Instant grading with side-by-side conceptual explanations in English and beautiful Urdu script.
- **High Scores Tracker**: Saves quiz history locally on the browser to track subject-by-subject performance.

### 3. 🌐 Bilingual Tarjuma (Academic Explainer)
- **Concept Decoding**: Translates hard English textbook terminology into understandable local analogues.
- **Roman Urdu & Urdu Script**: Displays parallel Naskh/Nastaliq script and Romanized phonetics.
- **Pakistani Analogies**: Explains complex science or economics terms with relatable regional daily-life scenarios.

### 4. 🧭 Safar Study Roadmaps (Safar Syllabus Planner)
- **Goal-Oriented Schedules**: Generates detailed 4-phase learning roadmaps for board exam prep, freelancing, programming, or language mastery.
- **Local Resources**: Suggests specific localized video lectures, Sabaq Foundation material, Teleschool Pakistan, and other open-source study channels.
- **Interactive Checklist**: Track progress across milestones with a local-state dashboard.

---

## 🏗️ Technical Architecture

Ustaad AI is built on a robust **full-stack (Express + Vite)** framework designed for security, speed, and standard container deployments.

- **Frontend**: React 18 with Vite, styled via **Tailwind CSS**.
- **Backend**: Custom Express server (`server.ts`) acting as a proxy layer to ensure API keys remain hidden from the browser.
- **AI Engine**: Powered server-side by `@google/genai` using the Gemini API.
- **State Management**: Built-in state for instant loading and `localStorage` to persist quiz performance, saved glossaries, and customized roadmaps.

---

## 🔑 Environment Variables

To activate the server-side AI features, you must configure the following variable in your `.env` or system environment secrets:

```env
# Google Gemini API key used for server-side generation (Do not expose client-side)
GEMINI_API_KEY=your_gemini_api_key_here
```

An template is available in `.env.example` at the root of the project workspace.

---

## 🚀 Running Locally

Follow these instructions to start the development server or compile the production bundle.

### Prerequisites
- [Node.js](https://nodejs.org) (v18 or higher recommended)
- npm or bun

### 1. Install Dependencies
```bash
npm install
```

### 2. Run the Development Server
```bash
npm run dev
```
*The portal will boot on `http://localhost:3000` by default, proxying React assets and API requests seamlessly.*

### 3. Build & Compile for Production
The production build compiles the client files and bundles the server code into a self-contained CommonJS target using `esbuild` to bypass runtime path checks:
```bash
npm run build
```

### 4. Start Production Server
```bash
npm run start
```

---

## 🎨 Visual Identity

The interface implements the **Sophisticated Dark** design theme:
- **Canvas Base**: Rich deep dark charcoal (`#0A0C10`) with secondary panels styled in dark slate (`#11141B`).
- **Typography Pairing**: Elegant Georgia display serifs for titles and branding, paired with modern sans-serif fonts for data density and supreme legibility.
- **Accents**: Emerald (`#10B981`) for education, Indigo (`#6366F1`) for mock exam paths, and Amber (`#F59E0B`) for translation/glossaries.

---

*Ustaad AI is aligned with United Nations Sustainable Development Goal 4 (Quality Education) to support Pakistani youth and digital builders.*
