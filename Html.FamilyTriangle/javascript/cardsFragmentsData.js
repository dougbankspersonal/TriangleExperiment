define([
  "sharedJavascript/cards",
  "sharedJavascript/debugLog",
  "sharedJavascript/htmlUtils",
  "sharedJavascript/triangleCards",
  "javascript/gameInfo",
  "dojo/domReady!",
], function (cards, debugLogModule, htmlUtils, triangleCards, gameInfo) {
  var debugLog = debugLogModule.debugLog;
  //-----------------------------------
  //
  // Global state.
  //
  //-----------------------------------
  var gCardConfigs = null;

  function generateCardConfigsForNthScoringTerrainType(index) {
    var configs = [];
    var tileTerrainType = gameInfo.scoringTerrainTypesArray[index];
    console.assert(
      tileTerrainType !== undefined,
      "Invalid terrain type for index " + index,
    );
    debugLog(
      "generateCardConfigsForNthScoringTerrainType",
      "terrainType = ",
      tileTerrainType,
    );

    // Three dots of this type.
    configs.push({
      dots: [tileTerrainType, tileTerrainType, tileTerrainType],
      terrainType: tileTerrainType,
    });

    // Two this type one of each other.
    for (var i = 0; i < gameInfo.terrainTypesArray.length; i++) {
      var dotTerrainType = gameInfo.terrainTypesArray[i];
      if (dotTerrainType === tileTerrainType) continue;
      configs.push({
        dots: [tileTerrainType, tileTerrainType, dotTerrainType],
        terrainType: tileTerrainType,
      });
    }

    // One of this type, two of the others, not the same, and ordered.
    for (var i = 0; i < gameInfo.terrainTypesArray.length - 1; i++) {
      for (var j = i + 1; j < gameInfo.terrainTypesArray.length; j++) {
        var firstDotTerrainType = gameInfo.terrainTypesArray[i];
        var secondDotTerrainType = gameInfo.terrainTypesArray[j];
        // If either of these is same as tileTerrainType, skip.
        if (firstDotTerrainType === tileTerrainType) continue;
        if (secondDotTerrainType === tileTerrainType) continue;
        configs.push({
          dots: [tileTerrainType, firstDotTerrainType, secondDotTerrainType],
          terrainType: tileTerrainType,
        });
      }
    }

    debugLog(
      "generateCardConfigsForNthScoringTerrainType",
      "configs = ",
      JSON.stringify(configs),
    );

    return configs;
  }

  function generateCardConfigs() {
    if (gCardConfigs !== null) {
      return gCardConfigs;
    }
    gCardConfigs = [];

    for (var i = 0; i < gameInfo.scoringTerrainTypesArray.length; i++) {
      var configs = generateCardConfigsForNthScoringTerrainType(i);
      gCardConfigs = gCardConfigs.concat(configs);
    }

    return gCardConfigs;
  }

  function getCardConfigs() {
    generateCardConfigs();

    console.assert(
      gCardConfigs,
      "getCardConfigs called before generateCardConfigs",
    );
    debugLog("getCardConfigs: gCardConfigs.length = ", gCardConfigs.length);
    return gCardConfigs;
  }

  function getNumCards() {
    generateCardConfigs();
    console.assert(
      gCardConfigs,
      "getNumCards called before generateCardConfigs",
    );
    return cards.getNumCardsFromConfigs(gCardConfigs);
  }

  function getBackConfigs() {
    var backConfigs = [];
    return backConfigs;
  }

  // This returned object becomes the defined value of this module
  return {
    getNumCards: getNumCards,
    getCardConfigs: getCardConfigs,
    getBackConfigs: getBackConfigs,
  };
});
