# ARevents Frontend (Next.js + TypeScript)

This is the frontend of the ARevents application — a platform to discover, create, and manage events. Built using Next.js App Router, TailwindCSS, and TypeScript.

## 🚀 Key Features

- Role-based Auth (Customer / Organizer)
- Event Listing with Search & Filter
- Protected Routes per Role
- Event Creation with Image Upload (Organizer)
- Event Voucher Creation (Per Event)
- Checkout & Payment Proof Upload (Customer)
- Countdown Timer & Transaction Status
- Referral Code at Registration
- Organizer Dashboard with Statistics & Attendee List
- Profile Editing, Points & Coupons
- Fully Responsive (Mobile & Desktop)

## 🧪 Tech Stack

- Next.js 13+ (App Router)
- TailwindCSS
- Redux Toolkit
- Axios with Interceptors
- React-Hot-Toast, Chart.js

## ⚙️ Local Setup

```bash
pnpm install
pnpm dev
```

Create `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:8080/api
```

## 🌐 Deployment

Frontend is live at:  
👉 https://miniproject-web.vercel.app
