/*
Functions for putting together card configs.

See candConfigUtils for description of a cardConfig.
*/

define([
  "sharedJavascript/cards",
  "sharedJavascript/debugLog",
  "javascript/deckConfigConstruction",
  "dojo/domReady!",
], function (cards, debugLogModule, deckConfigConstruction) {
  var debugLog = debugLogModule.debugLog;

  function generateCardConfig(deckConfig, i) {
    var cardConfig = {};

    // get the color map.
    var sectorToColor = deckConfig.colorGenerator(deckConfig.numColors);
    cardConfig.sectorToColor = sectorToColor;
    // Get the walls.
    var wallGenerator = deckConfig.wallGenerator(
      cardConfig.sectorToColor,
      deckConfig.wallFrequency
    );
    cardConfig.wallsBySector = wallGenerator;

    return cardConfig;
  }

  function generateCardConfigsFromDeckConfig(deckConfig) {
    debugLog(
      "generateCardConfigsFromDeckConfig",
      "called generateCardConfigsFromDeckConfig with deckConfig = ",
      JSON.stringify(deckConfig)
    );

    var cardConfigsAccumulator = [];

    for (var i = 0; i < deckConfig.numCardsInDeck; i++) {
      var cardConfig = generateCardConfig(deckConfig, i);
      cardConfigsAccumulator.push(cardConfig);
    }

    return cardConfigsAccumulator;
  }

  function generateCardConfigs() {
    var deckConfig = deckConfigConstruction.getDeckConfig();
    gCardConfigs = generateCardConfigsFromDeckConfig(deckConfig);
  }

  function getCardConfigAtIndex(index) {
    return cards.getCardConfigAtIndex(gCardConfigs, index);
  }

  function getNumCards() {
    debugLog(
      "getNumCards",
      "getNumCards: _cardConfigs = " + JSON.stringify(gCardConfigs)
    );
    return cards.getNumCardsFromConfigs(gCardConfigs);
  }

  // This returned object becomes the defined value of this module
  return {
    generateCardConfigs: generateCardConfigs,
    getCardConfigAtIndex: getCardConfigAtIndex,
    getNumCards: getNumCards,
  };
});
