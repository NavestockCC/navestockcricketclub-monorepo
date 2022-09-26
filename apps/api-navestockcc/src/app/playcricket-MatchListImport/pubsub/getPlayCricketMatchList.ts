

import * as functions from 'firebase-functions';

import { PlayCricketMatchListAPICall } from '../../services/PlayCricketAPICall';
import { MatchListDB } from '../services/MatchList_DB_service';
import { PublishPubSubMessage } from '../../services/PublishPubSubMessage';
import { map, switchMap } from 'rxjs/operators';
import { MatchList } from '@navestockcricketclub/match-interfaces';
import { forkJoin, lastValueFrom } from 'rxjs';


/**
 * Navestock Firebase Function
 * @author Lefras Coetzee
 * @description Function to pull Match List from the PlayCricket API.
 * @description The function is triggered from the 'Match_List_Import' PubSup topic
 * @description The function performs the following actions:
 *  1. get Matchlist from PlayCricket API
 *  2. extract the MatchList data from the API payload
 *  3. map the payload data to interface type MatchList
 *  4. publishes the MatchList data to PlayCricket_Match_List_Data PubSub
 *  5. writes the MatchList data to Firestore collection MatchList.<season>
 */
export const getPlayCricketMatchListPubSub = functions
  .region('europe-west2')
  .runWith({ memory: '128MB', timeoutSeconds: 60 })
  .pubsub.topic('Match_List_Import')
  .onPublish(async (msgPayload) => {
    /**
     * Retrieve Season from PubSub: Match_List_Import payload data
     * Validate that the PayLoad data contains a valid Season
     * If not extract the current Year as the season
     */
    let seasonToImport: string;

    if (
      'season' in msgPayload.json === false ||
      msgPayload.json.season === undefined
    ) {
      seasonToImport = new Date().getFullYear().toString();
    } else if (typeof msgPayload.json.season === 'string') {
      seasonToImport = msgPayload.json.season;
    } else if (typeof msgPayload.json.season === 'number') {
      seasonToImport = msgPayload.json.season.toString();
    } else {
      seasonToImport = new Date().getFullYear().toString();
    }

    const PCAPICall = new PlayCricketMatchListAPICall();
    const psMessage = new PublishPubSubMessage();
    const matchListDB = new MatchListDB();

    /**
     * Observable to:
     * 1. get Matchlist from PlayCricket API
     * 2. extract the MatchList data from the API payload
     * 3. map the paylopad data to interface object MatchList
     * 4.write the MatchList data to PlayCricket_Match_List_Data PubSub
     * 5.write the MatchList data to Firestore collection MatchList.<season>
     */
    const getPCMactchLlistPS = PCAPICall.getPlayCricketApiMatch_List(
      seasonToImport
    ).pipe(
      map((ApiResp) => ApiResp.data),
      map(
        (APIResp) =>
          ({
            season: seasonToImport,
            matches: APIResp.matches,
          } as MatchList)
      ),
      switchMap((mtchList) =>
        forkJoin({
          matchListPubsubPublish: psMessage.publishPubSubMessage(
            'PlayCricket_Match_List_Data',
            mtchList
          ),
          matchListDBWrite: matchListDB.addMatchlist(mtchList),
        })
      )
    );
    /**
     * Resolve function performing the asynchronous processing
     * (also known as "background functions") by returning a JavaScript promise.
     */
    return await lastValueFrom(getPCMactchLlistPS);
  });
