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

  const gTerrainTypeRed = "alien-0";
  const gTerrainTypeGreen = "alien-1";
  const gTerrainTypeYellow = "alien-2";
  const gTerrainTypeBlue = "alien-3";

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

  const gTerrainTypeToStringMap = {
    [gTerrainTypeRed]: "Mountain",
    [gTerrainTypeGreen]: "Flora",
    [gTerrainTypeYellow]: "Desert",
    [gTerrainTypeBlue]: "Ocean",
  };

  // This returned object becomes the defined value of this module
  return {
    terrainTypes: gTerrainTypes,
    terrainTypesArray: gTerrainTypesArray,
    scoringTerrainTypesArray: gScoringTerrainTypesArray,
    numPlayers: gNumPlayers,
    scoringTokenSymbolsArray: gScoringTokenSymbolsArray,
    terrainTypeToStringMap: gTerrainTypeToStringMap,
  };
});
