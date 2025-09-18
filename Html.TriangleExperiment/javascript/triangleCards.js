/* Deprecated */

define([
  "dojo/dom-style",
  "sharedJavascript/cards",
  "sharedJavascript/debugLog",
  "sharedJavascript/genericMeasurements",
  "sharedJavascript/htmlUtils",
  "javascript/cardConfigConstruction",
  "javascript/teCardUtils",
  "dojo/domReady!",
], function (
  domStyle,
  cards,
  debugLogModule,
  genericMeasurements,
  htmlUtils,
  cardConfigConstruction,
  teCardUtils
) {
  var debugLog = debugLogModule.debugLog;

  //-----------------------------------
  //
  // Constants
  //
  //-----------------------------------
  // Triangle height = base/2 * rad(3).
  // Row height is half that.
  // This seems to need fudging a bit: hence the +2.
  const gTriangleHeightPx = genericMeasurements.triangleCardHeightPx;
  const gSectorWidthPx = genericMeasurements.standardCardWidthPx / 2;
  const gSectorHeightPx = genericMeasurements.triangleCardHeightPx / 2;
  const gSymbolSizePxBySymbolCount = {
    1: gSectorHeightPx * 0.48,
    2: gSectorHeightPx * 0.28,
    3: gSectorHeightPx * 0.28,
  };

  // Euquilateral triangle: centeregTriangleHeightPx
  const gSymbolXPxBySymbolCountAndIndex = {
    1: [0],
    2: [0, 0],
    3: [-0.18 * gSectorWidthPx, 0, 0.18 * gSectorWidthPx],
  };

  const gLargeImageSizePx = gSymbolSizePxBySymbolCount[1];
  const gSmallImageSizePx = gSymbolSizePxBySymbolCount[2];

  // Go down 1/2 the height of image, then up 1/3 of height of row.
  const oneItemYPx = gLargeImageSizePx * 0.5 - gSectorHeightPx * 0.33;

  const oneOfTwoItemYPx = gSmallImageSizePx * 0.5 - gSectorHeightPx * 0.53;
  const twoOfTwoItemYPx = gSmallImageSizePx * 0.5 - gSectorHeightPx * 0.19;

  const oneOfThreeItemYPx = gSmallImageSizePx * 0.5 - gSectorHeightPx * 0.25;
  const twoOfThreeItemYPx = gSmallImageSizePx * 0.5 - gSectorHeightPx * 0.6;
  const threeOfThreeItemYPx = gSmallImageSizePx * 0.5 - gSectorHeightPx * 0.25;
  const gSymbolYPxBySymbolCountAndIndex = {
    1: [oneItemYPx],
    // Two items in a stack spaced around center
    2: [oneOfTwoItemYPx, twoOfTwoItemYPx],
    3: [oneOfThreeItemYPx, twoOfThreeItemYPx, threeOfThreeItemYPx],
  };

  const gSectorXBySectorIndexPx = [
    0,
    -gSectorWidthPx / 2,
    0,
    gSectorWidthPx / 2,
  ];
  const gSectorYBySectorIndexPx = [0, 0, 0, 0];
  const gSectorRotationBySectorIndexDeg = [0, 0, 180, 0];
  const gSymbolRotationBySectorIndexDeg = [0, 0, -180, 0];

  //-----------------------------------
  //
  // Functions
  //
  //-----------------------------------
  function addCardFront(parentNode, index) {
    var cardConfig = cardConfigConstruction.getCardConfigAtIndex(index);

    var [cardFrontNode, frontWrapperNode] = teCardUtils.addCardFrontAndWrapper(
      parentNode,
      cardConfig,
      index
    );

    debugLog("addCardFront", "cardConfig = ", JSON.stringify(cardConfig));

    var sectorToColor = cardConfig.sectorToColor;
    var wallsBySector = cardConfig.wallsBySector;

    // 2 rows.  Top has 1 sector, bottom 3.
    var columnCountByRow = [1, 3];
    var sectorIndex = 0;
    for (var rowIndex = 0; rowIndex < 2; rowIndex++) {
      var rowNode = htmlUtils.addDiv(
        frontWrapperNode,
        ["sectors-row", "sectors-row-" + rowIndex],
        "sectors-row-" + rowIndex
      );
      domStyle.set(rowNode, {
        height: gTriangleHeightPx + "px",
      });

      var columnCount = columnCountByRow[rowIndex];
      for (var columnIndex = 0; columnIndex < columnCount; columnIndex++) {
        var colorIndex = sectorToColor[sectorIndex];
        var wallsThisSector = wallsBySector[sectorIndex];

        debugLog(
          "addCardFront",
          "rowIndex = ",
          rowIndex,
          ": columnIndex = ",
          columnIndex,
          ": wallsThisSector = " + JSON.stringify(wallsThisSector)
        );

        teCardUtils.addNthSector(rowNode, sectorIndex, {
          colorIndex: colorIndex,
          wallsThisSector: wallsThisSector,
          sectorStyling: {
            height: gTriangleHeightPx / 2 + "px",
            width: gSectorWidthPx + "px",
            transform: `translate(${gSectorXBySectorIndexPx[sectorIndex]}px, ${gSectorYBySectorIndexPx[sectorIndex]}px) rotate(${gSectorRotationBySectorIndexDeg[sectorIndex]}deg)`,
          },
        });
        sectorIndex++;
      }
    }

    return cardFrontNode;
  }

  function addCardBack(parent, index) {
    var config = cardConfigConstruction.getCardConfigAtIndex(index);
    var classes = ["te"];

    if (config.isStarterCard) {
      classes.push("starter");
    }
    if (config.season) {
      classes.push("season-" + config.season);
    }

    var cardBackNode = cards.addCardBack(parent, index, {
      classes: classes,
    });

    var cardBackLogoNode = htmlUtils.addImage(
      cardBackNode,
      ["te-title"],
      "te-title"
    );

    var cardConfig = cardConfigConstruction.getCardConfigAtIndex(index);
    if (cardConfig.season) {
      var seasonName = teCardUtils.getSeasonName(cardConfig.season);
      var seasonNode = htmlUtils.addDiv(
        cardBackNode,
        ["season-name"],
        "season-name"
      );
      seasonNode.innerHTML = seasonName;
    }

    return cardBackNode;
  }

  // This returned object becomes the defined value of this module
  return {
    addCardFront: addCardFront,
    addCardBack: addCardBack,
  };
});
