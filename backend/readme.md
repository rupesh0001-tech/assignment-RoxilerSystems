# RateHub Backend

Backend REST API for Store Rating and Management Platform built with Express.js, TypeScript, PostgreSQL, and Prisma ORM.

## Project Structure
```
backend/
├── app.ts                  # Server entry point
├── configs/                # Environment, DB, and JWT configs
├── controllers/            # Controller handlers organized by feature
│   └── auth/
├── middlewares/            # Authentication, validation, and error middlewares
├── routes/                 # Express routing organized by feature
│   └── auth/
├── services/               # Business logic and database operations
│   └── auth/
├── prisma/                 # Prisma ORM schema & seed data
├── docs/                   # API documentation
└── readme.md
```

## Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Variables
Configure `.env`:
```env
PORT=5000
NODE_ENV=development
DATABASE_URL="postgresql://<user>@localhost:5432/store_rating_db?schema=public"
JWT_SECRET="ratehub_super_secure_jwt_secret_key_2026"
JWT_EXPIRES_IN="7d"
CORS_ORIGIN="http://localhost:5173"
```

### 3. Database Migration & Seed
```bash
npx prisma db push
npx prisma db seed # or npx tsx prisma/seed.ts
```

### 4. Run Development Server
```bash
npm run dev
```
Server will be active at `http://localhost:5000`.
