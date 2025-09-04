define(["sharedJavascript/debugLog", "dojo/domReady!"], function (
  debugLogModule
) {
  var debugLog = debugLogModule.debugLog;
  // Recursive.
  // Returns an array of arrays.
  // All the possible distributions of numSymbols symbols across numSlots slots.
  function generateDistributionsRecursive(numSymbols, numSlots) {
    debugLog(
      "Distributions",
      "generateDistributions: numSymbols = " +
        numSymbols +
        ": numSlots = " +
        numSlots
    );
    if (numSlots === 1) {
      debugLog(
        "Distributions",
        "generateDistributions: 1 slot, returning: " +
          JSON.stringify([numSymbols])
      );
      return [[numSymbols]];
    }
    var retVal = [];
    for (var i = 0; i <= numSymbols; i++) {
      var numSymbolsThisSlot = i;
      var distributions = generateDistributionsRecursive(
        numSymbols - i,
        numSlots - 1
      );
      for (var j = 0; j < distributions.length; j++) {
        // Push numSymbolsThisSlot to the front of the distribution.
        distributions[j].unshift(numSymbolsThisSlot);
      }
      // Add the retVal.
      retVal = retVal.concat(distributions);
    }
    return retVal;
  }

  function generatePossibleSymbolDistributions(numSymbolsPerCard, numSectors) {
    var retVal = generateDistributionsRecursive(numSymbolsPerCard, numSectors);
    debugLog(
      "Distributions",
      "generatePossibleSymbolDistributions: retVal = " + JSON.stringify(retVal)
    );
    return retVal;
  }

  // Distribution maps sector number to the number of symbols in the sector
  // Does not say what the symbols are.
  // This identifies and rejects invalid distributions.
  function isValidSymbolDistribution(distribution, numSymbolsPerCard) {
    var symbolMax = numSymbolsPerCard / 2;
    var blankSectorCount = 0;

    for (var i = 0; i < distribution.length; i++) {
      // Never allowed to have one sector with more than half the symbols.
      if (distribution[i] > symbolMax) {
        return false;
      }
      // Never allowed to have more than one blank sector.
      if (distribution[i] == 0) {
        blankSectorCount++;
        if (blankSectorCount > 1) {
          return false;
        }
      }
    }
    return true;
  }

  function generateAllValidSymbolDistributions(
    numSectors,
    numSymbolsPerCard,
    opt_extraCheck
  ) {
    var possibleDistrubutions = generatePossibleSymbolDistributions(
      numSymbolsPerCard,
      numSectors
    );

    debugLog(
      "Distributions",
      "generateAllValidSymbolDistributions: possibleDistributions = " +
        JSON.stringify(possibleDistribution)
    );

    var validDistributions = [];
    for (var i = 0; i < possibleDistrubutions.length; i++) {
      var possibleDistribution = possibleDistrubutions[i];

      // Caller may have extra checks.
      if (opt_extraCheck && !opt_extraCheck(possibleDistribution)) {
        continue;
      }

      if (!isValidSymbolDistribution(possibleDistribution, numSymbolsPerCard)) {
        continue;
      }
      validDistributions.push(possibleDistribution);
    }
    debugLog(
      "Distributions",
      "generateAllValidSymbolDistributions: validDistributions = " +
        JSON.stringify(validDistributions)
    );

    return validDistributions;
  }

  // This returned object becomes the defined value of this module
  return {
    generateAllValidSymbolDistributions: generateAllValidSymbolDistributions,
  };
});
