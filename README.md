# Jogi Mohan Krishna — High-Animation AI & Full-Stack Developer Portfolio

An interactive, dark cyber-themed portfolio website engineered for **Jogi Mohan Krishna**, showcasing expertise across AI/ML (RAG, CNN, Bi-LSTM, LangChain) and Full-Stack Web Development (React, Python, Node.js, MySQL).

---

## Live Features & Animation Mechanics

1. **Interactive Particle Constellation Canvas**:
   - 60 FPS HTML5 Canvas engine with smooth velocity physics, proximity connecting lines, and mouse cursor attraction/repulsion.
2. **Interactive 3D Card Tilt**:
   - Dynamic perspective tilt tracking mouse coordinates with soft specular highlights and elevation shadows.
3. **Dynamic Typewriter Headline**:
   - Rotates through key engineering titles (*"AI-Powered Applications"*, *"Enterprise RAG Systems"*, *"Deep Learning Pipelines"*, *"Full-Stack Web Architectures"*).
4. **Live Interactive Project Sandbox**:
   - **RAG Vector Retrieval Simulator**: Simulates vector similarity search using FAISS and generates grounded responses with citation chunks.
   - **ATS Resume Matcher**: Interactively evaluates Mohan's resume against target roles (AI Engineer, Full-Stack, Python Backend) with radial match score and skill tags.
5. **Synthesized Web Audio SFX**:
   - Optional futuristic cyber audio feedback synthesized via the browser's native **Web Audio API** (zero external MP3 downloads).
6. **One-Click Quick Copy & Form Validation**:
   - Instant clipboard copying with slide-up toast notification for email and phone.
   - Form pre-populates email drafts directly to `mohankrishnajogi123@gmail.com`.
7. **Mobile-First Responsive Layout**:
   - Fully optimized down to 320px screen width with mobile navigation drawer.

---

## Project Structure

```
mohan-portfolio/
├── index.html       # Semantic HTML5 with complete resume data & sections
├── style.css        # Cyber glassmorphism styling, animations, neon gradients
├── script.js        # Canvas particles, tilt effects, sound engine, demo sandbox
└── README.md        # Documentation & deployment guide
```

---

## How to Preview & Run Locally

### Option 1: Direct Browser Launch
Simply double-click `index.html` to open it in Chrome, Edge, Brave, or Firefox.

### Option 2: Using Node.js / npx
```bash
cd "C:\Users\mohan\.gemini\antigravity\scratch\mohan-portfolio"
npx serve .
```

### Option 3: Using Python HTTP Server
```bash
cd "C:\Users\mohan\.gemini\antigravity\scratch\mohan-portfolio"
python -m http.server 8000
```
Then visit `http://localhost:8000`.

---

## Free 1-Click Deployment

- **GitHub Pages**: Push this directory to a repository and enable GitHub Pages in Settings → Pages.
- **Vercel / Netlify**: Drag and drop the `mohan-portfolio` folder directly into Vercel or Netlify for instant global CDN deployment with HTTPS.
