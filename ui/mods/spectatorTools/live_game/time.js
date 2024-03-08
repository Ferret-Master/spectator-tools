//Only purpose is to relay time data to live_game
function SendSpectatorTime(){
	var CurrentTime = model.currentTimeInSeconds()
	//console.log("current time in time bar is "+CurrentTime)

	api.Panel.message("players", 'spectatorTime',CurrentTime)
	setTimeout(SendTime, 1000);
	return
	}
(function () {
    

    //update every second

    setTimeout(SendSpectatorTime, 1000);


})();
