<div align="center">🏙️ JanDrishti
Citizen-Verified Civic Issue Resolution Platform
Report. Resolve. Verify.

A civic-tech web application for reporting local infrastructure problems, tracking action, and giving citizens a voice in verifying claimed resolutions.
    
Aligned with UN Sustainable Development Goal 11 — Sustainable Cities and Communities
</div>📖 Overview
JanDrishti is a full-stack civic issue reporting platform designed to improve transparency and citizen participation in local infrastructure management. Citizens can report potholes, water leaks, broken streetlights, waste accumulation, drainage problems, and other neighborhood issues using a map-based interface. An administrative workflow supports issue assignment, repair updates, and resolution evidence.

What makes JanDrishti different? An administrator's claim that an issue has been fixed is not necessarily the final word. The application includes a citizen verification workflow so reported repairs can be confirmed or disputed.
Project status: Functional prototype. The repository includes a React/Vite client, Express REST API, Supabase authentication integration, and demo issue data. The Express API currently stores issue changes in memory, and the frontend includes a localStorage fallback. This is not yet a production-ready persistent grievance system.

✨ Features
👤 Citizen experience
- Account registration and sign-in via the authentication integration, with a local demo-session fallback in the current codebase.
- Civic issue reporting with category, description, priority, ward, location, and optional image URL.
- Interactive map with location markers, issue popups, and GPS-based map positioning.
- Issue browsing, filtering, status tracking, and community upvotes.
- Comments and activity history.
- Before/after evidence viewing and a citizen verification/dispute flow.
- Duplicate issue checking and issue-sharing UI.
🛠️ Administrative experience
- Dedicated admin portal interface.
- Review issues, assign officers, and update progress.
- Submit repair proof and move issues toward citizen verification.
- View issue activity and aggregate statistics.
Security note: The current /admin frontend route checks whether a user is signed in, but the code shown does not enforce a separate admin role at the route level. Server-side authorization must be added before production use.
🗺️ Mapping
- Leaflet + React Leaflet for interactive maps.
- OpenStreetMap tiles in light mode and CARTO tiles in dark mode.
- Color-coded issue markers, category icons, popups, and map click location selection.
- No Leaflet API key is required for the current tile configuration; follow each tile provider's attribution and usage policies.
🔄 How It Works
Citizen submits issue
         │
         ▼
Issue appears in civic dashboard / map
         │
         ▼
Admin reviews and assigns an officer
         │
         ▼
Repair progress and evidence submitted
         │
         ▼
Citizen reviews claimed resolution
         │
     ┌───┴────┐
     ▼        ▼
  Verified  Disputed
     │        │
     ▼        ▼
  Resolved  Reopened / further action
This represents the intended application workflow. Demo records and local persistence are currently used for parts of the experience.
🧰 Tech Stack
Layer	Technologies
Frontend	React 19, Vite 8, JavaScript, CSS
Routing	React Router 7
UI / Icons	Lucide React
Maps	Leaflet, React Leaflet, OpenStreetMap, CARTO tiles
Charts	Chart.js, react-chartjs-2
Backend	Node.js, Express 4, REST API
Middleware	CORS, dotenv
Authentication	Supabase Auth integration; local mock-session fallback
Prototype data	Express in-memory arrays and browser localStorage
Development	npm, Git, GitHub, VS Code


📁 Project Structure
jandrishti/
├── backend/
│   ├── src/
│   │   ├── data/
│   │   │   └── initialIssues.js
│   │   ├── routes/
│   │   │   ├── issues.js
│   │   │   ├── activities.js
│   │   │   ├── stats.js
│   │   │   ├── comments.js
│   │   │   └── duplicate.js
│   │   └── server.js
│   ├── .env.example
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── CivicMap.jsx
│   │   │   ├── AnimatedBackground.jsx
│   │   │   ├── CommentSection.jsx
│   │   │   ├── DuplicateWarning.jsx
│   │   │   ├── PhotoComparisonSlider.jsx
│   │   │   ├── ShareIssue.jsx
│   │   │   └── SLACountdown.jsx
│   │   ├── context/
│   │   │   ├── AuthContext.jsx
│   │   │   └── ThemeContext.jsx
│   │   ├── lib/
│   │   │   └── supabaseClient.js
│   │   ├── pages/
│   │   │   ├── LandingPage.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   └── AdminPortal.jsx
│   │   ├── Services/
│   │   │   ├── authService.js
│   │   │   └── issueService.js
│   │   └── styles/
│   └── package.json
├── docs/
│   └── ARCHITECTURE.md
├── package.json
└── README.md
🚀 Getting Started
Prerequisites
- Node.js and npm (use a version compatible with Vite 8)
- A Supabase project for the configured authentication integration
1. Clone the repository
git clone https://github.com/YOUR_USERNAME/YOUR_REPOSITORY.git
cd YOUR_REPOSITORY
Replace the placeholder with your actual GitHub repository URL.
2. Install dependencies
npm install
npm --prefix backend install
npm --prefix frontend install
3. Configure environment variables
Create frontend/.env.local:
VITE_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=YOUR_SUPABASE_PUBLISHABLE_KEY
VITE_BACKEND_URL=http://localhost:5000/api
Create backend/.env:
PORT=5000
NODE_ENV=development
The backend's .env.example also lists DATABASE_URL, but the current Express route handlers do not use it to persist issues. Adding a connection string alone will not enable database storage.
Never commit .env, .env.local, Supabase service-role keys, or other secrets. The Supabase publishable key is intended for client use; authorization still requires properly configured backend policies.

4. Start frontend and backend together
From the repository root:
npm run dev
Service	Local URL
Frontend	http://localhost:5173
Backend	http://localhost:5000
API health check	http://localhost:5000/api/health


You can also run them separately:
npm run dev:frontend
npm run dev:backend
5. Build the frontend
npm run build
🔌 REST API Reference
The Express API is mounted under /api.
Method	Endpoint	Purpose
GET	/api/health	Check backend availability
GET	/api/issues	List issues; supports category, status, ward, search filters
GET	/api/issues/:id	Get issue details
POST	/api/issues	Create an issue
PATCH	/api/issues/:id/status	Change status / record verification or dispute
POST	/api/issues/:id/upvote	Toggle community upvote
POST	/api/issues/:id/assign	Assign an officer
POST	/api/issues/:id/repair-proof	Submit repair evidence
GET	/api/activities	Get activity feed
GET	/api/stats/summary	Get summary metrics
POST	/api/issues/check	Check for possible duplicate issues


The repository also contains comment handlers, but their current router mount path should be reviewed before documenting them as a stable public API.

Example health check:
curl http://localhost:5000/api/health
Example issue request:
curl http://localhost:5000/api/issues
🧩 System Architecture
                  ┌───────────────────────────┐
                  │     React + Vite UI       │
                  │ Citizen / Admin / Map     │
                  └────────────┬──────────────┘
                               │
                  ┌────────────┴──────────────┐
                  ▼                           ▼
         ┌──────────────────┐      ┌──────────────────────┐
         │ Supabase Auth    │      │ Node.js / Express    │
         │ Login & sessions │      │ /api REST endpoints  │
         └──────────────────┘      └──────────┬───────────┘
                                             │
                                             ▼
                                  ┌──────────────────────┐
                                  │ In-memory issue data │
                                  │ (current prototype)  │
                                  └──────────────────────┘

          Browser localStorage supports demo/fallback state.
For more implementation details, see [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md).
🧪 Testing Checklist
- [ ] Register and sign in with valid Supabase configuration
- [ ] Load the landing page, dashboard, and interactive map
- [ ] Create a civic issue and inspect the API response
- [ ] Filter issues by category and status
- [ ] Assign an officer and submit repair proof
- [ ] Verify or dispute a resolution
- [ ] Test duplicate issue checking and upvotes
- [ ] Check frontend behavior when the Express API is offline
- [ ] Confirm mobile responsiveness and light/dark mode
- [ ] Verify permissions before enabling real admin access
⚠️ Current Limitations
- Non-persistent Express storage: API-created or modified issues are held in memory and can be lost when the backend restarts.
- Local fallback: Some frontend operations use localStorage and background API synchronization, so browser and server data may diverge.
- Authorization: Authenticated access to the admin route is not equivalent to verified admin-role authorization; sensitive API endpoints require server-side access controls.
- Database: The present backend does not implement PostgreSQL issue persistence, despite the project's planned Supabase/database architecture.
- Demo content: Seed issue reports and their associated evidence are illustrative, not confirmed live municipal records.
- Deployment: Frontend and backend require separate deployment configuration, including the correct VITE_BACKEND_URL and CORS settings.
🔮 Roadmap
- [ ] Persist civic issues, comments, verification history, and evidence in PostgreSQL
- [ ] Enforce Supabase JWT verification and role-based authorization in Express
- [ ] Configure database Row Level Security and secure file storage
- [ ] Add robust input validation, rate limiting, and audit logging
- [ ] Add secure image uploads and server-generated issue identifiers
- [ ] Add notifications for status changes and verification requests
- [ ] Improve map filters, geographic search, and accessibility
- [ ] Add integration tests and production deployment workflows
🌍 SDG Alignment
JanDrishti supports the aims of UN SDG 11: Sustainable Cities and Communities by encouraging public participation, improving visibility into local infrastructure problems, and emphasizing accountability in issue resolution.
🤝 Contributing
Contributions and suggestions are welcome. Open an issue describing the proposed improvement, or submit a pull request with a focused change and clear testing notes.
📄 License
No license is declared in this README. Add a LICENSE file if you want to define permissions for reuse and contributions.
