define([
  "sharedJavascript/debugLog",
  "javascript/cgcCustom",
  "javascript/deckConfigConstructionUtils",
  "javascript/teConstants",
  "dojo/domReady!",
], function (
  debugLogModule,
  cgcCustom,
  deckConfigConstructionUtils,
  teConstants
) {
  var debugLog = debugLogModule.debugLog;

  //-------------------------------------------------
  //
  // Functions
  //
  //-------------------------------------------------
  function getDeckConfig() {
    // Catty Garden Club game.
    // 4 colors: common, uncommon, rare, very rare.
    // Then statues.
    // Then buffer spaces.
    // Paths.
    const gBasicCGC = {
      generateSectorDescriptors:
        deckConfigConstructionUtils.generateSectorDescriptorsRandom,
      addExtrasConfigs: deckConfigConstructionUtils.addExtrasConfigsRandom,
      colors: [
        teConstants.sectorColors.Yellow,
        teConstants.sectorColors.Yellow,
        teConstants.sectorColors.Yellow,
        teConstants.sectorColors.Yellow,
        teConstants.sectorColors.Yellow,
        teConstants.sectorColors.Yellow,

        teConstants.sectorColors.Orange,
        teConstants.sectorColors.Orange,
        teConstants.sectorColors.Orange,
        teConstants.sectorColors.Orange,
        teConstants.sectorColors.Orange,

        teConstants.sectorColors.Red,
        teConstants.sectorColors.Red,
        teConstants.sectorColors.Red,
        teConstants.sectorColors.Red,

        teConstants.sectorColors.Purple,
        teConstants.sectorColors.Purple,
        teConstants.sectorColors.Purple,

        teConstants.sectorColors.Blue,
        teConstants.sectorColors.Blue,
        teConstants.sectorColors.Blue,
      ],
      buffers: [
        teConstants.sectorTypes.Buffer,
        teConstants.sectorTypes.Buffer,
        teConstants.sectorTypes.Buffer,
        teConstants.sectorTypes.Buffer,
      ],
      customSectorConfiguration: cgcCustom.addPaths,
      numCardsInDeck: 60,
      metaClass: "cgc",
    };

    return gBasicCGC;
  }

  // This returned object becomes the defined value of this module
  return {
    getDeckConfig: getDeckConfig,
  };
});
