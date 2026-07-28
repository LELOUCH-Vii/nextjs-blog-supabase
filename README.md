Next.js Blog CMS

A full-stack blog platform built entirely in JavaScript (Next.js, React, Node) with Supabase for auth, database, and storage — featuring role-based permissions, row-level security, and an admin CMS.

Overview

This project demonstrates a complete JavaScript-based full-stack architecture: a public-facing blog with an admin dashboard for content management, built to showcase auth, permissions, and infrastructure practices end to end.

Features
Public blog with post listing, individual post pages, and tag filtering
Admin dashboard for creating, editing, and deleting posts
Image upload and storage for post cover images
Role-based access control (admin vs reader)
Comment system with per-user rate limiting
Row-level security enforced at the database layer
Tech Stack
Layer	Technology
Frontend	Next.js, React
API / Backend logic	Next.js API routes (Node.js)
Database	PostgreSQL (via Supabase)
Auth	Supabase Auth
Storage	Supabase Storage
Hosting	Vercel
CI/CD	GitHub Actions
Error tracking	Sentry
Architecture
Frontend: Statically generated post pages for fast loads and CDN caching; client-rendered admin dashboard behind auth.
Database: users, posts, tags, post_tags, comments tables with row-level security policies restricting writes to authors/admins and reads to published content.
Auth & Permissions: Two roles — admin (full write access) and reader (read + comment) — enforced both in the UI and at the database level via RLS.
Rate Limiting: Comment submission is throttled per user to prevent spam.
Deployment: Automatic deploys to Vercel on merge to main, via a GitHub Actions workflow that lints and builds before deploying.

Visit http://localhost:3000 to view the app.

Environment Variables
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
Screenshots

Add screenshots of the post list, post detail, and admin dashboard here once built.

Roadmap
 Post list & detail pages
 Admin dashboard (CRUD)
 Image upload
 Comments + rate limiting
 Sentry integration
 CI/CD pipeline
License

MIT
