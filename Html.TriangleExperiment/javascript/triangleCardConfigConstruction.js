/*
Functions for putting together card configs.

See candConfigUtils for description of a cardConfig.
*/

define([
  "sharedJavascript/cards",
  "sharedJavascript/debugLog",
  "dojo/domReady!",
], function (cards, debugLogModule) {
  var debugLog = debugLogModule.debugLog;

  function generateCardConfig(deckConfig, indexInDeck) {
    var cardConfig = {};

    cardConfig.metaClass = deckConfig.metaClass;
    cardConfig.customSectorConfiguration = deckConfig.customSectorConfiguration;

    // get the color map.
    var sectorDescriptors = deckConfig.generateSectorDescriptors(deckConfig);
    for (var i = 0; i < sectorDescriptors.length; i++) {
      var sectorDescriptor = sectorDescriptors[i];
      // Add any extras.
      deckConfig.addExtrasConfigs(sectorDescriptor, deckConfig);
    }
    cardConfig.sectorDescriptors = sectorDescriptors;
    cardConfig.indexInDeck = indexInDeck;

    return cardConfig;
  }

  var gCardConfigs = null;
  function generateCardConfigs(deckConfig) {
    debugLog(
      "generateCardConfigsFromDeckConfig",
      "called generateCardConfigsFromDeckConfig with deckConfig = ",
      JSON.stringify(deckConfig)
    );
    // Only call once.
    console.assert(
      gCardConfigs === null,
      "generateCardConfigsFromDeckConfig called twice"
    );

    gCardConfigs = [];

    for (var i = 0; i < deckConfig.numCardsInDeck; i++) {
      var cardConfig = generateCardConfig(deckConfig, i);
      gCardConfigs.push(cardConfig);
    }

    return gCardConfigs;
  }

  function getCardConfigs() {
    return gCardConfigs;
  }

  // This returned object becomes the defined value of this module
  return {
    generateCardConfigs: generateCardConfigs,
    getCardConfigs: getCardConfigs,
  };
});
