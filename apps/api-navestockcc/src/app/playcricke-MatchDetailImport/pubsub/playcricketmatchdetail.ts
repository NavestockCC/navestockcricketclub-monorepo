import * as functions from 'firebase-functions';
import { MatchList } from '@navestockcricketclub/match-interfaces';

import { ComparisonService } from '../services/comparison.service';
import { MatchListImport } from '../services/matchImportDB.service';
import { PublishPubSubMessage } from '../../services/PublishPubSubMessage';

export const comparePlayCricketMatchDetailPubSub = functions.pubsub
  .topic('PlayCricket_Match_List_Data')
  .onPublish((msgPayload) => {
    try {
      const payloadData = msgPayload.json as MatchList;
      const seasonToImport: string = payloadData.season;
      const compServ = new ComparisonService();
      const mlDB = new MatchListImport();
      const pubSubWrite = new PublishPubSubMessage();

      mlDB.getMatchListImportData(seasonToImport).subscribe((resp) => {
        // Compare PlayCricket match list(payloadData) with match list kept in DB
        const matchListToUpdate: number[] =
          compServ.matchListComparisonOrchestrator(payloadData, resp);
        //Write all march ID's from the comparison to pubsub(Match_Detail_Import) to trigger import of match details
          matchListToUpdate.forEach((matchId) => {
          pubSubWrite.publishPubSubMessage('Match_Detail_Import', matchId)
          .subscribe({
            next: (v) =>
              functions.logger.log(
                `PubSub Message ${v} published to topic Match_Detail_Import`
              ),
            error: (e) => {
              functions.logger.error(`error code ${e.code}, details: ${e.details}`);
            },
            complete: () => functions.logger.log('published to topic: Match_Detail_Import complete'),
          });
        });
        //Update match list kept in the DB to the new match list down loaded from PlayCricket
        mlDB.setMatchListImportData(payloadData, seasonToImport);
      });

      return {
        function: 'comparePlayCricketMatchDetailPubSub',
        status: 'success',
      };
    } catch (error) {
      functions.logger.error(
        `getPlayCricketMatchDetailsPubSub: excution error: ${error}`
      );

      return {
        function: 'comparePlayCricketMatchDetailPubSub',
        status: 'error',
      };
    }
  });
