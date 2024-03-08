var world = api.getWorldView(0)

model.allPlayersArmy = function(playerId){

    var promiseArray = [];
    for(var i = 0; i< 16;i++){
        promiseArray.push(model.playersArmy(playerId, i))
    }
    var allPlanetArmyPromise = Promise.all(promiseArray)
    return allPlanetArmyPromise.then(function(result){
        var finalUnits = {};
        for(army in result){
            var armyKeys = _.keys(result[army])
            for(unit in armyKeys){
              
                if(!(armyKeys[unit] in finalUnits)){finalUnits[armyKeys[unit]] = []};
      
                
                for(i in result[army][armyKeys[unit]]){
                 
                    finalUnits[armyKeys[unit]].push(result[army][armyKeys[unit]][i])
                }
               
            
        }
    }
        // var unitArray = [];
        // armyKeys = _.keys(finalUnits)
        // for(var i = 0;i<armyKeys.length;i++){
        //     unitArray.push(finalUnits[armyKeys[i]])
        // }
        //unitArray = _.flatten(unitArray)

    
        return finalUnits;
    })

}

model.playersArmy = function(playerId, planetId){

    if(unitJsons == undefined){unitJsons = model.unitSpecs}
   
    var promise = new Promise(function(resolve,reject){

        if(world){


                var promise2 = world.getArmyUnits(playerId,planetId).then(function(result){ 

               
                const armyResult = result
                    return armyResult;
                
            })
            
        
        promise2.then(function(result){resolve(result)})
    
        }

    })

    promise.then(function(result){return result})
    
    return promise;
   


}

model.typeInArmy = function(result,unitTypeValue, justCount){//returns only units in army that have the correct types

    var count = 0;
    var jsonKeys = _.keys(unitJsons)

    if(unitTypeValue.length>0 && unitTypeValue[0] !== "" && unitTypeValue[0] !== undefined){
                      
        var finalResult = {};
        
        //this is inefficient imo
        for(var i = 0;i<jsonKeys.length;i++){
            var matchedValue = 0;
            for(var j = 0;j<unitTypeValue.length;j++){
                
                if(_.contains(unitJsons[jsonKeys[i]].types,unitTypeValue[j])){//check if each unit json contains every type in the value array
                  
                    matchedValue++;
             
                }
            }
            
            
           //console.log(matchedValue+" | "+unitTypeValue.length)
           
            if(result==undefined){continue}
         
            if(result[jsonKeys[i]] == undefined && matchedValue == unitTypeValue.length){

            }
            if(matchedValue == unitTypeValue.length && result[jsonKeys[i]] !== undefined){

                finalResult[jsonKeys[i]] = result[jsonKeys[i]]

                count += result[jsonKeys[i]].length
            }
        }
        result = finalResult;
        if(justCount == true){return count}
        return result;
}}

model.metalValueOfUnits = function(idArrays){

}