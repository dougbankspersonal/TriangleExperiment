define([
  "sharedJavascript/cards",
  "sharedJavascript/debugLog",
  "sharedJavascript/genericUtils",
  "javascript/distributions",
  "javascript/lagomCardDataUtils",
  "dojo/domReady!",
], function (
  cards,
  debugLogModule,
  genericUtils,
  distributions,
  lagomCardDataUtils
) {
  var debugLog = debugLogModule.debugLog;

  //-----------------------------------
  //
  // Constants
  //
  //-----------------------------------
  var gCardConfigs = [];

  const gTotalCardsInDeck = 72;
  const gMaxPurposeValue = 9;
  const gNumSymbolsPerCard = 5;
  // Triangle sectors are indexed like so:
  //                 0
  //                 2
  //               1    3
  const gNumSectors = 4;

  // How many times we try to get a card that doesn't have too many of one symbol.
  const gMaxTriesToGenerateAValidRandomCardConfig = 20;

  const gValidDistributions = distributions.generateAllValidSymbolDistributions(
    gNumSectors,
    gNumSymbolsPerCard
  );

  // How many symbols in the whole deck?
  const gTotalSymbolsInDeck = gTotalCardsInDeck * gNumSymbolsPerCard;

  // Should divide evenly: each symbol has equal likelihood of showing up.
  console.assert(
    gTotalSymbolsInDeck % lagomCardDataUtils.numSymbols == 0,
    "gTotalSymbolsInDeck = " +
      gTotalSymbolsInDeck +
      ": lagomCardDataUtils.numSymbols = " +
      lagomCardDataUtils.numSymbols
  );
  const gNumInstancesEachSymbol =
    gTotalSymbolsInDeck / lagomCardDataUtils.numSymbols;

  // This should slice up evenly so all purpose numbers have same likelihood of showing up.
  // There are gNumInstancesEachSymbol purpose symbols in the deck.
  const gNumInstancesEachPurposeValue =
    gNumInstancesEachSymbol / gMaxPurposeValue;
  console.assert(
    gNumInstancesEachPurposeValue == Math.floor(gNumInstancesEachPurposeValue),
    "gInstancesEachPurposeValue is not an int: gInstancesEachPurposeValue = " +
      gNumInstancesEachPurposeValue +
      ", gNumInstancesEachSymbol = " +
      gNumInstancesEachSymbol +
      ", gMaxPurpose = " +
      gMaxPurposeValue
  );

  //-----------------------------------
  //
  // Global functions
  //
  //-----------------------------------
  function generateCardConfigsInternal() {
    var cardConfigsAccumulator = [];

    var symbolHistory = {};

    for (var cardIndex = 0; cardIndex < gTotalCardsInDeck; cardIndex++) {
      var distributionIndex = cardIndex % gValidDistributions.length;

      var distribution = gValidDistributions[distributionIndex];

      // Try this N times until we get a card with a nice distribution of symbols.
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
        if (lagomCardDataUtils.cardHasNiceSymbolBalance(cardConfig)) {
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

  //-----------------------------------
  //
  // Functions
  //
  //-----------------------------------
  function getCardConfigAtIndex(index) {
    return cards.getCardConfigAtIndex(gCardConfigs, index);
  }

  function generateCardConfigs() {
    debugLog("triangleCardData", "calling generateCardConfigs");

    lagomCardDataUtils.setNumberingDetailsForSymbol(
      lagomCardDataUtils.symbolTypes.Purpose,
      1,
      gMaxPurposeValue,
      gNumInstancesEachPurposeValue
    );

    gCardConfigs = generateCardConfigsInternal();
  }

  function getNumCards() {
    debugLog(
      "triangleCardData",
      "getNumCards: _cardConfigs = " + JSON.stringify(gCardConfigs)
    );
    return cards.getNumCardsFromConfigs(gCardConfigs);
  }

  // This returned object becomes the defined value of this module
  return {
    getNumCards: getNumCards,
    getCardConfigAtIndex: getCardConfigAtIndex,
    generateCardConfigs: generateCardConfigs,
  };
});
