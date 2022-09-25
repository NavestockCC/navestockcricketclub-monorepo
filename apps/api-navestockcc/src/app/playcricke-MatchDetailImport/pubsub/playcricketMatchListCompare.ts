import * as functions from 'firebase-functions';
import { MatchList } from '@navestockcricketclub/match-interfaces';

import { ComparisonService } from '../services/comparison.service';
import { MatchListImport } from '../services/matchImportDB.service';
import { PublishPubSubMessage } from '../../services/PublishPubSubMessage';
import {  mergeMap, map, concat, lastValueFrom } from 'rxjs';
/**
 * PubSub trigger to compare MatchList from PlayCricket with MatchList last imported
 * Publishes a list of PubSub messages for matches which need updating
 */
export const comparePlayCricketMatchListPubSub = functions
.region('europe-west2')
.pubsub
  .topic('PlayCricket_Match_List_Data')
  .onPublish(async (msgPayload) => {


      const payloadData = msgPayload.json as MatchList;
      const seasonToImport: string = payloadData.season;
      const compServ = new ComparisonService();
      const mlDB = new MatchListImport();
      const pubSubWrite = new PublishPubSubMessage();

      const matchesToUpdate = mlDB
        .getMatchListImportData(seasonToImport)
        .pipe(
          mergeMap((mlData) =>
            compServ.matchListComparisonOrchestrator(payloadData, mlData)
          ),
          map(matchToImport => JSON.stringify({"matchid": matchToImport})),
          mergeMap((matchToImport) =>
            pubSubWrite.publishPubSubMessage(
              'Match_Detail_Import',
              matchToImport
            )
          )
        );

      const  matchListImportDB = mlDB
      .setMatchListImportData(payloadData, seasonToImport);


    const compareMatchList = concat(
      matchesToUpdate,
      matchListImportDB
  );

    return await lastValueFrom(compareMatchList);


  });
