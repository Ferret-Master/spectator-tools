(function(){
api.settings.definitions.keyboard.settings.spawn_puppet = {
  title: 'Spawn Puppet',
  type: 'keybind',
  set: 'effect hotkeys',
  display_group: 'effect testing',
  display_sub_group: 'Effect Testing',
  default: 'shift+z'
}


api.settings.definitions.keyboard.settings.clear_previous_puppet = {
  title: 'Clear Previous Puppet',
  type: 'keybind',
  set: 'effect hotkeys',
  display_group: 'effect testing',
  display_sub_group: 'Effect Testing',
  default: 'shift+x'
}

api.settings.definitions.keyboard.settings.clear_all_puppets = {
  title: 'Clear All Puppets',
  type: 'keybind',
  set: 'effect hotkeys',
  display_group: 'effect testing',
  display_sub_group: 'Effect Testing',
  default: 'shift+c'
}

api.settings.definitions.keyboard.settings.move_puppet = {
  title: 'Move previous puppet',
  type: 'keybind',
  set: 'effect hotkeys',
  display_group: 'effect testing',
  display_sub_group: 'Effect Testing',
  default: 'shift+v'
}

api.settings.definitions.keyboard.settings.draw = {
  title: 'Draw',
  type: 'keybind',
  set: 'effect hotkeys',
  display_group: 'effect testing',
  display_sub_group: 'Effect Testing',
  default: 'shift+f'
}

action_sets.gameplay["move_puppet"] = function(){

  var currentUISettings = model.currentUISettings;
  var mouseLocationPromise = model.holodeck.raycastTerrain(cursor_x,cursor_y)
  mouseLocationPromise.then(function(mouseLocation){
    
         
      var location = {
          planet:mouseLocation.planet || 0,
          pos: mouseLocation.pos,
         // scale:currentUISettings.scale, //unsure if I should include scale in  moving
          snap: currentUISettings.snap
      }
      
      

      api.puppet.moveLastPuppet(model.effectPuppetArray[model.effectPuppetArray.length-1].id, location);
          
      
  
  
  })

}

model.currentlyDrawing = false;

action_sets.gameplay["draw"] = function(){
  
  if(model.currentlyDrawing == true){action_sets.gameplay["clear_previous_puppet"]();model.currentlyDrawing = false;return}
  model.currentlyDrawing = true;
  if(!model.isSpectator()){return}
  action_sets.gameplay["spawn_puppet"]()   

  _.delay(action_sets.gameplay.loopedDraw,100)

  

}

action_sets.gameplay.loopedDraw = function(){
    var currentUISettings = model.currentUISettings;
    var mouseLocationPromise = model.holodeck.raycastTerrain(cursor_x,cursor_y)
    
    mouseLocationPromise.then(function(mouseLocation){

      
      var location = {
          planet:mouseLocation.planet || 0,
          pos: mouseLocation.pos,
         // scale:currentUISettings.scale, //unsure if I should include scale in  moving
          snap: currentUISettings.snap
      }
      


      api.puppet.moveLastPuppet(model.effectPuppetArray[model.effectPuppetArray.length-1].id, location);
          
      
      
  
  })

    if(model.currentlyDrawing == true){_.delay(action_sets.gameplay.loopedDraw,50)}

}

action_sets.gameplay["spawn_puppet"] = function(){
  var currentUISettings = model.currentUISettings;
  var mouseLocationPromise = model.holodeck.raycastTerrain(cursor_x,cursor_y)
  mouseLocationPromise.then(function(mouseLocation){
    
         
      var location = {
          planet:mouseLocation.planet || 0,
          pos: mouseLocation.pos,
          scale:currentUISettings.scale
      }
      if(currentUISettings.isUnit){
          var puppetIdPromise = api.puppet.createPuppet(currentUISettings.path, location,currentUISettings.anim_name,undefined,color,undefined)
          puppetIdPromise.then(function(result){
              var puppetObject = {}
              puppetObject.id = result;
              puppetObject.UIEffectSettings = currentUISettings

          })
      }
      else{
          var puppetIdPromise = api.puppet.createEffectVanilla(currentUISettings.path, location,undefined, currentUISettings.snap)
          puppetIdPromise.then(function(result){
              $.getJSON("coui://"+currentUISettings.path).then(function(data){
                  console.log(data)
              var puppetObject = {}
              puppetObject.id = result;
              puppetObject.string = JSON.stringify(data)
              puppetObject.UIEffectSettings = currentUISettings
              puppetObject.isUnit = false;
              puppetObject.location = location;
              model.effectPuppetArray.push(puppetObject)

          })
      })
      
  }
  })
 
}
action_sets.gameplay["clear_all_puppets"] = function(){

  api.puppet.killAllPuppets();
  model.effectPuppetArray = [];

}
action_sets.gameplay["clear_previous_puppet"] = function(){

  if(model.effectPuppetArray.length>0){
      api.puppet.killPuppet(model.effectPuppetArray[model.effectPuppetArray.length-1].id)
      model.effectPuppetArray.splice(-1,1)
  }
  

}
}
)()