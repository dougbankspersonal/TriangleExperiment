define([
  "sharedJavascript/debugLog",
  "sharedJavascript/htmlUtils",
  "javascript/gameInfo",
  "dojo/domReady!",
], function (debugLogModule, htmlUtils, gameInfo) {
  var debugLog = debugLogModule.debugLog;

  var gTokenDiceConfigs = null;

  function getVictoryTokensBackConfigForTerrain(terrainType) {
    var backConfig = {
      classes: ["token", "victory", "back", terrainType],
    };
    return backConfig;
  }

  function getVictoryTokenBacksDieConfig() {
    var dieConfig = {};
    dieConfig.classes = ["tokens", "victory", "back"];

    var faceConfigs = [];
    for (var i = 0; i < gameInfo.scoringTerrainTypesArray.length; i++) {
      var terrainType = gameInfo.scoringTerrainTypesArray[i];
      var backConfig = getVictoryTokensBackConfigForTerrain(terrainType);
      faceConfigs.push(backConfig);
    }

    dieConfig.faces = faceConfigs;
    return dieConfig;
  }

  function getVictoryTokenFrontDieConfigForTerrain(terrainType) {
    var dieConfig = {};
    dieConfig.classes = ["tokens", "victory"];

    var faceConfigs = [];
    for (var j = 0; j < gameInfo.scoringTokenSymbolsArray.length; j++) {
      var scoringTokenSymbol = gameInfo.scoringTokenSymbolsArray[j];
      var frontConfig = {
        classes: ["token", "victory", "front", terrainType],
        imageClasses: [scoringTokenSymbol],
      };
      faceConfigs.push(frontConfig);
    }
    dieConfig.faces = faceConfigs;
    return dieConfig;
  }

  function generateTokenDiceConfigs() {
    if (gTokenDiceConfigs !== null) {
      return gTokenDiceConfigs;
    }

    gTokenDiceConfigs = [];

    var backDieConfig = getVictoryTokenBacksDieConfig();
    gTokenDiceConfigs.push(backDieConfig);

    for (var i = 0; i < gameInfo.scoringTerrainTypesArray.length; i++) {
      var dieConfig = getVictoryTokenFrontDieConfigForTerrain(
        gameInfo.terrainTypesArray[i],
      );
      gTokenDiceConfigs.push(dieConfig);
    }

    return gTokenDiceConfigs;
  }

  function getTokenDiceConfigs() {
    generateTokenDiceConfigs();
    return gTokenDiceConfigs;
  }

  return {
    getTokenDiceConfigs: getTokenDiceConfigs,
  };
});
