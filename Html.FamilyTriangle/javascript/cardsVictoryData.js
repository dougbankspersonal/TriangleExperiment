define([
  "sharedJavascript/debugLog",
  "sharedJavascript/htmlUtils",
  "javascript/gameInfo",
  "dojo/domReady!",
], function (debugLogModule, htmlUtils, gameInfo) {
  var debugLog = debugLogModule.debugLog;

  var gCardVictorySymbolConfigs = null;
  var gCardVictorySurpriseConfigs = null;

  const gNumSurpriseTokens = 10;

  function generateTokenVictorySymbolConfigs() {
    if (gCardVictorySymbolConfigs !== null) {
      return gCardVictorySymbolConfigs;
    }

    gCardVictorySymbolConfigs = [];

    for (var i = 0; i < gameInfo.terrainTypesArray.length; i++) {
      var terrainType = gameInfo.terrainTypesArray[i];
      for (var j = 0; j < gameInfo.scoringTokenSymbolsArray.length; j++) {
        var scoringTokenSymbol = gameInfo.scoringTokenSymbolsArray[j];
        var cardConfig = {
          classes: ["victory", "symbol", "shade-" + terrainType],
          imageClasses: [scoringTokenSymbol],
        };
        gCardVictorySymbolConfigs.push(cardConfig);
      }
    }

    return gCardVictorySymbolConfigs;
  }

  function generateTokenVictorySurpriseConfigs() {
    if (gCardVictorySurpriseConfigs !== null) {
      return gCardVictorySurpriseConfigs;
    }

    gCardVictorySurpriseConfigs = [];

    for (var i = 0; i < gameInfo.terrainTypesArray.length; i++) {
      const terrainType = gameInfo.terrainTypesArray[i];
      const terrainTypeString = gameInfo.terrainTypeToStringMap[terrainType];
      for (var j = 0; j < gNumSurpriseTokens; j++) {
        var message;

        var coloringClass = "shade-" + terrainType;
        if (j == 0) {
          message =
            "<span class=value>🏆</span><br><span class=type>Wild</span><br><span class=extra>Any terrain type</span>";
          coloringClass = "wild";
        } else if (j == 1) {
          message =
            "<span class=value>🏆🏆</span><br><span class=type>" +
            terrainTypeString +
            "</span>";
        } else {
          message =
            "<span class=value>🏆</span><br><span class=type>" +
            terrainTypeString +
            "</span>";
        }

        var cardConfig = {
          classes: ["victory", "surprise", coloringClass],
          text: message,
        };
        gCardVictorySurpriseConfigs.push(cardConfig);
      }
    }

    return gCardVictorySurpriseConfigs;
  }

  function getNumCardsVctorySurprise() {
    generateTokenVictorySurpriseConfigs();
    return gCardVictorySurpriseConfigs.length;
  }

  function getNumCardsVictorySymbols() {
    generateTokenVictorySymbolConfigs();
    return gCardVictorySymbolConfigs.length;
  }

  function getCardsVctorySurpriseConfigs() {
    generateTokenVictorySurpriseConfigs();
    return gCardVictorySurpriseConfigs;
  }

  function getCardsVictorySymbolConfigs() {
    generateTokenVictorySymbolConfigs();
    return gCardVictorySymbolConfigs;
  }

  function getBackConfigs() {
    var backConfigs = [];
    for (
      let terrainTypeIndex = 0;
      terrainTypeIndex < gameInfo.terrainTypesArray.length;
      terrainTypeIndex++
    ) {
      var terrainType = gameInfo.terrainTypesArray[terrainTypeIndex];
      var backConfig = {
        classes: ["victory", "back", "square-" + terrainType],
      };
      backConfigs.push(backConfig);
    }
    return backConfigs;
  }

  return {
    getNumCardsVctorySurprise: getNumCardsVctorySurprise,
    getCardsVctorySurpriseConfigs: getCardsVctorySurpriseConfigs,

    getNumCardsVictorySymbols: getNumCardsVictorySymbols,
    getCardsVictorySymbolConfigs: getCardsVictorySymbolConfigs,

    getBackConfigs: getBackConfigs,
  };
});
