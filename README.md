# TradeJournal Pro

A mobile-first trading journal and market-learning workspace. It is designed for **recordkeeping, reflection, and education**—not live order execution, market predictions, or financial advice.

## Current features

- **Journal:** record, edit, filter, and review manually logged trades.
- **CSV import:** map common export columns, preview estimated calculations, and review likely duplicates before importing.
- **CSV export:** download your logged records for backup or analysis.
- **Dashboard & calendar:** summarize closed-trade records by date and instrument.
- **Analytics:** review results by instrument, setup, mindset, execution grade, and self-reported rule adherence; view sample-size/data-quality checks.
- **Replay Lab:** calculate hypothetical examples from inputs; it does not fetch live prices.
- **Learning tools:** Masterclass lessons, a visual knowledge quiz with progress, and saved playbook notes.
- **Personalization:** themes, text size, layout density, and motion preferences.
- **Cloud sync:** optional Supabase authentication and database storage when configured.

## Important limitations

- The app does **not** place orders, connect directly to a broker, or provide live market data.
- CSV columns vary by platform and export type. Always inspect the import preview and verify symbol, dates, direction, quantity, multipliers, and fees before confirming.
- Calculated results depend on the data you enter. Derivative products can have contract-specific multipliers and fees; don't assume a universal multiplier.
- Journal analytics describe past records and do not predict future outcomes.
- AI Copilot is optional and requires a supported provider configuration on the server. Until that is configured and tested, treat it as unavailable. Do not place provider secrets in `index.html`, public GitHub files, or browser settings.

## Supabase setup

1. Create a Supabase project.
2. Run the SQL setup script supplied with the project in the Supabase SQL editor.
3. In **Settings → API**, copy the Project URL and the publishable/anon key.
4. Enter those public client settings in the app's Cloud setup panel.
5. Create an account or sign in.
6. Confirm row-level security policies are enabled and restrict each user's records to that authenticated user.

**Never put a Supabase service-role key or an AI provider secret in browser code.** A publishable/anon key is only safe to use with correctly configured database permissions and row-level security. Do not enter broker passwords, account credentials, or private trading API secrets into the journal.

## GitHub Pages

The site is a static `index.html` app. In the repository, open **Settings → Pages** and confirm the deployment source is configured for the `main` branch and root directory (if using branch-based deployment). After a commit, GitHub Pages can take several minutes to publish; check the Actions/Pages status if the live site does not update.

## Manual smoke-test checklist

- [ ] Open on a narrow phone viewport; verify navigation, forms, tables, and dialogs fit.
- [ ] Connect a test Supabase account and verify records load only for that account.
- [ ] Create a test record, edit it, reload, export, then delete it.
- [ ] Import a small sample CSV; verify column mapping, preview, estimated math, and duplicate handling before confirming.
- [ ] Test empty states, malformed CSV, missing columns, and network/auth errors.
- [ ] Change theme, text size, density, and motion preference; reload and verify preferences persist.
- [ ] Confirm AI Copilot displays a clear setup/error state when the provider is not configured.

## Privacy

This repository contains front-end code. Keep private records in a properly secured database, avoid uploading real account credentials, and use sample or redacted data when testing or reporting issues.
