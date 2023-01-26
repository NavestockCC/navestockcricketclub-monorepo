import * as functions from 'firebase-functions/v2/https';
import { initializeApp, applicationDefault } from 'firebase-admin/app';
//import * as admin from 'firebase-admin/app';

/**
 * Import:Test message functions
 * */
import * as AddMessage from './app/add-message/helloNavestock_http';
import * as ListenMessagePubSub from './app/add-message/listenHelloNavestock-pubsub';

/**
 * Import: PlayCricket Match List Import Functions
 * */

//import * as HttpTriggerPlayCricetImport from './app/playcricket-MatchListImport/http/httpTriggerPubSubPlayCricketImport'
//import * as GetPlayCricketMatchListPubSub from './app/playcricket-MatchListImport/pubsub/getPlayCricketMatchList';

/**
 * Import: PlayCricket Match Detail Import Functions
 * */

//import * as ComparePlayCricketMatchDetailPubSub from './app/playcricket-MatchDetailImport/pubsub/playcricketMatchListCompare';
//import * as GetPlayCricketMatchDetailPubSub from './app/playcricket-MatchDetailImport/pubsub/getPlayCricketMatchDetails';
//import * as HttpPublishPlayCricetMatchToImport from './app/playcricket-MatchDetailImport/http/httpTriggerPubSubPlayCricketImport'

/**
 * Import: PlayCricket Player Stats Functions
 */

//import * as GetPlayerStatsPubSub from './app/player-stats/pubsub/player-stats'
//admin.initializeApp({credential: admin.applicationDefault()})

initializeApp({
  credential: applicationDefault(),
});

/*
export const helloworld = functions
.onRequest(
  {
    region: 'europe-west2'
  },
  (request, response) => {
  response.send('Hello from Navestock Cricket Club API');
});
8/

/** 
 *  Test message functions 
 * */
export const addmessage = AddMessage.helloNavestock;
export const addmessagepubsub = ListenMessagePubSub.listenHelloNavestock;

/**
 * PlayCricket MatchList Import Functions : Import matchlist from PlayCricket API
 * */

//export const httpTriggerPlayCricetImport = HttpTriggerPlayCricetImport.httpPublishPlayCricetSeasonToImport;
//export const getPlayCricketMatchListPubSub = GetPlayCricketMatchListPubSub.getPlayCricketMatchListPubSub;

/**
 * PlayCricket Match Detail Import Functions
 * */

//export const comparePlayCricketMatchListubSub = ComparePlayCricketMatchDetailPubSub.comparePlayCricketMatchListPubSub;
//export const getPlayCricketMatchDetailPubSub = GetPlayCricketMatchDetailPubSub.getPlayCricketMatchDetailPubSub;
//export const httpPublishPlayCricetMatchToImport = HttpPublishPlayCricetMatchToImport.httpPublishPlayCricetMatchToImport;

/**
 * Import: PlayCricket Player Stats Functions
 */

//export const getPlayerStatsPubSub = GetPlayerStatsPubSub.getPlayerStatsPubSub;
