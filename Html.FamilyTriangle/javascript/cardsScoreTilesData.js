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

  function generateCardConfigsForNthTerrainType(index) {
    var configs = [];
    var terrainType = gameInfo.terrainTypesArray[index];
    console.assert(
      terrainType !== undefined,
      "Invalid terrain type for index " + index,
    );
    debugLog(
      "generateCardConfigsForNthTerrainType",
      "terrainType = ",
      terrainType,
    );

    // Three dots of this type.
    configs.push({
      dots: [terrainType, terrainType, terrainType],
      terrainType: terrainType,
    });

    // Two this type one of each other.
    for (var i = 0; i < gameInfo.terrainTypesArray.length; i++) {
      if (i === index) continue;
      var otherTerrainType = gameInfo.terrainTypesArray[i];
      configs.push({
        dots: [terrainType, terrainType, otherTerrainType],
        terrainType: terrainType,
      });
    }

    // One of this type two of the others.
    for (var i = 0; i < gameInfo.terrainTypesArray.length; i++) {
      if (i === index) continue;
      for (var j = 1; j < gameInfo.terrainTypesArray.length; j++) {
        var k = (j + i) % gameInfo.terrainTypesArray.length;
        if (k === index) continue;
        var otherTerrainType1 = gameInfo.terrainTypesArray[i];
        var otherTerrainType2 = gameInfo.terrainTypesArray[k];
        configs.push({
          dots: [terrainType, otherTerrainType1, otherTerrainType2],
          terrainType: terrainType,
        });
      }
    }

    debugLog(
      "generateCardConfigsForNthTerrainType",
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

    for (var i = 0; i < gameInfo.terrainTypesArray.length; i++) {
      var configs = generateCardConfigsForNthTerrainType(i);
      gCardConfigs = gCardConfigs.concat(configs);
    }

    return gCardConfigs;
  }

  function getCardConfigs() {
    generateCardConfigs();

    console.assert(
      gCardConfigs,
      "getNumCards called before generateCardConfigs",
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
    for (let i = 0; i < gameInfo.terrainTypesArray.length; i++) {
      let terrainType = gameInfo.terrainTypesArray[i];
      var backConfig = {
        callback: function (parentNode, cardIndex) {
          return triangleCards.addTriangleCardBack(
            parentNode,
            cardIndex,
            ["cards-score-tiles", terrainType],
            function (parentNode) {
              htmlUtils.addImage(parentNode, ["trophy"], "trophy");
            },
          );
        },
      };
      backConfigs.push(backConfig);
    }
    return backConfigs;
  }

  // This returned object becomes the defined value of this module
  return {
    getNumCards: getNumCards,
    getCardConfigs: getCardConfigs,
    getBackConfigs: getBackConfigs,
  };
});
