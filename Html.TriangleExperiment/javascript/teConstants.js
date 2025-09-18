define([
  "sharedJavascript/debugLog",
  "sharedJavascript/genericUtils",
  "dojo/domReady!",
], function (debugLogModule, genericUtils) {
  var debugLog = debugLogModule.debugLog;

  // Both squares and triangles have four sectors.
  // Triangle sectors are indexed like so:
  //                 0
  //                 2
  //               1    3
  const gNumSectorsPerCard = 4;
  const gTriangleMiddleSectorIndex = 2;

  const gMaxPlayers = 4;

  const gColorType_Red = "red";
  const gColorType_Green = "green";
  const gColorType_Blue = "blue";
  const gColorType_Yellow = "yellow";
  const gColorType_Purple = "purple";
  const gColorType_Orange = "orange";
  const gColorType_Cyan = "cyan";

  const gColorTypes = {
    Red: gColorType_Red,
    Green: gColorType_Green,
    Blue: gColorType_Blue,
    Yellow: gColorType_Yellow,
    Purple: gColorType_Purple,
    Orange: gColorType_Orange,
    Cyan: gColorType_Cyan,
  };

  const gColorTypesArray = [
    gColorTypes.Red,
    gColorTypes.Green,
    gColorTypes.Blue,
    gColorTypes.Yellow,
    gColorTypes.Purple,
    gColorTypes.Orange,
    gColorTypes.Cyan,
  ];

  const gNumColorTypes = gColorTypesArray.length;

  var getRandommZeroToOne =
    genericUtils.createSeededGetZeroToOneRandomFunction(83743874);

  return {
    numSectorsPerCard: gNumSectorsPerCard,
    triangleMiddleSectorIndex: gTriangleMiddleSectorIndex,
    colorTypes: gColorTypes,
    numColorTypes: gNumColorTypes,
    colorTypesArray: gColorTypesArray,
    getRandommZeroToOne: getRandommZeroToOne,
  };
});
