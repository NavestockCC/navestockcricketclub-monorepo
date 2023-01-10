import { Timestamp } from 'firebase-admin/firestore';

export {
  MatchlistPlaycricketAPIRespone,
  MatchDetailPlaycricketAPIRespone,
  MatchList,
  Match,
  MatchDescription,
  Innings,
  InningsDescription,
  Bat,
  Bowl,
  FallOfWickets,
  Team,
  Player,
  PlayerStats,
  PlayerStatsMatch,
};

/**
 * @description Interface describing the data returned by the getPlayCricketApiMatch_List
 * @field {string} status - axios http return status code
 * @field {string} statusText - axios http return status description
 * @field { season: string, matches: MatchDescription[] } data - data returned by the http call
 */
interface MatchlistPlaycricketAPIRespone {
  status: number;
  statusText: string;
  data: { season: string; matches: MatchDescription[] };
}

/**
 * @description Interface describing the data returned by the getPlayCricketApiMatch_Detail
 * @field {string} status - axios http return status code
 * @field {string} statusText - axios http return status description
 * @field {match_details: any[]} data - data returned by the http call
 */
interface MatchDetailPlaycricketAPIRespone {
  status: number;
  statusText: string;
  data: { match_details: any[] };
}

/**
 * Match list
 * @field {number} season - number representing the season year
 * @field {Match[]} matches - array of {Match} the be played in a year
 */
interface MatchList {
  season: string;
  matches: MatchDescription[];
}
/**
 * @interface Match
 * @field {MatchDescription} description - describes the detailed match information
 * @field {Innings[]?} innings - information on each innings played
 * @field {Team[]?} players - each team with their squad members
 */
interface Match {
  description: MatchDescription;
  innings?: Innings[];
  players?: Team[];
}

/**
 * MatchDescription Interface
 * @date 1/3/2023 - 9:08:27 AM
 *
 * @interface MatchDescription
 * @field {number} id - Match ID
 * @field {string} status - Status of the match
 * @field {string} published - Is the match published
 * @field {string} last_updated - Date string of the last update to the match
 * @field {Timestamp} last_updated_timestamp? - <Firestore Timestamp> of the Date string of the last update to the match
 * @field {string} league_name? - Name of the league
 * @field {string} league_id? - League ID
 * @field {string} competition_name - Competition name
 * @field {string} competition_id?: string - Competition ID
 * @field {string} competition_type - Competition type (League | Friendly)
 * @field {string} match_type?: string;
 * @field {string} game_type?: string;
 * @field {string} season?: string;
 * @field {string} match_date: string;
 * @field {Timestamp} match_date_timestamp?: Timestamp;
 * @field {string} match_time - Time at which the match is played
 * @field {string} ground_name? - Name of the ground at which the match is played
 * @field {string} ground_id? - ID of the ground at which the match is played
 * @field {string} ground_latitude? = Ground Latitude coordinate
 * @field {string} ground_longitude? - Ground Longitude coordinate
 * @field {string} home_club_name? - Name of the club who is hosting the match
 * @field {string} home_team_name?  - Name of the team who is hosting the match
 * @field {string} home_team_id? - ID of the team who is hosting the match
 * @field {string} home_club_id?  - ID of the club who is hosting the match
 * @field {string} away_club_name?  - Name of the traveling club
 * @field {string} away_team_id?   - Name of the traveling team
 * @field {string} away_club_id?  - ID of the traveling club
 * @field {string} umpire_1_name?
 * @field {string} umpire_1_id?
 * @field {string} umpire_2_name?
 * @field {string} umpire_2_id?
 * @field {string} umpire_3_name?
 * @field {string} umpire_3_id?
 * @field {string} referee_name
 * @field {string} referee_id?
 * @field {string} scorer_1_name
 * @field {string} scorer_1_id?
 * @field {string} scorer_2_name
 * @field {string} scorer_2_id?
 * @field {boolean} home_team_isNavestock? - Is Navestock hosting the match
 * @field {string} navestock_club_name? - Navestock club name
 * @field {string} navestock_team_name? - Navestock team name
 * @field {string} navestock_team_id?  - Navestock team ID
 * @field {string} navestock_club_id? - Navestock club ID 
 * @field {string} opposition_club_name? - Opposition club name
 * @field {string} opposition_team_name? - Opposition team name
 * @field {string} opposition_team_id? - Opposition team ID
 * @field {string} opposition_club_id? - Opposition club ID
 * @field {string} toss_won_by_team_id? - Team ID of the team who won the toss
 * @field {string} toss? - Team Name of the team who won the toss
 * @field {string} batted_first? - ID of the team who batted first
 * @field {string} no_of_overs? - number of overs per team
 * @field {boolean} result_updated? - Has the result been updated
 * @field {string} result_description? - Description of the result
 * @field {string} result_applied_to?
 * @field {string} match_notes? - Notes summerising the match highlights
 */
interface MatchDescription {
  id: number;
  status: string;
  published: string;
  last_updated: string;
  last_updated_timestamp?: Timestamp;
  league_name?: string;
  league_id?: string;
  competition_name?: string;
  competition_id?: string;
  competition_type?: string;
  match_type?: string;
  game_type?: string;
  season?: string;
  match_date: string;
  match_date_timestamp?: Timestamp;
  match_time: string;
  ground_name?: string;
  ground_id?: string;
  ground_latitude?: string;
  ground_longitude?: string;
  home_club_name?: string;
  home_team_name?: string;
  home_team_id?: string;
  home_club_id?: string;
  away_club_name?: string;
  away_team_name?: string;
  away_team_id?: string;
  away_club_id?: string;
  umpire_1_name?: string;
  umpire_1_id?: string;
  umpire_2_name?: string;
  umpire_2_id?: string;
  umpire_3_name?: string;
  umpire_3_id?: string;
  referee_name?: string;
  referee_id?: string;
  scorer_1_name?: string;
  scorer_1_id?: string;
  scorer_2_name?: string;
  scorer_2_id?: string;
  home_team_isNavestock?: boolean;
  navestock_club_name?: string;
  navestock_team_name?: string;
  navestock_team_id?: string;
  navestock_club_id?: string;
  opposition_club_name?: string;
  opposition_team_name?: string;
  opposition_team_id?: string;
  opposition_club_id?: string;
  toss_won_by_team_id?: string;
  toss?: string;
  batted_first?: string;
  no_of_overs?: string;
  result_updated?: boolean;
  result_description?: string;
  result_applied_to?: string;
  match_notes?: string;
}

/**
 * Innings interface for the team
 * @date 1/3/2023 -  9:00:53 AM
 *
 * @interface Innings
 * @field {InningsDescription} description
 * @field {Array.Bat} bat?
 * @field {Array.Bowl} bowl?
 * @field {Array.FallOfWickets} fow?
 */
interface Innings {
  description: InningsDescription;
  bat?: Bat[];
  bowl?: Bowl[];
  fow?: FallOfWickets[];
}

interface InningsDescription {
  team_batting_name: string;
  team_batting_id: string;
  club_batting_name?: string;
  club_batting_id?: string;
  team_bowling_name?: string;
  team_bowling_id?: string;
  club_bowling_name?: string;
  club_bowling_id?: string;
  innings_number?: number;
  extra_byes?: number;
  extra_leg_byes?: number;
  extra_wides?: number;
  extra_no_balls?: number;
  extra_penalty_runs?: number;
  penalties_runs_awarded_in_other_innings?: number;
  total_extras?: number;
  runs?: number;
  wickets?: number;
  overs?: number;
  balls?: number;
  declared?: boolean;
  revised_target_runs?: number;
  revised_target_overs?: number;
  revised_target_balls?: number;
  match_id?: number;
}

interface Bat {
  type?: string;
  team_bowling_name?: string;
  team_bowling_id?: string;
  club_bowling_name?: string;
  club_bowling_id?: string;
  position: number;
  batsman_name: string;
  batsman_id: string;
  team_name?: string;
  team_id?: string;
  club_name?: string;
  club_id?: string;
  how_out?: string;
  fielder_name?: string;
  fielder_id?: string;
  bowler_name?: string;
  bowler_id?: string;
  runs?: number;
  fours?: number;
  sixes?: number;
  balls?: number;
  match_id?: number;
  player_id?: string;
  player_name?: string;
}

interface Bowl {
  type?: string;
  bowler_name: string;
  bowler_id: string;
  team_name?: string;
  team_id?: string;
  club_name?: string;
  club_id?: string;
  overs?: number;
  maidens?: number;
  runs?: number;
  wides?: number;
  wickets?: number;
  no_balls?: number;
  match_id?: number;
  team_batting_name?: string;
  team_batting_id?: string;
  club_batting_name?: string;
  club_batting_id?: string;
  player_id?: string;
  player_name?: string;
}

interface FallOfWickets {
  runs: number;
  wickets: number;
  batsman_out_name: string;
  batsman_out_id: string;
  batsman_in_name?: string;
  batsman_in_id?: string;
  batsman_in_runs?: number;
  match_id?: number;
  team_batting_name?: string;
  team_batting_id?: string;
  club_batting_name?: string;
  club_batting_id?: string;
  team_bowling_name?: string;
  team_bowling_id?: string;
  club_bowling_name?: string;
  club_bowling_id?: string;
}

interface Team {
  team_id: string;
  team_name: string;
  squad?: Player[];
}

interface Player {
  position?: number;
  player_name: string;
  player_id: string;
  captain?: boolean;
  wicket_keeper?: boolean;
}

interface PlayerStats {
  player_id: string;
  player_name?: string;
  bat?: Bat;
  bowl?: Bowl;
}


/**
 * Description placeholder
 * @date 1/3/2023 - 12:04:29 PM
 *
 * @interface PlayerStatsMatch
 * @typedef {PlayerStatsMatch}
 * @extends {PlayerStats}
 * 
 * @field {MatchDescription} matchdescription
 */
interface PlayerStatsMatch extends PlayerStats{
  matchdescription: MatchDescription;
}
