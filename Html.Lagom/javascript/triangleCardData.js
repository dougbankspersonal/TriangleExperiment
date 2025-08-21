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
  const numTriesForOptimalSymbolPicking = 10;

  // Each card has 4 quads containing six symbols.
  const numSymbolsPerCard = 6;

  // The order of quads:
  //            0
  //            3
  //          2   1
  //
  // I could generate this mathematically but it helps me to see them all explicitly spelled out.
  // Symbol distribution wise:
  // 2 outer quads have 2, 1 outer quad has 1: inner quad has one.
  const layout2211 = [2, 2, 1, 1];
  const layout2121 = [2, 1, 2, 1];
  const layout1221 = [1, 2, 2, 1];

  // 1 outer quad has 2, 2 outer quads have 1: inner quad has 2.
  const layout2112 = [2, 1, 1, 2];
  const layout1212 = [1, 2, 1, 2];
  const layout1122 = [1, 1, 2, 2];

  // 2 outer quads have 2, 1 outer has 2: inner has 2.
  const layout2202 = [2, 2, 0, 2];
  const layout2022 = [2, 0, 2, 2];
  const layout0222 = [0, 2, 2, 2];

  // 3 outer quads have 2: inner quad has 0.
  const layout2220 = [2, 2, 2, 0];

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
  const totalNumSymbols = totalNumCards * numSymbolsPerCard;
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
  // Returns ordered array one map per quad.
  // Map maps symbol name to count of that symbol in that quad.
  function makeMapsForASingleCard(shuffledArrayOfSymbols, layout) {
    var sumFromCountPerQuad = 0;
    for (var i = 0; i < layout.length; i++) {
      sumFromCountPerQuad += layout[i];
    }
    console.assert(
      sumFromCountPerQuad == numSymbolsPerCard,
      "makeMapsForASingleCard: sumFromCountPerQuad = " +
        sumFromCountPerQuad +
        " numSymbolsPerCard = " +
        numSymbolsPerCard
    );
    console.assert(
      shuffledArrayOfSymbols.length >= numSymbolsPerCard,
      "makeMapsForASingleCard: shuffledArrayOfSymbols.length:" +
        shuffledArrayOfSymbols.length +
        " < numSymbolsPerCard:" +
        numSymbolsPerCard
    );

    var maps = [];
    for (var i = 0; i < layout.length; i++) {
      var map = {};
      for (var j = 0; j < layout[i]; j++) {
        var symbolType = shuffledArrayOfSymbols.shift();
        if (!map[symbolType]) {
          map[symbolType] = 0;
        }
        map[symbolType]++;
      }
      maps.push(map);
    }

    return maps;
  }

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
      var purposeNumber = symbolIndex % numSymbolsPerCard;
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
      if (totals[symbolType] > numSymbolsPerCard / 2) {
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
          var testMaps = makeMapsForASingleCard(
            copyOfShuffledSymbolArray,
            layout
          );
          if (tryCount == numTriesForOptimalSymbolPicking) {
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
            tryCount == numTriesForOptimalSymbolPicking
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
        var quadDescs = [];
        for (var quadIndex = 0; quadIndex < maps.length; quadIndex++) {
          var quadDesc = {
            quadIndex: quadIndex,
            resourceTypeToResourceCountMap: maps[quadIndex],
          };

          // Did this quad have purpose?
          var numPurpose =
            quadDesc.resourceTypeToResourceCountMap[symbolTypes.Purpose];
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
            quadDesc.purposeNumbers = purposeNumbers;
          }
          quadDescs.push(quadDesc);
        }
        cardConfig.quadDescs = quadDescs;
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
