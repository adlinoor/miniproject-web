# Mini Project Web

This is the frontend of a minimal event management platform built using Next.js. Users can discover events, register with referral codes, and organizers can manage events from a dedicated dashboard.

## 🧩 Tech Stack

- Next.js 14 App Router
- TypeScript
- Tailwind CSS
- Redux Toolkit (Auth State)
- React Hook Form + Zod (Validation)
- Axios
- Cloudinary (for profile image upload)

## 🚀 Features

### Feature 1 – Event Experience
- Landing page with upcoming events
- Search and filter with debounce
- Event detail view
- Transaction flow with file upload (proof of payment)
- Countdown timer and error handling

### Feature 2 – User System
- Register / login with referral
- Profile management with optional profile picture
- Role-based routes (organizer vs customer)
- Notification with react-hot-toast

### Feature 3 – Organizer Dashboard
- Manage events (CRUD)
- View and manage attendees
- View transactions and approve/reject payments
- Chart-based statistics view

## 🛠 How to Run

```bash
# 1. Clone & Install
git clone https://github.com/adlinoor/miniproject-web.git
cd miniproject-web
npm install

# 2. Setup Environment
cp .env.example .env
# Add NEXT_PUBLIC_API_URL, Cloudinary keys (if used)

# 3. Run Dev Server
npm run dev
```

## 🧪 Testing

Manual testing through UI with protected routes and role logic. Form validation tested using Zod schema.

## 🌍 Live Demo

- Frontend: [https://miniproject-web.vercel.app](https://miniproject-web.vercel.app)
- Backend API: [https://miniproject-api-five.vercel.app](https://miniproject-api-five.vercel.app)
