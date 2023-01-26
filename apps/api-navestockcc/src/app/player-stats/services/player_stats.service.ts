import {
  Match,
  MatchDescription,
  Bat,
  Bowl,
  PlayerStats,
} from '@navestockcricketclub/match-interfaces';
import {
  map,
  of,
  Observable,
  mergeMap,
  mergeAll,
  merge,
  filter,
  groupBy,
  reduce,
} from 'rxjs';

export class PlayerStatsService {
  /**
   * Matchs description$
   * @param match
   * @returns MatchDescription of the Match object
   */
  public matchDescription$(match: Match): Observable<MatchDescription> {
    return of(match.description);
  }

  /**
   * Function to parse the part of the player stats data object
   * @date 1/7/2023 - 11:25:50 AM
   *
   * @public
   * @param {Match} match
   * @returns {Observable<{player_id: string, bat?: Bat, bowl?: Bowl}>}
   */
  public playerStats$(
    match: Match
  ): Observable<{ player_id: string; bat?: Bat; bowl?: Bowl }> {
    const match$ = of(match.innings);

    return match$.pipe(
      mergeMap((inngs) => of(inngs)),
      mergeAll(),
      mergeMap((v) => merge(of(v.bat), of(v.bowl))),
      mergeAll(),
      filter((v) => v.club_id == '4513'),
      groupBy((plyr) => plyr.player_id),
      mergeMap((group$) =>
        group$.pipe(reduce((acc, cur) => [...acc, cur], [`${group$.key}`]))
      ),
      map((arr) => arr as Bat[] | Bowl[]),
      map((arr) => {
        const pStats = {};
        arr.forEach((s) => {
          if (typeof s === 'object') {
            if (s.type === 'bat') {
              pStats['bat'] = s as Bat;
              pStats['player_name'] = s.player_name;
            } else if (s.type === 'bowl') {
              pStats['bowl'] = s as Bowl;
              pStats['player_name'] = s.player_name;
            }
          } else if (typeof s === 'string') {
            pStats['player_id'] = s;
          }
        });
        return pStats as PlayerStats;
      })
    );
  }
}
