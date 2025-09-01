define([
  "sharedJavascript/debugLog",
  "sharedJavascript/genericUtils",
  "dojo/domReady!",
], function (debugLogModule, genericUtils) {
  var debugLog = debugLogModule.debugLog;

  const SymbolType_Relationships = "wc-relationships";
  const SymbolType_Wealth = "wc-wealth";
  const SymbolType_Purpose = "wc-purpose";
  const SymbolType_Accomplishment = "wc-accomplishment";

  const gSymbolTypes = {
    Relationships: SymbolType_Relationships,
    Wealth: SymbolType_Wealth,
    Purpose: SymbolType_Purpose,
    Accomplishment: SymbolType_Accomplishment,
  };

  const gSymbolTypesArray = [
    gSymbolTypes.Relationships,
    gSymbolTypes.Wealth,
    gSymbolTypes.Purpose,
    gSymbolTypes.Accomplishment,
  ];
  const transparencyForColors = 0.2;
  const gSymbolToColorMap = {
    [gSymbolTypes.Relationships]: `rgba(128, 255, 128, ${transparencyForColors})`,
    [gSymbolTypes.Wealth]: `rgba(255, 255, 128, ${transparencyForColors})`,
    [gSymbolTypes.Purpose]: `rgba(255, 0, 0, ${transparencyForColors})`,
    [gSymbolTypes.Accomplishment]: `rgba(0, 128, 255, ${transparencyForColors})`,
  };

  const gNumSymbols = gSymbolTypesArray.length;

  const getRandomZeroToOne =
    genericUtils.createSeededGetZeroToOneRandomFunction(36593650);

  const gPurposeSpriteRows = 3;
  const gPurposeSpriteColumns = 3;

  //-----------------------------------
  //
  // Global functions
  //
  //-----------------------------------
  var gSymbolToNumberingDetailsMap = {
    [gSymbolTypes.Purpose]: {
      minValue: 1,
      history: {},
    },
  };

  // This should be a number with a sane value.
  function assertIsNumber(value) {
    if (typeof value !== "number" || isNaN(value)) {
      console.assert(
        false,
        "Expected number, got : " + typeof value + " with value = " + value
      );
    }
  }

  function setNumberingDetailsForSymbol(
    symbol,
    minValue,
    maxValue,
    numInstancesEachValue
  ) {
    assertIsNumber(minValue);
    assertIsNumber(maxValue);
    assertIsNumber(numInstancesEachValue);
    console.assert(minValue < maxValue, "minValue >= maxNumber");

    gSymbolToNumberingDetailsMap[symbol].minValue = minValue;
    gSymbolToNumberingDetailsMap[symbol].maxValue = maxValue;
    gSymbolToNumberingDetailsMap[symbol].numInstancesEachValue =
      numInstancesEachValue;
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

  function sumSectorMap(sectorMap) {
    // sectorMap maps symbol type to count of that symbol in sector.
    // We want the total of all symbols in sector.
    return Object.values(sectorMap).reduce((sum, count) => sum + count, 0);
  }

  // We want to describe what symbols go where in a card.
  // Passes back an array: one entry for each sector.
  // Each entry is a histogram mapping type of symbol to the number of times the symbol
  // appears in that sector (if a symbol is missing from histogram -> zero appearances
  // in the sector)
  function makeSectorMaps(
    countPerSymbolInDeck, // How many of each symbol in the deck (we are assuming all symbols have equal representation)
    symbolHistory, // Symbol to count histogram: how many times have we already used this symbol.
    distribution // N element array for n = number of sectors.  Each element says how many symbols in that sector.
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
          gSymbolTypesArray,
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
  // numInstancesEachValue: in the entire deck, we are not allowed to have any more than this number of any particular number.
  function addNumbersForSymbol(
    sectorDescriptor,
    symbolType,
    minValue,
    maxValue,
    history,
    numInstancesEachValue
  ) {
    debugLog(
      "addNumbersForSymbol",
      "symbolType = ",
      JSON.stringify(symbolType)
    );
    debugLog("addNumbersForSymbol", "minValue = ", JSON.stringify(minValue));
    debugLog("addNumbersForSymbol", "maxValue = ", JSON.stringify(maxValue));
    debugLog("addNumbersForSymbol", "history = ", JSON.stringify(history));
    debugLog(
      "addNumbersForSymbol",
      "maxInstances = ",
      JSON.stringify(numInstancesEachValue)
    );
    console.assert(symbolType, "symbolType is null");
    console.assert(minValue < maxValue, "minValue >= maxValue");
    console.assert(numInstancesEachValue > 0, "maxInstances <= 0");

    var maxFrequencyDifference = (maxValue - minValue) / 2;
    var numberArray = [];
    for (var i = minValue; i <= maxValue; i++) {
      numberArray[i] = i;
    }
    debugLog(
      "addNumbersForSymbol",
      "numberArray = ",
      JSON.stringify(numberArray)
    );
    var numNumbersRequired = sectorDescriptor.sectorMap[symbolType];
    numNumbersRequired = numNumbersRequired ? numNumbersRequired : 0;
    debugLog(
      "addNumbersForSymbol",
      "numNumbersRequired = ",
      JSON.stringify(numNumbersRequired)
    );

    if (numNumbersRequired > 0) {
      debugLog("addNumbersForSymbol", "numNumbersRequired > 0");
      var numbers = [];
      for (var i = 0; i < numNumbersRequired; i++) {
        var number = genericUtils.getRandomFromArrayWithRails(
          numberArray,
          history,
          maxFrequencyDifference,
          numInstancesEachValue,
          getRandomZeroToOne
        );
        debugLog(
          "addNumbersForSymbol",
          "getRandomFromArrayWithRails returned number = ",
          number
        );

        numbers.push(number);
      }
      debugLog("addNumbersForSymbol", "numbers = ", JSON.stringify(numbers));

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
    countPerSymbolInDeck, // For any symbol, max times it can appear.
    symbolHistory, // Record of previous choices.
    distribution // The number of symbols in each sector.
  ) {
    var sectorMaps = makeSectorMaps(
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
        "makeCardConfig: gNumberedSymbolDetailsMap = " +
          JSON.stringify(gSymbolToNumberingDetailsMap)
      );

      for (var symbolType in gSymbolToNumberingDetailsMap) {
        var numberedSymbolDetails = gSymbolToNumberingDetailsMap[symbolType];
        var minValue = numberedSymbolDetails.minValue;
        var maxValue = numberedSymbolDetails.maxValue;
        var numInstancesEachValue = numberedSymbolDetails.numInstancesEachValue;
        var history = numberedSymbolDetails.history
          ? numberedSymbolDetails.history
          : {};

        addNumbersForSymbol(
          sectorDescriptor,
          symbolType,
          minValue,
          maxValue,
          history,
          numInstancesEachValue
        );
        gSymbolToNumberingDetailsMap[symbolType].history = history;
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

  function noSymbolHasMajority(cardConfig) {
    // Map from symbol type -> num instances in config.
    var symbolCountMap = aggregateSymbolCountMaps(cardConfig);
    // Count all symbols on card.
    var totalSymbols = Object.values(symbolCountMap).reduce((a, b) => a + b, 0);
    // Check: no symbol should have majority of card.
    for (var symbolType in symbolCountMap) {
      if (symbolCountMap[symbolType] > totalSymbols / 2) {
        return false;
      }
    }
    return true;
  }

  function hasAtLeastTwoSymbolTypes(cardConfig) {
    var symbolCountMap = aggregateSymbolCountMaps(cardConfig);
    var numSymbolTypes = Object.keys(symbolCountMap).length;
    return numSymbolTypes >= 2;
  }

  // Is this a good card config?  Caller passes in zero or more things to test.
  function checkCardConfig(checks) {
    // Run the card config through each check.
    for (var i = 0; i < checks.length; i++) {
      if (!checks[i](cardConfig)) {
        return false;
      }
    }
    return true;
  }

  function getColorForSymbol(symbolType) {
    return gSymbolToColorMap[symbolType] || "transparent";
  }

  function countSymbolsInSector(cardConfig, sectorIndex) {
    var sectorMap = cardConfig.sectorDescriptors[sectorIndex].sectorMap;
    var symbolCount = sumSectorMap(sectorMap);
    return symbolCount;
  }

  function generateCardConfigs(totalCardsInDeck, validDistributions) {
    var cardConfigsAccumulator = [];

    var symbolHistory = {};

    for (var cardIndex = 0; cardIndex < totalCardsInDeck; cardIndex++) {
      var distributionIndex = cardIndex % validDistributions.length;

      var distribution = validDistributions[distributionIndex];

      // Make sure it passes all checks.
      var triesToGenerateAValidRandomCardConfig = 0;
      var cardConfig;
      while (true) {
        cardConfig = lagomCardDataUtils.makeCardConfig(
          gNumInstancesEachSymbol, // For any symbol, max times it can appear.
          symbolHistory, // Record of previous choices.
          distribution // The number of symbols in each sector.
        );
        triesToGenerateAValidRandomCardConfig++;

        // If good, bail.
        if (lagomCardDataUtils.checkCardConfig(cardConfig, gChecks)) {
          break;
        }

        // Too many tries: assert and bail.
        if (
          triesToGenerateAValidRandomCardConfig >=
          gMaxTriesToGenerateAValidRandomCardConfig
        ) {
          console.assert(
            false,
            "Failed to generate a good card after " +
              gMaxTriesToGenerateAValidRandomCardConfig +
              " tries."
          );
          break;
        }
        // Try again.
      }

      cardConfigsAccumulator.push(cardConfig);
    } // One card.

    return cardConfigsAccumulator;
  }

  // This returned object becomes the defined value of this module
  return {
    symbolTypes: gSymbolTypes,
    symbolTypesArray: gSymbolTypesArray,
    numSymbols: gNumSymbols,
    purposeSpriteColumns: gPurposeSpriteColumns,
    purposeSpriteRows: gPurposeSpriteRows,
    numPurposeSprites: gPurposeSpriteColumns * gPurposeSpriteRows,
    getRandomZeroToOne: getRandomZeroToOne,

    makeSectorMaps: makeSectorMaps,
    addNumbersForSymbol: addNumbersForSymbol,
    generateNCountArray: generateNCountArray,
    makeCardConfig: makeCardConfig,
    sumDistribution: sumDistribution,
    setNumberingDetailsForSymbol: setNumberingDetailsForSymbol,
    getColorForSymbol: getColorForSymbol,
    countSymbolsInSector: countSymbolsInSector,
    noSymbolHasMajority: noSymbolHasMajority,
    hasAtLeastTwoSymbolTypes: hasAtLeastTwoSymbolTypes,
    checkCardConfig: checkCardConfig,
    generateCardConfigs: generateCardConfigs,
  };
});
