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
  const gValidDistributions = [gDistribution];
  const gChecks = [lagomCardDataUtils.noSymbolHasMajority];

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
    "gNumInstancesEachPurposeValue is not an int: gNumInstancesEachPurposeValue = " +
      gNumInstancesEachPurposeValue +
      ", gNumInstancesEachSymbol = " +
      gNumInstancesEachSymbol +
      ", gMaxPurpose = " +
      gMaxPurposeValue
  );

  const gStarterCardConfig = {
    isStarterCard: true,
    sectorDescriptors: [
      {
        sectorMap: {
          [lagomCardDataUtils.symbolTypes.Wealth]: 1,
        },
      },
      {
        sectorMap: {},
      },
      {
        sectorMap: {
          [lagomCardDataUtils.symbolTypes.Relationships]: 1,
        },
      },
      {
        sectorMap: {
          [lagomCardDataUtils.symbolTypes.Wealth]: 1,
        },
      },
    ],
  };

  function getCardConfigAtIndex(index) {
    return cards.getCardConfigAtIndex(gCardConfigs, index);
  }

  function generateCardConfigs() {
    debugLog("CardConfigs", "calling generateCardConfigs");

    debugLog(
      "generateCardConfigs",
      "gTotalSymbolsInDeck = gTotalSymbolsInDeck"
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

    if (gStarterCardConfig) {
      for (var i = 0; i < lagomCardDataUtils.maxPlayers; i++) {
        gCardConfigs.unshift(gStarterCardConfig);
      }
    }

    console.assert(
      gMaxPurposeValue <= lagomCardDataUtils.numPurposeSprites,
      "gMaxPurposeValue: " +
        gMaxPurposeValue +
        "   is greater than numPurposeSprites: numPurposeSprites = " +
        lagomCardDataUtils.numPurposeSprites
    );
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
