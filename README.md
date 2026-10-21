# AgriFlow

AgriFlow is a React/Vite agricultural marketplace. Marketplace, supplier, order, RFQ, demand, chat, notification, and dispute records are database-backed through Supabase. The client does not seed or persist business records in browser storage.

## Live data setup

1. Copy `.env.example` to `.env.local`.
2. Set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` using the public anon key only.
3. Open [supabase/schema.sql](supabase/schema.sql), copy it into the Supabase SQL editor, and run it.
4. Configure Row Level Security for the authenticated roles before enabling writes in production.
5. Run `npm run build` and deploy with the same public environment variables.

Without Supabase configuration, the app intentionally shows an unavailable live-data state. It does not display seed buyers, farms, products, orders, reviews, or discovery results.

Email delivery, scheduled Demand Radar discovery, authentication, storage uploads, and service-role operations must run in a server-side or Supabase Edge Function adapter. Never expose those credentials through `VITE_*` variables.

## Current implementation boundary

The repository layer reads real Supabase rows and fails closed when the database is unavailable. WhatsApp remains user-initiated click-to-chat, SMS remains an explicitly labelled simulator, and no external buyer discovery is claimed until a permitted server-side source is configured. Authentication, field-level RLS policies, scheduled workers, and provider adapters still require deployment configuration and security review.

## Development

```bash
npm install
npm run dev
npm run build
```

---

The remainder of this file is the original Vite template reference.

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend enabling type-aware lint rules by installing `oxlint-tsgolint` and editing `.oxlintrc.json`:

```json
{
  "$schema": "./node_modules/oxlint/configuration_schema.json",
  "plugins": ["react", "typescript", "oxc"],
  "options": {
    "typeAware": true
  },
  "rules": {
    "react/rules-of-hooks": "error",
    "react/only-export-components": ["warn", { "allowConstantExport": true }]
  }
}
```

See the [Oxlint rules documentation](https://oxc.rs/docs/guide/usage/linter/rules) for the full list of rules and categories.
