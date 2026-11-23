
<div align="center">

# 🏙️ JanDrishti
### Citizen-Verified Civic Issue Resolution Platform

**Report. Resolve. Verify.**

A full-stack civic-tech platform empowering citizens to report local issues, track progress, and verify resolutions.

[![Live Website](https://img.shields.io/badge/Live_Website-Visit_JanDrishti-16845B?style=for-the-badge&logo=vercel&logoColor=white)](https://jandrishti-tan.vercel.app/)

![React](https://img.shields.io/badge/React-19-149ECA?logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-Express-339933?logo=nodedotjs&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-Authentication-3FCF8E?logo=supabase&logoColor=white)
![Leaflet](https://img.shields.io/badge/Maps-Leaflet-199900?logo=leaflet&logoColor=white)

**Aligned with UN Sustainable Development Goal 11 — Sustainable Cities and Communities**

</div>

---

## 🌐 Live Demo

**Website:** https://jandrishti-tan.vercel.app/

Explore JanDrishti's civic reporting interface, interactive maps, issue dashboard, and citizen verification experience.

> **Project Status:** Functional prototype. The application currently includes demo data and in-memory backend storage. Production-grade persistent issue storage and server-side authorization are planned improvements.

---

## 📖 About the Project

**JanDrishti** is a civic issue reporting and resolution tracking platform designed to bridge the communication gap between citizens and local authorities.

Every day, communities face problems such as damaged roads, overflowing garbage, broken streetlights, water leakage, and poor drainage. Reporting these problems and tracking their resolution can be difficult.

JanDrishti provides a centralized platform where citizens can report issues, identify their locations on an interactive map, monitor progress, and participate in verifying whether reported problems have actually been resolved.

### 💡 What Makes JanDrishti Different?

Traditional grievance systems often mark complaints as resolved based on administrative updates alone.

JanDrishti introduces a **citizen verification workflow**, allowing citizens to confirm or dispute a claimed resolution.

Our core principle is:

**An issue should not simply be marked resolved — its resolution should be verifiable.**

---

## ✨ Key Features

### 👤 Citizen Portal

- **User Authentication:** Registration, login, and session management through Supabase authentication integration.
- **Report Civic Issues:** Submit complaints about roads, sanitation, water supply, streetlights, and other public infrastructure.
- **Interactive Map:** Explore geographically located issues using Leaflet and OpenStreetMap.
- **Issue Tracking:** Follow reported issues through different resolution stages.
- **Community Engagement:** Support relevant issues through upvotes and comments.
- **Citizen Verification:** Verify or dispute resolutions submitted by administrators.
- **Issue History:** View progress updates and activity records.
- **Responsive Interface:** Accessible across desktop and mobile devices.

### 🛠️ Admin Portal

- Review reported civic issues.
- Monitor issue categories and priorities.
- Assign issues to responsible officers.
- Update issue progress and status.
- Submit repair evidence.
- Review issue statistics and activity.

> The current admin interface is part of the prototype. Production deployment requires server-side role-based authorization.

### 🗺️ Interactive Civic Map

JanDrishti integrates Leaflet with OpenStreetMap to provide an interactive geographical view of civic issues.

Features include:

- Map markers for reported problems.
- Location-based issue visualization.
- Issue details through map popups.
- Category-based issue identification.
- Map location selection.
- GPS-based positioning where permitted.

**No Leaflet API key is required** for the current OpenStreetMap tile configuration.

---

## 🔄 How JanDrishti Works

```text
        ┌───────────────────────┐
        │   Citizen Reports     │
        │      an Issue         │
        └───────────┬───────────┘
                    │
                    ▼
        ┌───────────────────────┐
        │ Issue Appears on Map  │
        │     & Dashboard       │
        └───────────┬───────────┘
                    │
                    ▼
        ┌───────────────────────┐
        │  Admin Reviews and    │
        │    Assigns Issue      │
        └───────────┬───────────┘
                    │
                    ▼
        ┌───────────────────────┐
        │   Repair Progress     │
        │  & Evidence Updated   │
        └───────────┬───────────┘
                    │
                    ▼
        ┌───────────────────────┐
        │ Citizen Verification  │
        └───────────┬───────────┘
                    │
             ┌──────┴──────┐
             ▼             ▼
        Verified        Disputed
             │             │
             ▼             ▼
          Resolved       Reopened
```

*This illustrates the intended end-to-end workflow, including features currently demonstrated using prototype data.*

---

## 🛠️ Tech Stack

| Category | Technologies |
|----------|-------------|
| Frontend | React.js, Vite, JavaScript, CSS |
| Backend | Node.js, Express.js |
| Authentication | Supabase Auth |
| Maps | Leaflet, React Leaflet, OpenStreetMap |
| Charts | Chart.js, React Chart.js 2 |
| Routing | React Router |
| Icons | Lucide React |
| API Architecture | REST APIs |
| Prototype Data | Express in-memory storage, localStorage |
| Frontend Deployment | Vercel |
| Version Control | Git, GitHub |
| Development Tools | VS Code, npm |

---

## 🏗️ System Architecture

```text
                 ┌──────────────────┐
                 │      CITIZEN     │
                 │       ADMIN      │
                 └────────┬─────────┘
                          │
                          ▼
             ┌────────────────────────┐
             │     REACT FRONTEND     │
             │                        │
             │  Landing Page          │
             │  Authentication        │
             │  Citizen Dashboard     │
             │  Admin Portal          │
             │  Interactive Map       │
             └────────────┬───────────┘
                          │
              ┌───────────┴───────────┐
              │                       │
              ▼                       ▼
      ┌──────────────┐       ┌─────────────────┐
      │ SUPABASE AUTH│       │ EXPRESS REST API│
      │              │       │                 │
      │ Registration │       │ Issue CRUD      │
      │ Login        │       │ Status Updates  │
      │ Sessions     │       │ Assignments     │
      └──────────────┘       │ Verification    │
                             │ Statistics      │
                             └────────┬────────┘
                                      │
                                      ▼
                             ┌─────────────────┐
                             │ IN-MEMORY DATA  │
                             │ Prototype State │
                             └─────────────────┘
```

The current prototype uses in-memory backend issue data and browser localStorage fallback. Persistent PostgreSQL integration is part of the development roadmap.

---

## 📂 Project Structure

```text
jandrishti/
│
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
│   │   │
│   │   ├── context/
│   │   │   ├── AuthContext.jsx
│   │   │   └── ThemeContext.jsx
│   │   │
│   │   ├── lib/
│   │   │   └── supabaseClient.js
│   │   │
│   │   ├── pages/
│   │   │   ├── LandingPage.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   └── AdminPortal.jsx
│   │   │
│   │   ├── Services/
│   │   │   ├── authService.js
│   │   │   └── issueService.js
│   │   │
│   │   └── styles/
│   │
│   └── package.json
│
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
│   │
│   └── package.json
│
├── docs/
│   └── ARCHITECTURE.md
│
├── package.json
└── README.md
```

---

## 🚀 Installation and Setup

### Prerequisites

Ensure you have installed:

- Node.js and npm
- Git
- VS Code or another code editor
- A Supabase project for authentication configuration

### Step 1: Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/YOUR_REPOSITORY.git
cd YOUR_REPOSITORY
```

Replace the placeholder with your repository URL.

### Step 2: Install Dependencies

From the project root:

```bash
npm install
npm --prefix frontend install
npm --prefix backend install
```

### Step 3: Configure Environment Variables

Create a `.env.local` file inside the `frontend` directory.

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_publishable_key
VITE_BACKEND_URL=http://localhost:5000/api
```

Create a `.env` file inside the `backend` directory.

```env
PORT=5000
NODE_ENV=development
```

**Security:** Never commit secret credentials or service-role keys to GitHub. Frontend environment variables prefixed with `VITE_` are exposed to the browser.

### Step 4: Start the Application

Run the frontend and backend together:

```bash
npm run dev
```

Alternatively, run them separately:

```bash
npm run dev:frontend
```

```bash
npm run dev:backend
```

### Step 5: Open the Application

| Service | URL |
|---------|-----|
| Frontend | http://localhost:5173 |
| Backend | http://localhost:5000 |
| API Health Check | http://localhost:5000/api/health |

---

## 🔌 Backend API Endpoints

The Node.js and Express backend provides REST endpoints for civic issue management.

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Check backend health |
| GET | `/api/issues` | Retrieve reported issues |
| GET | `/api/issues/:id` | Retrieve a specific issue |
| POST | `/api/issues` | Create a new issue |
| PATCH | `/api/issues/:id/status` | Update issue status |
| POST | `/api/issues/:id/upvote` | Toggle issue upvote |
| POST | `/api/issues/:id/assign` | Assign an officer |
| POST | `/api/issues/:id/repair-proof` | Submit repair evidence |
| GET | `/api/activities` | Retrieve activity records |
| GET | `/api/stats/summary` | Retrieve dashboard statistics |
| POST | `/api/issues/check` | Check for possible duplicate issues |

Example API request:

```bash
curl http://localhost:5000/api/issues
```

**Note:** The current Express backend stores issue records in memory. Changes are not guaranteed to survive a server restart.

---

## 🔐 Authentication and Security

JanDrishti integrates Supabase Authentication for account management.

Authentication-related functionality includes:

- User registration
- Email/password login
- Session handling
- Logout
- Authentication-aware navigation

### Planned Security Improvements

- Server-side JWT validation
- Role-based access control for administrators
- PostgreSQL Row Level Security
- Secure evidence uploads
- API input validation
- Rate limiting
- Audit logging

These improvements are required before handling real civic complaints in a production environment.

---

## 🎯 Project Objectives

1. Provide a centralized platform for reporting civic issues.
2. Improve visibility into local infrastructure problems.
3. Enable geographical visualization of complaints.
4. Support communication between citizens and administrators.
5. Encourage transparency in issue resolution.
6. Introduce citizen participation in resolution verification.
7. Promote accountability and community engagement.

---

## 🌍 Sustainable Development Goal Alignment

### SDG 11 — Sustainable Cities and Communities

JanDrishti supports the objectives of UN Sustainable Development Goal 11 by promoting citizen participation in urban management.

The project focuses on:

- Improving awareness of public infrastructure issues.
- Encouraging responsible community participation.
- Making local issue information more accessible.
- Supporting transparent resolution processes.
- Promoting more inclusive and sustainable communities.

---

## 🔮 Future Enhancements

- [ ] PostgreSQL database integration for persistent issue storage
- [ ] Secure image uploads using Supabase Storage
- [ ] Server-side admin authorization
- [ ] Real-time issue status notifications
- [ ] Advanced map-based filtering
- [ ] Automated duplicate issue detection
- [ ] Ward-wise civic analytics
- [ ] Public issue resolution reports
- [ ] Email notifications for status changes
- [ ] Improved accessibility and mobile experience
- [ ] Production deployment of the backend API

---

## 🤝 Contributing

Contributions, suggestions, and improvements are welcome.

To contribute:

1. Fork the repository.
2. Create a new feature branch.
3. Make your changes.
4. Commit your updates.
5. Open a pull request.

---

## 📄 License

A license has not yet been specified. Add a `LICENSE` file to define the terms for reuse and contribution.

---

<div align="center">

### 🏙️ JanDrishti

**Report. Resolve. Verify.**

*Empowering citizens. Strengthening communities. Building accountability.*

🌐 **[Visit Live Website](https://jandrishti-tan.vercel.app/)**

**Built with React, Node.js, Express, Supabase and Leaflet**

</div>
