define([
  "sharedJavascript/debugLog",
  "sharedJavascript/genericUtils",
  "sharedJavascript/htmlUtils",
  "javascript/teConstants",
  "dojo/domReady!",
], function (debugLogModule, genericUtils, htmlUtils, teConstants) {
  var debugLog = debugLogModule.debugLog;
  //-----------------------------------
  //
  // Constants
  //
  //-----------------------------------
  // Some concepts:
  // Sectors are numbered
  //     0
  //     2
  //   1   3
  // The path image looks like this:
  //      /\
  //     /  \
  //    /    \
  //   /_\____\
  // And half-path is half of that (comes in from the bottom)

  const gPathHalfRight = "path-half-right";
  const gPathHalfLeft = "path-half-left";
  const gPathFullRight = "path-full-right";
  const gPathFullLeft = "path-full-left";
  const gNothing = "none";

  const gPathOptions = {
    PathHalfRight: gPathHalfRight,
    PathHalfLeft: gPathHalfLeft,
    PathFullRight: gPathFullRight,
    PathFullLeft: gPathFullLeft,
    Nothing: gNothing,
  };

  const gPathOptionsArray = [
    gPathOptions.PathHalfRight,
    gPathOptions.PathHalfLeft,
    gPathOptions.PathFullRight,
    gPathOptions.PathFullLeft,
    gPathOptions.Nothing,
  ];

  const gSectorZeroLeftPathOptions = [
    // Goes right out.
    gPathOptions.PathFullLeft,
    gPathOptions.PathFullLeft,
    // Ends immediately.
    gPathOptions.PathHalfLeft,
    gPathOptions.PathHalfRight,
    // Goes down into the middle sector.
    gPathOptions.PathFullRight,
    gPathOptions.PathFullRight,
    gPathOptions.PathFullRight,
    gPathOptions.PathFullRight,
    gPathOptions.PathFullRight,
  ];

  const gSectorZeroRightPathOptions = [
    // Goes right out.
    gPathOptions.PathFullRight,
    gPathOptions.PathFullRight,
    // Ends immediately.
    gPathOptions.PathHalfLeft,
    gPathOptions.PathHalfRight,
    // Goes down into the middle sector.
    gPathOptions.PathFullLeft,
    gPathOptions.PathFullLeft,
    gPathOptions.PathFullLeft,
    gPathOptions.PathFullLeft,
    gPathOptions.PathFullLeft,
  ];

  const gOtherSectorPathOptions = [
    // Ends immediately.
    gPathOptions.PathHalfLeft,
    gPathOptions.PathHalfRight,

    gPathOptions.PathFullLeft,
    gPathOptions.PathFullLeft,
    gPathOptions.PathFullLeft,

    gPathOptions.PathHalfRight,
    gPathOptions.PathHalfRight,
    gPathOptions.PathHalfRight,
  ];

  //-----------------------------------
  //
  // Functions
  //
  //-----------------------------------
  // entrySide is the side of the *incoming" sector, e.g. the one at sectorNodes[sectorIndex], where
  // the path is coming in.
  function addPathsRecursive(sectorNodes, sectorIndex, entrySide, pathOption) {
    debugLog(
      "addPathsRecursive",
      "addPathsRecursive: sectorNodes = ",
      sectorNodes
    );
    debugLog(
      "addPathsRecursive",
      "sectorIndex = " + sectorIndex + " entrySide = " + entrySide
    );
    debugLog("addPathsRecursive", "pathOption = " + pathOption);
    // Get the node in question.
    var sectorNode = sectorNodes[sectorIndex];

    // Render the option in question.
    if (pathOption == gNothing) {
      debugLog("addPathsRecursive", "Nothing, done.");
      return;
    }
    var pathClass = pathOption;
    var rotationClass = "rotation-" + entrySide;
    var pathNode = htmlUtils.addImage(
      sectorNode,
      ["sector-path", pathClass, rotationClass],
      "sector-path-" + sectorIndex
    );

    // If this was a half path, done.
    if (pathOption == gPathHalfLeft || pathOption == gPathHalfRight) {
      debugLog("addPathsRecursive", "Half path, done.");
      return;
    }

    // What next?
    // 0th sector: the only way forward is side 1 turning right or side 2 turning left. Eother way we are going
    // into sector 2 through side 0.
    if (sectorIndex == 0) {
      debugLog("addPathsRecursive", "  sectorIndex is 0...");
      debugLog("addPathsRecursive", "  entrySide = " + entrySide);
      debugLog("addPathsRecursive", "  pathOption = " + pathOption);
      // If we entered on side 1: right to enter 2.
      // Entered side 2, left to enter 2.
      if (
        (entrySide == 1 && pathOption == gPathFullRight) ||
        (entrySide == 2 && pathOption == gPathFullLeft)
      ) {
        debugLog("addPathsRecursive", "  hitting recursive step");
        var newPathOption = genericUtils.getRandomArrayElement(
          gOtherSectorPathOptions,
          teConstants.getRandommZeroToOne
        );
        addPathsRecursive(sectorNodes, 2, 0, newPathOption);
      }
    } else if (sectorIndex == 2) {
      // Must go out.
      var nextSectorIndex = pathOption == gPathFullLeft ? 3 : 1;
      var nextEntrySide = nextSectorIndex == 3 ? 1 : 2;
      addPathsRecursive(
        sectorNodes,
        nextSectorIndex,
        nextEntrySide,
        pathOption
      );
    } else {
      // Sector 1 or 3.  It must have gone out.
      return;
    }
  }

  function addPaths(sectorNodes, cardConfig) {
    // Add this to sector zero.
    // Where do we enter?  Either sides 1 or 2.
    var entrySide = genericUtils.getRandomIntInRange(
      1,
      2,
      teConstants.getRandommZeroToOne
    );
    var pathOptions =
      entrySide == 1 ? gSectorZeroLeftPathOptions : gSectorZeroRightPathOptions;
    var pathOption = genericUtils.getRandomArrayElement(
      pathOptions,
      teConstants.getRandommZeroToOne
    );
    debugLog(
      "addPaths",
      "entrySide = " + entrySide + " pathOption = " + pathOption
    );
    addPathsRecursive(sectorNodes, 0, entrySide, pathOption);
  }

  // This returned object becomes the defined value of this module
  return {
    addPaths: addPaths,
  };
});
