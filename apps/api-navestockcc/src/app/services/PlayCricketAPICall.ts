import axios from 'axios';
import { from, Observable } from 'rxjs';
import * as playcricketCert from "../../environments/PlayCricket";

const playcricketCredentials = {
    "apitoken" : playcricketCert.firebaseAuthData.api_token,
    "site_id" : playcricketCert.firebaseAuthData.site_id
}



export class PlayCricketMatchListAPICall {
    public getPlayCricketApiMatch_List(seasonID: string): Observable<any> {
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
        );
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