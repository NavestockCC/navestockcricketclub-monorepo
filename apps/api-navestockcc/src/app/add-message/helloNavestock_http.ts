import * as functions from 'firebase-functions';
import { PublishPubSubMessage } from '../services/PublishPubSubMessage'

export const helloNavestock = functions
.region('europe-west2')
.https.onRequest(async (req, res) => {
    const msgToPublish = {"msg": "Hello from Navestock Pubsub:", "name": req.query.m.toString()};
    const addMsgPubsub = new PublishPubSubMessage();
    addMsgPubsub.publishPubSubMessage('Test_Message', msgToPublish);
    res.send("Hello Navestock: " + msgToPublish.name);
})