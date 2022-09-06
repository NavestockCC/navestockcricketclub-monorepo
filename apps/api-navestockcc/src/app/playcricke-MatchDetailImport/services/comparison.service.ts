// Imports


export class ComparisonService {



/**
 * Matchs list comparison orchestrator
 * @param pubSubMatchListData
 * @param currentMatchListData
 * @returns number[] of match id's for updated matches
 * @returns empty number[] if season attributes in array are not equal
 * @returns empty number[] if all items in the array are found and all items found are equal 
 */
public matchListComparisonOrchestrator(pubSubMatchListData: any, currentMatchListData: any):number[] {
    const matchtoUpdate: number[] = [];
 try {

/* 
** Validate if seasons in the comparison are equal
** If seasons are equal do comparison of arrays's
** If seasons are not equal don't do comparison of arrays 
*/
if(pubSubMatchListData !== currentMatchListData){

/* 
** Compare Arrays by iterating over PubSub Match List to find which items have been updated or added
** First validation id new items. findIndex returns -1 if item not found in array 
** Second validation if item was found validate if last_updated attribute is equal
*/
for (let i = 0; i < pubSubMatchListData.matches.length; i++) {
    const matchIndex = currentMatchListData.matches.findIndex(match => match.id === pubSubMatchListData.matches[i].id)
    if (matchIndex === -1) {
        matchtoUpdate.push(pubSubMatchListData.matches[i].id);
    }else if(pubSubMatchListData.matches[i].last_updated !== currentMatchListData.matches[matchIndex].last_updated){
        matchtoUpdate.push(pubSubMatchListData.matches[i].id);
        }
    }
}
} catch (error) {
     console.error(error);
}

return matchtoUpdate;
}

    
}