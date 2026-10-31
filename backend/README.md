# ValenceIQ Financial Analyst — Backend REST API (Phase 2)

This service powers the backend REST API, database persistence, and authentication for the **ValenceIQ Financial Analyst** platform.

---

## 🛠️ Tech Stack
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB & Mongoose
- **Authentication**: JWT with secure HttpOnly cookies & RBAC
- **Validation**: Zod schema validation

---

## 📁 Architecture

```
backend/
├── src/
│   ├── config/          # Database and environment configurations
│   ├── controllers/     # Route logic and business services
│   ├── middleware/      # Auth, RBAC, and error handlers
│   ├── models/          # Mongoose schemas (Customer, Subscription, Invoice, etc.)
│   ├── routes/          # Express API route declarations
│   └── server.js        # Express app entry point
├── .env.example         # Environment template
└── package.json         # Scripts and dependencies
```

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

### 3. Start Development Server
```bash
npm run dev
```
The API server will listen on `http://localhost:5000`.
Health endpoint: `http://localhost:5000/api/v1/health`
