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

  function getVictoryTokenDieConfigForTerrain(terrainType) {
    var dieConfig = {};
    dieConfig.classes = ["tokens", "victory"];

    var faceConfigs = [];

    // First the back.
    var backConfig = getVictoryTokensBackConfigForTerrain(terrainType);
    faceConfigs.push(backConfig);

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

    for (var i = 0; i < gameInfo.terrainTypesArray.length; i++) {
      var dieConfig = getVictoryTokenDieConfigForTerrain(
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
