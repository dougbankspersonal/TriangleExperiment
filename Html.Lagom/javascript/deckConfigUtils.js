// Deck config looks like this:
/*
      numNonStarterCardsInDeck: count of non starter cards,
      numSymbolsPerCard: number of symbols on each card,
      maxPurposeValue: purpose goes 1 to this,
      maxInstancesInCardBySymbol: map from symbol type to max instances of that symbol you can have on one card.
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
  // Normally, how many times can any given symbol appear on a card?
  function calculateMaxInstancesBySymbol(numSymbolsPerCard) {
    // Not much more than half.
    var retVal = {};
    for (var symbolType of lagomConstants.symbolTypesSet) {
      retVal[symbolType] = Math.ceil(numSymbolsPerCard / 2);
    }
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

  function generateDeckConfig(options) {
    debugLog("generateDeckConfig", "options = " + JSON.stringify(options));

    // Required...
    var numNonStarterCardsInDeck = options.numNonStarterCardsInDeck;
    var numSymbolsPerCard = options.numSymbolsPerCard;
    var maxPurposeValue = options.maxPurposeValue;

    console.assert(
      numNonStarterCardsInDeck,
      "numNonStarterCardsInDeck is required"
    );
    console.assert(numSymbolsPerCard, "numSymbolsPerCard is required");
    console.assert(maxPurposeValue, "maxPurposeValue is required");

    var maxInstancesInCardBySymbol;
    if (options.maxInstancesInCardBySymbol) {
      maxInstancesInCardBySymbol = structuredClone(
        options.maxInstancesInCardBySymbol
      );
    } else {
      maxInstancesInCardBySymbol =
        calculateMaxInstancesBySymbol(numSymbolsPerCard);
    }

    debugLog(
      "generateDeckConfig",
      "maxInstancesInCardBySymbol = " +
        JSON.stringify(maxInstancesInCardBySymbol)
    );

    var maxInstancesInDeckBySymbol;
    if (options.maxInstancesInDeckBySymbol) {
      maxInstancesInDeckBySymbol = structuredClone(
        options.maxInstancesInDeckBySymbol
      );
    } else {
      maxInstancesInDeckBySymbol = {};
      for (var symbolType of lagomConstants.symbolTypesSet) {
        maxInstancesInDeckBySymbol[symbolType] =
          (numNonStarterCardsInDeck * numSymbolsPerCard) /
          lagomConstants.numSymbols;
      }
    }

    const deckConfig = {
      numNonStarterCardsInDeck: numNonStarterCardsInDeck,
      numSymbolsPerCard: numSymbolsPerCard,
      maxPurposeValue: maxPurposeValue,
      maxInstancesInCardBySymbol: maxInstancesInCardBySymbol,
      starterCardConfig: options.starterCardConfig,
      maxInstancesInDeckBySymbol: maxInstancesInDeckBySymbol,
      distributionFilter: options.distributionFilter,
      season: options.season,
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
