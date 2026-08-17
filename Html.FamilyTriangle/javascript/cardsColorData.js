define([
  "sharedJavascript/cards",
  "sharedJavascript/debugLog",
  "javascript/gameInfo",
  "dojo/domReady!",
], function (cards, debugLogModule, gameInfo) {
  var debugLog = debugLogModule.debugLog;
  //-----------------------------------
  //
  // Global state.
  //
  //-----------------------------------
  var gCardConfigs = null;

  //-----------------------------------
  //
  // Functions
  //
  //-----------------------------------
  function convertTerrainTypeArraysToCardConfigs(terrainTypeArrays) {
    var cardConfigs = [];

    for (var terrainTypeArray of terrainTypeArrays) {
      var sectorDescriptors = [];
      console.assert(
        terrainTypeArray.length === 4,
        "terrainTypeArray.length !== 4",
      );
      for (var i = 0; i < terrainTypeArray.length; i++) {
        var terrainType = terrainTypeArray[i];
        var sectorDescriptor = { classes: [terrainType] };
        sectorDescriptors.push(sectorDescriptor);
      }

      var cardConfig = {
        sectorDescriptors: sectorDescriptors,
        classes: ["color"],
        overlayClass: "color-overlay",
      };
      cardConfigs.push(cardConfig);
    }

    return cardConfigs;
  }

  function decorateWithPlayerOverlay(cardConfigs, playerIndex) {
    var retVal = [];
    for (var i = 0; i < cardConfigs.length; i++) {
      var copiedCardConfig = structuredClone(cardConfigs[i]);
      for (var j = 0; j < copiedCardConfig.sectorDescriptors.length; j++) {
        var sectorDescriptor = copiedCardConfig.sectorDescriptors[j];
        // Nobody can own blue...
        if (!sectorDescriptor.classes.includes(gameInfo.terrainTypes.Blue)) {
          sectorDescriptor.overlaysByType = {
            player: ["player-icon-" + playerIndex],
          };
        }
      }
      retVal.push(copiedCardConfig);
    }
    return retVal;
  }

  /*
  function decorarteWithOverlays(cardConfigs) {
    var retVal = [];

    var grassCount = 0;
    var flowerCount = 0;
    for (var i = 0; i < cardConfigs.length; i++) {
      var copiedCardConfig = structuredClone(cardConfigs[i]);

      // Look for flowers.  Every other gets a different type of flower.
      for (var j = 0; j < copiedCardConfig.sectorDescriptors.length; j++) {
        var sectorDescriptor = copiedCardConfig.sectorDescriptors[j];
        if (sectorDescriptor.classes.includes(gTerrainTypeGrass)) {
          grassCount++;
          if (grassCount % gFlowerFrequency === 0) {
            var flowerCount = flowerCount + 1;
            var flowerType = "flower-" + (flowerCount % gNumFlowerTypes);
            sectorDescriptor.overlaysByType = {
              flower: [flowerType],
            };
          }
        }
      }
      retVal.push(copiedCardConfig);
    }

    return retVal;
  }
    */

  function generateTerrainTypeArrays() {
    // Just gonna do this by hand.
    // Keep in mind that the 3rd item (index 2) is in the middle of the triangle.
    var retVal = [
      // Middle & one corner match, other two are blue.
      [
        gameInfo.terrainTypes.Red,
        gameInfo.terrainTypes.Blue,
        gameInfo.terrainTypes.Red,
        gameInfo.terrainTypes.Blue,
      ],
      [
        gameInfo.terrainTypes.Yellow,
        gameInfo.terrainTypes.Blue,
        gameInfo.terrainTypes.Yellow,
        gameInfo.terrainTypes.Blue,
      ],
      [
        gameInfo.terrainTypes.Green,
        gameInfo.terrainTypes.Blue,
        gameInfo.terrainTypes.Green,
        gameInfo.terrainTypes.Blue,
      ],

      // Middle & one corner blue, other two match.
      [
        gameInfo.terrainTypes.Blue,
        gameInfo.terrainTypes.Red,
        gameInfo.terrainTypes.Blue,
        gameInfo.terrainTypes.Red,
      ],
      [
        gameInfo.terrainTypes.Blue,
        gameInfo.terrainTypes.Yellow,
        gameInfo.terrainTypes.Blue,
        gameInfo.terrainTypes.Yellow,
      ],
      [
        gameInfo.terrainTypes.Blue,
        gameInfo.terrainTypes.Green,
        gameInfo.terrainTypes.Blue,
        gameInfo.terrainTypes.Green,
      ],

      // Middle & one corner match, other two also match, non-blue.
      [
        gameInfo.terrainTypes.Red,
        gameInfo.terrainTypes.Yellow,
        gameInfo.terrainTypes.Red,
        gameInfo.terrainTypes.Yellow,
      ],
      [
        gameInfo.terrainTypes.Green,
        gameInfo.terrainTypes.Red,
        gameInfo.terrainTypes.Green,
        gameInfo.terrainTypes.Red,
      ],
      [
        gameInfo.terrainTypes.Yellow,
        gameInfo.terrainTypes.Green,
        gameInfo.terrainTypes.Yellow,
        gameInfo.terrainTypes.Green,
      ],

      // Middle & one corner match, other one non-blue one blue.
      [
        gameInfo.terrainTypes.Red,
        gameInfo.terrainTypes.Green,
        gameInfo.terrainTypes.Red,
        gameInfo.terrainTypes.Blue,
      ],
      [
        gameInfo.terrainTypes.Green,
        gameInfo.terrainTypes.Yellow,
        gameInfo.terrainTypes.Green,
        gameInfo.terrainTypes.Blue,
      ],
      [
        gameInfo.terrainTypes.Yellow,
        gameInfo.terrainTypes.Red,
        gameInfo.terrainTypes.Yellow,
        gameInfo.terrainTypes.Blue,
      ],

      // All 4 in different perms.
      [
        gameInfo.terrainTypes.Red,
        gameInfo.terrainTypes.Green,
        gameInfo.terrainTypes.Yellow,
        gameInfo.terrainTypes.Blue,
      ],
      [
        gameInfo.terrainTypes.Green,
        gameInfo.terrainTypes.Yellow,
        gameInfo.terrainTypes.Blue,
        gameInfo.terrainTypes.Red,
      ],
      [
        gameInfo.terrainTypes.Yellow,
        gameInfo.terrainTypes.Blue,
        gameInfo.terrainTypes.Red,
        gameInfo.terrainTypes.Green,
      ],
      [
        gameInfo.terrainTypes.Blue,
        gameInfo.terrainTypes.Red,
        gameInfo.terrainTypes.Green,
        gameInfo.terrainTypes.Yellow,
      ],

      // Middle and one don't match, others do, non-blue.
      [
        gameInfo.terrainTypes.Red,
        gameInfo.terrainTypes.Yellow,
        gameInfo.terrainTypes.Green,
        gameInfo.terrainTypes.Yellow,
      ],
      [
        gameInfo.terrainTypes.Yellow,
        gameInfo.terrainTypes.Green,
        gameInfo.terrainTypes.Red,
        gameInfo.terrainTypes.Green,
      ],
      [
        gameInfo.terrainTypes.Green,
        gameInfo.terrainTypes.Red,
        gameInfo.terrainTypes.Yellow,
        gameInfo.terrainTypes.Red,
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

  // This returned object becomes the defined value of this module
  return {
    getCardConfigs: getCardConfigs,
    getNumCards: getNumCards,
  };
});
