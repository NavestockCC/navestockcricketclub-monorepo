// The Cloud Functions for Firebase SDK to create Cloud Functions and set up triggers.
import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'


// The Firebase Admin SDK to access Firestore.
admin.initializeApp();

// Take the text parameter passed to this HTTP endpoint and insert it into 
// Firestore under the path /messages/:documentId/original
exports.addMessage = functions
.region('europe-west2')
.https.onRequest(async (req, res) => {
    // Send back a json message 
    res.send('Hello Navestock. APIs rule in production!!!!')
  });
