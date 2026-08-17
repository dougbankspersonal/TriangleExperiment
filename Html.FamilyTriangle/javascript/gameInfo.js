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

  const gTerrainTypeRed = "tri-red";
  const gTerrainTypeBlue = "tri-blue";
  const gTerrainTypeGreen = "tri-green";
  const gTerrainTypeYellow = "tri-yellow";

  const gTerrainTypes = {
    Red: gTerrainTypeRed,
    Blue: gTerrainTypeBlue,
    Green: gTerrainTypeGreen,
    Yellow: gTerrainTypeYellow,
  };

  const gTerrainTypesArray = Object.values(gTerrainTypes);

  // This returned object becomes the defined value of this module
  return {
    terrainTypes: gTerrainTypes,
    terrainTypesArray: gTerrainTypesArray,
    numPlayers: gNumPlayers,
  };
});
