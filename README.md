# 🌟 RateHub — Modern Store Rating & Platform Management System

RateHub is a full-stack, multi-role web application designed for discovering local stores, submitting transparent 1-to-5 star ratings with written reviews, managing store feedback, and administering platform users and listings.

---

## 🏗️ System Architecture Diagram

```mermaid
graph TD
    subgraph Client_Layer ["Client Layer (React 18 + Vite + Tailwind CSS)"]
        UI_Landing["Public Landing Page & Showcase"]
        UI_Auth["Authentication Flow<br/>(Login, Register, Password Reset)"]
        UI_AdminDash["Admin Dashboard<br/>(Metrics, User CRUD, Store CRUD)"]
        UI_OwnerDash["Store Owner Hub<br/>(Store Analytics, Customer Feedback)"]
        UI_UserDash["Normal User Dashboard<br/>(Store Explorer, Star Ratings, Reviews)"]
    end

    subgraph API_Gateway ["API Routing & Security Layer (Express + Node.js)"]
        MW_Cors["CORS & Request Parsing"]
        MW_Auth["JWT Authentication Middleware"]
        MW_RBAC["Role-Based Access Control (RBAC)"]
        MW_Zod["Zod Input Validation Middleware"]
    end

    subgraph Backend_Services ["Business Logic & Controllers"]
        Ctrl_Auth["Auth Service & Controller<br/>• Register & Login<br/>• JWT Tokens<br/>• Password Updates"]
        Ctrl_Store["Store Service & Controller<br/>• Listing & Search<br/>• Sorting & Filtering<br/>• Store Management"]
        Ctrl_Rating["Rating & Review Service<br/>• 1-5 Star Upserts<br/>• Written Reviews<br/>• Owner Feedback Retrieval"]
        Ctrl_Admin["Admin Service & Controller<br/>• Platform Metrics<br/>• User CRUD<br/>• Store Assignment"]
    end

    subgraph Database_Layer ["Persistence Layer (PostgreSQL + Prisma ORM)"]
        DB_User[("User Entity<br/>• Admin, Owner, Normal User")]
        DB_Store[("Store Entity<br/>• Name, Email, Address, Owner")]
        DB_Rating[("Rating & Review Entity<br/>• Value 1-5, Comment, User, Store")]
        DB_Token[("Password Reset Token Entity")]
    end

    %% Client to API
    UI_Landing -->|HTTP Requests| MW_Cors
    UI_Auth -->|Sign In / Up| MW_Cors
    UI_AdminDash -->|Bearer Token Requests| MW_Cors
    UI_OwnerDash -->|Bearer Token Requests| MW_Cors
    UI_UserDash -->|Bearer Token Requests| MW_Cors

    MW_Cors --> MW_Auth
    MW_Auth --> MW_RBAC
    MW_RBAC --> MW_Zod

    %% API to Controllers
    MW_Zod --> Ctrl_Auth
    MW_Zod --> Ctrl_Store
    MW_Zod --> Ctrl_Rating
    MW_Zod --> Ctrl_Admin

    %% Controllers to Database Layer via Prisma
    Ctrl_Auth --> DB_User
    Ctrl_Auth --> DB_Token
    Ctrl_Store --> DB_Store
    Ctrl_Rating --> DB_Rating
    Ctrl_Rating --> DB_Store
    Ctrl_Admin --> DB_User
    Ctrl_Admin --> DB_Store
    Ctrl_Admin --> DB_Rating
```

---

## 🗄️ Database Entity Relationship Diagram (ERD)

```mermaid
erDiagram
    USER ||--o{ STORE : "owns (StoreOwner)"
    USER ||--o{ RATING : "submits (UserRatings)"
    USER ||--o{ PASSWORD_RESET_TOKEN : "has"
    STORE ||--o{ RATING : "receives"

    USER {
        string id PK
        string name "6-60 chars"
        string email UK
        string passwordHash
        string address "Max 400 chars"
        enum role "SYSTEM_ADMIN | STORE_OWNER | NORMAL_USER"
        datetime createdAt
        datetime updatedAt
    }

    STORE {
        string id PK
        string name
        string email UK
        string address "Max 400 chars"
        string ownerId FK
        datetime createdAt
        datetime updatedAt
    }

    RATING {
        string id PK
        int value "1 to 5 Stars"
        string comment "Optional Review"
        string userId FK
        string storeId FK
        datetime createdAt
        datetime updatedAt
    }

    PASSWORD_RESET_TOKEN {
        string id PK
        string token UK
        string userId FK
        datetime expiresAt
        datetime createdAt
    }
```

---

## 👥 Role-Based Access Control (RBAC) Matrix

| Feature / Action | System Admin | Store Owner | Normal User | Public / Guest |
| :--- | :---: | :---: | :---: | :---: |
| **Browse Stores & Search Directory** | ✅ | — | ✅ | ✅ |
| **Switch Card Grid / Table List UI** | ✅ | — | ✅ | — |
| **Read Other People's Reviews** | ✅ | ✅ | ✅ | — |
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
