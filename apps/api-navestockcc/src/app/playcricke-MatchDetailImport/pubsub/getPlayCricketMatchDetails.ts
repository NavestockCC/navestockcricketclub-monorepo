
import * as functions from 'firebase-functions';
import {lastValueFrom, map, switchMap} from 'rxjs';

import { MatchInterfaceServices } from "../services/match.interface.service";
import { PlayCricketMatchListAPICall } from '../../services/PlayCricketAPICall';
import { MatchListImport } from "../services/matchImportDB.service";
import { Match } from '@navestockcricketclub/match-interfaces';




export const getPlayCricketMatchDetailPubSub = functions
.region('europe-west2')
.pubsub
  .topic('Match_Detail_Import')
  .onPublish(async (msgPayload) => {
   
        const MLI= new MatchListImport();
        const PCAPICall = new PlayCricketMatchListAPICall();
        const matchInterfaceServices = new MatchInterfaceServices();
        let matchID = '';
        if(typeof msgPayload.json.matchid === 'string'){
          matchID = msgPayload.json.matchid;
      } else if(typeof msgPayload.json.matchid === 'number'){
          matchID = msgPayload.json.matchid.toString();
        } 





  const getPCMatchDetail = PCAPICall.getPlayCricketApiMatch_Detail(matchID).pipe(
          map((resp) => resp.data.match_details[0]),
          map((APIResp$) => ({
            description: matchInterfaceServices.updateMatchDescription(APIResp$),
            innings: matchInterfaceServices.innings(APIResp$)
            } as Match)),
          switchMap(mData => MLI.updateMatchDetails(mData)),
        )
        
  return await lastValueFrom(getPCMatchDetail);      
    
  })