# Apex AI

Adaptive training for athletes.

**Initial sport:** Baseball  
**Long-term:** Multi-sport adaptive athletic training platform

## Current foundation

- **PR #1:** App shell, design system, dashboard, sport registry, AI Coach UI shell
- **PR #2:** Athlete onboarding, persistent profile, multi-sport athlete context

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

Open [http://localhost:3000](http://localhost:3000). Use **Continue** on the login screen (mock session), then complete onboarding.

Athlete profiles persist as JSON under `data/athletes/` (gitignored). Replace the repository implementation when a real database/auth stack lands.

### Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | ESLint |

### Architecture notes

- **Sports** are defined in `src/lib/sports/registry.ts`. Enable future sports by flipping `enabled`.
- **Athlete profile** lives in `src/lib/types/athlete.ts` with modular `AthleteSportProfile` entries.
- **Persistence:** `src/lib/athlete/repository.ts` (file-backed) → swap later for DB.
- **AthleteContext** (`buildAthleteContext`) is the handoff object for the future AI Coach.
- **Auth** remains a mock cookie session (`apex_session` + `apex_user_id`).
