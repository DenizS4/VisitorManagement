# 🏢 Visitor Management System

A modern **Visitor Management Platform** built with a **serverless architecture using Next.js**, powered by **Supabase (PostgreSQL)** for authentication, authorization, and data storage.

This application is designed to help companies, factories, and offices efficiently **track, manage, and control visitor access**.

---

## 🚀 Features

### 🔐 Authentication & Authorization

* Secure user authentication via Supabase
* Role-based access control (admin / staff)
* Session handling with Supabase Auth

### 📝 Visitor Management

* Register new visitors
* Assign **visitor pass cards**
* Track **entry & exit timestamps**
* Store visitor details (name, contact info, purpose of visit, etc.)
* Maintain historical records

### 🏭 Facility Use Cases

* Suitable for:

  * Factories / plants
  * Corporate offices
  * Warehouses
  * Any controlled-access facility

### 📊 Data Handling

* All visitor data stored in PostgreSQL (via Supabase)
* Real-time updates (if enabled)
* Centralized and scalable backend

### 🎨 UI / UX

* Clean and responsive interface using Tailwind CSS
* Fast navigation with Next.js App Router
* Optimized rendering strategies

---

## 🧱 Tech Stack

### Frontend

* **Next.js (App Router)**

  * Server Components
  * Client Components
  * Route Handlers (API routes)
  * Middleware (for auth protection)
  * Dynamic & static rendering
* **React**
* **Tailwind CSS**

### Backend (Serverless)

* **Supabase**

  * PostgreSQL database
  * Authentication (Auth)
  * Authorization (RLS policies)
  * RESTful + Realtime APIs

### Database

* **PostgreSQL**

  * Hosted via Supabase
  * Handles all visitor records and system data

---

## ⚙️ Installation & Setup

### 1. Clone the repository

```bash
git clone https://github.com/DenizS4/VisitorManagement.git
cd VisitorManagement
```

---

### 2. Install dependencies

```bash
npm install
```

---

### 3. Setup Supabase

1. Go to Supabase and create a new project
2. Create your database tables (visitors, users, etc.)
3. Enable authentication
4. Get your project credentials from:

   * Project URL
   * Anon Key
   * Database connection info

---

### 4. Create `.env` file

Create a `.env` file in the root of the project and fill it like this:

```env
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
NEXT_PUBLIC_SUPABASE_URL=your_project_url

POSTGRES_DATABASE=postgres
POSTGRES_HOST=your_db_host
POSTGRES_PASSWORD=your_db_password
POSTGRES_PRISMA_URL=your_prisma_url
POSTGRES_URL=your_postgres_url
POSTGRES_URL_NON_POOLING=your_non_pooling_url
POSTGRES_USER=postgres

SUPABASE_JWT_SECRET=your_jwt_secret
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
SUPABASE_URL=your_project_url
```

---

### 5. Run the app

```bash
npm run dev
```

---

### 🎉 That’s it

Open your browser:

```
http://localhost:3000
```

Your Visitor Management System should now be live.

---

## 📌 Notes

* Make sure your Supabase project is properly configured before running
* Keep your `.env` file secure — never commit it
* Use `.gitignore` to exclude sensitive data
