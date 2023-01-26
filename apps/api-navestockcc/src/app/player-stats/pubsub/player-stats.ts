/**
 * Navestock Firebase Function
 * @author Lefras Coetzee
 * @description BackgroundFunction to trigger by publishing data<Match> to [PlayCricket_Match_Details_Data] PubSub Topic.
 * @description
 * @description
 */

import * as functions from 'firebase-functions/v1';
import { Match } from '@navestockcricketclub/match-interfaces';
import { PlayerStatsService } from '../services/player_stats.service';

import { of, map, filter, mergeMap, combineLatest } from 'rxjs';
import { getFirestore } from 'firebase-admin/firestore';

/**
 * PubSub trigger which orchestrates the collection of statistical data from player
 * @date 1/6/2023 - 9:25:57 AM
 *
 */
export const getPlayerStatsPubSub = functions
  .region('europe-west2')
  .runWith({ memory: '128MB', timeoutSeconds: 60 })
  .pubsub.topic('PlayCricket_Match_Details_Data')
  .onPublish(async (msgPayload) => {
    const matchdata = <unknown>msgPayload.json;

    const playerStatsService = new PlayerStatsService(); // instance of PlayersStatsService which takes a Match Object as input and returns the MatchDescription
    const afs = getFirestore();
    const fsBatch = afs.batch();

    // function to take PlayerStats object and write it to the Firestore DB
    const playerstatsSub = {
      next: (psd) => {
        //Firestire Document Path to which PlayerStats are written
        const playerStatPath = afs.collection('PlayerStats').doc(psd.player_id);

        const playerStatsDocPath = playerStatPath
          .collection('matches')
          .doc(psd.matchdescription.id.toString());

        //Add Doc Writes to Firestore batch write
        fsBatch.set(playerStatPath, {
          player_id: psd.player_id,
          player_name: psd.player_name,
        });
        fsBatch.set(playerStatsDocPath, psd);
      },
      error: (err) => {
        console.error('Observer got an error: ' + err);
      },

      // Commit Firestore batch
      complete: async () => {
        await fsBatch.commit();
      },
    };

    //Function to parse {String} Player_ID, {bat} Bat. {bowl} Bowl
    const plyrStats = of(matchdata).pipe(
      map((psPayLoad) => psPayLoad as Match),
      filter((mtch) => 'innings' in mtch === true),
      filter((mtch) => mtch.innings !== undefined || mtch.innings.length > 0),
      mergeMap((mtch) => playerStatsService.playerStats$(mtch))
    );

    //Function to parse Match Description
    const matchDescription = of(matchdata).pipe(
      map((psPayLoad) => psPayLoad as Match),
      mergeMap((match) => playerStatsService.matchDescription$(match)),
      map((v) => ({ matchdescription: v }))
    );

    //Function to parse PlayerStats from MatchDescription and {String} Player_ID, {bat} Bat. {bowl} Bowl
    combineLatest([matchDescription, plyrStats])
      .pipe(
        map((v) => {
          let pso = {};
          v.forEach((av) => (pso = { ...pso, ...av }));
          return pso;
        })
      )
      .subscribe(playerstatsSub);
  });
