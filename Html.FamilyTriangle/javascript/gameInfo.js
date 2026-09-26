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

  const gScoringTokenSymbol0 = "scoring-token-symbol-0";
  const gScoringTokenSymbol1 = "scoring-token-symbol-1";
  const gScoringTokenSymbol2 = "scoring-token-symbol-2";

  const gScoringTokenSymbolsArray = [
    gScoringTokenSymbol0,
    gScoringTokenSymbol1,
    gScoringTokenSymbol2,
  ];

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
    scoringTokenSymbolsArray: gScoringTokenSymbolsArray,
  };
});
