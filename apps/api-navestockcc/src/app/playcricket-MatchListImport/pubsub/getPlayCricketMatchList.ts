/**
 * Navestock Firebase Function
 * @author Lefras Coetzee
 * @description Function to pull Match Details from the PlayCricket Match Details API.
 * @description The function is triggered from the 'Match_Detail_Import_PubSub' PubSup topic
 *
 */

import * as functions from 'firebase-functions';

import { PlayCricketMatchListAPICall } from '../../services/PlayCricketAPICall';
import { MatchListDB } from '../services/MatchList_DB_service';
import { PublishPubSubMessage } from '../../services/PublishPubSubMessage';
import { map, switchMap} from 'rxjs/operators';
import { MatchList } from '@navestockcricketclub/match-interfaces';
import { forkJoin, lastValueFrom} from 'rxjs';

export const getPlayCricketMatchListPubSub = functions
  .region('europe-west2')
  .pubsub.topic('Match_List_Import')
  .onPublish(async (msgPayload) => {
    // Retrieve Season from PubSub: Match_List_Import
    let seasonToImport: string;
    if (msgPayload.json.season === undefined) {
      seasonToImport = new Date().getFullYear().toString();
    } else {
      seasonToImport = msgPayload.json.season;
    }

    const PCAPICall = new PlayCricketMatchListAPICall();
    const psMessage = new PublishPubSubMessage();
    const matchListDB = new MatchListDB();

  const getPCMactchLlistPS = PCAPICall.getPlayCricketApiMatch_List(seasonToImport)
    .pipe(
      map((ApiResp) => ApiResp.data),
      map((APIResp) => ({
        season: seasonToImport,
        matches: APIResp.matches
        } as MatchList)),
      switchMap(mtchList => forkJoin({
        matchListPubsubPublish: psMessage.publishPubSubMessage('PlayCricket_Match_List_Data',mtchList),
        matchListDBWrite: matchListDB.addMatchlist(mtchList)
      }))
     
    )
    
  return await lastValueFrom(getPCMactchLlistPS);  
  });
