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
  const SymbolType_Accomplishment = "wc-accomplishment";
  const SymbolType_Relationships = "wc-relationships";
  const SymbolType_Purpose = "wc-purpose";
  const SymbolType_Wealth = "wc-wealth";

  const gSymbolTypes = {
    Accomplishment: SymbolType_Accomplishment,
    Purpose: SymbolType_Purpose,
    Relationships: SymbolType_Relationships,
    Wealth: SymbolType_Wealth,
  };

  const gSymbolTypesArray = [
    gSymbolTypes.Relationships,
    gSymbolTypes.Wealth,
    gSymbolTypes.Purpose,
    gSymbolTypes.Accomplishment,
  ];

  const getRandomZeroToOne =
    genericUtils.createSeededGetZeroToOneRandomFunction(4747575);

  var gCardConfigs = [];

  const gTotalCardsInDeck = 72;
  const gMaxPurpose = 9;
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
    gTotalSymbolsInDeck % gSymbolTypesArray.length == 0,
    "gTotalSymbolsInDeck = " +
      gTotalSymbolsInDeck +
      ": symbolTypesArray.length = " +
      gSymbolTypesArray.length
  );
  const gNumInstancesEachSymbol =
    gTotalSymbolsInDeck / gSymbolTypesArray.length;

  // Purpose numbers should also slice up evenly.
  console.assert(
    gNumInstancesEachSymbol % gMaxPurpose == 0,
    "gNumInstancesEachSymbol = ",
    gNumInstancesEachSymbol,
    ": gMaxPurpose == ",
    gMaxPurpose
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
    var rawSymbolArray = lagomCardDataUtils.generateNCountArray(
      gSymbolTypesArray,
      gNumInstancesEachSymbol
    );
    debugLog(
      "CardConfig",
      "rawSymbolArray = " + JSON.stringify(rawSymbolArray)
    );

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
          gSymbolTypesArray, // Set of symbols to choose from.
          gNumInstancesEachSymbol, // For any symbol, max times it can appear.
          symbolHistory, // Record of previous choices.
          distribution, // The number of symbols in each sector.
          gNumberedSymbolDetailsMap,
          getRandomZeroToOne
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
    debugLog("CardConfigs", "calling generateLowEndCardConfigs");

    gCardConfigs = generateCardConfigsInternal();
  }

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
