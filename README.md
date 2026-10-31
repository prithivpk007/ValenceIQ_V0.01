# Brightloop Software — Enterprise Subscription Management Cloud

Cloud-native B2B SaaS platform for full-lifecycle subscription management, dynamic pricing tier governance, sales quotation pipelines, recurring invoice reconciliation, customer self-service billing, and conversational AI analytics.

---

## 📁 Repository Structure

```
ValenceIQ/
├── frontend/                  # React 19 + Vite 8 + Tailwind CSS v4 Client SPA
│   ├── src/                   # Dashboards, role pages, components, services
│   ├── public/                # Static assets & SEO favicon
│   ├── package.json           # Frontend dependencies
│   └── vite.config.js         # Vite configuration
│
├── backend/                   # Node.js + Express + MongoDB REST API (Phase 2)
│   ├── src/
│   │   ├── config/            # Database and environment configurations
│   │   ├── middleware/        # JWT auth, RBAC, and error handlers
│   │   ├── models/            # Mongoose schemas (Customer, Subscription, Invoice, etc.)
│   │   ├── routes/            # REST API endpoints
│   │   └── server.js          # Express app entry point
│   ├── .env.example           # Environment template
│   └── package.json           # Backend dependencies
│
├── package.json               # Monorepo root with convenience scripts
└── README.md                  # Project overview and instructions
```

---

## 🚀 Quick Start

### 1. Install Dependencies
To install frontend dependencies:
```bash
npm install --prefix frontend
```
Or for both frontend and backend:
```bash
npm run install:all
```

### 2. Run Development Server
From the root directory (`ValenceIQ`):
```bash
# Starts the frontend Vite dev server (http://localhost:5173)
npm run dev

# Starts the backend API server (http://localhost:5000)
npm run dev:backend
```

Or run directly inside each directory:
```bash
# Frontend
cd frontend
npm install
npm run dev

# Backend
cd backend
npm install
npm run dev
```

---

## 📑 Detailed Documentation
- [Frontend Documentation](file:///g:/ValenceIQ/frontend/README.md)
- [Backend Documentation](file:///g:/ValenceIQ/backend/README.md)
