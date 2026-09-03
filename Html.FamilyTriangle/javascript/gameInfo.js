define([
  "sharedJavascript/cards",
  "sharedJavascript/debugLog",
  "sharedJavascript/triangleCardUtils",
  "dojo/domReady!",
], function (cards, debugLogModule, triangleCardUtils) {
  var debugLog = debugLogModule.debugLog;
  //-----------------------------------
  //
  // Constants
  //
  //-----------------------------------
  const gNumPlayers = 4;

  const gTerrainTypeRed = "suburb";
  const gTerrainTypeBlue = "swamp";
  const gTerrainTypeGreen = "farm";
  const gTerrainTypeYellow = "city";

  const gTerrainTypes = {
    Red: gTerrainTypeRed,
    Green: gTerrainTypeGreen,
    Yellow: gTerrainTypeYellow,
    Blue: gTerrainTypeBlue,
  };

  const gTerrainTypesArray = Object.values(gTerrainTypes);

  const gScoringTerrainTypesArray = [
    gTerrainTypeRed,
    gTerrainTypeGreen,
    gTerrainTypeYellow,
  ];
  // This returned object becomes the defined value of this module
  return {
    terrainTypes: gTerrainTypes,
    terrainTypesArray: gTerrainTypesArray,
    scoringTerrainTypesArray: gScoringTerrainTypesArray,
    numPlayers: gNumPlayers,
  };
});
