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

import { map,} from 'rxjs/operators'

const matchListDB = new MatchListDB();

export const getPlayCricketMatchListPubSub = functions
.region('europe-west2')
.pubsub
  .topic('Match_List_Import')
  .onPublish((msgPayload) => {
    try {

      // Retrieve Season from PubSub: Match_List_Import
      let seasonToImport: string;
      if (msgPayload.json.season === undefined){
        seasonToImport = new Date().getFullYear().toString();
      } else {
        seasonToImport = msgPayload.json.season;
      }
     
     
      const PCAPICall = new PlayCricketMatchListAPICall();
      const psMessage = new PublishPubSubMessage();

      PCAPICall.getPlayCricketApiMatch_List(seasonToImport).pipe(
        map((APIResp) => ({
          status: APIResp.status,
          statusText: APIResp.statusText,
          data: { season: seasonToImport, matches: APIResp.data.matches },
        }))
      ).subscribe(
        mlData => {
            matchListDB.addMatchlist(mlData.data);
            psMessage.publishPubSubMessage('PlayCricket_Match_List_Data', mlData.data)
            .subscribe({
              next: (v) =>
                console.log(
                  `PubSub Message ${v} published to topic PlayCricket_Match_List_Data`
                ),
              error: (e) => {
                console.error(`error code ${e.code}, details: ${e.details}`);
              },
              complete: () => console.info('published to topic complete'),
            });
        }
      );
      return {function: 'getPlayCricketMatchListPubSub', status: 'success'};
      }
      catch (error) {
        functions.logger.error(error);
        return {function: 'getPlayCricketMatchListPubSub', status: 'error'};
      }
    }
  )
  
