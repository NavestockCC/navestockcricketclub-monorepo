/**
 * Firebase Function
 * @author Lefras Coetzee
 * @description Function to import the player stats pulled from the PlayCricket Match Details API.   
 * @description The function is triggered from the 'PlayCricket_Match_Details' PubSup topic
 * 


import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { DocumentReference, WriteBatch } from '@google-cloud/firestore';

//Navestock
import { match } from '../objects/match.object';
import { batting } from '../objects/batting.object';
import { bowling } from '../objects/bowling.object';
import { MatchServices } from '../playcricket-MatchDetailImport/services/match_Services';
import { InningsDetailsServices } from '../playcricket-MatchDetailImport/services/inningsdetails_Services';


export const playerStatsImport = functions.pubsub
    .topic('PlayCricket_Match_Details_Data')
    .onPublish(msgPayload => {

        if (msgPayload.json.match_details === undefined) {
            console.error(new Error('E_playerStatsImportMatch_0: Details not found'));
            return 'playerStatsImport: execution ERROR!!!';
        } else {
            const afs = admin.firestore();
            const playerStatsBatch: WriteBatch = afs.batch();

            const matchServices = new MatchServices();
            const inningsDetailsServices = new InningsDetailsServices();

            const matchObject: match = matchServices.creatMatchObject({ match_details: msgPayload.json.match_details });
            if (matchObject.result_updated === true) {

                const inningsImportData = msgPayload.json.match_details[0].innings; //Extract the innings data

                // Extract innings data from the match data
                if (inningsImportData !== null) {
                    //Read each innings and extract the innings scores and team info
                    inningsImportData.forEach((inningsElement: any) => {
                        if (inningsElement.team_batting_id === matchObject.navestock_team_id) {
                            inningsElement.bat.forEach((batElement: any) => {
                                try {
                                    const battingData: batting = inningsDetailsServices.createBattingObject(batElement);
                                    const playerStatsObject = {'palyerid': battingData.batsman_id, 'playername': battingData.batsman_name};

                                    Object.assign(
                                        playerStatsObject, 
                                        matchObject, 
                                        {
                                         'batsman_id': battingData.batsman_id,
                                         'batsman_name': battingData.batsman_name,
                                         'batsman_bowler_id': battingData.bowler_id,
                                         'batsman_bowler_name': battingData.bowler_name,
                                         'batsman_fielder_id': battingData.fielder_id,
                                         'batsman_fielder_name': battingData.fielder_name,
                                         'batsman_fours': battingData.fours,
                                         'batsman_how_out': battingData.how_out,
                                         'batsman_position': battingData.position,
                                         'batsman_runs': battingData.runs,
                                         'batsman_sixes': battingData.sixes
                                        })

                                    //Write data to playerstats, by adding it to the playerStatsBatch
                                    const dRefPlayer: DocumentReference = afs.collection('PlayerStats').doc(playerStatsObject.palyerid.toString());
                                    const dRefStats: DocumentReference = afs.collection('PlayerStats').doc(playerStatsObject.palyerid.toString()).collection('matches').doc(matchObject.id.toString());
                                    playerStatsBatch.set(dRefPlayer, {'palyerid': battingData.batsman_id, 'playername': battingData.batsman_name}, { merge: true });
                                    playerStatsBatch.set(dRefStats, playerStatsObject, { merge: true });

                                    //Write data to Nonours Board, by adding it to the playerStatsBatch
                                    if(battingData.runs >= 100){
                                        const dbRefHB: DocumentReference = afs.collection('HonoursBoard').doc(playerStatsObject.palyerid.toString() + matchObject.id.toString());
                                        playerStatsBatch.set(dbRefHB,  playerStatsObject, { merge: true });
                                    }

                                }
                                catch{
                                    (e: any) => console.error(new Error('E_playerStatsImport_1: ' + e));
                                }

                            });
                        }
                        else {
                            //extract bowling data from innings
                            inningsElement.bowl.forEach((bowlElement: any) => {
                                try {
                                    const bowlingData: bowling = inningsDetailsServices.createBolingObject(bowlElement);

                                    const playerStatsObject = {'palyerid': bowlingData.bowler_id, 'playername': bowlingData.bowler_name}
                                    Object.assign(
                                            playerStatsObject, 
                                            matchObject, 
                                            {
                                             'bowler_id': bowlingData.bowler_id,
                                             'bowler_name':bowlingData.bowler_name,
                                             'bowler_maidens': bowlingData.maidens,
                                             'bowler_no_balls': bowlingData.no_balls,
                                             'bowler_overs': bowlingData.overs,
                                             'bowler_runs': bowlingData.runs,
                                             'bowler_wickets': bowlingData.wickets,
                                             'bowler_wides': bowlingData.wides
                                            })

                                //Write data to playerstats, by adding it to the playerStatsBatch
                                const dRefPlayer: DocumentReference = afs.collection('PlayerStats').doc(playerStatsObject.palyerid.toString());
                                const dRefStats: DocumentReference = afs.collection('PlayerStats').doc(playerStatsObject.palyerid.toString()).collection('matches').doc(matchObject.id.toString());
                                playerStatsBatch.set(dRefPlayer, {'palyerid': bowlingData.bowler_id, 'playername': bowlingData.bowler_name}, { merge: true });
                                playerStatsBatch.set(dRefStats, playerStatsObject, { merge: true });

                                    if(bowlingData.wickets >= 5){
                                        const dbRefHB: DocumentReference = afs.collection('HonoursBoard').doc(playerStatsObject.palyerid.toString() + matchObject.id.toString());
                                        playerStatsBatch.set(dbRefHB, playerStatsObject, { merge: true });
                                    }
                                }
                                catch{
                                    (e: any) => console.error(new Error('E_playerStatsImport_2 ' + e));
                                }

                            })
                        }
                    });

                }
            }

            playerStatsBatch.commit().then(
                wrteResults => {
                    if(wrteResults.length > 0){
                        console.log(wrteResults.length + ' docs updated for Playerstats'  + ' @ ' + wrteResults[0].writeTime.toDate());
                    };
                }
            ).catch(
                err => {
                    console.error(new Error('E_playerStatsImport_4: ' + err));
                }
            );

            return 'playerStatsImport: completed sucessfully'; // Let firebase function know it can terminate the function  
        }
    })

     */