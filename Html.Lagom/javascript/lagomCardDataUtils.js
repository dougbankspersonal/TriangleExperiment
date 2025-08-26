define([
  "sharedJavascript/debugLog",
  "sharedJavascript/genericUtils",
  "dojo/domReady!",
], function (debugLogModule, genericUtils) {
  var debugLog = debugLogModule.debugLog;

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
  function sumDistribution(distribution) {
    var retVal = 0;
    for (
      var sectorIndex = 0;
      sectorIndex < distribution.length;
      sectorIndex++
    ) {
      assertIsNumber(distribution[sectorIndex]);
      retVal += distribution[sectorIndex];
    }
    return retVal;
  }

  // We want to describe what symbols go where in a card.
  // Passes back an array: one entry for each sector.
  // Each entry is a histogram mapping type of symbol to the number of times the symbol
  // appears in that sector (if a symbol is missing from histogram -> zero appearances
  // in the sector)
  function makeSectorMaps(
    symbolTypesArray, // Array of all possible symbol types.
    countPerSymbolInDeck, // How many of each symbol in the deck (we are assuming all symbols have equal representation)
    symbolHistory, // Symbol to count histogram: how many times have we already used this symbol.
    distribution, // N element array for n = number of sectors.  Each element says how many symbols in that sector.
    getRandomZeroToOne // Seeded rand function.
  ) {
    // build the card description: an array of sector maps.
    var sectorMaps = [];

    var totalSymbolsInDistribution = sumDistribution(distribution);

    for (
      var sectorIndex = 0;
      sectorIndex < distribution.length;
      sectorIndex++
    ) {
      var sectorMap = {};
      var symbolCount = distribution[sectorIndex];
      for (var j = 0; j < symbolCount; j++) {
        var symbolType = genericUtils.getRandomFromArrayWithRails(
          symbolTypesArray,
          symbolHistory,
          totalSymbolsInDistribution / 2,
          countPerSymbolInDeck,
          getRandomZeroToOne
        );
        if (!sectorMap[symbolType]) {
          sectorMap[symbolType] = 0;
        }
        sectorMap[symbolType]++;
      }
      sectorMaps.push(sectorMap);
    }
    return sectorMaps;
  }

  // Sector descriptor: map from sector index to histogram of symbol appearance in sector.
  // symbolType: What type of symbol needs numbers attached.
  // minValue, maxValue: we are going to add a number from [minValue, maxValue] for each symbol of given type.
  // history: a histogram mapping number to times we've used this number in all of the deck.
  // maxInstances: in the entire deck, we are not allowed to have any more than this number of any particular number.
  // getRandomZeroToOne: seeded rand function.
  function addNumbers(
    sectorDescriptor,
    symbolType,
    minValue,
    maxValue,
    history,
    maxInstances,
    getRandomZeroToOne
  ) {
    var maxFrequencyDifference = (maxValue - minValue) / 2;
    var numberArray = [];
    for (var i = minValue; i <= maxValue; i++) {
      numberArray[i] = i;
    }
    var numNumbersRequired = sectorDescriptor.sectorMap[symbolType];
    numNumbersRequired = numNumbersRequired ? numNumbersRequired : 0;

    if (numNumbersRequired > 0) {
      var numbers = [];
      for (var i = 0; i < numNumbersRequired; i++) {
        var number = genericUtils.getRandomFromArrayWithRails(
          numberArray,
          history,
          maxFrequencyDifference,
          maxInstances,
          getRandomZeroToOne
        );
        numbers.push(number);
      }
      sectorDescriptor.numbersBySymbolType =
        sectorDescriptor.numbersBySymbolType
          ? sectorDescriptor.numbersBySymbolType
          : {};
      sectorDescriptor.numbersBySymbolType[symbolType] = numbers;
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
    debugLog(
      "LagomCardData",
      "generateNCountArray retVal = " + JSON.stringify(retVal)
    );
    return retVal;
  }

  function makeCardConfig(
    symbolTypesArray, // Set of symbols to choose from.
    countPerSymbolInDeck, // For any symbol, max times it can appear.
    symbolHistory, // Record of previous choices.
    distribution, // The number of symbols in each sector.
    numberedSymbolDetailsMap, // Details on which symbols need numbers, how to number.
    getRandomZeroToOne // Seeded rand function,
  ) {
    var sectorMaps = makeSectorMaps(
      symbolTypesArray,
      countPerSymbolInDeck,
      symbolHistory,
      distribution,
      getRandomZeroToOne
    );

    debugLog(
      "LagomCardData",
      "makeCardConfig: sectorMaps = " + JSON.stringify(sectorMaps)
    );

    var cardConfig = {
      sectorDescriptors: [],
    };

    for (var sectorIndex = 0; sectorIndex < sectorMaps.length; sectorIndex++) {
      var sectorDescriptor = {
        sectorMap: sectorMaps[sectorIndex],
      };

      // For any symbol that needs numbers, add those numbers.
      debugLog(
        "LagomCardData",
        "makeCardConfig: numberedSymbolDetails = " +
          JSON.stringify(numberedSymbolDetailsMap)
      );

      for (var symbolType in numberedSymbolDetailsMap) {
        var numberedSymbolDetails = numberedSymbolDetailsMap[symbolType];
        var minValue = numberedSymbolDetails.minValue;
        var maxValue = numberedSymbolDetails.maxValue;
        var maxInstances = numberedSymbolDetails.maxInstances;
        var history = numberedSymbolDetails.history
          ? numberedSymbolDetails.history
          : {};

        addNumbers(
          sectorDescriptor,
          symbolType,
          minValue,
          maxValue,
          history,
          maxInstances,
          getRandomZeroToOne
        );
        numberedSymbolDetailsMap[symbolType].history = history;
      }

      cardConfig.sectorDescriptors.push(sectorDescriptor);
    }
    return cardConfig;
  }

  function aggregateSymbolCountMaps(cardConfig) {
    var symbolCountMap = {};
    for (
      var sectorIndex = 0;
      sectorIndex < cardConfig.sectorDescriptors.length;
      sectorIndex++
    ) {
      var sectorMap = cardConfig.sectorDescriptors[sectorIndex].sectorMap;
      for (var symbolType in sectorMap) {
        if (!symbolCountMap[symbolType]) {
          symbolCountMap[symbolType] = 0;
        }
        symbolCountMap[symbolType] += sectorMap[symbolType];
      }
    }
    return symbolCountMap;
  }

  // No symbol should be more than half the symbols.
  function cardHasNiceSymbolBalance(cardConfig) {
    var symbolCountMap = aggregateSymbolCountMaps(cardConfig);
    var totalSymbols = Object.values(symbolCountMap).reduce((a, b) => a + b, 0);
    for (var symbolType in symbolCountMap) {
      if (symbolCountMap[symbolType] > totalSymbols / 2) {
        return false;
      }
    }
    return true;
  }

  // This returned object becomes the defined value of this module
  return {
    makeSectorMaps: makeSectorMaps,
    addNumbers: addNumbers,
    generateNCountArray: generateNCountArray,
    makeCardConfig: makeCardConfig,
    cardHasNiceSymbolBalance: cardHasNiceSymbolBalance,
    sumDistribution: sumDistribution,
  };
});
