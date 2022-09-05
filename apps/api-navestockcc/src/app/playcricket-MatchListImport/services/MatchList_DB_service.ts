import * as admin from 'firebase-admin';
import { from} from 'rxjs';

export class MatchListDB {
  /**
   * addMatchlistmatchlist: object : void
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public addMatchlist(matchlist: any) {
    const afs = admin.firestore();
    const collectionDB = 'MatchList';


    if (matchlist.season === undefined) {
      matchlist.season = new Date().getFullYear();
    }

    const documentDB = matchlist.season;

    return from(afs.collection(collectionDB).doc(documentDB).set(matchlist))
  }
}
