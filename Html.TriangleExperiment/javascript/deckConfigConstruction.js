define([
  "sharedJavascript/debugLog",
  "sharedJavascript/genericUtils",
  "javascript/teConstants",
  "dojo/domReady!",
], function (debugLogModule, genericUtils, teConstants) {
  var debugLog = debugLogModule.debugLog;

  //-------------------------------------------------
  //
  // Functions
  //
  //-------------------------------------------------

  function assignTwoColorsTwoSectors(numColors) {
    var colorIndices = [];
    for (var i = 0; i < numColors; i++) {
      colorIndices.push(i);
    }
    debugLog("assignTwoColorsTwoSectors", "numColors = " + numColors);
    debugLog(
      "assignTwoColorsTwoSectors",
      "colorIndices = " + JSON.stringify(colorIndices)
    );

    // Pick any two colors;
    var selectedColorIndices = genericUtils.getRandomNonRepeatingArrayElements(
      colorIndices,
      2,
      teConstants.getRandommZeroToOne
    );
    debugLog(
      "assignTwoColorsTwoSectors",
      "selectedColorIndices = " + JSON.stringify(selectedColorIndices)
    );
    console.assert(selectedColorIndices.length == 2, "Should have 2 colors");
    console.assert(
      selectedColorIndices[0] != selectedColorIndices[1],
      "Should be different"
    );

    // Map from sector id to color: 1 and 2, then 3 and 4.
    var sectorToColor = [
      selectedColorIndices[0],
      selectedColorIndices[0],
      selectedColorIndices[1],
      selectedColorIndices[1],
    ];
    return sectorToColor;
  }

  function assignWallsNotBetweenMatchingColor(sectorToColor, wallFrequency) {
    // For each sector, roll a die on walls.
    // But never a wall between two matching colors.
    // For a triangle with base on bottom, walls go clockwise starting on left:
    //      *
    //    0   1
    //   *--2--*
    // So in sector 2 then are upside down:
    //
    //   *--2--*
    //    1   0
    //      *
    debugLog("assignWallsNotBetweenMatchingColor", "called");
    var wallsBySector = [];
    for (var i = 0; i < teConstants.numSectorsPerCard; i++) {
      debugLog("assignWallsNotBetweenMatchingColor", "i = " + i);
      var sectorIndex = i;
      // Roll a die on number of walls:
      var numWalls = genericUtils.getRandomArrayElement(
        wallFrequency,
        teConstants.getRandommZeroToOne
      );
      var walls = [0, 0, 0];
      // Arbirtary rotation.
      var rotation = genericUtils.getRandomIntInRange(
        0,
        2,
        teConstants.getRandommZeroToOne
      );
      for (var j = 0; j < numWalls; j++) {
        var wallIndex = (j + rotation) % 3;
        walls[wallIndex] = 1;
      }
      debugLog(
        "assignWallsNotBetweenMatchingColor",
        "walls = " + JSON.stringify(walls)
      );
      wallsBySector[sectorIndex] = walls;
    }
    debugLog(
      "assignWallsNotBetweenMatchingColor",
      "wallsBySector = " + JSON.stringify(wallsBySector)
    );

    // Now clean it up: remove any walls between matching colors.
    // Only adjacent sectors are '2' and 'everything else'.
    var middleSectorId = 2;
    var middleSectorColor = sectorToColor[middleSectorId];
    for (var i = 0; i < teConstants.numSectorsPerCard; i++) {
      if (i == middleSectorId) {
        continue;
      }
      var thisSectorColor = sectorToColor[i];
      if (thisSectorColor != middleSectorColor) {
        continue;
      }
      // They match: remove any walls between.
      if (i == 0) {
        wallsBySector[i][2] = 0;
        wallsBySector[middleSectorId][2] = 0;
      } else if (i == 1) {
        wallsBySector[i][1] = 0;
        wallsBySector[middleSectorId][1] = 0;
      } else {
        wallsBySector[i][0] = 0;
        wallsBySector[middleSectorId][0] = 0;
      }
    }
    return wallsBySector;
  }

  function getDeckConfig() {
    // Tweaks on how we build a deck.
    // 1. How many colors and what are they?
    // 2. Where are walls?
    // 3. Rules on valid wall and color placements.

    // 3 symbol, 4 purpose.
    const gColor4Config = {
      numColors: 4,
      wallFrequency: [
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2,
      ],
      colorGenerator: assignTwoColorsTwoSectors,
      wallGenerator: assignWallsNotBetweenMatchingColor,
      numCardsInDeck: 60,
    };

    return gColor4Config;
  }

  // This returned object becomes the defined value of this module
  return {
    getDeckConfig: getDeckConfig,
  };
});
