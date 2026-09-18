define([
  "sharedJavascript/cards",
  "sharedJavascript/debugLog",
  "sharedJavascript/triangleCards",
  "javascript/cardTileDataUtils",
  "javascript/gameInfo",
  "dojo/domReady!",
], function (
  cards,
  debugLogModule,
  triangleCards,
  cardTileDataUtils,
  gameInfo,
) {
  var debugLog = debugLogModule.debugLog;
  //-----------------------------------
  //
  // Global state.
  //
  //-----------------------------------
  var gCardConfigs = null;
  const gAllBlueCount = 1;

  //-----------------------------------
  //
  // Functions
  //
  //-----------------------------------
  function generateAllBlueCardConfig() {
    var allBlueTerrainTypeArray = [
      gameInfo.terrainTypes.Blue,
      gameInfo.terrainTypes.Blue,
      gameInfo.terrainTypes.Blue,
      gameInfo.terrainTypes.Blue,
    ];

    var allBlueCardConfig = cardTileDataUtils.terrainTypeArrayToCardConfig(
      allBlueTerrainTypeArray,
    );
    return allBlueCardConfig;
  }

  function generateStartingTileCardConfig() {
    var startingTileTerrainTypeArray = [
      gameInfo.terrainTypes.Blue,
      gameInfo.terrainTypes.Red,
      gameInfo.terrainTypes.Green,
      gameInfo.terrainTypes.Yellow,
    ];

    var startingTileCardConfig = cardTileDataUtils.terrainTypeArrayToCardConfig(
      startingTileTerrainTypeArray,
    );
    return startingTileCardConfig;
  }

  function generateCardConfigs() {
    if (gCardConfigs !== null) {
      return gCardConfigs;
    }
    gCardConfigs = [];

    // Add all-swamps.
    for (var i = 0; i < gAllBlueCount; i++) {
      var allBlueCardConfig = generateAllBlueCardConfig();
      gCardConfigs.push(allBlueCardConfig);
    }

    // Add starting tile:
    var startingTileCardConfig = generateStartingTileCardConfig();
    gCardConfigs.push(startingTileCardConfig);

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
    var backConfig = {
      callback: function (parentNode, cardIndex) {
        return triangleCards.addTriangleCardBack(parentNode, cardIndex, [
          "extra-tile-back",
        ]);
      },
    };
    backConfigs.push(backConfig);
    return backConfigs;
  }

  // This returned object becomes the defined value of this module
  return {
    getCardConfigs: getCardConfigs,
    getNumCards: getNumCards,
    getBackConfigs: getBackConfigs,
  };
});
