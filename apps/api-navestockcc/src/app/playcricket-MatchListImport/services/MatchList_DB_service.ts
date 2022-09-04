import * as admin from 'firebase-admin';

export class MatchListDB {


  /**
   * addMatchlistmatchlist: object : void
   */
  public addMatchlist(matchlist: any): void {
    try {

        const afs = admin.firestore();

        const collectionDB = 'MatchList';
        
        if (matchlist.season === undefined){
            matchlist.season = new Date().getFullYear();
        }

        const documentDB = matchlist.season;

        afs.collection(collectionDB).doc(documentDB).set(matchlist);

    } catch (error) {
      console.error(error);
    } 

    
  }
}
