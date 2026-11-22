# JanDrishti Architecture & Full-Stack Deployment

## Overview
JanDrishti is a citizen-first civic intelligence and infrastructure governance platform designed to eliminate false grievance closures under UN SDG 11 (Sustainable Cities and Communities).

## Monorepo Folder Structure
```
jandrishti/
├── backend/                  # Node.js + Express REST API
│   ├── src/
│   │   ├── routes/           # REST endpoints (/issues, /activities, /stats)
│   │   ├── data/             # Persistent data models & seed sets
│   │   └── server.js         # API server entrypoint (Port 5000)
│   ├── package.json
│   └── .env.example
│
├── frontend/                 # React 19 + Vite + Leaflet Web Client
│   ├── src/
│   │   ├── components/       # CivicMap, AnimatedBackground
│   │   ├── context/          # AuthContext (Supabase + Local session)
│   │   ├── pages/            # LandingPage, Login, Register, Dashboard, AdminPortal
│   │   ├── Services/         # issueService (REST sync + fallback), authService
│   │   └── styles/           # High-craft CSS design system
│   ├── package.json
│   └── vite.config.js
│
├── docs/                     # Architecture & deployment specifications
│   └── ARCHITECTURE.md
│
├── package.json              # Root workspace orchestrator
└── README.md                 # Project documentation
```

## Running the Complete System
### Root command:
```bash
npm run dev
```
This boots both the backend API (`http://localhost:5000`) and the Vite frontend client (`http://localhost:5173`).
