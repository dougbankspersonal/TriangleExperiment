define([
  "sharedJavascript/debugLog",
  "javascript/deckConfigConstructionUtils",
  "javascript/teConstants",
  "dojo/domReady!",
], function (debugLogModule, deckConfigConstructionUtils, teConstants) {
  var debugLog = debugLogModule.debugLog;

  //-------------------------------------------------
  //
  // Functions
  //
  //-------------------------------------------------

  function getDeckConfig() {
    // Monster hotel game:
    // 4 colors, equally likely.
    // Buffer spaces.
    // Corridors between sectors.
    const gBasicMH = {
      generateSectorDescriptors:
        deckConfigConstructionUtils.generateSectorDescriptorsRandom,
      addExtrasConfigs: deckConfigConstructionUtils.addExtrasConfigsRandom,
      colors: [
        teConstants.sectorColors.Green,
        teConstants.sectorColors.Blue,
        teConstants.sectorColors.Yellow,
        teConstants.sectorColors.Red,
      ],
      buffers: [teConstants.sectorTypes.Buffer],
      extras: [
        {
          buffers: false,
          type: "mh-sword",
          sectorCountPossibilities: [1, 1, 2, 2, 2, 3],
        },
        {
          buffers: false,
          type: "mh-shield",
          sectorCountPossibilities: [0, 0, 1],
        },
      ],
      numCardsInDeck: 60,
      metaClass: "mh",
    };

    return gBasicMH;
  }

  // This returned object becomes the defined value of this module
  return {
    getDeckConfig: getDeckConfig,
  };
});
