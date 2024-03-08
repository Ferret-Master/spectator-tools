	model.effectPuppetArray = [];// an array containing all spawned puppets
	
	function stringify(obj) {
		var cache = [];
		var str = JSON.stringify(obj, function(key, value) {
		  if (typeof value === "object" && value !== null) {
			if (cache.indexOf(value) !== -1) {
			  // Circular reference found, discard key
			  return;
			}
			// Store value in our collection
			cache.push(value);
		  }
		  return value;
		});
		cache = null; // reset the cache
		return str;
	  }


	model.currentUISettings = {//testing settings
		isUnit:false,
		path:"/pa/effects/specs/red_line.pfx",
		scale:1,
		snap:10

	}
	var sentUnitSpecs = false;

	var createSimpleUnitSpecs = function(unitSpecs){
		var finalSpecs = {}
		var unitKeys = _.keys(unitSpecs)
		_.forEach(unitKeys, function(key){
			finalSpecs[key] = {
				cost: unitSpecs[key].cost,
				types: unitSpecs[key].types
			}
		})
		return finalSpecs
		
	}


	var effectUpdateLoop = function () { //reguarly checks currently loaded effect file/ui panel for changes and reloads puppet as needed
      
		for(puppetIndex in model.effectPuppetArray){
			var puppet = model.effectPuppetArray[puppetIndex];
			var path = puppet.UIEffectSettings.path;
			var isUnit = puppet.isUnit;
			updateEffect(puppet,path,isUnit)
			

		}

		
		if(sentUnitSpecs == false && model.unitSpecs !== undefined){api.Panel.message("players", 'unitJsons', stringify(createSimpleUnitSpecs(model.unitSpecs)));sentUnitSpecs = true}
            _.delay(effectUpdateLoop, 1000);
    };

	var updateEffect = function(puppet,path,isUnit){

		$.getJSON("coui://"+path).then(function(data){
                
                unitJSON = data;
				if(isUnit == true){
					//do stuff later
				}
				else{
					var oldFileString = puppet.string;
					var newString = JSON.stringify(data);
					if(newString === oldFileString){//same as before
						return;
					}
					else{
						api.puppet.killPuppet(puppet.id)
						var puppetIdPromise = api.puppet.createEffectVanilla(path, puppet.location,undefined, puppet.UIEffectSettings.snap)
						puppetIdPromise.then(function(result){
						for(var i = 0;i<model.effectPuppetArray.length;i++){if(model.effectPuppetArray[i].id == puppet.id){
							model.effectPuppetArray[i].string = newString;
							model.effectPuppetArray[i].id = result;
						}}
					})
				}
				}
		})
	}
	

	console.log("starting effect testing")
    effectUpdateLoop();
	
