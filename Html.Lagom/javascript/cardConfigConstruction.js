/*
Functions for putting together card configs.

See candConfigUtils for description of a cardConfig.
*/

define([
  "sharedJavascript/debugLog",
  "sharedJavascript/genericUtils",
  "javascript/distributions",
  "javascript/lagomConstants",
  "javascript/numberingUtils",
  "dojo/domReady!",
], function (
  debugLogModule,
  genericUtils,
  distributions,
  lagomConstants,
  numberingUtils
) {
  var debugLog = debugLogModule.debugLog;

  //----------------------------------------
  //
  // Constants
  //
  //----------------------------------------
  // How many times we try to get a card that doesn't have too many of one symbol.
  const gMaxTriesToGenerateAValidRandomCardConfig = 20;

  //----------------------------------------
  //
  // Starter card configs.
  //
  //----------------------------------------
  var gThreeWealthStarterConfig = {
    isStarterCard: true,
    sectorDescriptors: [
      {
        sectorMap: {
          [lagomConstants.symbolTypes.Wealth]: 1,
        },
      },
      {
        sectorMap: {
          [lagomConstants.symbolTypes.Wealth]: 1,
        },
      },
      {
        sectorMap: {
          [lagomConstants.symbolTypes.Parent]: 1,
        },
      },
      {
        sectorMap: {
          [lagomConstants.symbolTypes.Wealth]: 1,
        },
      },
    ],
  };

  var gTwoWealthOneRelationshipStarterConfig = {
    isStarterCard: true,
    sectorDescriptors: [
      {
        sectorMap: {
          [lagomConstants.symbolTypes.Wealth]: 1,
        },
      },
      {
        sectorMap: {
          [lagomConstants.symbolTypes.Wealth]: 1,
        },
      },
      {
        sectorMap: {
          [lagomConstants.symbolTypes.Parent]: 1,
        },
      },
      {
        sectorMap: {
          [lagomConstants.symbolTypes.Relationships]: 1,
        },
      },
    ],
  };

  //------------------------------------------
  //
  // Global Storage
  //
  //------------------------------------------
  var gSymbolToNumberingDetailsMap = {};
  var gUseCountBySymbol = {};

  //------------------------------------------
  //
  // functions
  //
  //------------------------------------------
  // We want to describe what symbols go where in a card.
  // Passes back an array: one entry for each sector.
  // Each entry is a histogram mapping type of symbol to the number of times the symbol
  // appears in that sector (if a symbol is missing from histogram -> zero appearances
  // in the sector)
  function generateSectorMaps(
    maxInstancesInCardBySymbol, // Maps symbol to max appearances on a single card.
    maxInstancesInDeckBySymbol, // Maps symbol to max appearances in the deck.
    useCountBySymbol, // Symbol to count histogram: how many times have we already used this symbol.
    distribution // N element array for n = number of sectors.  Each element says how many symbols in that sector.
  ) {
    debugLog(
      "generateSectorMaps",
      "  generateSectorMaps: maxInstancesInCardBySymbol = ",
      JSON.stringify(maxInstancesInCardBySymbol)
    );
    debugLog(
      "generateSectorMaps",
      "  generateSectorMaps: maxInstancesInDeckBySymbol = ",
      JSON.stringify(maxInstancesInDeckBySymbol)
    );
    debugLog(
      "generateSectorMaps",
      "  generateSectorMaps: useCountBySymbol = ",
      JSON.stringify(useCountBySymbol)
    );
    debugLog(
      "generateSectorMaps",
      "  generateSectorMaps: distribution = ",
      JSON.stringify(distribution)
    );

    // build the card description: an array of sector maps.
    var sectorMaps = [];

    var numSymbolsNeeded = distributions.sumDistribution(distribution);
    var randomArrayOfSymbolTypes = genericUtils.getRandomsFromArrayWithControls(
      lagomConstants.symbolTypesArray,
      numSymbolsNeeded,
      maxInstancesInCardBySymbol,
      maxInstancesInDeckBySymbol,
      useCountBySymbol,
      lagomConstants.getRandomZeroToOne
    );

    var nextSymbolToUseIndex = 0;
    for (
      var sectorIndex = 0;
      sectorIndex < distribution.length;
      sectorIndex++
    ) {
      var sectorMap = {};
      var symbolsThisSector = distribution[sectorIndex];
      // Add that many symbols to this map.
      for (var i = 0; i < symbolsThisSector; i++) {
        var symbolType = randomArrayOfSymbolTypes[nextSymbolToUseIndex];
        sectorMap[symbolType] = (sectorMap[symbolType] || 0) + 1;
        nextSymbolToUseIndex++;
      }
      sectorMaps.push(sectorMap);
    }
    return sectorMaps;
  }

  function generateRandomCardConfig(
    maxInstancesInCardBySymbol, // Maps symbol to max appearances on a single card.
    maxInstancesInDeckBySymbol, // Maps symbol to max appearances in the deck.
    useCountBySymbol, // Record of previous choices.
    symbolToNumberingDetailsMap, // Who needs numbering, what numbers were used, etc.
    distribution // The number of symbols in each sector.
  ) {
    // An array: sector index maps to a sector map (mapping symbol type to count in sector)
    var sectorMaps = generateSectorMaps(
      maxInstancesInCardBySymbol,
      maxInstancesInDeckBySymbol,
      useCountBySymbol,
      distribution
    );

    // Create the card config.
    var cardConfig = {
      sectorDescriptors: [],
    };
    var symbolCountOnCardBySymbol = {};
    for (var i = 0; i < sectorMaps.length; i++) {
      var sectorMap = sectorMaps[i];
      var sectorDescriptor = {
        sectorMap: sectorMap,
        numbersBySymbolType: [],
      };
      cardConfig.sectorDescriptors.push(sectorDescriptor);
    }

    debugLog(
      "generateRandomCardConfig",
      "before: symbolToNumberingDetailsMap = " +
        JSON.stringify(symbolToNumberingDetailsMap)
    );

    // Apply numbering info to card config.
    numberingUtils.addNumberingDetailsToCardConfig(
      cardConfig,
      symbolToNumberingDetailsMap
    );

    debugLog(
      "generateRandomCardConfig",
      "before: symbolToNumberingDetailsMap = " +
        JSON.stringify(symbolToNumberingDetailsMap)
    );
    return cardConfig;
  }

  function generateCardConfig(deckConfig, validDistributions, cardIndex) {
    debugLog("generateCardConfig", "cardIndex = ", cardIndex);

    var distributionIndex = cardIndex % validDistributions.length;
    var distribution = validDistributions[distributionIndex];

    var triesToGenerateAValidRandomCardConfig = 0;
    var cardConfig;
    while (true) {
      debugLog(
        "generateCardConfig",
        "starting while loop: cardIndex = ",
        cardIndex
      );
      debugLog(
        "generateCardConfig",
        "starting while loop: triesToGenerateAValidRandomCardConfig = ",
        triesToGenerateAValidRandomCardConfig
      );

      // Every time thru here we need a fresh copy of any history stuff.
      var useCountBySymbolCopy = structuredClone(gUseCountBySymbol);
      var symbolToNumberingDetailsMapCopy = structuredClone(
        gSymbolToNumberingDetailsMap
      );

      debugLog(
        "generateCardConfig",
        "before: deckConfig = " + JSON.stringify(deckConfig)
      );

      // Let this get updated.
      cardConfig = generateRandomCardConfig(
        deckConfig.maxInstancesInCardBySymbol,
        deckConfig.maxInstancesInDeckBySymbol, // For each given symbol max times it can appear.
        useCountBySymbolCopy, // Record of previous choices.
        symbolToNumberingDetailsMapCopy, // Record of details on symbols that need numbering, including a history of what's been used.
        distribution // The number of symbols in each sector.
      );

      debugLog(
        "generateCardConfig",
        "after: deckConfig = " + JSON.stringify(deckConfig)
      );

      debugLog(
        "generateCardConfig",
        "cardConfig = ",
        JSON.stringify(cardConfig)
      );

      triesToGenerateAValidRandomCardConfig++;

      if (cardConfig) {
        // It succeeded: update history stuff.
        // Every time thru here we need a fresh copy of any history stuff.
        gUseCountBySymbol = structuredClone(useCountBySymbolCopy);
        gSymbolToNumberingDetailsMap = structuredClone(
          symbolToNumberingDetailsMapCopy
        );

        return cardConfig;
      }

      // Too many tries: assert and bail.
      if (
        triesToGenerateAValidRandomCardConfig >=
        gMaxTriesToGenerateAValidRandomCardConfig
      ) {
        console.assert(
          false,
          "generateCardConfig Failed to generate a good card after " +
            gMaxTriesToGenerateAValidRandomCardConfig +
            " tries."
        );
        return null;
      }
    }

    // I don't think this is possible.
    console.assert(false, "How did we get here?");
    return null;
  }

  function addStarterCardsToAccumulator(cardConfigsAccumulator, deckConfig) {
    if (deckConfig.starterCardConfig) {
      for (var i = 0; i < lagomConstants.maxPlayers; i++) {
        cardConfigsAccumulator.unshift(deckConfig.starterCardConfig);
      }
    }
  }

  function generateCardConfigs(deckConfig) {
    debugLog(
      "generateCardConfigs",
      "called generateCardConfigs with deckConfig = ",
      JSON.stringify(deckConfig)
    );

    var cardConfigsAccumulator = [];

    // Init numbering details.
    numberingUtils.initNumberingDetailsForSymbol(
      gSymbolToNumberingDetailsMap,
      lagomConstants.symbolTypes.Purpose,
      1,
      deckConfig.maxPurposeValue,
      deckConfig.maxInstancesInDeckBySymbol[lagomConstants.symbolTypes.Purpose]
    );

    addStarterCardsToAccumulator(cardConfigsAccumulator, deckConfig);

    const validDistributions =
      distributions.generateAllValidSymbolDistributions(
        lagomConstants.numSectorsPerCard,
        deckConfig.numSymbolsPerCard,
        deckConfig.checkDistribution
      );

    for (
      var cardIndex = 0;
      cardIndex < deckConfig.numNonStarterCardsInDeck;
      cardIndex++
    ) {
      var cardConfig = generateCardConfig(
        deckConfig,
        validDistributions,
        cardIndex
      );
      // Maybe failed.
      if (!cardConfig) {
        debugLog(
          "generateCardConfigs",
          "failed to generate card config for cardIndex = ",
          cardIndex
        );
        break;
      } else {
        cardConfigsAccumulator.push(cardConfig);
      }
    } // One card.

    return cardConfigsAccumulator;
  }

  // This returned object becomes the defined value of this module
  return {
    threeWealthStarterConfig: gThreeWealthStarterConfig,
    twoWealthOneRelationshipStarterConfig:
      gTwoWealthOneRelationshipStarterConfig,

    generateCardConfig: generateCardConfig,
    generateCardConfigs: generateCardConfigs,
  };
});
