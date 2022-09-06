import {Timestamp}from 'firebase-admin/firestore';
import { map, Observable } from 'rxjs';
import * as stripTags from 'striptags'

import {
  MatchDescription,
  InningsDescription,
  Innings,
  Bat,
  Bowl,
  FallOfWickets,
} from '@navestockcricketclub/match-interfaces';

export class MatchInterfaceServices {
  /**
   * Sets navestock and opposition attributes
   * @param match
   * @returns navestock and opposition attributes
   */
  public setNavestockAndOppositionAttributes(
    match: MatchDescription
  ): MatchDescription {
    const home_team_isNavestock = this.isNavestockHomeTeam(match.home_club_id);

    //PlayCricket sets away_club_id to undefined when home and away club are the same club
    if (match.away_club_id === undefined) {
      match.away_club_id = match.home_club_id;
      match.away_club_name = match.home_club_name;
    }

    // set the oposition and navestock team info
    if (home_team_isNavestock === true) {
      match.navestock_club_id = match.home_club_id;
      match.navestock_club_name = match.home_club_name;
      match.navestock_team_id = match.home_team_id;
      match.navestock_team_name = match.home_team_name;

      match.opposition_club_id = match.away_club_id;
      match.opposition_club_name = match.away_club_name;
      match.opposition_team_id = match.away_team_id;
      match.opposition_team_name = match.away_team_name;
    } else {
      match.navestock_club_id = match.away_club_id;
      match.navestock_club_name = match.away_club_name;
      match.navestock_team_id = match.away_team_id;
      match.navestock_team_name = match.away_team_name;

      match.opposition_club_id = match.home_club_id;
      match.opposition_club_name = match.home_club_name;
      match.opposition_team_id = match.home_team_id;
      match.opposition_team_name = match.home_team_name;
    }

    return match;
  }

  /** Evaluates the 'home_club_id' to see if it equal to 4513 Which is the Navestock Playcrick club id. */
  private isNavestockHomeTeam(home_club_id: string): boolean {
    let returnVal: boolean;
    if (home_club_id === '4513') {
      returnVal = true;
    } else {
      returnVal = false;
    }
    return returnVal;
  }

  /**
   * Updates string date to firebase timestamp
   * @param dateString
   * @param [timeString]
   * @returns string date to firebase timestamp
   */
  public updateStringDateToFirebaseTimestamp(
    dateString: string,
    timeString?: string
  ): Timestamp {

    //Convert string t date
    const splitDate: string[] = dateString.split('/');

    //If timeString is not defined
    if (timeString === undefined || timeString === '') {
      timeString = '12:00';
    }

    // Create JS Date
    const dateObject = new Date(
      splitDate[2] +
        '-' +
        splitDate[1] +
        '-' +
        splitDate[0] +
        'T' +
        timeString +
        ':00+01:00'
    );

    //Convert JS Date to Firestore Timestamp
    return Timestamp.fromDate(dateObject); 
  }

  /**
   * Updates match description
   * @param match
   * @returns match description
   */
  public updateMatchDescription(
    match: Observable<any>
  ): Observable<MatchDescription> {
    return match.pipe(
      //Transform API Response to MatchDescription
      map((resp) => {
        const mdo = {};
        for (const [k, v] of Object.entries(resp)) {
          if (typeof v != 'object') {
            if (v != undefined && v != '') {
              mdo[k] = v;
            }
          }
        }
        return mdo as MatchDescription;
      }),
      // Remove all HTM tags from match_notes
      map((mtchData) => {
        if (mtchData.match_notes != undefined) {
          mtchData.match_notes = stripTags(mtchData.match_notes);
        }
        return mtchData as MatchDescription;
      }),
      //Set Navestock and Opposition team attributes
      map((mtchData) => {
        return this.setNavestockAndOppositionAttributes(mtchData);
      }),
      //Set date fields to Firebase Timestamps
      map((mtchData) => {
        if (mtchData.last_updated != undefined) {
          mtchData.last_updated_timestamp =
            this.updateStringDateToFirebaseTimestamp(mtchData.last_updated);
        }
        if (mtchData.match_date != undefined) {
          mtchData.match_date_timestamp =
            this.updateStringDateToFirebaseTimestamp(
              mtchData.match_date,
              mtchData.match_time
            );
        }
        return mtchData;
      })
    );
  }

  /**
   * innings
   */
  public innings(match: Observable<any>): Observable<Innings[]> {
    return match.pipe(
      map((resp) => {
        if (Array.isArray(resp.innings) && resp.innings.length) {
          const teamsData = {};
          teamsData[resp.home_team_id] = {
            team_id: resp.home_team_id,
            team_name: resp.home_team_name,
            club_id: resp.home_club_id,
            club_name: resp.home_club_name,
            opposition_id: resp.away_team_id,
            match_id: resp.id
          };
          teamsData[resp.away_team_id] = {
            team_id: resp.away_team_id,
            team_name: resp.away_team_name,
            club_id: resp.away_club_id,
            club_name: resp.away_club_name,
            opposition_id: resp.home_team_id,
            match_id: resp.id
          }; 

          for (let i = 0; i < resp.innings.length ; i++){
            resp.innings[i]['teams'] = teamsData;
          }
          return resp.innings as unknown[];
        } else {
          return [] as unknown[];
        }
      }),
      map((i) => {
        const iArray: Innings[] = [];
        i.forEach((item) =>
          iArray.push({
            description: this.inningsDescription(item),
            bat: this.inningsBat(item),
            bowl: this.inningBowl(item),
            fow: this.inningFallOfWickets(item),
          } as Innings)
        );
        return iArray;
      })
    );
  }

  private inningsDescription(inningsData: any): InningsDescription {
    const ido = {};
    for (const [k, v] of Object.entries(inningsData)) {
      if (typeof v != 'object') {
        if (v != undefined && v != '') {
          ido[k] = this.attributeTypeCorrection('description', v, k);
        }
      }
    }
    //Add additional attributes for teams and clubs
    ido['team_batting_name'] = inningsData.teams[inningsData['team_batting_id']].team_name;
    ido['club_batting_id'] = inningsData.teams[inningsData['team_batting_id']].club_id;
    ido['club_batting_name'] = inningsData.teams[inningsData['team_batting_id']].club_name;
    ido['team_bowling_id'] = inningsData.teams[inningsData['team_batting_id']].opposition_id;
    ido['team_bowling_name'] = inningsData.teams[ido['team_bowling_id']].team_name;
    ido['club_bowling_id'] = inningsData.teams[ido['team_bowling_id']].club_id;
    ido['club_bowling_name'] = inningsData.teams[ido['team_bowling_id']].club_name;
    ido['match_id'] = inningsData.teams[inningsData['team_batting_id']].match_id;
    return ido as InningsDescription;
  }

  private inningsBat(inningsData: any): Bat[] {
    const ido: Bat[] = [];
    if (Array.isArray(inningsData.bat) && inningsData.bat.length) {
      inningsData.bat.forEach((element) => {
        const idbo = {};
        for (const [k, v] of Object.entries(element)) {
          if (typeof v != 'object') {
            if (v != undefined && v != '') {
              idbo[k] = this.attributeTypeCorrection('bat', v, k);
            }
          }
        }
        //Add additional attributes for teams and clubs
        idbo['club_id'] = inningsData.teams[inningsData['team_batting_id']].club_id;
        idbo['club_name'] = inningsData.teams[inningsData['team_batting_id']].club_name;
        idbo['team_id'] = inningsData.teams[inningsData['team_batting_id']].team_id;
        idbo['team_name'] = inningsData.teams[inningsData['team_batting_id']].team_name;
        idbo['team_bowling_id'] = inningsData.teams[inningsData['team_batting_id']].opposition_id;
        idbo['club_bowling_id'] = inningsData.teams[idbo['team_bowling_id']].club_id;
        idbo['club_bowling_name'] = inningsData.teams[idbo['team_bowling_id']].club_name;
        idbo['team_bowling_name'] = inningsData.teams[idbo['team_bowling_id']].team_name;
        idbo['match_id'] = inningsData.teams[inningsData['team_batting_id']].match_id;
        ido.push(idbo as Bat);
      });
    }
    return ido;
  }

  private inningBowl(inningsData: any): Bowl[] {
    const ido: Bowl[] = [];
    if (Array.isArray(inningsData.bowl) && inningsData.bowl.length) {
      inningsData.bowl.forEach((element) => {
        const idbo = {};
        for (const [k, v] of Object.entries(element)) {
          if (typeof v != 'object') {
            if (v != undefined && v != '') {
              idbo[k] = this.attributeTypeCorrection('bowl', v, k);
            }
          }
        }
        //Add additional attributes for teams and clubs
        idbo['club_batting_id'] = inningsData.teams[inningsData['team_batting_id']].club_id;
        idbo['club_batting_name'] = inningsData.teams[inningsData['team_batting_id']].club_name;
        idbo['team_batting_id'] = inningsData.teams[inningsData['team_batting_id']].team_id;
        idbo['team_batting_name'] = inningsData.teams[inningsData['team_batting_id']].team_name;
        idbo['team_id'] = inningsData.teams[inningsData['team_batting_id']].opposition_id;
        idbo['club_id'] = inningsData.teams[idbo['team_id']].club_id;
        idbo['club_name'] = inningsData.teams[idbo['team_id']].club_name;
        idbo['team_name'] = inningsData.teams[idbo['team_id']].team_name;
        idbo['match_id'] = inningsData.teams[inningsData['team_batting_id']].match_id;
        ido.push(idbo as Bowl);
      });
    }
    return ido;
  }

  private inningFallOfWickets(inningsData: any): FallOfWickets[] {
    const ido: FallOfWickets[] = [];
    if (Array.isArray(inningsData.fow) && inningsData.fow.length) {
      inningsData.fow.forEach((element) => {
        const idbo: unknown = {};
        for (const [k, v] of Object.entries(element)) {
          if (typeof v != 'object') {
            if (v != undefined && v != '') {
              idbo[k] = this.attributeTypeCorrection('fow', v, k);
            }
          }
        }
        //Add additional attributes for teams and clubs
        idbo['club_batting_id'] = inningsData.teams[inningsData['team_batting_id']].club_id;
        idbo['club_batting_name'] = inningsData.teams[inningsData['team_batting_id']].club_name;
        idbo['team_batting_id'] = inningsData.teams[inningsData['team_batting_id']].team_id;
        idbo['team_batting_name'] = inningsData.teams[inningsData['team_batting_id']].team_name;
        idbo['team_bowling_id'] = inningsData.teams[inningsData['team_batting_id']].opposition_id;
        idbo['club_bowling_id'] = inningsData.teams[idbo['team_bowling_id']].club_id;
        idbo['club_bowling_name'] = inningsData.teams[idbo['team_bowling_id']].club_name;
        idbo['team_bowling_name'] = inningsData.teams[idbo['team_bowling_id']].team_name;
        idbo['match_id'] = inningsData.teams[inningsData['team_batting_id']].match_id;
        ido.push(idbo as FallOfWickets);
      });
    }
    return ido;
  }

  private attributeTypeCorrection(
    interfaceObject: string,
    attributeValue: string | number | boolean | unknown,
    attributeKey: string
  ): string | number | boolean {
    const interfaceObjectSamples: { bat: Bat, bowl: Bowl, fow: FallOfWickets, description:InningsDescription } =
      {
        bat: {
          position: 0,
          batsman_name: '',
          batsman_id: '',
          how_out: '',
          fielder_name: '',
          fielder_id: '',
          bowler_name: '',
          bowler_id: '',
          runs: 0,
          fours: 0,
          sixes: 0,
          balls: 0,
        },
        bowl: {
          bowler_name: '',
          bowler_id: '',
          overs: 0,
          maidens: 0,
          runs: 0,
          wides: 0,
          wickets: 0,
          no_balls: 0,
        },
        fow: {
          runs: 0,
          wickets: 0,
          batsman_out_name: '',
          batsman_out_id: '',
          batsman_in_name: '',
          batsman_in_id: '',
          batsman_in_runs: 0,
        },
        description:{
          team_batting_name: "",
          team_batting_id: "",
          team_bowling_name: "",
          team_bowling_id: "",
          innings_number: 0,
          extra_byes: 0,
          extra_leg_byes: 0,
          extra_wides: 0,
          extra_no_balls: 0,
          extra_penalty_runs: 0,
          penalties_runs_awarded_in_other_innings: 0,
          total_extras: 0,
          runs: 0,
          wickets: 0,
          overs: 0,
          balls: 0,
          declared: true,
          revised_target_runs: 0,
          revised_target_overs: 0,
          revised_target_balls: 0
        }
      };

    let returnAttributeValue;
    const interfaceToTest = interfaceObjectSamples[interfaceObject];
    if (typeof interfaceToTest[attributeKey] === typeof attributeValue) {
      returnAttributeValue = attributeValue;
    } else if (
      typeof attributeValue === 'string' &&
      typeof interfaceToTest[attributeKey] === 'number'
    ) {
      returnAttributeValue = +attributeValue;
    } else if (
      typeof attributeValue === 'number' &&
      typeof interfaceToTest[attributeKey] === 'string'
    ) {
      returnAttributeValue = attributeValue.toString();
    } else if (
      typeof attributeValue === 'string' &&
      typeof interfaceToTest[attributeKey] === 'boolean'
    ) {
      returnAttributeValue = attributeValue.toLocaleLowerCase() === 'true';
    }

    return returnAttributeValue;
  }
}
