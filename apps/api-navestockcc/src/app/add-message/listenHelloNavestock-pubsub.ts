/**
 * Navestock Firebase Function
 * @author Lefras Coetzee
 * @description Test_Message.
 * 
 */

import * as functions from 'firebase-functions';
import {getFirestore} from 'firebase-admin/firestore'


export const listenHelloNavestock = functions
.region('europe-west2')
.pubsub
    .topic('Test_Message')
    .onPublish(msgPayload => {
        if (msgPayload.json.msg === undefined) {
            console.error(new Error('E_getPCML_1: msg param not found'));
            return 'listenHelloNavestock_PubSub: excution ERROR!!!';
        } else {
                    const afs = getFirestore(); // Crearte an instanse of Firestore
                    afs.collection('TEST').add(msgPayload.json);

        return 'listenHelloNavestock_PubSub: excution completed sucsesfully';
        }
    }
    )