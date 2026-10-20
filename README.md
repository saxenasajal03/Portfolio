# Sajal Saxena — Interactive 3D Portfolio & Systems Dossier

> **Full-Stack Software Engineer · Business Development Associate at Urban Company · Certified Generative AI Professional**

[![Vite](https://img.shields.io/badge/Vite-8.3-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/React-19.0-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-7.0-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Three.js](https://img.shields.io/badge/Three.js-WebGL-black?logo=three.js)](https://threejs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![GitHub Actions](https://img.shields.io/badge/CI%2FCD-GitHub_Pages-2088FF?logo=github-actions&logoColor=white)](https://github.com/)

A high-performance interactive 3D portfolio and engineering portfolio built with **React 19**, **Three.js**, **TypeScript**, and **Tailwind CSS**. Built with architectural typography, real-time WebGL parallax, responsive 3D micro-motion cards, and a dedicated Portfolio Intelligence console.

---

## 🌟 Key Highlights & Engineering Features

### 1. Interactive 3D Centerpiece & Portrait Processing
- **Three.js Scene Architecture**: Real-time WebGL rendering with custom physical-based lighting, soft circular drop-shadow, dynamic particle dust field, and interactive mouse-driven Euler gimbal rotation.
- **Client-Side Background Segmentation**: High-precision edge-seeded flood fill, chromatic distance thresholding, and smoothstep alpha feathering directly in an offscreen HTML5 canvas to isolate portraits with zero backend latency.

### 2. Centered Kinetic 3D Typography
- Prominent **SAJAL SAXENA** monolithic architectural header centered directly in the hero stage.
- Multi-layer `preserve-3d` spatial depth with individual letter elevation, smooth exponential damping (`lerp`), and dynamic specular drop-shadows that track cursor movement.

### 3. 3D Micro-Motion UI Across All Sections
- Reusable `MotionCard3D` wrapper providing responsive tilt, specular glint reflection, and depth elevation on hover for all cards across:
  - **Projects**: Elexoplus ERP, ConnectX WebRTC, Plant Leaf Disease CNN, Electricity Ledger.
  - **Experience**: Urban Company SBC Quality Team, themrgamer.com, Feynn Labs, CollegeDesire.
  - **Skills & Certifications**: Oracle Cloud Infrastructure 2025 GenAI Professional, HackerRank, Infosys Java, TCS ESG.
  - **Education**: B.Tech CSE (Dev Bhoomi Uttarakhand University), NEP Saarthi Ambassador.
  - **Contact**: Direct communication console and coordinates.

### 4. Portfolio Copilot (Intelligence Console)
- Built-in instant response terminal that answers queries regarding Sajal's work experience, project technical stacks, SLA metrics, and contact info.
- Formatted output cards with category indicators, tech badges, and one-click quick jump actions.

### 5. Direct Mail & Communication Flow
- 1-click **Direct Email** that automatically opens the user's default desktop/mobile mail app (Apple Mail, Outlook, Thunderbird, iOS Mail, Android Gmail) with pre-filled topics.
- Web Gmail fallback trigger to compose in the browser.
- Direct links to **LinkedIn Profile** (`/in/sajal-saxena-cse/`) and verified **Resume PDF** download.

---

## 📂 Project Architecture

```
├── .github/
│   └── workflows/
│       └── deploy.yml          # Automated GitHub Pages CI/CD workflow
├── public/
│   └── assets/
│       └── resource/
│           ├── image_18e25f87.png                 # Portrait asset
│           ├── SAJAL_SAXENA_RESUME_3b56c39e.pdf    # Official resume PDF
│           └── Sajal_Saxena_Resume.pdf
├── src/
│   ├── components/
│   │   ├── ContactSection.tsx    # Direct contact, mail triggers & LinkedIn
│   │   ├── EducationSection.tsx  # Academic background & UGC NEP Saarthi
│   │   ├── ExperienceSection.tsx # Urban Company & past engineering roles
│   │   ├── Kinetic3DName.tsx     # Centered 3D kinetic name in Hero
│   │   ├── MotionCard3D.tsx      # 3D interactive tilt card container
│   │   ├── Navbar.tsx            # Clean glassmorphic navigation bar
│   │   ├── ProfileDossier.tsx    # Detailed profile breakdown & modal
│   │   ├── ProjectsSection.tsx   # ERP, WebRTC, CNN, & Systems projects
│   │   ├── Sajal3DCanvas.tsx     # Three.js WebGL canvas & lighting
│   │   ├── SkillsSection.tsx     # Tech stack & Oracle GenAI certification
│   │   └── SmartBot.tsx          # Portfolio Copilot terminal assistant
│   ├── utils/
│   │   ├── audio.ts              # Synthesized Web Audio feedback (zero mp3s)
│   │   └── backgroundRemoval.ts  # Client-side canvas studio background isolator
│   ├── App.tsx                   # Main orchestrator & layout
│   ├── index.css                 # Atelier Unit scale variables & animations
│   └── main.tsx                  # Application entry point
├── index.html                    # Root HTML & SEO meta tags
├── package.json                  # Scripts & dependencies
├── tsconfig.json                 # Strict TypeScript configuration
└── vite.config.ts                # Bundler configuration with relative base './'
```

---

## 🚀 Quick Start & Local Setup

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm** or **bun** / **yarn** / **pnpm**

### Installation
```bash
# Clone the repository
git clone https://github.com/<your-username>/<repo-name>.git

# Navigate to project folder
cd <repo-name>

# Install all dependencies
npm install

# Start local development server
npm run dev
```

Open your browser at `http://localhost:3000` to interact with the 3D portfolio.

---

## 🌐 Free Deployment to GitHub Pages

This repository is already pre-configured for **GitHub Pages** with two easy options:

### Option A: Automatic Deployment via GitHub Actions (Recommended)
1. Push this repository to GitHub:
   ```bash
   git add .
   git commit -m "feat: complete modern 3D portfolio for Sajal Saxena"
   git branch -M main
   git remote add origin https://github.com/<your-username>/<your-repo-name>.git
   git push -u origin main
   ```
2. On GitHub, go to your repository **Settings** → **Pages**.
3. Under **Build and deployment** → **Source**, select **GitHub Actions**.
4. The `.github/workflows/deploy.yml` workflow will automatically build and publish your site! Your live portfolio will be accessible at:
   `https://<your-username>.github.io/<your-repo-name>/`

### Option B: Manual Deployment via `gh-pages`
```bash
# Builds production assets and deploys straight to the gh-pages branch
npm run deploy
```
Then under **Settings** → **Pages**, select **Deploy from a branch** and choose `gh-pages` / `/ (root)`.

---

## 🛠️ Tech Stack & Libraries

| Domain | Technology |
|---|---|
| **Framework & UI** | React 19, TypeScript, Tailwind CSS v4, Lucide Icons |
| **3D & Graphics** | Three.js, WebGL, PMREMGenerator, Canvas 2D API |
| **Motion & Parallax** | CSS 3D Transforms (`preserve-3d`), Custom Exponential Damping (`lerp`) |
| **Audio** | Procedural Web Audio API (Synthesized resonant oscillators) |
| **Build & Deploy** | Vite 8, GitHub Actions, gh-pages |

---

## 📬 Contact & Connect

- **Engineer**: Sajal Saxena
- **Role**: Business Development Associate (Central SBC Quality) @ Urban Company
- **Email**: [sajalsaxenagola@gmail.com](mailto:sajalsaxenagola@gmail.com)
- **Phone / WhatsApp**: [+91 88408 10386](tel:+918840810386)
- **LinkedIn**: [linkedin.com/in/sajal-saxena-cse](https://www.linkedin.com/in/sajal-saxena-cse/)
- **Location**: Ghitorni, New Delhi / Gola Gokarannath, Uttar Pradesh (PIN: 262802)

---

© 2026 Sajal Saxena. All rights reserved.
