import type { SportConfig, SportId } from "@/lib/types/sport";

/**
 * Central sport registry.
 * Enable a sport by setting `enabled: true` and fleshing out config —
 * UI and AI context should read from here rather than sport-specific branches.
 */
export const SPORTS: Record<string, SportConfig> = {
  baseball: {
    id: "baseball",
    name: "Baseball",
    shortName: "Baseball",
    icon: "baseball",
    accent: "#2EE6A8",
    enabled: true,
    config: {
      positions: [
        "Pitcher",
        "Catcher",
        "First Base",
        "Second Base",
        "Third Base",
        "Shortstop",
        "Left Field",
        "Center Field",
        "Right Field",
        "Outfielder",
        "Utility",
      ],
      defaultMetrics: ["readiness", "trainingLoad", "recovery", "sprintSpeed"],
      seasonPhases: ["off-season", "pre-season", "in-season", "post-season"],
    },
  },
  football: {
    id: "football",
    name: "Football",
    shortName: "Football",
    icon: "football",
    enabled: false,
    config: {
      positions: ["QB", "RB", "WR", "TE", "OL", "DL", "LB", "DB", "K/P"],
      defaultMetrics: ["readiness", "trainingLoad", "recovery"],
    },
  },
  basketball: {
    id: "basketball",
    name: "Basketball",
    shortName: "Basketball",
    icon: "basketball",
    enabled: false,
    config: {
      positions: ["PG", "SG", "SF", "PF", "C"],
      defaultMetrics: ["readiness", "trainingLoad", "recovery"],
    },
  },
  soccer: {
    id: "soccer",
    name: "Soccer",
    shortName: "Soccer",
    icon: "soccer",
    enabled: false,
    config: {
      positions: ["GK", "CB", "FB", "CM", "Winger", "ST"],
      defaultMetrics: ["readiness", "trainingLoad", "recovery"],
    },
  },
  "track-and-field": {
    id: "track-and-field",
    name: "Track & Field",
    shortName: "Track",
    icon: "track",
    enabled: false,
    config: {
      events: ["Sprints", "Hurdles", "Jumps", "Throws", "Distance", "Multis"],
      defaultMetrics: ["readiness", "trainingLoad", "recovery"],
    },
  },
  tennis: {
    id: "tennis",
    name: "Tennis",
    shortName: "Tennis",
    icon: "tennis",
    enabled: false,
    config: { defaultMetrics: ["readiness", "trainingLoad", "recovery"] },
  },
  volleyball: {
    id: "volleyball",
    name: "Volleyball",
    shortName: "Volleyball",
    icon: "volleyball",
    enabled: false,
    config: {
      positions: ["Setter", "Outside", "Opposite", "Middle", "Libero"],
      defaultMetrics: ["readiness", "trainingLoad", "recovery"],
    },
  },
  swimming: {
    id: "swimming",
    name: "Swimming",
    shortName: "Swim",
    icon: "swimming",
    enabled: false,
    config: {
      events: ["Freestyle", "Backstroke", "Breaststroke", "Butterfly", "IM"],
      defaultMetrics: ["readiness", "trainingLoad", "recovery"],
    },
  },
  lacrosse: {
    id: "lacrosse",
    name: "Lacrosse",
    shortName: "Lacrosse",
    icon: "lacrosse",
    enabled: false,
    config: { defaultMetrics: ["readiness", "trainingLoad", "recovery"] },
  },
  hockey: {
    id: "hockey",
    name: "Hockey",
    shortName: "Hockey",
    icon: "hockey",
    enabled: false,
    config: { defaultMetrics: ["readiness", "trainingLoad", "recovery"] },
  },
  wrestling: {
    id: "wrestling",
    name: "Wrestling",
    shortName: "Wrestling",
    icon: "wrestling",
    enabled: false,
    config: { defaultMetrics: ["readiness", "trainingLoad", "recovery"] },
  },
};

export function getSport(id: SportId | null | undefined): SportConfig | null {
  if (!id) return null;
  return SPORTS[id] ?? null;
}

export function getEnabledSports(): SportConfig[] {
  return Object.values(SPORTS).filter((s) => s.enabled);
}

export function getAllSports(): SportConfig[] {
  return Object.values(SPORTS);
}

export function buildSportContext(sportId: SportId | null) {
  const sport = getSport(sportId);
  return { sportId: sport?.id ?? null, sport };
}
