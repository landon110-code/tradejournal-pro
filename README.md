# TradeJournal Pro

A mobile-first trading journal and learning workspace built as a static GitHub Pages app with optional Supabase account sync.

**Live app:** https://landon110-code.github.io/tradejournal-pro/  
**Repository:** https://github.com/landon110-code/tradejournal-pro

## Current features

- Dashboard and performance summaries from saved closed trades
- Trade log with add, edit, delete, filtering, CSV export, and CSV import preview
- CSV column auto-detection for common broker/trading-platform headers
- Calendar, analytics, and instrument/setup/mindset breakdowns
- Appearance themes and device-level interface preferences
- Beginner Academy, knowledge quiz, playbook, and local chart-study notebook
- Mobile navigation and responsive layouts
- Optional account-based cloud storage through Supabase

## Run it

The app is a static `index.html`. You can open it through GitHub Pages or serve the repository locally with any static web server. The Supabase JavaScript client is loaded from a CDN, so cloud features need an internet connection.

## Supabase setup

1. Create or select a Supabase project.
2. Open **SQL Editor** and review/run [`supabase/setup.sql`](supabase/setup.sql) only if you are setting up a **new database schema**.
3. In the app, open **Settings**, confirm the Project URL and publishable/anon key, then connect and create an account.
4. Confirm email if your Supabase Auth settings require it, then sign in.

### Important existing-database warning

The starter SQL is for a new setup, not an automatic migration for an existing database. Back up existing data and compare the table columns and policies before applying schema changes to a project that already contains tables. Never put a Supabase **service-role secret** in this website. The browser may use only a publishable key (or legacy anon key), with Row Level Security enabled.

## TradingView import

TradeJournal Pro currently imports supported CSV files through the Trade Log importer. TradingView export availability and column formats can differ by chart, broker connection, and account view. Export a sample file from your actual workflow, upload it, use **Auto-detect columns**, check every mapping and preview row, and only then import.

CSV import is not a live broker connection and does not continuously sync positions or fills. Check the imported prices, side, dates, quantities, commissions, and multiplier before relying on any calculated P&L. Futures multipliers vary by contract and must be verified.

## Copilot and integrations

The page includes a Copilot interface that calls a Supabase Edge Function named `trading-copilot`. The function source/deployment and its AI provider configuration are not included in this repository at present. Copilot responses therefore require that backend function and its secret configuration be deployed separately. Do not expose an AI provider key in browser JavaScript.

A direct broker connection is not implemented by the CSV importer. It requires a supported provider/API, secure server-side credential handling, and appropriate permission scopes. Do not ask users to paste brokerage passwords into this app.

## Data and privacy notes

- Theme, UI preferences, quiz progress, and chart-study notes are stored in the current browser's local storage; they do not automatically follow a user to another device.
- Trades and quiz progress use Supabase when the user is signed in and the database schema/RLS policies are configured.
- Export backups regularly. Clearing browser storage can remove local-only data.
- The app is an educational journaling tool, not a source of financial advice or trade signals.

## Development checks

There is no dedicated automated test suite or package build step yet. Before merging changes, at minimum check the inline JavaScript syntax, confirm unique HTML IDs, and verify GitHub Pages Actions succeed. Then manually smoke-test navigation, trade CRUD, CSV preview/import, settings, quiz progress, and mobile layouts.
