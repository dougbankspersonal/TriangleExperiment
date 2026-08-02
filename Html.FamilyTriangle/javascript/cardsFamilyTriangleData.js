// 207.846pxs

/*
Tightly bound with hoaDeckConfigConstruction.js

hoaDeckConfigConstruction describes a deck of cards in "HOA" specific terms.
This translates into an array of card configs using generic "triangle cards" terms, these can
be passed off to triangleCards shared code to generate actual cards.
*/
define([
  "sharedJavascript/cards",
  "sharedJavascript/debugLog",
  "sharedJavascript/genericUtils",
  "sharedJavascript/triangleCardUtils",
  "dojo/domReady!",
], function (cards, debugLogModule, genericUtils, triangleCardUtils) {
  var debugLog = debugLogModule.debugLog;
  //-----------------------------------
  //
  // Constants
  //
  //-----------------------------------
  const gFlowerFrequency = 2;
  const gNumFlowerTypes = 3;

  const gNumPlayers = 4;

  const gTerrainTypeRed = "tri-red";
  const gTerrainTypeBlue = "tri-blue";
  const gTerrainTypeGreen = "tri-green";
  const gTerrainTypeYellow = "tri-yellow";

  const gTerrainTypes = {
    Red: gTerrainTypeRed,
    Blue: gTerrainTypeBlue,
    Green: gTerrainTypeGreen,
    Yellow: gTerrainTypeYellow,
  };

  const gTerrainTypesArray = Object.values(gTerrainTypes);

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
  // Is element rotationall unique in the remainder of this array.
  function elementIsRotationallyUnique(elementAsArray, index, array) {
    debugLog(
      "elementIsRotationallyUnique",
      "elementAsArray = ",
      JSON.stringify(elementAsArray),
    );
    debugLog("elementIsRotationallyUnique", "index = ", index);
    for (var i = index + 1; i < array.length; i++) {
      var otherElemenetAsArray = array[i];
      debugLog(
        "elementIsRotationallyUnique",
        "otherElemenetAsArray = ",
        JSON.stringify(otherElemenetAsArray),
      );
      if (
        triangleCardUtils.elementsRotationallyMatch(
          elementAsArray,
          otherElemenetAsArray,
        )
      ) {
        debugLog(
          "elementIsRotationallyUnique",
          "elementAsArray is rotationally same as otherElemenetAsArray: returning false",
        );
        return false;
      }
      debugLog("elementIsRotationallyUnique", "no matches, returning true");
    }
    return true;
  }

  // Returns all the legal unique combos of terrain types.
  // Each combo is an array of 4 terrain values, one for each sector.
  //
  // In the current experiement a combo is legal if:
  // 1. It is not just all one terrain type.
  // 2. It is rotationally unique.  Unfortunately the index for the center sector is 2.
  //   So these are all same:
  //     * r r b b
  //     * b r b r
  //     * r b b r
  function getLegalUniqueCombos() {
    debugLog(
      "getLegalUniqueCombos",
      "gTerrainTypesArray = ",
      JSON.stringify(gTerrainTypesArray),
    );
    var allCombos = genericUtils.generateAllArrays(
      gTerrainTypesArray,
      triangleCardUtils.sectorsInTriangle,
    );

    debugLog("getLegalUniqueCombos", "allCombos = ", JSON.stringify(allCombos));

    // Throw out anything where one type shows up too much.
    var filteredCombos1 = allCombos.filter((elementAsArray, _index, _array) => {
      var hasTooManyCopies =
        genericUtils.arrayHasAnElemententWithMoreThanNCopies(
          elementAsArray,
          triangleCardUtils.sectorsInTriangle - 2,
        );
      return !hasTooManyCopies;
    });

    debugLog(
      "getLegalUniqueCombos",
      "filteredCombos1 = ",
      JSON.stringify(filteredCombos1),
    );

    // Throw out anything where there are 0 dups.
    var filteredCombos2 = filteredCombos1.filter(
      (elementAsArray, _index, _array) => {
        var hasDups = genericUtils.arrayHasAnElemententWithMoreThanNCopies(
          elementAsArray,
          1,
        );
        debugLog(
          "getLegalUniqueCombos",
          "elementAsArray = ",
          JSON.stringify(elementAsArray),
        );
        debugLog("getLegalUniqueCombos", "hasDups = ", hasDups);

        return hasDups;
      },
    );

    debugLog(
      "getLegalUniqueCombos",
      "filteredCombos2 = ",
      JSON.stringify(filteredCombos2),
    );

    // Throw out rotationally similar combos.
    var finalCombos = filteredCombos2.filter((elementAsArray, index, array) => {
      return elementIsRotationallyUnique(elementAsArray, index, array);
    });

    debugLog(
      "getLegalUniqueCombos",
      "finalCombos = ",
      JSON.stringify(finalCombos),
    );
    return finalCombos;
  }

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
        classes: ["family-triangle"],
        overlayClass: "family-triangle-overlay",
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
        if (!sectorDescriptor.classes.includes(gTerrainTypeBlue)) {
          sectorDescriptor.overlaysByType = {
            player: ["player-" + playerIndex],
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

  function generateCardConfigs() {
    console.assert(gCardConfigs === null, "generateCardConfigs called twice");
    gCardConfigs = [];

    // Just worrying about sectors here.
    // This algorithm:
    // A piece always has 2 water and 2 of something else.  Other things may match or not.
    // Some fraction of the water is actually water-path.
    var terrainTypeArrays = getLegalUniqueCombos();

    debugLog(
      "generateCardConfigs",
      "terrainTypeArrays = ",
      JSON.stringify(terrainTypeArrays),
    );

    // Convert these into cardConfigs
    var tmpCardConfigs =
      convertTerrainTypeArraysToCardConfigs(terrainTypeArrays);

    // One copy for each player.
    for (var i = 0; i < gNumPlayers; i++) {
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
    console.assert(
      gCardConfigs,
      "getNumCards called before generateCardConfigs",
    );
    debugLog("getCardConfigs: gCardConfigs.length = ", gCardConfigs.length);
    return gCardConfigs;
  }

  function getNumCards() {
    console.assert(
      gCardConfigs,
      "getNumCards called before generateCardConfigs",
    );
    return cards.getNumCardsFromConfigs(gCardConfigs);
  }

  // This returned object becomes the defined value of this module
  return {
    terrainTypes: gTerrainTypes,
    terrainTypesArray: gTerrainTypesArray,
    numPlayers: gNumPlayers,

    generateCardConfigs: generateCardConfigs,
    getCardConfigs: getCardConfigs,
    getNumCards: getNumCards,
  };
});
