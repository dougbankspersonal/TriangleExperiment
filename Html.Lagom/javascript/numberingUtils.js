/*
A cardConfig is:
  isStarterCard: opt bool, if true this is a starter.
  sectorDescriptors: array of sector descriptors, array index -> sector index.

A sector descriptor is:
  sectorMap: maps symbol type to count of that symbol in sector.
  numbersBySymbolType: if a symbol has to be numbered, maps the symbol to an array of numbers to use.
*/

define([
  "sharedJavascript/debugLog",
  "sharedJavascript/genericUtils",
  "javascript/cardConfigUtils",
  "javascript/lagomConstants",
  "dojo/domReady!",
], function (debugLogModule, genericUtils, cardConfigUtils, lagomConstants) {
  var debugLog = debugLogModule.debugLog;

  //------------------------------------------
  //
  // Global Storage
  //
  //------------------------------------------
  //------------------------------------------
  //
  // functions
  //
  //------------------------------------------

  // Add an entry to symbolToNumberingDetailsMap: this symbol needs numbers, the
  // numbers range from 1 to n, and we generate a (for now empty) map where we can
  // track number to num times number was used.
  function initNumberingDetailsForSymbol(
    symbolToNumberingDetailsMap,
    symbol,
    minValue,
    maxValue,
    maxInstancesInDeck
  ) {
    debugLog(
      "initNumberingDetailsForSymbol",
      "initNumberingDetailsForSymbol: initial symbolToNumberingDetailsMap = " +
        JSON.stringify(symbolToNumberingDetailsMap)
    );
    debugLog(
      "initNumberingDetailsForSymbol",
      "initNumberingDetailsForSymbol: symbol = " + symbol
    );
    debugLog(
      "initNumberingDetailsForSymbol",
      "initNumberingDetailsForSymbol: minValue = " + minValue
    );
    debugLog(
      "initNumberingDetailsForSymbol",
      "initNumberingDetailsForSymbol: maxValue = " + maxValue
    );
    debugLog(
      "initNumberingDetailsForSymbol",
      "initNumberingDetailsForSymbol: maxInstancesInDeck = " +
        maxInstancesInDeck
    );

    debugLog("initNumberingDetailsForSymbol", "Start asserts");
    genericUtils.assertIsNumber(minValue, "minValue");
    genericUtils.assertIsNumber(maxValue, "maxValue");
    genericUtils.assertIsNumber(maxInstancesInDeck, "maxInstancesInDeck");
    console.assert(minValue < maxValue, "minValue >= maxNumber");
    debugLog("initNumberingDetailsForSymbol", "End asserts");

    // We should not be setting this twice.
    console.assert(
      symbolToNumberingDetailsMap[symbol] === undefined,
      "symbolToNumberingDetailsMap[symbol] is not null"
    );

    var numberingDetails = {
      minValue: minValue,
      maxValue: maxValue,
      maxInstancesInDeck: maxInstancesInDeck,
      useCountByNumber: {},
    };
    symbolToNumberingDetailsMap[symbol] = numberingDetails;
    debugLog(
      "initNumberingDetailsForSymbol: final symbolToNumberingDetailsMap = " +
        JSON.stringify(symbolToNumberingDetailsMap[symbol])
    );
  }

  // We have 2 maps.
  // One maps symbol type to a count, how many random numbers we need for that symbol.
  // Other maps symbol type to details on random number generation: min/max value, max times any
  // particular can be used, history of choices, etc.
  // Return a map from symbol type to array of random number values.
  // Note that the number values are *numbers*, not *strings*.
  function getRandomNumbersBySymbolTypes(
    countsBySymbol,
    symbolToNumberingDetailsMap
  ) {
    debugLog(
      "getRandomNumbersBySymbolTypes",
      "countsBySymbol = " + JSON.stringify(countsBySymbol)
    );
    debugLog(
      "getRandomNumbersBySymbolTypes",
      "symbolToNumberingDetailsMap = " +
        JSON.stringify(symbolToNumberingDetailsMap)
    );

    var randomNumbersBySymbolTypes = [];

    for (var symbolType in symbolToNumberingDetailsMap) {
      var numberingDetails = symbolToNumberingDetailsMap[symbolType];
      // Any entry in symbolToNumberingDetailsMap should have something non-trivial to
      // say about assigning numbers to symbols.
      console.assert(
        numberingDetails,
        "Missing numbering details for symbol type: " + symbolType
      );
      // It is possible that the card in question has none of this particular number-needing
      // symbol.
      var numNumbersNeeded = countsBySymbol[symbolType] || 0;
      if (numNumbersNeeded == 0) {
        continue;
      }

      // Generate an array of random numbers "on rails": not too many uses of one kind, not too many repeats, etc.
      // Make the array of choices.
      var availableNumberValues = [];
      // Every number can appear at most once on a card.
      var maxCountInCardByNumberValue = {};
      // Every number can appear at most <max> in the deck.
      var maxCountInDeckByNumberValue = {};
      for (
        var numberValue = numberingDetails.minValue;
        numberValue <= numberingDetails.maxValue;
        numberValue++
      ) {
        availableNumberValues.push(numberValue.toString());
        maxCountInCardByNumberValue[numberValue.toString()] = 1;
        maxCountInDeckByNumberValue[numberValue.toString()] =
          numberingDetails.maxInstancesInDeck;
      }

      debugLog(
        "getRandomNumbersBySymbolTypes",
        "before: numberingDetails.useCountByNumber = " +
          JSON.stringify(numberingDetails.useCountByNumber)
      );
      var randomNumberValues = genericUtils.getRandomsFromArrayWithControls(
        availableNumberValues,
        numNumbersNeeded,
        maxCountInCardByNumberValue,
        maxCountInDeckByNumberValue,
        numberingDetails.useCountByNumber,
        lagomConstants.getRandomZeroToOne
      );
      debugLog(
        "getRandomNumbersBySymbolTypes",
        "randomNumberValues = " + JSON.stringify(randomNumberValues)
      );
      debugLog(
        "getRandomNumbersBySymbolTypes",
        "after: numberingDetails.useCountByNumber = " +
          JSON.stringify(numberingDetails.useCountByNumber)
      );

      // These are strings, convert back to ints.
      var randomNumbers = randomNumberValues.map(function (numStr) {
        return parseInt(numStr, 10);
      });

      randomNumbersBySymbolTypes[symbolType] = randomNumbers;
    }
    return randomNumbersBySymbolTypes;
  }

  function addNumberingDetailsToCardConfig(
    cardConfig,
    symbolToNumberingDetailsMap
  ) {
    // get a map from symbol type to total count of symbol on card.
    var countsBySymbol = cardConfigUtils.getCountsBySymbol(cardConfig);

    debugLog(
      "addNumberingDetailsToCardConfig",
      "before: symbolToNumberingDetailsMap = " +
        JSON.stringify(symbolToNumberingDetailsMap)
    );

    // If a symbol is used and it needs numbers, get the array of numbers.
    // Leave in map from symbol type to array of numbers.
    var randomNumbersBySymbolType = getRandomNumbersBySymbolTypes(
      countsBySymbol,
      symbolToNumberingDetailsMap
    );

    debugLog(
      "addNumberingDetailsToCardConfig",
      "after: symbolToNumberingDetailsMap = " +
        JSON.stringify(symbolToNumberingDetailsMap)
    );

    // Use these to fill in numbering details.
    for (
      var sectorIndex = 0;
      sectorIndex < cardConfig.sectorDescriptors.length;
      sectorIndex++
    ) {
      var sectorDescriptor = cardConfig.sectorDescriptors[sectorIndex];
      var sectorMap = sectorDescriptor.sectorMap;

      for (var symbolType in sectorMap) {
        var symbolCount = sectorMap[symbolType];

        // Do we need to worry about this symbol?  Does it even use numbers?
        var numberingDetailsMap = symbolToNumberingDetailsMap[symbolType];
        if (numberingDetailsMap == null) {
          // Symbol type doesn't care about numbering, fine: bounce.
          continue;
        }
        var maxNumberCountInDeckForSymbolType =
          numberingDetailsMap.maxInstancesInDeck
            ? numberingDetailsMap.maxInstancesInDeck
            : 0;
        if (maxNumberCountInDeckForSymbolType == 0) {
          continue;
        }

        // Get the random numbers for this symbol type.
        var randomNumbersForThisSymbol = randomNumbersBySymbolType[symbolType];

        // We should have at least as many as this sector requires.
        console.assert(
          randomNumbersForThisSymbol.length >= symbolCount,
          "Not enough random numbers for symbol type: " + symbolType
        );

        // Slice off that many random numbers.
        var randomNNumbersForThisSymbolInThisSector =
          randomNumbersForThisSymbol.splice(0, symbolCount);
        // Just being real sure the original array is updated.
        randomNumbersBySymbolType[symbolType] = randomNumbersForThisSymbol;

        sectorDescriptor.numbersBySymbolType[symbolType] =
          randomNNumbersForThisSymbolInThisSector;
      }
    }

    // Should now be decorated with numbers.
    debugLog(
      "addNumberingDetailsToCardConfig",
      "Updated cardConfig = " + JSON.stringify(cardConfig)
    );
  }

  // This returned object becomes the defined value of this module
  return {
    initNumberingDetailsForSymbol: initNumberingDetailsForSymbol,
    addNumberingDetailsToCardConfig: addNumberingDetailsToCardConfig,
  };
});
