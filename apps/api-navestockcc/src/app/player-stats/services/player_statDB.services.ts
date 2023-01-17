import { getFirestore, WriteResult } from 'firebase-admin/firestore';
import { from, Observable } from 'rxjs';

import { PlayerStatsMatch } from '@navestockcricketclub/match-interfaces';

export class PlayerStatsDBService {
  afs = getFirestore();


  /**
   * Function to update Player Stats information in the Firestore DB
   * @date 1/4/2023 - 1:23:45 PM
   *
   * @public
   * @param {PlayerStatsMatch} playerStatsData The player stats data
   * @returns {Observable<WriteResult>}
   */
  public setPlayerStatsData(
    playerStatsData: PlayerStatsMatch
  ): Observable<WriteResult> {
    const playerStatsDocPath = this.afs
      .collection('PlayerStats')
      .doc(playerStatsData.player_id)
      .collection('matches')
      .doc(playerStatsData.matchdescription.id.toString());
    return from(playerStatsDocPath.set(playerStatsData, { merge: true }));
  }

}
