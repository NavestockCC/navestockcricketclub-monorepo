/**
 * Navestock Firebase Function
 * @author Lefras Coetzee
 * @description Test_Message.
 * 
 */

import * as functions from 'firebase-functions/v2/pubsub';
import {getFirestore} from 'firebase-admin/firestore'


export const listenHelloNavestock = functions
.onMessagePublished(
    'Test_Message',
   msgPayload => {
        if (msgPayload.data.message.json === undefined) {
            console.error(new Error('E_getPCML_1: msg param not found'));
            return 'listenHelloNavestock_PubSub: excution ERROR!!!';
        } else {
                    const afs = getFirestore(); // Crearte an instanse of Firestore
                    afs.collection('TEST').add(msgPayload.data.message.json);

        return 'listenHelloNavestock_PubSub: excution completed sucsesfully';
        }
    }
    );