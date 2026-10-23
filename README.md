<div align="center">
  <h1>📄 FileConvert</h1>
  <p><em>Modern, high-performance, and serverless web platform for advanced PDF manipulation and multi-format image conversion.</em></p>
  
  <p>
    <img alt="Next.js" src="https://img.shields.io/badge/Next.js-16.1-000000?style=for-the-badge&logo=next.js&logoColor=white" />
    <img alt="React" src="https://img.shields.io/badge/React-19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" />
    <img alt="Tailwind CSS" src="https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" />
    <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript&logoColor=white" />
    <img alt="Supabase" src="https://img.shields.io/badge/Supabase-Database%20%26%20Storage-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white" />
    <img alt="pdf-lib" src="https://img.shields.io/badge/pdf--lib-1.17-E53E3E?style=for-the-badge&logo=adobe-acrobat-reader&logoColor=white" />
  </p>
</div>

<br />

**FileConvert** is a full-featured, serverless file-processing platform engineered for speed, privacy, and visual excellence. Featuring a complete suite of PDF and image utilities, it enables users to convert, merge, split, edit, organize, protect, unlock, and number documents directly in the browser—with seamless anonymous conversion and optional user authentication.

---

## 🚀 Complete Tools Suite

FileConvert brings together 8 specialized tools into an integrated, unified workspace:

### 📑 PDF Utilities

1. **🔢 Number PDF (`/tools/number-pdf`)**
   - **Custom Numbering Formats:** Add page numbers using standard (`1`), hyphens (`- 1 -`), words (`Page 1`, `Page 1 of X`), brackets (`[ 1 ]`), or tildes (`~ 1 ~`).
   - **Cardinal Placement:** 6 positions (Top-Left, Top-Center, Top-Right, Bottom-Left, Bottom-Center, Bottom-Right).
   - **Visual Customization:** Font size (8 to 72 pt), fonts (Arial, Helvetica, Times Roman, Courier New), text color picker, and optional badge shapes (rounded pills, rectangles).
   - **WYSIWYG Live Preview:** Exact proportional rendering matching point-for-point preview coordinates to the downloaded PDF.

2. **✍️ Edit PDF (`/tools/edit-pdf`)**
   - **Interactive Multi-Layer Canvas:** Insert customizable text with font size, color, alignments, and typography styles (bold, italic, underline).
   - **Shapes & Redactions:** Draw opaque boxes or ellipses to mask sensitive information or highlight content.
   - **Images & Digital Signatures:** Upload transparent PNG/JPG logos and signatures, or sign directly with the freehand drawing pad.
   - **Watermark Stamps & Layer Management:** Apply diagonal or centered watermark stamps and manage layer order ($z$-index) with one-click reordering and deletion.

3. **✂️ Split PDF (`/tools/split-pdf`)**
   - **Dual Splitting Modes:** Split by custom page ranges (e.g., `1-3, 5, 8-10`) or by fixed intervals (e.g., split every 2 pages).
   - **Interactive Page Extraction:** Visual thumbnail grid to toggle individual pages, with real-time two-way synchronization to the page input field.
   - **Optional Merge on Split:** Combine extracted pages into a single output PDF or download individual documents.

4. **📑 Merge PDF (`/tools/merge-pdf`)**
   - **Seamless Document Concatenation:** Combine multiple PDF documents into a single consolidated file in seconds.
   - **Drag-and-Drop Sequencing:** Reorder documents intuitively before merging.
   - **Page Rotation:** Rotate individual documents in 90° increments before processing.

5. **🗂️ Organize PDF (`/tools/organize-pdf`)**
   - **Visual Page Manager:** Full interactive grid of pages rendered with client-side canvas via `pdfjs-dist`.
   - **Reordering & Deletion:** Drag and drop pages to rearrange document flow; remove unnecessary pages with a single click.
   - **Rotation & Blank Page Injection:** Rotate pages independently and insert blank pages at any position.

6. **🔒 Protect PDF (`/tools/protect-pdf`)**
   - **Document Encryption:** Secure PDF files with robust AES password encryption.
   - **Real-Time Strength Meter:** Client-side password validation checking length, uppercase, numbers, and special characters.

7. **🔓 Unlock PDF (`/tools/unlock-pdf`)**
   - **Restriction Removal:** Decrypt protected documents by providing the correct password to restore full access.

---

### 🖼️ Image Utilities

8. **🔄 Image Converter (`/tools/image-converter`)**
   - **Multi-Format Conversions:** Convert bidirectionally between **JPEG, PNG, WEBP, AVIF, TIFF, GIF, and PDF**.
   - **PDF to Image Conversion:** Multi-page PDF documents are rendered with high-fidelity PyMuPDF and automatically stitched vertically into image outputs.
   - **Staged File Queue:** Drag and drop multiple images or PDFs, set individual or bulk target formats, preview thumbnails, and convert simultaneously.

---

## ✨ Key Features & Architectural Highlights

- 🎨 **Modern Design & Glassmorphism:** Clean dark-mode interface built with Tailwind CSS v4, subtle borders, frosted glass effects, and fluid micro-animations.
- 🌓 **Instant Theme Toggle:** Smooth theme transition (Light / Dark) powered by `ThemeContext` and persisted in `localStorage`.
- 🕵️ **Anonymous-First Processing:** Perform conversions immediately without requiring an account.
- 🔐 **Optional User Authentication:** Supabase Auth integration with Sign In, Sign Up, profile management, and session-refreshing middleware.
- 📊 **Conversion History & Queue:** Live status badges (`pending`, `processing`, `completed`, `failed`), human-readable file sizes (B, KB, MB), instant download links, and bulk clearing.
- 🧹 **Automated Storage Cleanup (Cron):** Serverless cron endpoint (`/api/cron/cleanup`) that automatically purges files older than 24 hours from both Supabase Storage and PostgreSQL.
- 📱 **Fully Responsive:** Tested and optimized across mobile, tablet, and ultra-wide screens.

---

## 🛠️ Tech Stack

| Layer | Technologies |
| :--- | :--- |
| **Framework** | [Next.js 16](https://nextjs.org/) (App Router, Server Components, Route Handlers) |
| **Frontend Library** | [React 19](https://react.dev/) |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/) + Google Material Symbols |
| **Language** | [TypeScript 5](https://www.typescriptlang.org/) (Strict typing) |
| **Backend & Storage** | [Supabase](https://supabase.com/) (PostgreSQL + Storage Buckets + Auth) |
| **PDF Engines** | [pdf-lib](https://pdf-lib.js.org/), [pdfjs-dist](https://mozilla.github.io/pdf.js/), [PyPDF2](https://pypi.org/project/pypdf2/) |
| **Image Engines** | [Sharp](https://sharp.pixelplumbing.com/), [PyMuPDF](https://pymupdf.readthedocs.io/) |
| **Notifications** | [react-hot-toast](https://react-hot-toast.com/) |

---

## 📁 Project Structure

```text
app-conversor-next/
├── public/                          # Static assets and favicons
├── src/
│   ├── app/                         # Next.js App Router
│   │   ├── api/                     # Serverless endpoints
│   │   │   ├── conversions/         # Conversion queries and deletion
│   │   │   ├── cron/cleanup/        # 24-hour file cleanup cron
│   │   │   ├── pdf/                 # PDF routes (edit, merge, split, organize, protect, unlock, number)
│   │   │   └── process/             # Image processing and multi-page rendering
│   │   ├── auth/                    # Login and Signup pages
│   │   ├── dashboard/               # Main workspace / image converter view
│   │   ├── history/                 # Full conversion history view
│   │   ├── tools/                   # Dedicated tool routes:
│   │   │   ├── edit-pdf/
│   │   │   ├── image-converter/
│   │   │   ├── merge-pdf/
│   │   │   ├── number-pdf/
│   │   │   ├── organize-pdf/
│   │   │   ├── protect-pdf/
│   │   │   ├── split-pdf/
│   │   │   └── unlock-pdf/
│   │   └── (legal & info pages)     # /about, /contact, /faq, /help-center, /privacy, /terms
│   ├── components/                  # Modular React components
│   │   ├── dashboard/               # Staged files list, action bar, zoom modal
│   │   ├── history/                 # History table, stats cards, filters
│   │   ├── landing/                 # Modular landing page sections
│   │   ├── layout/                  # Header, Footer, Sidebar, ThemeToggle
│   │   ├── shared/                  # ConversionsQueue, FileUploader, PasswordInput
│   │   └── tools/                   # Shared tool workspace components
│   ├── context/                     # AuthContext and ThemeContext
│   ├── hooks/                       # Decoupled UI hooks per tool (useDashboardUI, useMergeUI, etc.)
│   ├── lib/
│   │   ├── python/                  # Python helper scripts (pdf_crypto.py, pdf_to_image.py)
│   │   └── supabase/                # Browser and Server Supabase clients
│   ├── services/                    # Client-side API conversion service
│   └── types/                       # TypeScript interfaces and DTOs
├── .env.example                     # Environment variables template
├── package.json
└── README.md
```

---

## ⚙️ Getting Started

### 1. Prerequisites

Ensure you have the following installed on your system:
- **Node.js**: `v20.x` or later
- **Package Manager**: `npm`, `pnpm`, or `yarn`
- **Python**: `3.9+` (required for PDF encryption/decryption and PDF-to-image rendering)
- **Supabase Account**: A free project on [Supabase](https://supabase.com/)

Install the required Python packages:
```bash
pip install PyPDF2 pymupdf
```

### 2. Clone the Repository

```bash
git clone https://github.com/WalterMartinez20/app-files-converter-next.git
cd app-files-converter-next
```

### 3. Install Node Dependencies

```bash
npm install
```

### 4. Configure Environment Variables

Create a `.env.local` file in the root directory based on `.env.example`:

```bash
cp .env.example .env.local
```

Fill in your Supabase credentials:

```env
# Supabase Public Configuration (Accessible in browser)
NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"

# Supabase Service Role Key (Server-only / Cron operations)
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"
```

---

## 🗄️ Database & Storage Setup (Supabase SQL)

Because the project utilizes anonymous and authenticated conversions without uploading sensitive database credentials to GitHub, configure your Supabase project directly using the SQL script below.

### How to apply:
1. Go to your **[Supabase Dashboard](https://supabase.com/dashboard)**.
2. Select your project and navigate to **SQL Editor** in the left sidebar.
3. Paste and run the following SQL script:

```sql
-- ====================================================================
-- FileConvert: Database Schema, Indexes, RLS Policies & Storage Bucket
-- ====================================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Create the Conversions Table
CREATE TABLE IF NOT EXISTS public.conversions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL, -- Nullable to allow anonymous guest conversions
    file_name TEXT NOT NULL,
    original_format TEXT NOT NULL,
    target_format TEXT NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
    file_size BIGINT NOT NULL DEFAULT 0,
    storage_path TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. High-Performance Indexes
CREATE INDEX IF NOT EXISTS idx_conversions_user_id ON public.conversions(user_id);
CREATE INDEX IF NOT EXISTS idx_conversions_created_at ON public.conversions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_conversions_status ON public.conversions(status);

-- 4. Enable Row Level Security (RLS) on Conversions Table
ALTER TABLE public.conversions ENABLE ROW LEVEL SECURITY;

-- 5. RLS Policies for Conversions Table
-- Allow all users (anonymous and authenticated) to create records
CREATE POLICY "Allow public insert to conversions"
    ON public.conversions FOR INSERT
    TO public
    WITH CHECK (true);

-- Allow all users to read conversion records
CREATE POLICY "Allow public select from conversions"
    ON public.conversions FOR SELECT
    TO public
    USING (true);

-- Allow updates (e.g. status transition from pending to processing/completed)
CREATE POLICY "Allow public update to conversions"
    ON public.conversions FOR UPDATE
    TO public
    USING (true)
    WITH CHECK (true);

-- Allow deletions (e.g. users deleting history items)
CREATE POLICY "Allow public delete from conversions"
    ON public.conversions FOR DELETE
    TO public
    USING (true);

-- 6. Configure Storage Bucket ('files')
INSERT INTO storage.buckets (id, name, public, file_size_limit)
VALUES ('files', 'files', true, 104857600) -- 100 MB file limit
ON CONFLICT (id) DO UPDATE SET public = true;

-- 7. Storage RLS Policies for 'files' Bucket
-- Allow uploads to the 'files' bucket
CREATE POLICY "Allow public uploads to files bucket"
    ON storage.objects FOR INSERT
    TO public
    WITH CHECK (bucket_id = 'files');

-- Allow public downloads/reads from the 'files' bucket
CREATE POLICY "Allow public read from files bucket"
    ON storage.objects FOR SELECT
    TO public
    USING (bucket_id = 'files');

-- Allow updates in the 'files' bucket
CREATE POLICY "Allow public update to files bucket"
    ON storage.objects FOR UPDATE
    TO public
    USING (bucket_id = 'files')
    WITH CHECK (bucket_id = 'files');

-- Allow deletions in the 'files' bucket (for user deletion & automated 24h cron)
CREATE POLICY "Allow public delete from files bucket"
    ON storage.objects FOR DELETE
    TO public
    USING (bucket_id = 'files');
```

---

## 🏃 Running the Application

### Development Mode

Run the Next.js development server with Turbopack:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build

Create an optimized production build:

```bash
npm run build
npm run start
```

### Code Quality & Linting

```bash
npm run lint
```

---

## 🧹 Automated 24h File Cleanup

To keep storage usage minimal, FileConvert includes a serverless cleanup endpoint at `/api/cron/cleanup`.

When triggered, it queries the `conversions` table for files older than 24 hours, deletes the files from Supabase Storage (`files` bucket), and removes the records from the database.

You can trigger this endpoint automatically using:
- **Vercel Cron Jobs** (via `vercel.json`)
- **GitHub Actions**
- An external cron service (such as [cron-job.org](https://cron-job.org/)) pointing to:
  ```http
  GET https://your-domain.com/api/cron/cleanup
  ```

---

## 👨‍💻 Author

**Walter Martínez** - Systems Engineering Student at *Universidad Gerardo Barrios* (El Salvador).

- 💼 [LinkedIn](https://www.linkedin.com/in/walter-mart%C3%ADnez-4712162b7)
- 🐙 [GitHub](https://github.com/WalterMartinez20)

---

<div align="center">
  <p>Built with precision, performance, and attention to detail.</p>
</div>
