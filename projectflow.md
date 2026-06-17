# Elena Dashboard Project Flow

## Overview

Elena Dashboard is an admin portal built with React, Vite, Tailwind CSS, Redux Toolkit, React Router DOM, and RTK Query. It provides a protected admin experience for Tableli management, including authentication, password recovery, dashboard overview, chef and user management, booking and payout controls, and notifications.

## Technologies

- React 19
- Vite
- Tailwind CSS
- Redux Toolkit / RTK Query
- React Router DOM v7
- React Toastify
- SweetAlert2
- Zod
- Zustand (dependency included)

## App Entry & Shell

- `src/main.jsx`: app entrypoint.
  - Renders `<App />` inside Redux `<Provider store={store}>`.
  - Adds `<ToastContainer />` for toast notifications.
- `src/App.jsx`: route configuration and auth guard.
  - Wraps app in `BrowserRouter`.
  - Renders `Header` and `ScrollToTop`.
  - Defines public auth routes and protected admin routes.
  - Guards `/admin/*` with `ProtectedRoute` based on `localStorage.user`.
  - Redirects root `/` and unknown paths to login or admin depending on auth.

## Routing & Navigation

### Public auth routes

- `/auth/login` → `Login` page.
- `/auth/forget-password` → `ForgotPassword` page.
- `/auth/verify-otp` → `OTPVerification` page.
- `/auth/reset-password` → `ResetPassword` page.

### Protected admin routes

- `/admin/*` → `AdminDashboard` layout.

### Admin dashboard nested routes

- `/admin` → `AdminOverview`
- `/admin/chef-requests` → `ChefVerification`
- `/admin/chefs` → `ManageChefs`
- `/admin/users` → `ManageUsers`
- `/admin/users/:id/bookings` → `UserBookingHistory`
- `/admin/bookings` → `AllBookings`
- `/admin/bookings/:id` → `BookingDetails`
- `/admin/payouts` → `ManagePayouts`
- `/admin/settings` → `AdminSettings`
- `/admin/notifications` → `Notification`

## Authentication Flow

### Login

- `src/pages/Auth/Login.jsx`
- Uses `useLoginMutation` from `redux/api/authApiSlice.js`.
- On success:
  - Saves admin object in `localStorage.user`.
  - Saves `accessToken` and optional `refreshToken` in `localStorage`.
  - Saves tokens in secure cookies.
  - Dispatches `setCredentials` to Redux user slice.
  - Navigates to `/admin`.
- Supports "Remember this device" by storing remembered admin email/password.

### Forgot Password

- `src/pages/Auth/ForgotPassword.jsx`
- Uses `useForgotPasswordMutation`.
- Sends recovery OTP request to `/admin/forgot-password`.
- Stores email in `localStorage.resetEmail`.
- Redirects automatically to `/auth/verify-otp`.

### OTP Verification

- `src/pages/Auth/OTPVerification.jsx`
- Uses `useVerifyOtpMutation` and `useResendOtpMutation`.
- Accepts 6-digit OTP input.
- On success, stores the email and navigates to `/auth/reset-password`.
- Can resend OTP after timer expiry.

### Reset Password

- `src/pages/Auth/ResetPassword.jsx`
- Uses `useResetPasswordMutation`.
- Reads email from `localStorage.resetEmail`.
- Sends new password / confirm password to `/admin/reset-password`.
- Clears reset values and redirects to `/auth/login`.

## Admin Layout & UX

- `src/pages/AdminDashboard/AdminDashboard.jsx` renders the admin layout.
- Desktop sidebar: `AdminSidebar`.
- Mobile bottom navigation: `AdminBottomNav`.
- Header: `src/components/layout/Header.jsx`.
  - Hidden on `/auth/*` pages.
  - Displays current admin name and notification icon.
  - Provides logout button.
- `ScrollToTop` ensures page scroll reset on route changes.

## Core Dashboard Pages

- `AdminOverview.jsx` – admin stats, recent activity, user ratio.
- `ChefVerification.jsx` – review and verify chef requests.
- `ManageChefs.jsx` – manage chef accounts.
- `ManageUsers.jsx` – search, filter, block, delete users.
- `UserBookingHistory.jsx` – view bookings for a specific user.
- `AllBookings.jsx` – list and filter all bookings.
- `BookingDetails.jsx` – view booking details for a single booking.
- `ManagePayouts.jsx` – payout management.
- `AdminSettings.jsx` – admin account and app settings.
- `Notification.jsx` – notifications list and unread indicator.

## State Management & API

### Redux store

- `src/redux/store.js`
  - Configures `apiSlice.reducer` and `user` slice.
  - Adds RTK Query middleware and dev tools.

### Api slice

- `src/redux/api/apiSlice.js`
  - Base URL from `import.meta.env.VITE_BASE_URL` or fallback to `https://api.tableli.com/api/v1`.
  - Adds `Authorization: Bearer <token>` header from `accessToken` or `resettoken`.

### Auth API endpoints

- `src/redux/api/authApiSlice.js`
  - `/admin/admin-login`
  - `/admin/forgot-password`
  - `/admin/otp-verify`
  - `/admin/resend-otp`
  - `/admin/reset-password`
  - `/admin/change-password`

### Admin API

- `src/redux/api/adminApiSlice.js`
  - `/admin/overview`

### User API

- `src/redux/api/userApiSlice.js`
  - `/user/all-users/:role`
  - `/user/single-user/:id`
  - `/user/delete-user/:id`
  - `/user/block-user/:id`

### User slice

- `src/redux/slices/userSlices.js`
  - Tracks `currentUser`, `token`, `refreshToken`, `loading`, and `error`.
  - `setCredentials` and `logout` actions.

## Data Storage & Security

- `localStorage` fields:
  - `user`
  - `accessToken`
  - `refreshToken`
  - `resetEmail`
  - `rememberedAdminEmail`
  - `rememberedAdminPassword`
- Cookies store `accessToken` and `refreshToken` with `Secure` and `SameSite=Strict`.

## Build & Run

- `npm run dev` – start development server.
- `npm run build` – build production bundle.
- `npm run preview` – preview production build.
- `npm run lint` – run ESLint.

## Project Flow Summary

1. User opens the app.
2. If not authenticated, app redirects to `/auth/login`.
3. Admin logs in with email and password.
4. Auth success stores credentials and navigates to `/admin`.
5. Admin page renders a dashboard layout with sidebar / bottom nav and header.
6. Admin navigates between overview, chef requests, chefs, users, bookings, payouts, settings, and notifications.
7. Logout clears stored tokens and returns to login.
8. Password recovery is a separate flow via forgot password, OTP verify, and reset password.

## Notes

- `App.jsx` uses role-based guard to allow only `admin` or `superAdmin` users.
- Header and notifications are hidden during authentication screens.
- The dashboard is responsive: sidebar on desktop, bottom nav on mobile.
- The base URL can be customized via `VITE_BASE_URL` in environment configuration.
