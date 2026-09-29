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
  var gCardsPerPlayerDeck = 0;

  //-----------------------------------
  //
  // Functions
  //
  //-----------------------------------
  function convertTerrainTypeArraysToCardConfigs(terrainTypeArrays) {
    var cardConfigs = [];

    for (var terrainTypeArray of terrainTypeArrays) {
      var cardConfig =
        cardTileDataUtils.terrainTypeArrayToCardConfig(terrainTypeArray);
      cardConfigs.push(cardConfig);
    }

    return cardConfigs;
  }

  function decorateWithPlayerOverlay(cardConfigs, playerIndex) {
    var retVal = [];
    const blueSectorClass = cardTileDataUtils.terrainTypeToSectorClass(
      gameInfo.terrainTypes.Blue,
    );

    for (var i = 0; i < cardConfigs.length; i++) {
      var copiedCardConfig = structuredClone(cardConfigs[i]);
      for (var j = 0; j < copiedCardConfig.sectorDescriptors.length; j++) {
        var sectorDescriptor = copiedCardConfig.sectorDescriptors[j];
        // Nobody can own blue...
        if (!sectorDescriptor.classes.includes(blueSectorClass)) {
          sectorDescriptor.overlaysByType = {
            player: ["player-icon-" + playerIndex],
          };
        }
      }
      retVal.push(copiedCardConfig);
    }
    return retVal;
  }

  function generateTerrainTypeArrays() {
    // Just gonna do this by hand.
    // Keep in mind that the Oth item (index 0) is in the middle of the triangle.
    var retVal = [
      // Middle & one corner match, one blue, one other color.
      [
        gameInfo.terrainTypes.Red,
        gameInfo.terrainTypes.Blue,
        gameInfo.terrainTypes.Red,
        gameInfo.terrainTypes.Yellow,
      ],
      [
        gameInfo.terrainTypes.Yellow,
        gameInfo.terrainTypes.Blue,
        gameInfo.terrainTypes.Yellow,
        gameInfo.terrainTypes.Green,
      ],
      [
        gameInfo.terrainTypes.Green,
        gameInfo.terrainTypes.Blue,
        gameInfo.terrainTypes.Green,
        gameInfo.terrainTypes.Red,
      ],

      // Corners match middle different, one corner blue.
      [
        gameInfo.terrainTypes.Green,
        gameInfo.terrainTypes.Blue,
        gameInfo.terrainTypes.Red,
        gameInfo.terrainTypes.Red,
      ],
      [
        gameInfo.terrainTypes.Red,
        gameInfo.terrainTypes.Blue,
        gameInfo.terrainTypes.Yellow,
        gameInfo.terrainTypes.Yellow,
      ],
      [
        gameInfo.terrainTypes.Yellow,
        gameInfo.terrainTypes.Blue,
        gameInfo.terrainTypes.Green,
        gameInfo.terrainTypes.Green,
      ],

      // 2/1/blue
      [
        gameInfo.terrainTypes.Red,
        gameInfo.terrainTypes.Red,
        gameInfo.terrainTypes.Green,
        gameInfo.terrainTypes.Blue,
      ],
      [
        gameInfo.terrainTypes.Green,
        gameInfo.terrainTypes.Green,
        gameInfo.terrainTypes.Yellow,
        gameInfo.terrainTypes.Blue,
      ],
      [
        gameInfo.terrainTypes.Yellow,
        gameInfo.terrainTypes.Yellow,
        gameInfo.terrainTypes.Red,
        gameInfo.terrainTypes.Blue,
      ],

      // 2 and blue.
      [
        gameInfo.terrainTypes.Yellow,
        gameInfo.terrainTypes.Yellow,
        gameInfo.terrainTypes.Blue,
        gameInfo.terrainTypes.Blue,
      ],
      [
        gameInfo.terrainTypes.Red,
        gameInfo.terrainTypes.Red,
        gameInfo.terrainTypes.Blue,
        gameInfo.terrainTypes.Blue,
      ],
      [
        gameInfo.terrainTypes.Green,
        gameInfo.terrainTypes.Green,
        gameInfo.terrainTypes.Blue,
        gameInfo.terrainTypes.Blue,
      ],

      // no blue.
      [
        gameInfo.terrainTypes.Red,
        gameInfo.terrainTypes.Green,
        gameInfo.terrainTypes.Yellow,
        gameInfo.terrainTypes.Green,
      ],
      [
        gameInfo.terrainTypes.Yellow,
        gameInfo.terrainTypes.Red,
        gameInfo.terrainTypes.Green,
        gameInfo.terrainTypes.Red,
      ],
      [
        gameInfo.terrainTypes.Green,
        gameInfo.terrainTypes.Yellow,
        gameInfo.terrainTypes.Red,
        gameInfo.terrainTypes.Yellow,
      ],
    ];
    return retVal;
  }

  function generateCardConfigs() {
    if (gCardConfigs !== null) {
      return gCardConfigs;
    }
    gCardConfigs = [];

    // Just worrying about sectors here.
    // This algorithm:
    // A piece always has 2 water and 2 of something else.  Other things may match or not.
    // Some fraction of the water is actually water-path.
    var terrainTypeArrays = generateTerrainTypeArrays();

    debugLog(
      "generateCardConfigs",
      "terrainTypeArrays = ",
      JSON.stringify(terrainTypeArrays),
    );

    // Convert these into cardConfigs
    var tmpCardConfigs =
      convertTerrainTypeArraysToCardConfigs(terrainTypeArrays);

    // Note this as the num cards in each player deck.
    gCardsPerPlayerDeck = tmpCardConfigs.length;

    // One copy for each player.
    for (var i = 0; i < gameInfo.numPlayers; i++) {
      var playerCardConfigs = structuredClone(tmpCardConfigs);
      playerCardConfigs = decorateWithPlayerOverlay(playerCardConfigs, i);
      gCardConfigs = gCardConfigs.concat(playerCardConfigs);
    }

    debugLog(
      "generateCardConfigs",
      "cardConfigs = ",
      JSON.stringify(gCardConfigs),
    );

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
    for (
      let playerIndex = 0;
      playerIndex < gameInfo.numPlayers;
      playerIndex++
    ) {
      var backConfig = {
        count: gCardsPerPlayerDeck,
        callback: function (parentNode, cardIndex) {
          debugLog("getBackConfigs", "in backConfig: cardIndex = ", cardIndex);
          debugLog(
            "getBackConfigs",
            "in backConfig: playerIndex = ",
            playerIndex,
          );
          return triangleCards.addPlayerSpecificTriangleCardBack(
            parentNode,
            cardIndex,
            playerIndex,
            ["color"],
          );
        },
      };
      backConfigs.push(backConfig);
    }
    return backConfigs;
  }

  // This returned object becomes the defined value of this module
  return {
    getCardConfigs: getCardConfigs,
    getNumCards: getNumCards,
    getBackConfigs: getBackConfigs,
  };
});
