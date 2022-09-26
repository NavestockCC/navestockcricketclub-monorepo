
import {getFirestore, WriteResult} from 'firebase-admin/firestore';
import { from, map, Observable } from 'rxjs';

import { Match, MatchList } from '@navestockcricketclub/match-interfaces';

export class MatchListImport {
    
    
        afs = getFirestore();

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
 * Sets match list import data
 * @param matchList 
 * @param seasonImport 
 * @returns firebase WriteResult
 */
public setMatchListImportData(matchList:MatchList, seasonImport:string):Observable<WriteResult> {

    const matchListImportDoc = this.afs.collection('MatchListImport').doc(seasonImport)
    return from(matchListImportDoc.set(matchList, { merge: true }));
}    

/**
 * Updates match details
 * @param match 
 * @returns match details 
 */
public updateMatchDetails(match:Match):Observable<WriteResult>  {
    const matchDetailDoc = this.afs.collection('Fixtures').doc(match.description.id.toString());
    return from(matchDetailDoc.set(match, { merge: true }));
    
}



}