# Spendez Feature Inventory

Last updated: 2026-04-20

This file is the living feature checklist for the app. Update it whenever a feature is added, removed, or materially changed.

## Live now

- Authentication
  - User registration
  - User login
  - Token refresh handling in the frontend API client
  - Persisted session restore via `/users/me`

- Group workspace
  - Create group
  - List my groups
  - Select active group for the dashboard
  - Mobile-friendly group selection and navigation

- Expenses
  - Manual expense creation from the dashboard
  - Group expense listing on the dashboard
  - Category-based analytics per selected group
  - Automatic split creation for active members when a new expense is saved
  - Balance and simplified debt calculations from stored splits

- OCR
  - Authenticated receipt image upload
  - OCR text extraction
  - Suggested amount, category, and date parsing
  - OCR-assisted expense creation from the dashboard

- Analytics
  - User summary for the recent period
  - Group dashboard totals
  - Category breakdown
  - Recurring expense detection
  - Top expense visibility through dashboard data

- Electricity
  - Save electricity meter/billing records per group
  - View recent electricity records in the dashboard

- Payments
  - Read recorded group payments on the dashboard

- Mobile compatibility
  - Responsive app layout
  - Collapsible mobile navigation
  - Bottom navigation for phone screens
  - Dashboard and groups pages adapted for small screens

## Backend-ready but not fully surfaced in UI yet

- Add/remove group members
- Update/archive groups
- Update/delete expenses
- Create and update payments
- Budget create/get/update
- Notifications list and mark-as-read

## Known limitations

- OCR is currently optimized for receipt images; PDF handling is not yet a polished end-user flow.
- Payment creation is available in the API, but there is not yet a dedicated frontend form for it.
- Budget and notifications APIs exist, but dedicated dashboard screens are still pending.
