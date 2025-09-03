define([
  "sharedJavascript/cards",
  "sharedJavascript/debugLog",
  "javascript/distributions",
  "javascript/lagomCardDataUtils",
  "dojo/domReady!",
], function (cards, debugLogModule, distributions, lagomCardDataUtils) {
  var debugLog = debugLogModule.debugLog;

  //-----------------------------------
  //
  // Constants
  //
  //-----------------------------------
  var gCardConfigs = [];

  // Triangle sectors are indexed like so:
  //                 0
  //                 2
  //               1    3
  const gNumSectors = 4;
  const gMiddleSectorIndex = 2;

  var gCommonStarterCardConfig = {
    isStarterCard: true,
    sectorDescriptors: [
      {
        sectorMap: {
          [lagomCardDataUtils.symbolTypes.Wealth]: 1,
        },
      },
      {
        sectorMap: {
          [lagomCardDataUtils.symbolTypes.Wealth]: 1,
        },
      },
      {
        sectorMap: {
          [lagomCardDataUtils.symbolTypes.Parent]: 1,
        },
      },
      {
        sectorMap: {
          [lagomCardDataUtils.symbolTypes.Wealth]: 1,
        },
      },
    ],
  };

  // Things we frequently twiddle.
  // Keep them here in "configs", add/uncomment as needed.
  const sixSymbolConfig = {
    numSymbolsPerCard: 6,
    maxPurposeValue: 9,
    checks: [lagomCardDataUtils.noSymbolHasMajority],
    totalCardsInDeck: 72,
  };
  const fiveSymbolConfig = {
    numSymbolsPerCard: 5,
    maxPurposeValue: 8,
    checks: [lagomCardDataUtils.noSymbolHasMajority],
    starterCardConfig: gCommonStarterCardConfig,
    totalCardsInDeck: 64,
  };

  const threeSymbolConfig = {
    numSymbolsPerCard: 3,
    maxPurposeValue: 4,
    checks: [
      lagomCardDataUtils.noSymbolHasMajority,
      lagomCardDataUtils.hasAtLeastTwoSymbolTypes,
      lagomCardDataUtils.hasAtLeastTwoSymbolTypes,
    ],
    starterCardConfig: gCommonStarterCardConfig,
    totalCardsInDeck: 80,
  };

  // This is it. where we set confgs.
  const gCardConfig = threeSymbolConfig;
  const gTotalCardsInDeck = gCardConfig.totalCardsInDeck;

  const gNumSymbolsPerCard = gCardConfig.numSymbolsPerCard;
  const gMaxPurposeValue = gCardConfig.maxPurposeValue;
  const gChecks = gCardConfig.checks;

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
    "gNumInstancesEachPurposeValue is not an int: gNumInstancesEachPurposeValue = " +
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
  //
  // Functions
  //
  //-----------------------------------
  function getCardConfigAtIndex(index) {
    return cards.getCardConfigAtIndex(gCardConfigs, index);
  }

  function generateCardConfigs() {
    debugLog("triangleCardData", "gTotalCardsInDeck = " + gTotalCardsInDeck);
    debugLog("triangleCardData", "gNumSymbolsPerCard = " + gNumSymbolsPerCard);
    debugLog(
      "triangleCardData",
      "gTotalSymbolsInDeck = " + gTotalSymbolsInDeck
    );
    debugLog(
      "triangleCardData",
      "gNumInstancesEachSymbol = " + gNumInstancesEachSymbol
    );

    debugLog("generateCardConfigs", "gNumSymbolsPerCard =", gNumSymbolsPerCard);
    debugLog("generateCardConfigs", "gMaxPurposeValue =", gMaxPurposeValue);

    debugLog(
      "generateCardConfigs",
      "gNumInstancesEachPurposeValue =",
      gNumInstancesEachPurposeValue
    );

    console.assert(
      gMaxPurposeValue <= lagomCardDataUtils.numPurposeSprites,
      "gMaxPurposeValue is greater than numPurposeSprites"
    );

    lagomCardDataUtils.setNumberingDetailsForSymbol(
      lagomCardDataUtils.symbolTypes.Purpose,
      1,
      gMaxPurposeValue,
      gNumInstancesEachPurposeValue
    );

    gCardConfigs = lagomCardDataUtils.generateCardConfigs(
      gTotalCardsInDeck,
      gNumInstancesEachSymbol,
      gValidDistributions,
      gChecks
    );

    if (gCommonStarterCardConfig) {
      for (var i = 0; i < lagomCardDataUtils.maxPlayers; i++) {
        gCardConfigs.unshift(gCommonStarterCardConfig);
      }
    }
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
