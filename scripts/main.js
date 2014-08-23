var planets = {};
var planetIds = [];
var selectedPlanets = [];
var connectedPlanets = [];
var connectionIds = [];
var totalPlanets = 10;
var levelWidth = $(window).width()-100;
var levelHeight = $(window).height()-100;
var viewport = $('#viewport');
var selectedPlanet;

function setupLevel() {
  currentId = 0;
  for(var i=0; i<totalPlanets; i++) {
    var randomX = ~~(levelWidth/2)*Math.random();
    var randomY = ~~(levelHeight)*Math.random();
    var mirrorX = levelWidth-randomX;
    var mirrorY = levelHeight-randomY;
    var planetId = 'planet' + currentId;
    planets[planetId] = {color:'grey', x:randomX, y:randomY, id:planetId, selected:false};
    planetIds.push(planetId);
    viewport.append('<div class="planet grey" id="'+planetId+'"></div>');
    currentId++;

    planetId = 'planet' + currentId;
    planets[planetId] = {color:'grey', x:mirrorX, y:mirrorY, id:planetId, selected:false};
    planetIds.push(planetId);
    viewport.append('<div class="planet grey" id="'+planetId+'"></div>');
    currentId++;
  }

  $('.planet').click(function() {
    planetClicked($(this));
  });
}

function initialDraw() {
  planetIds.forEach(function(planetId) {
    var planet = planets[planetId];
    var planetEl = $('#'+planetId);
    planetEl.css('left', planet.x);
    planetEl.css('top', planet.y);
  });
}

function getPlanetDistance(planetOneId, planetTwoId) {
  planetOnex = planets[planetOneId].x
  planetOney = planets[planetOneId].y
  planetTwox = planets[planetTwoId].x
  planetTwoy = planets[planetTwoId].y

  deltaY = planetTwoy - planetOney;
  deltaX = planetTwox - planetOnex;

  deltaY *= deltaY;
  deltaX *= deltaX;
  distance = Math.sqrt(deltaX + deltaY);
  
  return distance;
}

function planetClicked(planetEl) {
  var planetId = planetEl.attr('id');
  var planet = planets[planetId];

  //delete connections from the selected planet, if they exist
  for(var i = 0; i < connectedPlanets.length; i++) {
    if(connectedPlanets[i].from == planetId) {
      connectionId = planetId + connectedPlanets[i].to;
      connectedPlanets.splice(i, 1);
      viewport.remove(connectionId);

      for(var j = 0; j < connectionIds.length; j++) {
        if(connectionIds[j] == connectionId) {
          connectionIds.splice(j, 1);
        }
      }
    }
  }

  if(selectedPlanets.length == 0) {
    planet.selected = !planet.selected;
    planetEl.toggleClass('selected');
    selectedPlanets.push(planetId);
  }else if(selectedPlanets.length == 1) {
    if(selectedPlanets[0] == planetId){
      planet.selected = !planet.selected;
      planetEl.toggleClass('selected');
      selectedPlanets = [];
    }else {
      //make connection between the two planets
      connectedPlanets.push({from: selectedPlanets[0], to: planetId});
      connectionId = selectedPlanets[0] + planetId;
      //deselect planets
      $('#'+selectedPlanets[0]).toggleClass('selected');
      planets[selectedPlanets[0]].selected = !planets[selectedPlanets[0]].selected;
      planet.selected = !planet.selected;
      //draw connection
      planetDistance = getPlanetDistance(selectedPlanets[0], planetId);
      viewport.append('<div class="connection blue" id="'+connectionId+'"></div>');
      connectionEl = $("#"+connectionId);
      connectionEl.css("width", planetDistance);
      connectionIds.push(connectionId);
      //finish deselecting planets
      selectedPlanets = [];
    }
  }else if(selectedPlanets.length > 2) {
    //deselects other selected planets
    $('#'+selectedPlanets[0]).toggleClass('selected');
    planets[selectedPlanets[0]].selected = !planets[selectedPlanets[0]].selected;

    $('#'+selectedPlanets[1]).toggleClass('selected');
    planets[selectedPlanets[1]].selected = !planets[selectedPlanets[1]].selected;

    selectedPlanets = [];
    //select current planet
    selectedPlanets.push(planetId);
    planetEl.toggleClass('selected');
  }
}

setupLevel();
initialDraw();
setInterval(function() {

}, 33);
