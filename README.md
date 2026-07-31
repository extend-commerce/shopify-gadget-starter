# Shopify Gadget Starter

Starter template for embedded Shopify apps built on Gadget, React Router, Shopify App Bridge, Shopify Polaris web components, and a shared TypeScript package for app-level services.

## Tech Stack

- **Runtime and framework:** Gadget app framework with React Router 7.
- **Frontend:** React 19, Shopify App Bridge, Shopify Polaris web components, `@gadgetinc/react`, and `@gadgetinc/react-shopify-app-bridge`.
- **Backend:** Gadget actions, routes, Shopify connection APIs, and Fastify-compatible route context.
- **Shopify:** Shopify Admin GraphQL, Shopify CLI app config, App Bridge embedded app support, and Shopify webhooks configured through the Shopify app TOML.
- **Shared package:** Yarn workspace package at `packages/shared` for reusable server/client helpers.
- **Billing:** Shopify billing checks plus Mantle helper/provider scaffolding.
- **Analytics:** Pluggable analytics manager with mock, Mantle, Mixpanel, and PostHog providers.
- **Email/lifecycle messaging:** Loops helpers for install, reinstall, and uninstall events.
- **Feedback/changelog:** Featurebase browser widget with signed user token support.
- **Quality:** TypeScript project references, ESLint, Prettier, Vitest, React Testing Library, Commitlint, Commitizen, and Husky.
- **Package manager:** Yarn 1.22.22 workspaces.

## What Is Included

- Embedded Shopify app shell with App Bridge and Polaris web components loaded in `web/root.tsx`.
- Authenticated app layout in `web/routes/_app.tsx`, including navigation, analytics context, and Featurebase bootstrapping.
- Example app index route in `web/routes/_app._index.tsx` that loads and displays Shopify products.
- Example backend action in `api/actions/getProducts.ts` that queries Shopify Admin GraphQL.
- Daily scheduled Shopify sync action in `api/actions/scheduledShopifySync.ts`.
- Shopify install, reinstall, and uninstall lifecycle hooks that trigger subscription sync, Loops events, and analytics events.
- Billing guard in `packages/shared/billing.server.ts` that skips dev stores, checks active subscriptions/charges, and redirects unpaid shops to Shopify pricing plans.
- Shared analytics abstraction with mock provider enabled outside production and production providers ready to opt in.
- Loops helper functions for install, reinstall, and uninstall email flows.
- Mantle server helper and React provider wrapper.
- Featurebase JWT helper and frontend widget bootstrap.
- Shopify app CLI configuration for development in `shopify.app.development.toml`.
- Empty `extensions/` directory for future Shopify app extensions.

## Project Layout

| Path | Purpose |
| --- | --- |
| `web/` | React Router frontend for the embedded Shopify app. Routes live in `web/routes`, reusable UI in `web/components`, browser utilities in `web/lib`, and route registration in `web/routes.ts`. |
| `api/actions/` | Global backend actions. This starter includes product loading and scheduled Shopify sync examples. |
| `api/models/` | Model action and schema files managed by the app. Use this area for model-specific lifecycle behavior. |
| `api/routes/` | HTTP route handlers. This starter includes a billing callback route. |
| `accessControl/` | Permission and filter files for app access rules. |
| `packages/shared/` | Shared workspace package for reusable app services such as analytics, billing, Loops, Mantle, Featurebase, and user helpers. |
| `packages/shared/analytics/` | Provider-neutral analytics manager, event types, and provider implementations. |
| `extensions/` | Placeholder for Shopify app extensions. |
| `.shopify/` and `shopify.app.*.toml` | Shopify CLI app configuration files. |
| `.gadget/` | Local Gadget sync/client metadata generated for this checkout. |

## Environment Variables

Configure variables in the Gadget environment, not in committed source files. Use `ggt var` for local CLI management.

Required when the corresponding integration is enabled:

- `LOOPS_API_KEY`
- `LOOPS_APP_MAILING_LIST_ID`
- `LOOPS_UNINSTALL_MAILING_LIST_ID`
- `LOOPS_APP_NAME`
- `FEATUREBASE_SECRET`
- `GADGET_PUBLIC_FEATUREBASE_APP_ID`
- `GADGET_PUBLIC_MANTLE_APP_ID`
- `MANTLE_API_KEY`
- `GADGET_PUBLIC_MANTLE_APP_TOKEN`
- `GADGET_PUBLIC_MIXPANEL_TOKEN`
- `GADGET_PUBLIC_POSTHOG_API_KEY`
- `GADGET_PUBLIC_POSTHOG_API_HOST`

The current analytics wiring uses `MockAnalyticsProvider` outside production. Production analytics providers are present but commented out in `web/lib/analytics.tsx` and `packages/shared/analytics.server.ts`; uncomment only the providers you intend to configure.

## Local Setup

Prerequisites:

- Node.js version from `.node-version`.
- Yarn 1.x.
- Access to the Gadget project and its development environment.
- Access to the Shopify app used for development.
- Gadget CLI installed globally:

```bash
npm install -g ggt
```

Setup steps:

```bash
yarn install
ggt status
ggt dev
```

Use `ggt status` first to see whether this directory is already connected and syncing. If sync is already running for this checkout, reuse that process. Do not run `ggt push` or `ggt pull` while `ggt dev` is active because `ggt dev` handles two-way sync between local files and the Gadget development environment.

If this is a fresh checkout that is not connected to the Gadget app yet, authenticate with the Gadget CLI and start `ggt dev` against the correct app and development environment. The command stores local sync metadata under `.gadget/`.

Once `ggt dev` is running, app changes are synced to the Gadget development environment. For Shopify CLI tasks, use:

```bash
yarn shopify:dev
yarn shopify:info
yarn shopify:deploy
```

The development Shopify app config is in `shopify.app.development.toml`. Update that file when connecting the template to a different Shopify app or Gadget development URL.

## Useful Commands

```bash
yarn typecheck
yarn lint
yarn format:check
yarn test
yarn build
ggt problems
ggt logs --follow
```

Use `ggt problems` before handing off backend changes, and `ggt logs --follow` when debugging runtime behavior in the Gadget environment.

## Working With Integrations

- **Analytics:** Add or remove providers in `web/lib/analytics.tsx` for browser events and `packages/shared/analytics.server.ts` for server-side events.
- **Billing:** Adjust payment gating in `packages/shared/billing.server.ts`; the root loader calls it before rendering paid app screens.
- **Emails:** Loops lifecycle handlers live in `packages/shared/loops.server.ts` and are called from Shopify shop install/reinstall/uninstall actions.
- **Featurebase:** JWT generation lives in `packages/shared/featurebase.server.ts`; the widget boots in `web/components/featurebase.tsx`.
- **Mantle:** Server identification helpers live in `packages/shared/mantle.server.ts`; the React provider wrapper lives in `web/components/mantle-provider.tsx`.
- **Shopify Admin GraphQL:** Keep reusable query types in the shared generated GraphQL types and call Shopify through the current Gadget Shopify connection.

## Notes for New Projects

When using this starter for a new app, update:

- Package and app names in `package.json`, `shopify.app.development.toml`, and app metadata.
- Shopify scopes in `shopify.app.development.toml`.
- Gadget app/environment connection used by `ggt dev`.
- Integration environment variables for only the services you plan to use.
- Analytics providers that should run in production.
