# 21 Questions — Friends Edition

A shareable 21-question friendship quiz built with Next.js and Supabase.

## Setup
1. Create a separate Supabase project for Friends Edition.
2. In Supabase SQL Editor, run `supabase-schema.sql`.
3. In Vercel Project Settings → Environment Variables, add:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY` (server-side only; never use a `NEXT_PUBLIC_` prefix)
   - `NEXT_PUBLIC_SITE_URL` (your deployed URL, optional)
4. Deploy this repository on Vercel.

## Local development
Run `npm install`, copy `.env.example` to `.env.local`, fill in your keys, then run `npm run dev`.

## Features
- Create a 21-answer challenge and share its unique link.
- Friends enter their name and answer the questions.
- Score is calculated on the server and creator answers are revealed after submission.
- Creator dashboard shows attempts and a score-ranked leaderboard.
- Dashboard access uses a private creator token. Keep the dashboard link private.

This is a no-account convenience gate, not identity verification: anyone with the private dashboard URL can view its leaderboard. Do not share that URL publicly.
