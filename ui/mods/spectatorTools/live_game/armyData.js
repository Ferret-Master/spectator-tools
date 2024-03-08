var unitJsons = undefined;
model.showAdvancedSpectatorPanel = ko.observable(false);

model.toggleAdvancedSpectatorPanel = function(){model.showAdvancedSpectatorPanel(!model.showAdvancedSpectatorPanel())}
model.playerData = []
model.time = 0;
model.landTime = -1;

var DEFAULT_ADVANCED_SPECTATOR_MODE = 'metal';
model.advancedSpectatorPanelMode = ko.observable(DEFAULT_ADVANCED_SPECTATOR_MODE); /* mode : 'economy' | 'army' | 'alliance' */
model.showMetalData = ko.computed(function () {
    return model.advancedSpectatorPanelMode() === 'metal';
});
model.showPowerData = ko.computed(function () {
    return model.advancedSpectatorPanelMode() === 'power';
});
model.showFabFacData = ko.computed(function () {
    return model.advancedSpectatorPanelMode() === 'fabs-factories';
});
model.showAdvancedArmyData = ko.computed(function ()
{
    return model.advancedSpectatorPanelMode() === 'advancedArmy';
});
model.showLandData = ko.computed(function ()
{
    return model.advancedSpectatorPanelMode() === 'land';
});
model.showAirData = ko.computed(function ()
{
    return model.advancedSpectatorPanelMode() === 'air';
});
model.showNavalData = ko.computed(function ()
{
    return model.advancedSpectatorPanelMode() === 'naval';
});
model.showOrbitalData = ko.computed(function ()
{
    return model.advancedSpectatorPanelMode() === 'orbital';
});
model.showOffensiveData = ko.computed(function ()
{
    return model.advancedSpectatorPanelMode() === 'offensive';
});
model.showDefensiveData = ko.computed(function ()
{
    return model.advancedSpectatorPanelMode() === 'defensive';
});
model.showMiscData = ko.computed(function ()
{
    return model.advancedSpectatorPanelMode() === 'misc';
});

//functions that are used to calc data

console.log("army data loaded")

//populate player data with base object

var players = model.players();

//these stats will likely be in their own panels but might split the fac type specific stats to their own panel


var disableData = false;
//loop that updates playerData
model.updatePlayerData = function(){
    if(disableData == true){return}
    if(model.playerData.length == 0){
        populatePlayerData();
    }
    if(unitJsons == undefined){_.delay(model.updatePlayerData, 1000); return}
    var playerPromises = []

    model.updatePlayerStats()// updates stats from api

    for(var i = 0;i<model.playerData.length;i++){
        var player = model.players()[i]
        playerPromises.push(model.allPlayersArmy(i))
        // var metalString = player.metalProductionStr.split("/")
        // model.playerData[i].totalMetalIncome = metalString[0].trim()
        // model.playerData[i].totalMetalSpending = metalString[1].trim()
        // model.playerData[i].efficiency = player.buildEfficiencyStr
    }
    Promise.all(playerPromises).then(function(result){
        //TODO remove unneeded calls if laggy and combine from other types
        for(var i = 0; i< result.length; i++){
            model.playerData[i].army = result[i]
            var playerArmy = model.playerData[i].army

            // fab and fac counts
            model.playerData[i].totalFabCount = model.typeInArmy(playerArmy, ["UNITTYPE_Mobile","UNITTYPE_Fabber"], true)
            
            model.playerData[i].t1FabCount = model.typeInArmy(playerArmy, ["UNITTYPE_Basic","UNITTYPE_Mobile","UNITTYPE_Fabber"], true)
            model.playerData[i].t2FabCount = model.typeInArmy(playerArmy, ["UNITTYPE_Advanced","UNITTYPE_Mobile","UNITTYPE_Fabber"], true)
            model.playerData[i].totalFactoryCount = model.typeInArmy(playerArmy, ["UNITTYPE_Factory"], true)
            model.playerData[i].t1FactoryCount = model.typeInArmy(playerArmy, ["UNITTYPE_Basic","UNITTYPE_Factory"], true)
            model.playerData[i].t2FactoryCount = model.typeInArmy(playerArmy, ["UNITTYPE_Advanced","UNITTYPE_Factory"], true)
            model.playerData[i].t1BotFactoryCount = model.typeInArmy(playerArmy, ["UNITTYPE_Basic","UNITTYPE_Factory","UNITTYPE_Bot"], true)
            model.playerData[i].t1VehicleFactoryCount = model.typeInArmy(playerArmy, ["UNITTYPE_Basic","UNITTYPE_Factory","UNITTYPE_Vehicle"], true)
            model.playerData[i].t1AirFactoryCount = model.typeInArmy(playerArmy, ["UNITTYPE_Basic","UNITTYPE_Factory","UNITTYPE_Air"], true)
            model.playerData[i].t1NavalFactoryCount = model.typeInArmy(playerArmy, ["UNITTYPE_Basic","UNITTYPE_Factory","UNITTYPE_Naval"], true)
            model.playerData[i].t2BotFactoryCount = model.typeInArmy(playerArmy, ["UNITTYPE_Advanced","UNITTYPE_Factory","UNITTYPE_Bot"], true)
            model.playerData[i].t2VehicleFactoryCount = model.typeInArmy(playerArmy, ["UNITTYPE_Advanced","UNITTYPE_Factory","UNITTYPE_Vehicle"], true)
            model.playerData[i].t2AirFactoryCount = model.typeInArmy(playerArmy, ["UNITTYPE_Advanced","UNITTYPE_Factory","UNITTYPE_Air"], true)
            model.playerData[i].t2NavalFactoryCount = model.typeInArmy(playerArmy, ["UNITTYPE_Advanced","UNITTYPE_Factory","UNITTYPE_Naval"], true)
      
            //army counts
            model.playerData[i].t1ArmyCount = model.typeInArmy(playerArmy, ["UNITTYPE_Mobile","UNITTYPE_Offense","UNITTYPE_Basic"], true)
            model.playerData[i].t2ArmyCount = model.typeInArmy(playerArmy, ["UNITTYPE_Mobile","UNITTYPE_Offense","UNITTYPE_Advanced"], true)
            model.playerData[i].totalArmyCount =  model.playerData[i].t1ArmyCount +  model.playerData[i].t2ArmyCount
         
            // armyMetalValue:0,
            // t1ArmyMetalValue:0,
            // t2ArmyMetalValue:0,

            //land stats
            model.playerData[i].t1LandCount = model.typeInArmy(playerArmy, ["UNITTYPE_Mobile","UNITTYPE_Offense","UNITTYPE_Basic","UNITTYPE_Land"], true)
            model.playerData[i].t2LandCount = model.typeInArmy(playerArmy, ["UNITTYPE_Mobile","UNITTYPE_Offense","UNITTYPE_Advanced","UNITTYPE_Land"], true)
            model.playerData[i].totalLandCount = model.playerData[i].t1LandCount +  model.playerData[i].t2LandCount
            // t1LandMetalValue:0,
            // t2LandMetalValue:0,

            //air stats
            
            model.playerData[i].t1AirCount = model.typeInArmy(playerArmy, ["UNITTYPE_Mobile","UNITTYPE_Offense","UNITTYPE_Basic","UNITTYPE_Air"], true)
            model.playerData[i].t1AirFighters = model.typeInArmy(playerArmy, ["UNITTYPE_Mobile","UNITTYPE_Fighter","UNITTYPE_Basic","UNITTYPE_Air"], true)
            model.playerData[i].t2AirCount = model.typeInArmy(playerArmy, ["UNITTYPE_Mobile","UNITTYPE_Offense","UNITTYPE_Advanced","UNITTYPE_Air"], true)
            model.playerData[i].t2AirFighters = model.typeInArmy(playerArmy, ["UNITTYPE_Mobile","UNITTYPE_Fighter","UNITTYPE_Advanced","UNITTYPE_Air"], true)
            model.playerData[i].totalAirCount =model.playerData[i].t1AirCount + model.playerData[i].t2AirCount
          
            // t1AirMetalValue:0,
            // t2AirMetalValue:0,

            //naval stats

            model.playerData[i].t1NavalCount = model.typeInArmy(playerArmy, ["UNITTYPE_Mobile","UNITTYPE_Offense","UNITTYPE_Basic","UNITTYPE_Naval"], true)
            model.playerData[i].t2AirCount = model.typeInArmy(playerArmy, ["UNITTYPE_Mobile","UNITTYPE_Offense","UNITTYPE_Advanced","UNITTYPE_Naval"], true)
            model.playerData[i].totalNavalCount = model.playerData[i].t1NavalCount + model.playerData[i].t2NavalCount
          
            // t1NavalMetalValue:0,
            // t2NavalMetalValue:0,

            //orbital stats

            model.playerData[i].t1OrbitalCount = model.typeInArmy(playerArmy, ["UNITTYPE_Mobile","UNITTYPE_Basic","UNITTYPE_Orbital"], true)
            model.playerData[i].t2OrbitalCount = model.typeInArmy(playerArmy, ["UNITTYPE_Mobile","UNITTYPE_Offense","UNITTYPE_Advanced","UNITTYPE_Orbital"], true)
            model.playerData[i].totalOrbitalCount = model.playerData[i].t1OrbitalCount + model.playerData[i].t2OrbitalCount
           
            // t1OrbitalMetalValue:0,
            // t2OrbitalMetalValue:0,

            //offsensive stats

            // recentMetalTrade:0,
            // totalMetalTrade:0,
            // fabsKilled:0,
            // metalDestroyed:0,
            // buildingsDestroyed:0,
            // mapControl:0,

            //defensive stats
            model.playerData[i].t1DefensesCount = model.typeInArmy(playerArmy, ["UNITTYPE_Structure","UNITTYPE_Defense","UNITTYPE_Basic"], true)
            model.playerData[i].t2DefensesCount = model.typeInArmy(playerArmy, ["UNITTYPE_Structure","UNITTYPE_Defense","UNITTYPE_Advanced"], true)
            model.playerData[i].totalDefensesCount = model.playerData[i].t1DefensesCount + model.playerData[i].t2DefensesCount
          
            //metalInvestedInDefenses:0,

            model.playerData[i].aaCount = model.typeInArmy(playerArmy, ["UNITTYPE_AirDefense"], true)

            //aaMetalInvested:0,
        }
    })
    
    _.delay(model.updatePlayerData, 1000)
}
model.updatePlayerData();


//computable that makes ui observables = to the player data

model.updatePlayerStats = function(){
    api.gamestats.get(model.time)
    .then(function (payload) {
        var result = parse(payload)
        for(var i = 0;i<model.playerData.length;i++){
            var playerResult = result.armies[i]
            model.playerData[i].stats = playerResult
        }
    })
}

var landingTimeCounter = 0
var workedOutLanding = false
model.workOutLandingTime = function(){

    if(workedOutLanding == false){
    api.gamestats.get(landingTimeCounter).then(function(payload){
        var result = parse(payload)
        if(result.armies[0].unit_count == 0){
            if(model.time > (landingTimeCounter + 1)){landingTimeCounter++}
            _.delay(model.workOutLandingTime, 100)
        }
        else{
            for(var i = 0;i<model.playerData.length;i++){
                model.landTime = landingTimeCounter
            }
            workedOutLanding = true
        }
    })}

}



//handlers to get data from other scenes

handlers.planetCount = function(payload){}

handlers.unitJsons = function(payload){
    unitJsons = JSON.parse(payload)
}

handlers.spectatorTime = function(payload) {
    model.time = payload;
};


function populatePlayerData (){
    _.forEach(model.players(), function(){
    model.playerData.push({
        //economy data
        totalMetalIncome:0,
        totalReclaimIncome:0,
        extractorIncome:0,
        t2ExtractorIncome:0,
        jigMetalIncome:0,
        totalMetalSpending:0,
        totalPowerIncome:0,
        powerGenIncome:0,
        otherPowerIncome:0,
        powerUsageRadars:0,
        powerUsageFactorys:0,
        powerUsageFabs:0,
        efficiency:0,
        averageEfficiency:0,
        metalEfficiency:0,
        powerEfficiency:0,
        floatedMetal:0,
        totalReclaimedMetal:0,
        //fab and production stuff
        totalFabCount:0,
        t1FabCount:0,
        t2FabCount:0,
        totalFactoryCount:0,
        totalT1FactoryCount:0,
        totalT2FactoryCount:0,
        t1BotFactoryCount:0,
        t1VehicleFactoryCount:0,
        t1AirFactoryCount:0,
        t1NavalFactoryCount:0,
        t2BotFactoryCount:0,
        t2VehicleFactoryCount:0,
        t2AirFactoryCount:0,
        t2NavalFactoryCount:0,
        //army overall stats
        totalArmyCount:0,
        t1ArmyCount:0,
        t2ArmyCount:0,
        armyMetalValue:0,
        t1ArmyMetalValue:0,
        t2ArmyMetalValue:0,
        //land stats
        totalLandCount:0,
        t1LandCount:0,
        t2LandCount:0,
        t1LandMetalValue:0,
        t2LandMetalValue:0,
        //air stats
        totalAirCount:0,
        t1AirCount:0,
        t1AirFighters:0,
        t2AirCount:0,
        t2AirFighters:0,
        t1AirMetalValue:0,
        t2AirMetalValue:0,
        //naval stats
        totalNavalCount:0,
        t1NavalCount:0,
        t2NavalCount:0,
        t1NavalMetalValue:0,
        t2NavalMetalValue:0,
        //orbital stats
        totalOrbitalCount:0,
        t1OrbitalCount:0,
        t2OrbitalCount:0,
        t1OrbitalMetalValue:0,
        t2OrbitalMetalValue:0,
        //offsensive stats
        recentMetalTrade:0,
        totalMetalTrade:0,
        fabsKilled:0,
        metalDestroyed:0,
        buildingsDestroyed:0,
        mapControl:0,
        //defensive stats
        defensesCount:0,
        metalInvestedInDefenses:0,
        aaCount:0,
        aaMetalInvested:0,
        //timings
        firstT2Timing:0,
        secondT2Timing:0,
        t2EcoTiming:0,
        //extractor income
        hit100IncomeTiming:0,
        hit200IncomeTiming:0,
        hit300IncomeTiming:0,

        //win chance
        winChance:0
    })
})
}



(function () {
   
    $(".div_spectator_panel").append(loadHtml("coui://ui/mods/spectatorTools/advanced_panel.html"))
})();

