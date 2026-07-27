define([
  "sharedJavascript/debugLog",
  "sharedJavascript/genericUtils",
  "javascript/cgcCustom",
  "javascript/teConstants",
  "dojo/domReady!",
], function (debugLogModule, genericUtils, cgcCustom, teConstants) {
  var debugLog = debugLogModule.debugLog;

  //-------------------------------------------------
  //
  // Functions
  //
  //-------------------------------------------------
  // Returns one sectorDesc per sector.
  // SectorDesc looks like:
  //    { type: "colored", color: "red" }
  // or
  //    { type: "buffer" }
  function generateSectorDescriptorsRandom(deckConfig) {
    debugLog("generateSectorDescriptorsRandom", "called");
    debugLog(
      "generateSectorDescriptorsRandom",
      "deckConfig = " + JSON.stringify(deckConfig)
    );

    var numSectors = teConstants.numSectorsPerCard;

    // Odds of being a buffer vs colored sector.
    // First n elements of all colors array.
    var optionsArray = structuredClone(deckConfig.colors);
    debugLog(
      "generateSectorDescriptorsRandom",
      "1. optionsArray = ",
      JSON.stringify(optionsArray)
    );

    if (deckConfig.buffers) {
      optionsArray = optionsArray.concat(deckConfig.buffers);
      debugLog(
        "generateSectorDescriptorsRandom",
        "2. optionsArray = ",
        JSON.stringify(optionsArray)
      );
    }

    var randomChoices = genericUtils.getRandomMaybeRepeatingArrayElements(
      optionsArray,
      numSectors,
      teConstants.getRandommZeroToOne
    );

    // Twiddle this around to be a little more clear.
    var sectorDescriptors = [];
    for (var i = 0; i < randomChoices.length; i++) {
      var randomChoice = randomChoices[i];
      if (randomChoice === teConstants.sectorTypes.Buffer) {
        sectorDescriptors.push({
          type: teConstants.sectorTypes.Buffer,
        });
      } else {
        sectorDescriptors.push({
          type: teConstants.sectorTypes.Colored,
          color: randomChoice,
        });
      }
    }
    return sectorDescriptors;
  }

  function addExtrasConfigRandom(sectorDescriptor, extra) {
    var extraType = extra.type;
    var sectorType = sectorDescriptor.type;

    debugLog(
      "addExtrasConfigRandom",
      "sectorDescriptor = ",
      JSON.stringify(sectorDescriptor)
    );

    debugLog(
      "addExtrasConfigRandom",
      "sectorDescriptor = ",
      JSON.stringify(sectorDescriptor)
    );

    if (sectorType === teConstants.sectorTypes.Buffer && !extra.buffers) {
      return;
    }

    // How many of this extra to add to this sector.
    var extraCount = genericUtils.getRandomArrayElement(
      extra.sectorCountPossibilities,
      teConstants.getRandommZeroToOne
    );

    var rotation = genericUtils.getRandomArrayElement(
      teConstants.triangleSides,
      teConstants.getRandommZeroToOne
    );

    sectorDescriptor.extras = sectorDescriptor.extras || {};
    sectorDescriptor.extras[extraType] = [false, false, false];

    for (var i = 0; i < extraCount; i++) {
      var extraIndex = (rotation + i) % 3;
      var variant = extraType;
      if (extra.subvariants) {
        var subvariant = genericUtils.getRandomArrayElement(
          extra.subvariants,
          teConstants.getRandommZeroToOne
        );
        variant = variant + "-" + subvariant;
      }
      sectorDescriptor.extras[extraType][extraIndex] = variant;
    }
  }

  // Changes sector descriptor in place.
  function addExtrasConfigsRandom(sectorDescriptor, deckConfig) {
    var extras = deckConfig.extras ? deckConfig.extras : [];

    for (var extra of extras) {
      addExtrasConfigRandom(sectorDescriptor, extra);
    }
  }

  // This returned object becomes the defined value of this module
  return {
    generateSectorDescriptorsRandom: generateSectorDescriptorsRandom,
    addExtrasConfigsRandom: addExtrasConfigsRandom,
  };
});
