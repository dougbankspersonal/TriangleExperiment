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
  // Constants
  //
  //-----------------------------------
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

  const getRandomZeroToOne =
    genericUtils.createSeededGetZeroToOneRandomFunction(36593650);

  //-----------------------------------
  //
  // Global vars
  //
  //-----------------------------------
  var gCardConfigs = [];

  const gTotalCardsInDeck = 72;
  const gMaxPurpose = 9;
  const gDistribution = [0, 3, 2, 1];

  var gNumSymbolsPerCard = 0;
  for (var i = 0; i < gDistribution.length; i++) {
    gNumSymbolsPerCard += gDistribution[i];
  }

  const gTotalSymbolsInDeck = gTotalCardsInDeck * gNumSymbolsPerCard;
  const gNumInstancesEachSymbol =
    gTotalSymbolsInDeck / gSymbolTypesArray.length;

  // Should divide evenly: each symbol has equal likelihood of showing up.
  console.assert(
    gNumInstancesEachSymbol == Math.floor(gNumInstancesEachSymbol),
    "gNumInstancesEachSymbol is not an int: gNumInstancesEachSymbol = " +
      gNumInstancesEachSymbol +
      ": gTotalSymbolsInDeck = " +
      gTotalSymbolsInDeck +
      ": symbolTypesArray.length = " +
      gSymbolTypesArray.length
  );

  // This should slice up evenly so all purpose numbers have same likelihood of showing up.
  // There are gNumInstancesEachSymbol purpose symbols in the deck.
  const gInstancesEachPurposeNumber = gNumInstancesEachSymbol / gMaxPurpose;
  console.assert(
    gInstancesEachPurposeNumber == Math.floor(gInstancesEachPurposeNumber),
    "gInstancesEachPurposeNumber is not an int: gInstancesEachPurposeNumber = " +
      gInstancesEachPurposeNumber +
      ", gNumInstancesEachSymbol = " +
      gNumInstancesEachSymbol +
      ", gMaxPurpose = " +
      gMaxPurpose
  );

  var gNumberedSymbolDetailsMap = {
    [gSymbolTypes.Purpose]: {
      minValue: 1,
      maxValue: gMaxPurpose,
      history: {},
    },
  };

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
        gSymbolTypesArray,
        gNumInstancesEachSymbol,
        symbolHistory,
        gDistribution,
        gNumberedSymbolDetailsMap,
        getRandomZeroToOne
      );

      cardConfigsAccumulator.push(cardConfig);
    } // One card.

    debugLog(
      "CardConfigHistories",
      "symbolHistory = ",
      JSON.stringify(symbolHistory)
    );
    debugLog(
      "CardConfigHistories",
      "gNumberedSymbolDetailsMap = ",
      JSON.stringify(gNumberedSymbolDetailsMap)
    );

    return cardConfigsAccumulator;
  }

  function getCardConfigAtIndex(index) {
    return cards.getCardConfigAtIndex(gCardConfigs, index);
  }

  function generateCardConfigs() {
    debugLog("CardConfigs", "calling generateLowEndCardConfigs");

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
    symbolTypes: gSymbolTypes,
    symbolTypesArray: gSymbolTypesArray,

    getNumCards: getNumCards,
    getCardConfigAtIndex: getCardConfigAtIndex,
    generateCardConfigs: generateCardConfigs,
  };
});
