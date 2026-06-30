# Browser PDF Tools

**Privacy-first PDF tools that run entirely in your browser.**

Merge, split, compress, convert, edit, and secure PDFs — 30+ tools, free to use. Your files are processed locally on your device and are never uploaded to a server.

---

## Why this project?

Most online PDF tools upload your documents to a server. This app does the opposite: **all PDF processing happens client-side** in the browser. That means:

- No file uploads or server-side document storage
- Works offline after the page loads (for most tools)
- Full control over your documents

Optional user accounts let you sign in to save preferences and sync settings across devices. PDF files themselves still never leave your browser.

---

## Features

### Organize PDF

| Tool | Description |
|------|-------------|
| **Merge PDF** | Combine multiple PDFs in the order you want |
| **Split PDF** | Split into individual pages (ZIP) or extract a page range |
| **Rotate PDF** | Rotate pages to any angle (-180° to 180°) |
| **Organize PDF** | Drag to reorder pages, delete unwanted pages |

### Optimize PDF

| Tool | Description |
|------|-------------|
| **Compress PDF** | Reduce file size (light / medium / high quality) |
| **Repair PDF** | Attempt to fix damaged or corrupt PDF files |

### Convert from PDF

| Tool | Description |
|------|-------------|
| **PDF to Word** | Convert to editable DOCX (with OCR for scanned pages) |
| **PDF to Excel** | Extract tabular data into spreadsheets |
| **PDF to PowerPoint** | Turn each page into a slide |
| **PDF to JPG** | Export pages as JPG or PNG images |
| **PDF to PDF/A** | Convert to archive-ready PDF/A format |

### Convert to PDF

| Tool | Description |
|------|-------------|
| **Word to PDF** | Convert DOCX documents to PDF |
| **Excel to PDF** | Convert spreadsheets to PDF |
| **PowerPoint to PDF** | Convert presentations to PDF |
| **JPG to PDF** | Combine images into a single PDF |
| **HTML to PDF** | Save web pages as PDF |

### Edit PDF

| Tool | Description |
|------|-------------|
| **Edit PDF** | Add text annotations to pages |
| **Sign PDF** | Place your signature image on selected pages |
| **Watermark** | Stamp text with custom opacity and angle |
| **Page numbers** | Add formatted page numbers (top or bottom) |
| **Redact PDF** | Permanently remove sensitive content |
| **Crop PDF** | Trim margins from PDF pages |
| **PDF Forms** | Create fillable PDF forms |

### PDF Security

| Tool | Description |
|------|-------------|
| **Protect PDF** | Add password protection |
| **Unlock PDF** | Remove password when you know it |

### PDF Intelligence

| Tool | Description |
|------|-------------|
| **OCR PDF** | Extract text from scanned pages (Tesseract.js) |
| **Scan to PDF** | Capture documents from your device camera |
| **Compare PDF** | View two PDFs side by side |
| **AI Summarizer** | Generate concise document summaries |
| **Translate PDF** | Translate content while preserving layout |

### User accounts (optional)

- Email/password sign-up and login
- Sign in with Google (OAuth)
- Accounts are optional — all tools work without logging in

### Owner admin dashboard

A **separate Next.js app** in the `admin/` folder provides an owner-only analytics dashboard:

- Active users (anonymous and logged-in)
- Tool usage stats (views, completions, files processed)
- Sign-up and login counts
- 7-day activity chart and recent events feed

Analytics collect **metadata only** (tool name, file count, file size). No file content or filenames are stored.

---

## Tech stack

| Layer | Technology |
|-------|------------|
| Framework | [Next.js 16](https://nextjs.org/) (App Router) |
| UI | [React 19](https://react.dev/) + [Tailwind CSS 4](https://tailwindcss.com/) |
| Auth | [Auth.js](https://authjs.dev/) (NextAuth v5) |
| Database | [Prisma](https://www.prisma.io/) + SQLite |
| PDF core | [pdf-lib](https://pdf-lib.js.org/), [PDF.js](https://mozilla.github.io/pdf.js/) |
| OCR | [Tesseract.js](https://tesseract.projectnaptha.com/) |
| Office formats | docx, xlsx, mammoth, pptxgenjs |
| File UX | react-dropzone |

---

## Getting started

### Prerequisites

- Node.js 18+
- npm

### Install

```bash
git clone https://github.com/yourusername/browser-pdf-tools.git
cd browser-pdf-tools
npm install
```

`npm install` copies the PDF.js worker to `public/` and generates the Prisma client.

### Environment variables

Copy `.env.example` to `.env.local` in the project root:

```bash
cp .env.example .env.local
```

Fill in the values:

```env
# Required for auth
AUTH_SECRET=your-random-secret

# Database (SQLite, created on first push)
DATABASE_URL="file:./dev.db"

# Google OAuth (optional — for Sign in with Google)
AUTH_GOOGLE_ID=your-google-client-id
AUTH_GOOGLE_SECRET=your-google-client-secret

# Public site URL (SEO)
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

Generate `AUTH_SECRET`:

```bash
npx auth secret
```

For Google OAuth, create credentials at [Google Cloud Console](https://console.cloud.google.com/) and add this redirect URI:

```
http://localhost:3000/api/auth/callback/google
```

### Database setup

```bash
npm run db:push
```

### Run the main app

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Run the admin dashboard

Create `admin/.env.local` (see `admin/.env.example`):

```env
AUTH_SECRET=same-value-as-main-app
DATABASE_URL="file:./dev.db"
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=your-secure-password
```

Start the admin app (runs on port **3001**):

```bash
npm run dev:admin
```

Open [http://localhost:3001](http://localhost:3001) and sign in with the admin email and password.

> **Change the default admin password before deploying to production.**

### Production build

```bash
# Main app
npm run build
npm start

# Admin dashboard
npm run build:admin
npm run start --prefix admin
```

---

## Available scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start main app (port 3000) |
| `npm run dev:admin` | Start admin dashboard (port 3001) |
| `npm run build` | Production build for main app |
| `npm run build:admin` | Production build for admin app |
| `npm run db:push` | Sync Prisma schema to database |
| `npm run db:studio` | Open Prisma Studio (database GUI) |

---

## Project structure

```
browser-pdf-tools/
├── admin/                  # Separate owner dashboard (port 3001)
│   └── src/
│       ├── app/            # Admin pages & API routes
│       └── components/     # Dashboard UI
├── prisma/
│   └── schema.prisma       # User, auth, and analytics models
├── public/                 # Static assets & PDF.js worker
├── scripts/                # Post-install setup
└── src/
    ├── app/                # Next.js routes (tools, auth, API)
    ├── components/         # UI, tools, layout, auth
    └── lib/                # Tool registry, SEO, PDF utils, analytics
```

---

## Privacy

**PDF files are never uploaded.** All document processing runs locally in your browser.

The app collects **anonymous usage metadata** (which tools are used, file counts and sizes) to power the owner dashboard. No file content, filenames, or document data is sent to the server.

If you use optional accounts, we store your email and profile info for authentication only.

---

## License

MIT (or add your preferred license).
