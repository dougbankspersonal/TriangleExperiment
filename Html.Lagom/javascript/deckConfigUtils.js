// Deck config looks like this:
/*
      numNonStarterCardsInDeck: count of non starter cards,
      numSymbolsPerCard: number of symbols on each card,
      maxPurposeValue: purpose goes 1 to this,
      maxInstancesInCardBySymbol: a series of functions to apply to collected card configurations to make sure they obey certain rules.
      starterCardConfig: card config describing starter card.,
      maxInstancesInDeckBySymbol: table mapping symbol type to max instances of that symbol in deck,
      distributionFilter: optional filter to reject certain distributions of symbols (distribution maps sector index to count of all symbols in sector),
 */

define([
  "sharedJavascript/debugLog",
  "javascript/lagomConstants",
  "dojo/domReady!",
], function (debugLogModule, lagomConstants) {
  var debugLog = debugLogModule.debugLog;

  const gSymbolExtraFudge = 4;

  //------------------------------------------
  //
  // functions
  //
  //------------------------------------------
  // We are given num cards, num symbols on each card, and possibly a breakdown of maxes per
  // symbol (possibly incomplete, like "this symbol can have no more than n" with no mention of other symbols).
  // Return a map from symbol name to max-instances-of-that-symbol.
  // If there are no restrictions, we can just return a uniform distribution.
  function calculateMaxInstancesBySymbol(
    numCardsInDeck,
    numSymbolsPerCard,
    opt_maxesBySymbol
  ) {
    debugLog(
      "calculateMaxInstancesBySymbol",
      "numCardsInDeck = " +
        numCardsInDeck +
        ", numSymbolsPerCard = " +
        numSymbolsPerCard
    );
    debugLog(
      "calculateMaxInstancesBySymbol",
      "opt_maxesBySymbol = " + JSON.stringify(opt_maxesBySymbol)
    );
    var totalNumSymbols = numCardsInDeck * numSymbolsPerCard;

    debugLog(
      "calculateMaxInstancesBySymbol",
      "totalNumSymbols = " + JSON.stringify(totalNumSymbols)
    );

    var retVal;
    if (opt_maxesBySymbol) {
      retVal = structuredClone(opt_maxesBySymbol);
    } else {
      retVal = {};
    }

    debugLog(
      "calculateMaxInstancesBySymbol",
      "initial retVal = " + JSON.stringify(retVal)
    );

    // 1. Adjust total, subtracting off the customs.
    var totalRestrictedSymbols = 0;
    var countRestrictedSymbolTypes = 0;
    for (var i = 0; i < lagomConstants.symbolTypesArray.length; i++) {
      var symbolType = lagomConstants.symbolTypesArray[i];
      if (retVal[symbolType]) {
        countRestrictedSymbolTypes++;
        totalRestrictedSymbols += retVal[symbolType];
      }
    }

    debugLog(
      "calculateMaxInstancesBySymbol",
      "totalRestrictedSymbols = " + totalRestrictedSymbols
    );

    debugLog(
      "calculateMaxInstancesBySymbol",
      "countRestrictedSymbolTypes = " + countRestrictedSymbolTypes
    );

    // 2. Split total and allocate among everyone who doesn't have a custom.
    var totalLeftover = totalNumSymbols - totalRestrictedSymbols;
    debugLog(
      "calculateMaxInstancesBySymbol",
      "totalLeftover = " + totalLeftover
    );
    var countUnrestrictedSymbolTypes =
      lagomConstants.symbolTypesArray.length - countRestrictedSymbolTypes;
    var countPerUnmaxedSymbol = Math.ceil(
      totalLeftover / countUnrestrictedSymbolTypes
    );
    debugLog(
      "calculateMaxInstancesBySymbol",
      "countPerUnmaxedSymbol = " + countPerUnmaxedSymbol
    );
    for (var i = 0; i < lagomConstants.symbolTypesArray.length; i++) {
      var symbolType = lagomConstants.symbolTypesArray[i];
      var count = retVal[symbolType] ? retVal[symbolType] : 0;
      if (count == 0) {
        // FIXME(dbanks)
        // I still can't get the final few cards to generate with the right number of symbols:
        // Once you make a bunch that follow the rules it's easy to wind up where you can't
        // make the last few still following the rules and still have a balanced deck.
        // Don't care, it's late, I'm tired, can come up with something clever later.
        // So just lie and allow an extra few symbols.

        retVal[symbolType] = countPerUnmaxedSymbol + gSymbolExtraFudge;
      }
    }
    debugLog(
      "calculateMaxInstancesBySymbol",
      "final retVal = " + JSON.stringify(retVal)
    );
    return retVal;
  }

  function sanityCheckDeckConfig(deckConfig) {
    console.assert(
      deckConfig.maxPurposeValue <= lagomConstants.numPurposeSprites,
      "gDeckConfig.maxPurposeValue is greater than numPurposeSprites"
    );

    // All of the maxes should be integers.
    for (var symbolType in deckConfig.maxInstancesInDeckBySymbol) {
      var maxInstances = deckConfig.maxInstancesInDeckBySymbol[symbolType];
      console.assert(
        Number.isInteger(maxInstances),
        symbolType + " maxInstances is not an integer"
      );
    }
  }

  function generateDeckConfig(
    numNonStarterCardsInDeck,
    numSymbolsPerCard,
    maxPurposeValue,
    maxInstancesInCardBySymbol,
    starterCardConfig,
    opt_maxInstancesInDeckBySymbol,
    opt_distributionFilter
  ) {
    var maxInstancesInDeckBySymbol = calculateMaxInstancesBySymbol(
      numNonStarterCardsInDeck,
      numSymbolsPerCard,
      opt_maxInstancesInDeckBySymbol
    );

    debugLog(
      "deckConfigUtils",
      "maxInstancesInDeckBySymbol = " +
        JSON.stringify(maxInstancesInDeckBySymbol)
    );

    const deckConfig = {
      numNonStarterCardsInDeck: numNonStarterCardsInDeck,
      numSymbolsPerCard: numSymbolsPerCard,
      maxPurposeValue: maxPurposeValue,
      maxInstancesInCardBySymbol: maxInstancesInCardBySymbol,
      starterCardConfig: starterCardConfig,
      maxInstancesInDeckBySymbol: maxInstancesInDeckBySymbol,
      distributionFilter: opt_distributionFilter,
    };

    debugLog(
      "generateDeckConfig",
      "Deck config generated: " + JSON.stringify(deckConfig)
    );
    sanityCheckDeckConfig(deckConfig);

    return deckConfig;
  }

  // This returned object becomes the defined value of this module
  return {
    generateDeckConfig: generateDeckConfig,
  };
});
