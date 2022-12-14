import * as functions from 'firebase-functions';
import {initializeApp}from 'firebase-admin/app';

/**  
 * Import:Test message functions 
 * */
import * as AddMessage from './app/add-message/helloNavestock_http';
import * as ListenMessagePubSub from './app/add-message/listenHelloNavestock-pubsub';

/**  
 * Import: PlayCricket Match List Import Functions
 * */

import * as HttpTriggerPlayCricetImport from './app/playcricket-MatchListImport/http/httpTriggerPubSubPlayCricketImport'
import * as GetPlayCricketMatchListPubSub from './app/playcricket-MatchListImport/pubsub/getPlayCricketMatchList';


/**  
 * Import: PlayCricket Match Detail Import Functions
* */

import * as ComparePlayCricketMatchDetailPubSub from './app/playcricke-MatchDetailImport/pubsub/playcricketMatchListCompare';
import * as GetPlayCricketMatchDetailPubSub from './app/playcricke-MatchDetailImport/pubsub/getPlayCricketMatchDetails';
import * as HttpPublishPlayCricetMatchToImport from './app/playcricke-MatchDetailImport/http/httpTriggerPubSubPlayCricketImport'
 


export const helloWorld = functions
.region('europe-west2')
.https.onRequest((request, response) => {
  response.send('Hello from Navestock Cricket Club API');
});

initializeApp({
  //credential: admin.credential.applicationDefault(),
  });

/** 
 *  Test message functions 
 * */
export const addMessage = AddMessage.helloNavestock;
export const addMessagePubSub = ListenMessagePubSub.listenHelloNavestock;

/** 
 * PlayCricket MatchList Import Functions : Import matchlist from PlayCricket API 
 * */

export const httpTriggerPlayCricetImport = HttpTriggerPlayCricetImport.httpPublishPlayCricetSeasonToImport;
export const getPlayCricketMatchListPubSub = GetPlayCricketMatchListPubSub.getPlayCricketMatchListPubSub;


/** 
 * PlayCricket Match Detail Import Functions 
 * */

export const comparePlayCricketMatchListubSub = ComparePlayCricketMatchDetailPubSub.comparePlayCricketMatchListPubSub;
export const getPlayCricketMatchDetailPubSub = GetPlayCricketMatchDetailPubSub.getPlayCricketMatchDetailPubSub;
export const httpPublishPlayCricetMatchToImport = HttpPublishPlayCricetMatchToImport.httpPublishPlayCricetMatchToImport;
