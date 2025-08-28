define([
  "sharedJavascript/cards",
  "sharedJavascript/debugLog",
  "sharedJavascript/genericUtils",
  "javascript/lagomCardDataUtils",
  "dojo/domReady!",
], function (cards, debugLogModule, genericUtils, lagomCardDataUtils) {
  var debugLog = debugLogModule.debugLog;

  //-----------------------------------
  //
  // Global vars
  //
  //-----------------------------------
  var gCardConfigs = [];

  const gTotalCardsInDeck = 72;
  const gMaxPurposeValue = 9;
  const gDistribution = [0, 3, 2, 1];

  var gNumSymbolsPerCard = 0;
  for (var i = 0; i < gDistribution.length; i++) {
    gNumSymbolsPerCard += gDistribution[i];
  }

  const gTotalSymbolsInDeck = gTotalCardsInDeck * gNumSymbolsPerCard;
  const gNumInstancesEachSymbol =
    gTotalSymbolsInDeck / lagomCardDataUtils.numSymbols;

  // Should divide evenly: each symbol has equal likelihood of showing up.
  console.assert(
    gNumInstancesEachSymbol == Math.floor(gNumInstancesEachSymbol),
    "gNumInstancesEachSymbol is not an int: gNumInstancesEachSymbol = " +
      gNumInstancesEachSymbol +
      ": gTotalSymbolsInDeck = " +
      gTotalSymbolsInDeck +
      ": numSymbols = " +
      lagomCardDataUtils.numSymbols
  );

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
      debugLog(
        "CardConfigs",
        "generateCardConfigsInternal cardIndex = " + cardIndex
      );

      // Just for clarity: sum the distribution array, it should equal num symbols per card.
      var totalSymbolsInDistribution =
        lagomCardDataUtils.sumDistribution(gDistribution);
      console.assert(
        totalSymbolsInDistribution == gNumSymbolsPerCard,
        "Total symbols do not match num symbols per card"
      );

      var cardConfig = lagomCardDataUtils.makeCardConfig(
        gNumInstancesEachSymbol,
        symbolHistory,
        gDistribution
      );

      cardConfigsAccumulator.push(cardConfig);
    } // One card.

    debugLog(
      "CardConfigHistories",
      "symbolHistory = ",
      JSON.stringify(symbolHistory)
    );

    return cardConfigsAccumulator;
  }

  function getCardConfigAtIndex(index) {
    return cards.getCardConfigAtIndex(gCardConfigs, index);
  }

  function generateCardConfigs() {
    debugLog("CardConfigs", "calling generateCardConfigs");

    lagomCardDataUtils.setNumberingDetailsForSymbol(
      lagomCardDataUtils.symbolTypes.Purpose,
      1,
      gMaxPurposeValue,
      gNumInstancesEachPurposeValue
    );

    gCardConfigs = generateCardConfigsInternal();
  }

  //-----------------------------------
  //
  // Functions
  //
  //-----------------------------------
  function getNumCards() {
    debugLog(
      "CardConfigs",
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
