
import * as functions from 'firebase-functions';
import { connect, forkJoin, map } from 'rxjs';

import { MatchInterfaceServices } from "../services/match.interface.service";
import { PlayCricketMatchListAPICall } from '../../services/PlayCricketAPICall';
import { MatchListImport } from "../services/matchImportDB.service";



export const getPlayCricketMatchDetailPubSub = functions.pubsub
  .topic('Match_Detail_Import')
  .onPublish((msgPayload) => {
    try {
        const MLI= new MatchListImport();
        const matchID = msgPayload.json;
        const PCAPICall = new PlayCricketMatchListAPICall();
        const matchInterfaceServices = new MatchInterfaceServices();
 
        PCAPICall.getPlayCricketApiMatch_Detail(matchID.toString()).pipe(
          map((resp) => {return resp.data.match_details[0];}),
          connect((APIResp$) => forkJoin({
            description: matchInterfaceServices.updateMatchDescription(APIResp$),
            innings: matchInterfaceServices.innings(APIResp$)
          }))
        ).subscribe(
          mData => {
            MLI.updateMatchDetails(mData);
          }
        );

        return {function: 'getPlayCricketMatchDetailPubSub', status: 'success'}
    } catch (error) {
        functions.logger.warn(error)
        return {function: 'getPlayCricketMatchDetailPubSub', status: 'error'}
    }

    
  });