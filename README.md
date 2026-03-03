# 📌 Smart Bookmark App

A private real-time bookmark manager built using **Next.js (App Router)** and **Supabase (Auth, Database, Realtime)**, deployed on **Vercel**.

---

## 🚀 Live Demo

🔗 [https://smart-bookmark-webapp-lilac.vercel.app ](https://smart-bookmark-webapp-lilac.vercel.app/) 
(Currrently, 02-03-2026 onwards the Supabase is down can't able to access)

---

## 🛠 Tech Stack

- **Frontend:** Next.js 16 (App Router)
- **Authentication:** Supabase Auth (Google OAuth only)
- **Database:** Supabase PostgreSQL
- **Security:** Row Level Security (RLS)
- **Realtime:** Supabase Realtime (Postgres Changes)
- **Styling:** Tailwind CSS
- **Deployment:** Vercel
- **Version Control:** Git & GitHub

---

## ✨ Features

- 🔐 Google OAuth login (no email/password)
- 📌 Add bookmarks (title + URL)
- 🗑 Delete bookmarks
- 👤 Bookmarks are private per user
- ⚡ Real-time updates across multiple tabs
- ☁️ Fully deployed on Vercel

---


No custom backend server was required because Supabase handles:

- Authentication
- Authorization (RLS)
- Database
- Realtime events

---

# 🔒 Security Implementation

Row Level Security (RLS) was enabled on the `bookmarks` table.

Policies created:

### SELECT
### INSERT
### DELETE

# Problems Faced & Solutions
## problems: Google login worked locally but failed after deployment.
## Cause: Production URL was not added to Google OAuth Authorized Origins.

## problem: supabaseUrl is required
## Cause: Environment variables were not configured in Vercel.


### Local Setup
git clone https://github.com/your-username/smart-bookmark-app.git
cd smart-bookmark-app

### Dependencies:
npm install

### create .env.local:
NEXT_PUBLIC_SUPABASE_URL=your_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key

### Run:
npm run dev
