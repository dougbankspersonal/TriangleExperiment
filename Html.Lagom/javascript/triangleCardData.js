define([
  "sharedJavascript/cards",
  "sharedJavascript/debugLog",
  "sharedJavascript/genericUtils",
  "dojo/domReady!",
], function (cards, debugLog, genericUtils) {
  //-----------------------------------
  //
  // Constants
  //
  //-----------------------------------

  const SymbolType_Relationships = "wc-relationships";
  const SymbolType_Wealth = "wc-wealth";
  const SymbolType_Purpose = "wc-purpose";
  const SymbolType_Accomplishment = "wc-accomplishment";

  const symbolTypes = {
    AddRelationships: SymbolType_Relationships,
    AddWealth: SymbolType_Wealth,
    Purpose: SymbolType_Purpose,
    AddAccomplishment: SymbolType_Accomplishment,
  };

  var symbolTypesArray = [
    symbolTypes.AddRelationships,
    symbolTypes.AddWealth,
    symbolTypes.Purpose,
    symbolTypes.AddAccomplishment,
  ];

  const seededZeroToOneRandomFunction =
    genericUtils.createSeededGetZeroToOneRandomFunction(387438748);

  //-----------------------------------
  //
  // Global vars
  //
  //-----------------------------------
  const gNumTriesForOptimalSymbolPicking = 10;

  // Each card has N sectors.
  const gNumSectorsPerCard = 4;

  // Each card has M symbols.
  const gNumSymbolsPerCard = 6;

  // The order of sectors:
  //            0
  //            3
  //          2   1
  //
  // I could generate this mathematically but it helps me to see them all explicitly spelled out.
  // Symbol distribution wise:
  // 2 outer sectors have 2, 1 outer sectors has 1: inner sectors has one.
  const layout2211 = [2, 2, 1, 1];
  const layout2121 = [2, 1, 2, 1];
  const layout1221 = [1, 2, 2, 1];

  // 1 outer sectors has 2, 2 outer sectors have 1: inner sectors has 2.
  const layout2112 = [2, 1, 1, 2];
  const layout1212 = [1, 2, 1, 2];
  const layout1122 = [1, 1, 2, 2];

  // 2 outer sectors have 2, 1 outer has 2: inner has 2.
  const layout2202 = [2, 2, 0, 2];
  const layout2022 = [2, 0, 2, 2];
  const layout0222 = [0, 2, 2, 2];

  // 3 outer sectors have 2: inner sectors has 0.
  const sectors = [2, 2, 2, 0];

  // Each   layout is equally likely.
  const layouts = [
    layout2211,
    layout2121,
    layout1221,

    layout2112,
    layout1212,
    layout1122,

    layout2202,
    layout2022,
    layout0222,

    layout2220,
  ];

  // For each layout with have n instances of that layout.
  const instancesPerLayout = 6;
  const totalNumCards = layouts.length * instancesPerLayout;

  // Card has numSymbolsPerCard, so...
  const totalNumSymbols = totalNumCards * gNumSymbolsPerCard;
  // N different symbol types...
  const appearancesPerSymbol = totalNumSymbols / symbolTypesArray.length;

  var cardConfigs = [];

  // Should divide evenly.
  console.assert(
    appearancesPerSymbol == Math.floor(appearancesPerSymbol),
    "appearancesPerSymbol == " +
      appearancesPerSymbol +
      ": " +
      totalNumSymbols +
      " / " +
      symbolTypesArray.length +
      " should be an integer."
  );

  //-----------------------------------
  //
  // Global functions
  //
  //-----------------------------------
  function generateAllSymbolsUsedArray() {
    var allSymbolsArray = [];
    for (
      var symbolIndex = 0;
      symbolIndex < symbolTypesArray.length;
      symbolIndex++
    ) {
      var symbolType = symbolTypesArray[symbolIndex];
      for (
        var symbolCount = 0;
        symbolCount < appearancesPerSymbol;
        symbolCount++
      ) {
        allSymbolsArray.push(symbolType);
      }
    }
    debugLog.debugLog(
      "CardConfigs",
      "rawSymbolArray = " + JSON.stringify(allSymbolsArray)
    );
    return allSymbolsArray;
  }

  function generateAllPurposeNumbersArray() {
    var allPurposeNumbersArray = [];
    for (
      var symbolIndex = 0;
      symbolIndex < appearancesPerSymbol;
      symbolIndex++
    ) {
      var purposeNumber = symbolIndex % gNumSymbolsPerCard;
      allPurposeNumbersArray.push(purposeNumber + 1);
    }
    debugLog.debugLog(
      "CardConfigs",
      "allPurposeNumbersArray = " + JSON.stringify(allPurposeNumbersArray)
    );
    return allPurposeNumbersArray;
  }

  function mapsAreGood(maps) {
    // Maps should have no more than N of any one symbol.
    var totals = {};
    for (var i = 0; i < maps.length; i++) {
      var map = maps[i];
      for (var symbolType in maps[i]) {
        if (!totals[symbolType]) {
          totals[symbolType] = 0;
        }
        totals[symbolType] += map[symbolType];
      }
    }
    for (var symbolType in totals) {
      if (totals[symbolType] > gNumSymbolsPerCard / 2) {
        return false;
      }
    }
    return true;
  }

  function generateCardConfigsInternal() {
    var newCardConfigs = [];

    // Get an array of all symbols used across all cards.
    // Not shuffled or anything.
    var allSymbolsArray = generateAllSymbolsUsedArray();

    // Also make an array of purpose numbers.  Again, not shuffled.
    var allPurposeNumbersArray = generateAllPurposeNumbersArray();

    // Shuffle symbols and purpose numbers.
    var shuffledSymbolArray = genericUtils.copyAndShuffleArray(
      allSymbolsArray,
      seededZeroToOneRandomFunction
    );
    var shuffledPurposeNumberArray = genericUtils.copyAndShuffleArray(
      allPurposeNumbersArray,
      seededZeroToOneRandomFunction
    );

    for (var layoutIndex = 0; layoutIndex < layouts.length; layoutIndex++) {
      debugLog.debugLog(
        "CardConfigs",
        "Doug: generateCardConfigsInternal layoutIndex = " + layoutIndex
      );

      debugLog.debugLog(
        "CardConfigs",
        "Doug: shuffledSymbolArray = " + JSON.stringify(shuffledSymbolArray)
      );
      debugLog.debugLog(
        "CardConfigs",
        "Doug: shuffledSymbolArray.length = " +
          JSON.stringify(shuffledSymbolArray.length)
      );
      debugLog.debugLog(
        "CardConfigs",
        "Doug: shuffledPurposeNumberArray = " +
          JSON.stringify(shuffledPurposeNumberArray)
      );
      debugLog.debugLog(
        "CardConfigs",
        "Doug: shuffledPurposeNumberArray.length = " +
          JSON.stringify(shuffledPurposeNumberArray.length)
      );

      var layout = layouts[layoutIndex];
      debugLog.debugLog(
        "CardConfigs",
        "Doug: layout = " + JSON.stringify(layout)
      );

      // Make card configs for this layout.
      for (
        var instanceIndex = 0;
        instanceIndex < instancesPerLayout;
        instanceIndex++
      ) {
        // This is a lazy way to do it, but for now it'll do:
        // If any map has any value > numSymbolsPerCard/2, then more than half the card is one symbol.  Maybe not
        // good for gameplay?
        // Reject and try again n times.
        var maps;
        var tryCount = 0;
        while (true) {
          var copyOfShuffledSymbolArray = genericUtils.copyAndShuffleArray(
            shuffledSymbolArray,
            seededZeroToOneRandomFunction
          );
          var testMaps = makeSectorMaps(
            copyOfShuffledSymbolArray,
            layout,
            gNumSymbolsPerCard
          );
          if (tryCount == gNumTriesForOptimalSymbolPicking) {
            console.assert(
              false,
              "layoutIndex = " +
                layoutIndex +
                " instanceIndex = " +
                instanceIndex +
                ": tried too many times to get a good map: using it anyway."
            );
          }
          if (
            mapsAreGood(testMaps) ||
            tryCount == gNumTriesForOptimalSymbolPicking
          ) {
            maps = testMaps;
            shuffledSymbolArray = copyOfShuffledSymbolArray;
            break;
          }
          tryCount++;
        }

        debugLog.debugLog(
          "CardConfigs",
          "Doug: maps = " + JSON.stringify(maps)
        );
        var cardConfig = {};
        var sectorDescriptors = [];
        for (var sectorIndex = 0; sectorIndex < maps.length; sectorIndex++) {
          var sectorDescriptor = {
            sectorIndex: sectorIndex,
            sectorMap: maps[sectorIndex],
          };

          // Did this sector have purpose?
          var numPurpose = sectorDescriptor.sectorMap[symbolTypes.Purpose];
          numPurpose = numPurpose ? numPurpose : 0;
          if (numPurpose > 0) {
            var purposeNumbers = [];
            for (
              var purposeIndex = 0;
              purposeIndex < numPurpose;
              purposeIndex++
            ) {
              var purposeNumber = shuffledPurposeNumberArray.shift();
              purposeNumbers.push(purposeNumber);
            }
            sectorDescriptor.purposeNumbers = purposeNumbers;
          }
          sectorDescriptors.push(sectorDescriptor);
        }
        cardConfig.sectorDescriptors = sectorDescriptors;
        newCardConfigs.push(cardConfig);
      } // One card.
    } // One group.

    return newCardConfigs;
  }

  function getCardConfigAtIndex(index) {
    return cards.getCardConfigAtIndex(cardConfigs, index);
  }

  function generateCardConfigs() {
    debugLog.debugLog("CardConfigs", "Doug: calling generateLowEndCardConfigs");

    cardConfigs = generateCardConfigsInternal();
  }

  //-----------------------------------
  //
  // Functions
  //
  //-----------------------------------
  function getNumCards() {
    debugLog.debugLog(
      "CardConfigs",
      "getNumCards: _cardConfigs = " + JSON.stringify(cardConfigs)
    );
    return cards.getNumCardsFromConfigs(cardConfigs);
  }

  // This returned object becomes the defined value of this module
  return {
    symbolTypes: symbolTypes,

    getNumCards: getNumCards,
    getCardConfigAtIndex: getCardConfigAtIndex,
    generateCardConfigs: generateCardConfigs,
  };
});
