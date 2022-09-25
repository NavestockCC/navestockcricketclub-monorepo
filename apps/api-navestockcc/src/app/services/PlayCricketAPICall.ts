import axios from 'axios';
import { from, map, Observable } from 'rxjs';
import * as playcricketCert from "../../environments/PlayCricket";
import {MatchlistPlaycricketAPIRespone } from '@navestockcricketclub/match-interfaces'

const playcricketCredentials = {
    "apitoken" : playcricketCert.firebaseAuthData.api_token,
    "site_id" : playcricketCert.firebaseAuthData.site_id
}



export class PlayCricketMatchListAPICall{
    public getPlayCricketApiMatch_List_v1(seasonID: string): Observable<MatchlistPlaycricketAPIRespone> {
        return from(
          axios({
            method: 'get',
            baseURL: 'https://play-cricket.com/api/v2',
            url: 'matches.json',
            responseType: 'json',
            params: {
              site_id: playcricketCredentials.site_id,
              season: seasonID,
              api_token: playcricketCredentials.apitoken,
            }
          })
        ).pipe(
          map((APIResp) => ({
              status: APIResp.status,
              statusText: APIResp.statusText,
              data: { season: seasonID, matches: APIResp.data.matches }}
          )),
        map(APIResp => APIResp as MatchlistPlaycricketAPIRespone)  
        );
      }

  
        public getPlayCricketApiMatch_List(seasonID: string): Observable<MatchlistPlaycricketAPIRespone> {

          return new Observable( ( observer ) => {
            axios({
              method: 'get',
              baseURL: 'https://play-cricket.com/api/v2',
              url: 'matches.json',
              responseType: 'json',
              params: {
                site_id: playcricketCredentials.site_id,
                season: seasonID,
                api_token: playcricketCredentials.apitoken,
              }
            })
            .then( ( response ) => {
                const MLResp = {
                  status: response.status,
                  statusText: response.statusText,
                  data: { season: seasonID, matches: response.data.matches }
                } as MatchlistPlaycricketAPIRespone;
                observer.next( MLResp );
                observer.complete();
            } )
            .catch( ( error ) => {
                observer.error( error );
            } );
        } );
          }



  public getPlayCricketApiMatch_Detail(matchID: string): Observable<any> {
      return from(
        axios({
          method: 'get',
          baseURL: 'https://play-cricket.com/api/v2',
          url: 'match_detail.json',
          responseType: 'json',
          params: {
            match_id: matchID,
            api_token: playcricketCredentials.apitoken,
          }
        })
      );
    }
}