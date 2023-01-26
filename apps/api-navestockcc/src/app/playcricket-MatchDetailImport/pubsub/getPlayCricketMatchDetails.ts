/**
 * Navestock Firebase Function
 * @author Lefras Coetzee
 * @description BackgroundFunction to trigger by publishing data<MatchId> to [Match_Detail_Import] PubSub Topic.
 * @description The function takes the MatchId and retrieved Match Details from the PlayCricket API
 * @description Data retrieved from the Play Cricket Api is transformed in to an Object:Match and written to the Firestore Fixtures collection
 */

import * as functions from 'firebase-functions/v1';
import { forkJoin, lastValueFrom, map, switchMap } from 'rxjs';

import { MatchInterfaceServices } from '../services/match.interface.service';
import { PlayCricketMatchListAPICall } from '../../services/PlayCricketAPICall';
import { MatchListImport } from '../services/matchImportDB.service';
import { Match } from '@navestockcricketclub/match-interfaces';
import { PublishPubSubMessage } from '../../services/PublishPubSubMessage';

export const getPlayCricketMatchDetailPubSub = functions
  .region('europe-west2')
  .runWith({ memory: '128MB', timeoutSeconds: 60 })
  .pubsub.topic('Match_Detail_Import')
  .onPublish(async (msgPayload) => {
    const psMessage = new PublishPubSubMessage();
    const MLI = new MatchListImport();
    const PCAPICall = new PlayCricketMatchListAPICall();
    const matchInterfaceServices = new MatchInterfaceServices();

    /**
     * Ensure matchId is a string
     */
    let matchID = '';
    if (typeof msgPayload.json.matchid === 'string') {
      matchID = msgPayload.json.matchid;
    } else if (typeof msgPayload.json.matchid === 'number') {
      matchID = msgPayload.json.matchid.toString();
    }

    /**
     * Observable to
     * 1. get detailed match information from PlayCricket API
     * 2. then extract the match details from the Payload data
     * 3. format the data into a Match interface Object
     * 4. write the Match data to the Firestore collection Fixtures.<Match ID>
     */
    const getPCMatchDetail = PCAPICall.getPlayCricketApiMatch_Detail(
      matchID
    ).pipe(
      map((resp) => resp.data.match_details[0]),
      map(
        (APIResp$) =>
          ({
            description:
              matchInterfaceServices.updateMatchDescription(APIResp$),
            innings: matchInterfaceServices.innings(APIResp$),
          } as Match)
      ),
      switchMap((mData) =>
        forkJoin({
          matchDetailPubsubPublish: psMessage.publishPubSubMessage(
            'PlayCricket_Match_Details_Data',
            mData
          ),
          matchDetailDBWrite: MLI.updateMatchDetails(mData),
        })
      )
    );

    /**
     * Resolve function performing the asynchronous processing
     * (also known as "background functions") by returning a JavaScript promise.
     */
    return await lastValueFrom(getPCMatchDetail).catch((e) =>
      functions.logger.debug(`getPlayCricketMatchDetailPubSub: ${e}`)
    );
  });
