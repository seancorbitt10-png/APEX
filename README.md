# Apex AI

Adaptive training for athletes.

**Initial sport:** Baseball  
**Long-term:** Multi-sport adaptive athletic training platform

## PR #1 — Foundation

This repository currently ships the authenticated application shell, design system, sport-context architecture, and athlete dashboard (mock data). No AI provider is connected yet.

### Stack

- Next.js 16 (App Router)
- React 19
- TypeScript
- Tailwind CSS v4

### Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Use **Continue to Dashboard** on the login screen (mock session).

### Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | ESLint |

### Architecture notes

- **Sports** are defined in `src/lib/sports/registry.ts`. Enable future sports by flipping `enabled` and extending config — avoid sport-specific UI forks.
- **Athlete profile** shape lives in `src/lib/types/athlete.ts`.
- **Mock dashboard data** is centralized in `src/lib/data/mock.ts` for easy API replacement.
- **Auth** is a mock cookie session (`apex_session`) via `src/proxy.ts` + server actions. Replace with real auth later.
