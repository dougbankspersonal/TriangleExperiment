define([
  "dojo/dom-class",
  "dojo/dom-style",
  "sharedJavascript/cards",
  "sharedJavascript/debugLog",
  "sharedJavascript/genericMeasurements",
  "sharedJavascript/htmlUtils",
  "javascript/triangleCardConfigConstruction",
  "javascript/teCardUtils",
  "javascript/teConstants",
  "dojo/domReady!",
], function (
  domClass,
  domStyle,
  cards,
  debugLogModule,
  genericMeasurements,
  htmlUtils,
  triangleCardConfigConstruction,
  teCardUtils,
  teConstants
) {
  var debugLog = debugLogModule.debugLog;
  //-----------------------------------

  // Constants
  //
  //-----------------------------------
  // Triangle height = base/2 * rad(3).
  // Row height is half that.
  // This seems to need fudging a bit: hence the +2.
  const gTriangleHeightPx = genericMeasurements.triangleCardHeightPx;
  const gSectorWidthPx = genericMeasurements.standardCardWidthPx / 2;

  const gSectorRotationBySectorIndexDeg = [0, 0, 180, 0];

  const gSectorXBySectorIndexPx = [
    0,
    -gSectorWidthPx / 2,
    0,
    gSectorWidthPx / 2,
  ];
  const gSectorYBySectorIndexPx = [0, 0, 0, 0];

  //-----------------------------------
  //
  // Functions
  //
  //-----------------------------------
  function addRow(parentNode, rowIndex) {
    var rowNode = htmlUtils.addDiv(
      parentNode,
      ["sectors-row", "sectors-row-" + rowIndex],
      "sectors-row-" + rowIndex
    );
    domStyle.set(rowNode, {
      height: gTriangleHeightPx + "px",
    });
    return rowNode;
  }

  function addExtras(parentNode, sectorDescriptor) {
    debugLog(
      "addExtras",
      "sectorDescriptor = ",
      JSON.stringify(sectorDescriptor)
    );

    for (var extraType in sectorDescriptor.extras) {
      var extrasForType = sectorDescriptor.extras[extraType];
      for (var i = 0; i < extrasForType.length; i++) {
        if (!extrasForType[i]) {
          continue;
        }
        var extraVariant = extrasForType[i];
        var extraClass = "extra-" + i;
        var extraImageNode = htmlUtils.addImage(
          parentNode,
          ["sector-extra", extraClass, extraVariant],
          "sector-extra-" + extraType + "-" + i
        );
      }
    }
  }

  function addSector(parentNode, sectorIndex, sectorDescriptor) {
    var contentsClassSuffix =
      sectorDescriptor.type == teConstants.sectorTypes.Buffer
        ? teConstants.sectorTypes.Buffer
        : sectorDescriptor.color;
    var contentsClass = "node-" + contentsClassSuffix;

    var translateX = gSectorXBySectorIndexPx[sectorIndex];
    var translateY = gSectorYBySectorIndexPx[sectorIndex];
    var rotationDeg = gSectorRotationBySectorIndexDeg[sectorIndex];
    debugLog("addSector", "sectorIndex = ", JSON.stringify(sectorIndex));
    debugLog("addSector", "translateX = ", JSON.stringify(translateX));
    debugLog("addSector", "translateY = ", JSON.stringify(translateY));
    debugLog("addSector", "rotationDeg = ", JSON.stringify(rotationDeg));

    var sectorNode = teCardUtils.addNthSector(parentNode, sectorIndex, {
      height: gTriangleHeightPx / 2 + "px",
      width: gSectorWidthPx + "px",
      transform: `translate(${gSectorXBySectorIndexPx[sectorIndex]}px, ${gSectorYBySectorIndexPx[sectorIndex]}px) rotate(${gSectorRotationBySectorIndexDeg[sectorIndex]}deg)`,
    });

    // add the contents of the  sector.
    var sectorContentsNode = htmlUtils.addImage(
      sectorNode,
      ["sector-contents", contentsClass],
      "sector-contents-" + sectorIndex
    );

    // add any extras.
    addExtras(sectorNode, sectorDescriptor);

    return sectorNode;
  }

  function addCardFront(parentNode, index) {
    var cardConfigs = triangleCardConfigConstruction.getCardConfigs();
    var cardConfig = cards.getCardConfigAtIndex(cardConfigs, index);

    var [cardFrontNode, frontWrapperNode] = teCardUtils.addCardFrontAndWrapper(
      parentNode,
      cardConfig,
      index
    );

    domClass.add(cardFrontNode, cardConfig.metaClass);

    debugLog("addCardFront", "cardConfig = ", JSON.stringify(cardConfig));

    var sectorDescriptors = cardConfig.sectorDescriptors;

    // 2 rows.  Top has 1 sector, bottom 3.
    var columnCountByRow = [1, 3];
    var sectorNodes = [];
    var sectorIndex = 0;
    for (var rowIndex = 0; rowIndex < 2; rowIndex++) {
      var rowNode = addRow(frontWrapperNode, rowIndex);

      var columnCount = columnCountByRow[rowIndex];
      for (var columnIndex = 0; columnIndex < columnCount; columnIndex++) {
        var sectorNode = addSector(
          rowNode,
          sectorIndex,
          sectorDescriptors[sectorIndex]
        );
        sectorNodes.push(sectorNode);
        sectorIndex++;
      }
    }

    // If there's customSectorConfiguration function call that.
    debugLog(
      "addCardFront",
      "cardConfig.customSectorConfiguration = ",
      JSON.stringify(cardConfig.customSectorConfiguration)
    );
    if (cardConfig.customSectorConfiguration) {
      cardConfig.customSectorConfiguration(sectorNodes, cardConfig);
    }

    return cardFrontNode;
  }

  function addCardBack(parent, index) {
    var cardConfigs = triangleCardConfigConstruction.getCardConfigs();
    var cardConfig = cards.getCardConfigAtIndex(cardConfigs, index);

    var classes = ["te", cardConfig.metaClass];

    var cardBackNode = cards.addCardBack(parent, index, {
      classes: classes,
    });

    var cardBackIconNode = htmlUtils.addImage(
      cardBackNode,
      ["te-icon"],
      "te-icon"
    );

    return cardBackNode;
  }

  // This returned object becomes the defined value of this module
  return {
    addCardFront: addCardFront,
    addCardBack: addCardBack,
  };
});
