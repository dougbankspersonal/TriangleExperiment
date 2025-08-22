/* Deprecated */

define([
  "dojo/dom-style",
  "sharedJavascript/cards",
  "sharedJavascript/debugLog",
  "sharedJavascript/genericUtils",
  "sharedJavascript/htmlUtils",
  "dojo/domReady!",
], function (domStyle, cards, debugLog, genericUtils, htmlUtils) {
  // This should be a number with a sane value.
  function assertIsNumber(value) {
    if (typeof value !== "number" || isNaN(value)) {
      console.assert(
        false,
        "Expected number, got : " + typeof value + " with value = " + value
      );
    }
  }

  // sectorIndexToNumSymbols is an array, each value tells how many
  // symbols are in sector of that index on the card.
  // Count all the symbols.
  // Do some sanity checking along the way.
  function totalSymbolsInAllSectors(sectorIndexToNumSymbolsInSector) {
    var retVal = 0;
    for (
      var sectorIndex = 0;
      sectorIndex < sectorIndexToNumSymbolsInSector.length;
      sectorIndex++
    ) {
      assertIsNumber(sectorIndexToNumSymbolsInSector[sectorIndex]);
      retVal += sectorIndexToNumSymbolsInSector[sectorIndex];
    }
    return retVal;
  }

  // We want to describe a card.
  // We are given:
  // * Shuffled array of symbols: when we need a symbol just pull off the front.
  // * an array where each element says how many symbols are in the sector of that index.
  // * an expected number of symbols on entire card.
  // First sanity check: sum of symbol count in sectorIndexToNumSymbolsInSector should be
  // expectedNumSymbolsPerCard.
  // Then fill in card description:
  // * Each card has n sectors.
  // * Each sector has n symbols.
  // * To describe a sector: a map from symbol name to num instances of that symbol.
  // * To describe a card: ordered array of sector maps.
  function makeSectorMaps(
    shuffledArrayOfSymbols,
    sectorIndexToNumSymbolsInSector,
    expectedNumSymbolsPerCard
  ) {
    // Sanity checking: count of symbols in sectorIndexToNumSymbolsInSector should be expected num symbols
    // per card.
    var totalSymbolsOnCard = totalSymbolsInAllSectors(
      sectorIndexToNumSymbolsInSector
    );
    console.assert(
      totalSymbolsOnCard == expectedNumSymbolsPerCard,
      "makeSectorMaps: totalSymbolsOnCard = " +
        totalSymbolsOnCard +
        "; gNumSymbolsPerCard = " +
        expectedNumSymbolsPerCard
    );

    console.assert(
      shuffledArrayOfSymbols.length >= expectedNumSymbolsPerCard,
      "makeSectorMaps: shuffledArrayOfSymbols.length:" +
        shuffledArrayOfSymbols.length +
        " < _numSymbolsPerCard:" +
        expectedNumSymbolsPerCard
    );

    // build the card description: an array of sector maps.
    var sectorMaps = [];
    for (
      var sectorIndex = 0;
      sectorIndex < sectorIndexToNumSymbolsInSector.length;
      sectorIndex++
    ) {
      var sectorMap = {};
      for (var j = 0; j < sectorIndexToNumSymbolsInSector[sectorIndex]; j++) {
        var symbolType = shuffledArrayOfSymbols.shift();
        if (!sectorMap[symbolType]) {
          sectorMap[symbolType] = 0;
        }
        sectorMap[symbolType]++;
      }
      sectorMaps.push(sectorMap);
    }
    return sectorMaps;
  }

  // We have a sector with different symbols in it.
  // Some symbols may also require a number (it's not just wealth, it's wealth 2 or whatever).
  // Pull required numbers from shuffled array of numbers, add them to a table
  // of numbers-by-symbol on the sectorDescriptor.
  function maybeAddNumbers(
    sectorDescriptor,
    symbolTypeRequiringNumbers,
    shuffledArrayOfNumbers
  ) {
    var numNumbersRequired =
      sectorDescriptor.sectorMap[symbolTypeRequiringNumbers];
    numNumbersRequired = numNumbersRequired ? numNumbersRequired : 0;
    if (numNumbersRequired > 0) {
      var numbers = [];
      for (
        var numberCount = 0;
        numberCount < numNumbersRequired;
        numberCount++
      ) {
        var number = shuffledArrayOfNumbers.shift();
        numbers.push(number);
      }
      sectorDescriptor.numbersBySymbolType =
        sectorDescriptor.numbersBySymbolType
          ? sectorDescriptor.numbersBySymbolType
          : {};
      sectorDescriptor.numbersBySymbolType[symbolTypeRequiringNumbers] =
        numbers;
    }
  }

  function generateNCountArray(values, countPerValue) {
    var retVal = [];
    for (var valueIndex = 0; valueIndex < values.length; valueIndex++) {
      var value = values[valueIndex];
      for (var valueCount = 0; valueCount < countPerValue; valueCount++) {
        retVal.push(value);
      }
    }
    debugLog.debugLog(
      "CardConfigs",
      "generateNCountArray retVal = " + JSON.stringify(retVal)
    );
    return retVal;
  }

  function makeCardConfig(
    shuffledArrayOfSymbols,
    symbolCountBySectorIndex,
    expectedSymbolCount,
    opt_symbolsRequiringNumbers
  ) {
    var sectorMaps = makeSectorMaps(
      shuffledArrayOfSymbols,
      symbolCountBySectorIndex,
      expectedSymbolCount
    );

    debugLog.debugLog(
      "CardConfigs",
      "Doug: makeCardConfig: sectorMaps = " + JSON.stringify(sectorMaps)
    );

    var cardConfig = {
      sectorDescriptors: [],
    };

    for (var sectorIndex = 0; sectorIndex < sectorMaps.length; sectorIndex++) {
      var sectorDescriptor = {
        sectorMap: sectorMaps[sectorIndex],
      };

      // For any symbol that needs numbers, add those numbers.
      var symbolsRequiringNumbers = opt_symbolsRequiringNumbers || {};
      debugLog.debugLog(
        "CardConfigs",
        "Doug: makeCardConfig: symbolsRequiringNumbers = " +
          JSON.stringify(symbolsRequiringNumbers)
      );

      for (var symbolType in symbolsRequiringNumbers) {
        var shuffledNumbers = symbolsRequiringNumbers[symbolType];
        maybeAddNumbers(sectorDescriptor, symbolType, shuffledNumbers);
      }

      cardConfig.sectorDescriptors.push(sectorDescriptor);
    }
    return cardConfig;
  }

  // This returned object becomes the defined value of this module
  return {
    makeSectorMaps: makeSectorMaps,
    maybeAddNumbers: maybeAddNumbers,
    generateNCountArray: generateNCountArray,
    makeCardConfig: makeCardConfig,
  };
});
