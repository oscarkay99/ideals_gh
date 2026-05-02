# Supabase Setup

This project now supports Supabase for:

- Email/password authentication
- Password reset emails
- Core business tables used by the current `src/services/*` modules

## Local app configuration

The frontend reads:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`

Those values belong in `.env.local`.

## AI function configuration

The Supabase Edge Functions that power AI replies, AI post generation, POS AI, and weekly AI insights read:

- `OPENAI_API_KEY`
- `OPENAI_MODEL`

Recommended default:

- `OPENAI_MODEL=gpt-4.1-mini`

If `OPENAI_MODEL` is not set, the functions now default to `gpt-4.1-mini`.

## Apply the backend schema

Run the SQL in `supabase/migrations/20260423_init_core.sql` inside the Supabase SQL editor, or apply it through the Supabase CLI after linking the project.

## Admin access still needed

The frontend can connect with the publishable key, but creating tables, policies, and server-side resources still requires either:

- A Supabase personal access token for CLI login, or
- The project service role key for admin-level automation
