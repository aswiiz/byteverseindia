# ByteVerse — Ideas Into Digital Reality

> A modern, responsive, production-ready portfolio and technology project showcase website built with Node.js, Express, React 19, TypeScript, MongoDB Atlas, and the Telegram Bot API. Ready for single-click deployment to Vercel.

---

## 1. Project Overview

**ByteVerse** is a technology brand and software showcase portfolio where visitors explore engineering projects, discover technologies used, view interactive screenshots, access GitHub repositories and live production demos, and submit project enquiries.

- **Public Contact Email:** `byteverseindia.in@gmail.com`
- **Admin Email:** `aswinraj@gmail.com`
- **Instagram Account:** [`@byteverse.in`](https://instagram.com/byteverse.in)
- **Deployment Targets:** Vercel Serverless / Node.js Container / Docker

---

## 2. Key Features

- **High-Fidelity Visual Design:** Deep midnight navy and dark surfaces with electric blue, violet, and subtle cyan highlights inspired by Vercel, Stripe, and Apple. Adheres to zero-pill metadata discipline and WCAG AA contrast.
- **Dynamic Project Showcase:** Loaded dynamically from MongoDB Atlas with category filters (Cloud & DevOps, Mobile & AI, Web Applications, Enterprise Tools, Open Source) and live keyword search.
- **Dedicated Project Modals & Details:** Includes problem statements, key technical features, tech stacks, GitHub/Demo links, and related projects.
- **Real-Time Telegram Bot Notifications:** Enquiries submitted through the website are instantly dispatched to the administrator's Telegram via server-side bot webhooks with HTML escaping and safe error fallback.
- **Hidden Admin Entry Point:** Clicking the **BYTEVERSE** wordmark in the footer 5 times within 3.5 seconds activates the admin authentication terminal. Direct URL access (`/admin/login`) is also supported.
- **Protected Admin Dashboard:**
  - System overview & telemetry statistics (Total Projects, Featured, Published, Enquiries).
  - Full Project CRUD: create, edit, delete with confirmation, live preview, toggle featured/published status.
  - Image management: validated uploads (< 3MB, MIME checks) and data-URI/URL storage.
  - Enquiry management: view visitor inquiries, change status (new/read/replied/archived), and delete entries.
  - One-click Telegram test button to verify bot credentials.
  - One-click "Download Complete Vercel ZIP" package.

---

## 3. Technology Stack

- **Frontend:** React 19, TypeScript, Tailwind CSS v4, Lucide Icons
- **Backend:** Node.js, Express.js
- **Database:** MongoDB Atlas using Mongoose (with in-memory fallback store when URI is not configured)
- **Notification:** Telegram Bot API
- **Deployment Platform:** Vercel (serverless routing via `vercel.json` and `api/index.js`)

---

## 4. Environment Variables Setup

Create a `.env` file in the root directory based on `.env.example`:

```env
NODE_ENV=development
PORT=3000

# MongoDB Atlas Database Connection URI (Mongoose)
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/byteverse?retryWrites=true&w=majority

# Administrator Credentials
ADMIN_EMAIL=aswinraj@gmail.com
ADMIN_PASSWORD=your_strong_admin_password_here

# Telegram Bot API for Instant Enquiry Notifications
TELEGRAM_BOT_TOKEN=123456789:ABCdefGHIjklMNOpqrSTUvwxYZ
TELEGRAM_CHAT_ID=123456789

# Session Security & Encryption Secret
SESSION_SECRET=your_jwt_or_session_secret_key

# Public Contact & Brand Reference
PUBLIC_CONTACT_EMAIL=byteverseindia.in@gmail.com
PUBLIC_INSTAGRAM=byteverse.in
```

---

## 5. MongoDB Atlas Setup

1. Create a free cluster on [MongoDB Atlas](https://www.mongodb.com/atlas).
2. Under **Database Access**, create a user with read and write privileges.
3. Under **Network Access**, add `0.0.0.0/0` (Allow access from anywhere) so Vercel serverless functions can connect.
4. Copy the connection string and paste it into `MONGODB_URI` in `.env` (or Vercel environment variables).

> **Note:** If `MONGODB_URI` is left blank, ByteVerse will automatically run using its built-in resilient in-memory fallback store. The app will never crash and remains 100% functional.

---

## 6. Telegram Bot Setup

1. Open Telegram and search for `@BotFather`.
2. Send `/newbot` and follow the prompts to obtain your `TELEGRAM_BOT_TOKEN`.
3. Search for `@userinfobot` or `@raw_data_bot` on Telegram and send a message to retrieve your numeric `TELEGRAM_CHAT_ID`.
4. Add these two values to your `.env` file or Vercel environment variables.
5. In the ByteVerse Admin Dashboard under **System & Deployment Tools**, click **"Send Diagnostic Telegram Message"** to verify communication.

---

## 7. Local Development & Installation

```bash
# 1. Clone repository
git clone https://github.com/byteverse-org/byteverse.git
cd byteverse

# 2. Install dependencies
npm install

# 3. Configure environment
cp .env.example .env
# Fill in your variables in .env

# 4. Start local development server (Express + Vite on Port 3000)
npm run dev

# 5. Open in browser
http://localhost:3000
```

---

## 8. Vercel Deployment Guide

1. Push your code to GitHub.
2. In the [Vercel Dashboard](https://vercel.com), click **Add New Project** and select your repository.
3. Framework Preset: **Vite**
4. Build Command: `npm run build`
5. Output Directory: `dist`
6. Add the Environment Variables:
   - `MONGODB_URI`
   - `ADMIN_EMAIL` (`aswinraj@gmail.com`)
   - `ADMIN_PASSWORD` (strong password)
   - `TELEGRAM_BOT_TOKEN`
   - `TELEGRAM_CHAT_ID`
   - `SESSION_SECRET`
7. Click **Deploy**. Vercel will build the frontend and deploy the serverless routes defined in `vercel.json` and `api/index.js`.

---

## 9. Admin Login & Credentials

- **Direct URL:** `/admin/login`
- **Hidden Footer Trigger:** Click the **BYTEVERSE** wordmark in the footer 5 times quickly.
- **Default Email:** `aswinraj@gmail.com`
- **Default Password:** `ByteVerse@2026!` (configured via `ADMIN_PASSWORD` environment variable)

---

## 10. Security Best Practices Implemented

- Server-side bearer token authentication on all management routes (`POST`, `PUT`, `DELETE`).
- IP-based rate limiting on login attempts to mitigate brute-force attacks.
- Strict MIME and file-size validation (< 3MB) for image uploads.
- Complete HTML escaping of user inputs before transmitting to the Telegram Bot API.
- Sensitive environment variables (`TELEGRAM_BOT_TOKEN`, `ADMIN_PASSWORD`) are never exposed to the client bundle.

---

## 11. Support & Community

- **Email:** [byteverseindia.in@gmail.com](mailto:byteverseindia.in@gmail.com)
- **Instagram:** [@byteverse.in](https://instagram.com/byteverse.in)
