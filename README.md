# 📄 FileConvert - Full-Stack PDF & Image Processing Suite

![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)
![React](https://img.shields.io/badge/React-18-blue?logo=react)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.0-38B2AC?logo=tailwind-css)
![Supabase](https://img.shields.io/badge/Supabase-Database_&_Storage-3ECF8E?logo=supabase)
![TypeScript](https://img.shields.io/badge/TypeScript-Ready-3178C6?logo=typescript)

FileConvert is a modern, serverless web application built to demonstrate advanced file manipulation, scalable backend architecture, and secure database management. It allows users to seamlessly edit, split, and merge PDF documents, as well as convert images, entirely in the browser.

## ✨ Features

- **PDF Manipulation:** Merge multiple PDFs, split specific pages, and apply text, redactions, and watermarks dynamically using `pdf-lib`.
- **Anonymous Usage via RLS:** Leverages Supabase Row Level Security (RLS) to allow guests to process files securely without creating an account.
- **Automated Data Pruning:** Implements a serverless Cron Job that automatically deletes files and database records older than 24 hours to optimize storage and ensure privacy.
- **Modern UI/UX:** Built with Tailwind CSS and Next.js App Router for a fully responsive, dark-mode ready, and highly interactive user experience.
- **Authentication Ready:** Includes pre-configured Next.js middleware and Supabase Auth context for future scalability.

## 🏗️ Architecture & Tech Stack

- **Frontend:** Next.js (App Router), React, Tailwind CSS.
- **Backend:** Next.js API Routes (Serverless).
- **Database & Storage:** Supabase (PostgreSQL, Storage Buckets).
- **Document Processing:** `pdf-lib`.
- **Deployment:** Designed for Vercel with integrated cron job support (`vercel.json`).

## 🚀 Getting Started

First, clone the repository and install the dependencies:

```bash
git clone [https://github.com/tu-usuario/tu-repo.git](https://github.com/tu-usuario/tu-repo.git)
cd tu-repo
npm install
```

Set up your environment variables. Create a `.env.local` file in the root directory and add your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

Run the development server:

```bash
npm run dev
```

Open http://localhost:3000 with your browser to see the result.

## 🗄️ Database Setup (Supabase)

To enable anonymous file processing, the following SQL policies must be executed in the Supabase SQL Editor to bypass the default Row Level Security (RLS) restrictions for guests:

```sql
ALTER TABLE public.conversions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow anonymous inserts" ON public.conversions FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "Allow select all" ON public.conversions FOR SELECT TO public USING (true);
CREATE POLICY "Allow update all" ON public.conversions FOR UPDATE TO public USING (true);
CREATE POLICY "Allow delete all" ON public.conversions FOR DELETE TO public USING (true);
```

## 👨‍💻 Author

**Walter** - Engineering Student at Gerardo Barrios University (El Salvador), passionate about building robust backend architectures and scalable full-stack applications.

- [Connect on LinkedIn](https://www.linkedin.com/in/walter-martínez-4712162b7)
- [Follow on GitHub](https://github.com/WalterMartinez20)

---

_This project was created as a technical portfolio demonstration._
