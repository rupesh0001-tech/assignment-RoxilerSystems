# 🌟 RateHub — Modern Store Rating & Platform Management System

> 🌐 **Live Frontend Application**: [https://frontend-murex-two-44.vercel.app](https://frontend-murex-two-44.vercel.app)  
> ⚙️ **Live Backend REST API**: [https://assignment-roxilersystems.onrender.com](https://assignment-roxilersystems.onrender.com)  
> 🗄️ **Cloud Database**: PostgreSQL on Neon

RateHub is a full-stack, multi-role web application designed for discovering local stores, submitting transparent 1-to-5 star ratings with written reviews, managing store feedback, and administering platform users and listings.

---

## 🏗️ System Architecture Diagram

![RateHub System Architecture](./architecture_diagram.svg)

### Textual Architecture Flow

```text
+---------------------------------------------------------------------------------------+
|                       1. CLIENT TIER (React 18 + Vite + Tailwind CSS)                 |
|  [Landing Page]  [Auth Pages]  [Normal User View]  [Store Owner Hub]  [Admin Dash]   |
+------------------------------------------+--------------------------------------------+
                                           | HTTP REST API (Bearer JWT)
                                           v
+---------------------------------------------------------------------------------------+
|                    2. API GATEWAY & SECURITY (Express.js + TypeScript)                |
|       [CORS & Body Parser]  -->  [JWT Auth Guard]  -->  [RBAC]  -->  [Zod Validation]  |
+------------------------------------------+--------------------------------------------+
                                           | Validated Requests
                                           v
+---------------------------------------------------------------------------------------+
|                    3. BUSINESS SERVICES & CONTROLLERS TIER                            |
|    +-----------------+  +------------------+  +-----------------+  +---------------+  |
|    |  Auth Service   |  |  Store Service   |  | Rating Service  |  | Admin Service |  |
|    | • Login/Signup  |  | • Search/Filter  |  | • 1-5 Star Feed |  | • Metrics     |  |
|    | • Reset Tokens  |  | • Multi-Sort     |  | • Review Text   |  | • User/Store  |  |
|    +-----------------+  +------------------+  +-----------------+  +---------------+  |
+------------------------------------------+--------------------------------------------+
                                           | Prisma ORM Client
                                           v
+---------------------------------------------------------------------------------------+
|                    4. PERSISTENCE LAYER (PostgreSQL + Prisma ORM)                     |
|           [User Table]        [Store Table]        [Rating Table]       [Reset Token] |
+---------------------------------------------------------------------------------------+
```

---

## 🗄️ Database Entity Relationship Diagram (ERD)

![Database ERD](./erd_diagram.svg)

### Database Entities & Keys

```text
+------------------------+          +------------------------+
|         USER           |  1    N  |         STORE          |
|------------------------|<---------|------------------------|
| id (PK, UUID)          |  owns    | id (PK, UUID)          |
| name (6-60 chars)      |          | name (String)          |
| email (Unique)         |          | email (Unique)         |
| passwordHash           |          | address (Max 400)      |
| address (Max 400)      |          | ownerId (FK -> User)   |
| role (ADMIN/OWNER/USER)|          +-----------+------------+
+-----------+------------+                      | 1
            | 1                                 |
            | submits                           | receives
            | N                                 | N
            v                                   v
+------------------------------------------------------------+
|                           RATING                           |
|------------------------------------------------------------|
| id (PK, UUID)                                              |
| value (Integer 1 to 5)                                     |
| comment (Text, Optional written review)                    |
| userId (FK -> User.id)                                     |
| storeId (FK -> Store.id)                                   |
| UNIQUE (userId, storeId)                                   |
+------------------------------------------------------------+
```

---

## 👥 Role-Based Access Control (RBAC) Matrix

| Feature / Action | System Admin | Store Owner | Normal User | Public / Guest |
| :--- | :---: | :---: | :---: | :---: |
| **Browse Stores & Search Directory** | ✅ | — | ✅ | ✅ |
| **Switch Card Grid / Table List UI** | ✅ | — | ✅ | — |
| **Read Other People's Written Reviews** | ✅ | ✅ | ✅ | — |
| **Submit 1–5 Star Rating & Review** | ✅ | — | ✅ | — |
| **Modify Past Submitted Rating** | ✅ | — | ✅ | — |
| **View Store Average & Ratings** | ✅ | ✅ (Own Store) | ✅ | ✅ |
| **View Customer Reviewers Feedback** | ✅ | ✅ (Own Store) | — | — |
| **Platform Metrics (Users/Stores/Ratings)** | ✅ | — | — | — |
| **Full User CRUD (Create/Edit/Delete)** | ✅ | — | — | — |
| **Full Store CRUD (Create/Edit/Delete)** | ✅ | — | — | — |
| **Change Password** | ✅ | ✅ | ✅ | — |

---

## 💻 Tech Stack

### Frontend
- **Framework**: React 18 with TypeScript
- **Bundler & Tooling**: Vite
- **Styling**: Vanilla Tailwind CSS (Strict Light Mode with clean glass cards and micro-interactions)
- **Icons**: Lucide React
- **Routing**: React Router DOM v6 with dedicated sub-routes (`/dashboard/browse`, `/dashboard/top-rated`, `/dashboard/reviews`, `/dashboard/users`, `/dashboard/stores`)
- **HTTP Client**: Axios with interceptors and JWT authorization header injection

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js with TypeScript
- **Database & ORM**: PostgreSQL with Prisma ORM
- **Authentication**: JSON Web Tokens (JWT) + bcryptjs password hashing
- **Data Validation**: Zod schema validation middleware
- **Execution & Hot Reload**: `tsx` (TypeScript Execute)

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js (v18 or higher)
- PostgreSQL (running locally or via cloud connection string)

### 2. Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure environment variables in `.env`:
   ```env
   PORT=5001
   DATABASE_URL="postgresql://postgres:postgres@localhost:5432/store_rating_db?schema=public"
   JWT_SECRET="super-secret-jwt-token-key-change-in-production"
   JWT_EXPIRES_IN="7d"
   FRONTEND_URL="http://localhost:5173"
   ```
4. Run database migrations:
   ```bash
   npx prisma db push
   ```
5. Seed the database with realistic multi-role data:
   ```bash
   npm run seed
   ```
6. Start the backend development server:
   ```bash
   npm run dev
   ```
   *The backend API will run at `http://localhost:5001`.*

---

### 3. Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the frontend dev server:
   ```bash
   npm run dev
   ```
   *The application will be accessible at `http://localhost:5173`.*

---

## 🔑 Demo Accounts

| Role | Email | Password |
| :--- | :--- | :--- |
| **System Admin** | `admin@ratehub.com` | `AdminPassword123!` |
| **Store Owner 1** | `owner@brewnbloom.com` | `OwnerPassword123!` |
| **Store Owner 2** | `owner@urbanroast.com` | `OwnerPassword123!` |
| **Store Owner 3** | `owner@thebooknook.com` | `OwnerPassword123!` |
| **Normal User 1** | `user@example.com` | `UserPassword123!` |
| **Normal User 2** | `sophia@example.com` | `UserPassword123!` |
