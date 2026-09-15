/**
 * Sport context model for multi-sport expansion.
 * Add new sports via the registry — do not hard-code sport branches in UI.
 */

export type SportId =
  | "baseball"
  | "football"
  | "basketball"
  | "soccer"
  | "track-and-field"
  | "tennis"
  | "volleyball"
  | "swimming"
  | "lacrosse"
  | "hockey"
  | "wrestling"
  | (string & {});

export interface SportConfig {
  id: SportId;
  name: string;
  /** Short label for compact UI (e.g. badges, selectors) */
  shortName: string;
  /** Emoji or icon key — UI maps this to a visual */
  icon: string;
  /** Optional accent override for sport-specific highlights */
  accent?: string;
  enabled: boolean;
  /** Sport-specific configuration hooks for future adaptive engine */
  config: {
    positions?: string[];
    events?: string[];
    defaultMetrics?: string[];
    seasonPhases?: string[];
  };
}

/** Context passed into AI conversation / planning layers */
export interface SportContext {
  sportId: SportId | null;
  sport: SportConfig | null;
}
