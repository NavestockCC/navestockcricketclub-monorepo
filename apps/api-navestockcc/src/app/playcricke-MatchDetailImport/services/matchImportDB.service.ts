
import {getFirestore} from 'firebase-admin/firestore';
import { from, map, Observable } from 'rxjs';

import { Match, MatchList } from '@navestockcricketclub/match-interfaces';

export class MatchListImport {
    
    
        afs = getFirestore();
 
        /*
constructor(){
    this.afs.settings({
        ignoreUndefinedProperties: true
      });
}
*/

   /**
    * Gets match list import data
    * @param seasonImport 
    * @returns match list import data 
    */
   public getMatchListImportData(seasonImport:string):Observable<MatchList> {

        const matchListImportDoc = this.afs.collection('MatchListImport').doc(seasonImport)
        
        
        const matchListImportDB = from(matchListImportDoc.get());

       return matchListImportDB.pipe(
            map(resp => {
                let returnML: MatchList = undefined;
                    if(resp.exists){
                        returnML =  resp.data() as MatchList;
                    } else{
                        returnML ={
                            season: seasonImport, 
                            matches: []
                        };
                    }
                return returnML
            })
        )
    }


/**
 * Updates match details
 * @param match 
 */
 public setMatchListImportData(matchList:MatchList, seasonImport:string):void {

    const matchListImportDoc = this.afs.collection('MatchListImport').doc(seasonImport)
    matchListImportDoc.set(matchList, { merge: true });
}    

/**
 * Updates match details
 * @param match 
 */
public updateMatchDetails(match:Match):void {
    const matchDetailDoc = this.afs.collection('Fixtures').doc(match.description.id.toString());
    matchDetailDoc.set(match, { merge: true });
    
}



}