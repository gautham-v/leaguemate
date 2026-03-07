import { sleeperApi } from '@/api/sleeper';
import type { SleeperLeague } from '@/types/sleeper';

export type LeagueGroup = [string, SleeperLeague[]];

/**
 * Walk backward through previous_league_id chain to find all historical seasons.
 */
async function walkLeagueHistory(previousLeagueId: string | null): Promise<SleeperLeague[]> {
  const history: SleeperLeague[] = [];
  let leagueId = previousLeagueId;
  while (leagueId) {
    try {
      const league = await sleeperApi.getLeague(leagueId);
      history.push(league);
      leagueId = league.previous_league_id;
    } catch {
      break;
    }
  }
  return history;
}

export async function fetchUserLeaguesGrouped(userId: string): Promise<LeagueGroup[]> {
  const state = await sleeperApi.getNFLState();
  const seasons = [state.season, state.previous_season];

  const results = await Promise.all(
    seasons.map((s) => sleeperApi.getUserLeagues(userId, s).catch(() => [] as SleeperLeague[])),
  );

  const allLeagues = results.flat();
  if (allLeagues.length === 0) throw new Error('No leagues found for this user');

  // Deduplicate leagues by league_id (same league may appear in both seasons)
  const seen = new Set<string>();
  const unique = allLeagues.filter((l) => {
    if (seen.has(l.league_id)) return false;
    seen.add(l.league_id);
    return true;
  });

  const grouped = unique.reduce<Record<string, SleeperLeague[]>>((acc, l) => {
    (acc[l.name] ??= []).push(l);
    return acc;
  }, {});

  // For each group, walk backward from the oldest league to find full history
  const entries = Object.entries(grouped);
  await Promise.all(
    entries.map(async ([, leagues]) => {
      const oldest = leagues.reduce((a, b) => (Number(a.season) < Number(b.season) ? a : b));
      if (oldest.previous_league_id) {
        const history = await walkLeagueHistory(oldest.previous_league_id);
        leagues.push(...history);
      }
    }),
  );

  return entries.sort(([, a], [, b]) => {
    const maxA = Math.max(...a.map((l) => Number(l.season)));
    const maxB = Math.max(...b.map((l) => Number(l.season)));
    return maxB - maxA;
  });
}
