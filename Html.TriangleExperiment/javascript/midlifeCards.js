/* Deprecated */

define([
  "dojo/dom-style",
  "sharedJavascript/cards",
  "sharedJavascript/debugLog",
  "sharedJavascript/genericMeasurements",
  "sharedJavascript/htmlUtils",
  "javascript/midlifeCardData",
  "dojo/domReady!",
], function (
  domStyle,
  cards,
  debugLogModule,
  genericMeasurements,
  htmlUtils,
  midlifeCardData
) {
  var debugLog = debugLogModule.debugLog;

  //-----------------------------------
  //
  // Functions
  //
  //-----------------------------------
  function addCardFront(parentNode, index, opt_configs) {
    var cardConfig = midlifeCardData.getCardConfigAtIndex(index);
    debugLog("midlifeCards", "cardConfig = ", JSON.stringify(cardConfig));

    var id = "midlife-" + index;
    var classes = ["midlife"];
    var cardFrontNode = cards.addCardFront(parentNode, classes, id);
    domStyle.set(cardFrontNode, {
      "border-width": `${genericMeasurements.cardFrontBorderWidthPx}px`,
      "border-style": "solid",
    });

    var frontWrapperNode = htmlUtils.addDiv(
      cardFrontNode,
      ["front-wrapper"],
      "front-wrapper"
    );

    // 2 rows, 2 sectors in each.
    for (var rowIndex = 0; rowIndex < 2; rowIndex++) {
      var rowNode = htmlUtils.addDiv(
        frontWrapperNode,
        ["sectors-row", "sectors-row-" + rowIndex],
        "sectors-row-" + rowIndex
      );

      var isGood = false;
      for (var columnIndex = 0; columnIndex < 2; columnIndex++) {
        var sectorIndex = rowIndex * 2 + columnIndex;
        // Good/bad/bad/good.
        var optionKey;
        if (rowIndex == 0) {
          if (columnIndex == 0) {
            optionKey = cardConfig.goodOptionKeys[0];
            isGood = true;
          } else {
            optionKey = cardConfig.badOptionKeys[0];
            isGood = false;
          }
        } else {
          if (columnIndex == 0) {
            optionKey = cardConfig.badOptionKeys[1];
            isGood = false;
          } else {
            optionKey = cardConfig.goodOptionKeys[1];
            isGood = true;
          }
        }

        var optionDesc = midlifeCardData.allOptionsMap[optionKey];

        var sectorNode = htmlUtils.addDiv(rowNode, [
          "sector",
          isGood ? "good" : "bad",
          "sector-index-" + sectorIndex,
          "sector-index-" + sectorIndex,
        ]);
        var titleNode = htmlUtils.addDiv(
          sectorNode,
          ["title"],
          "title",
          optionDesc.title
        );
        var textNode = htmlUtils.addDiv(
          sectorNode,
          ["text"],
          "text",
          optionDesc.text
        );
      }
    }

    return cardFrontNode;
  }

  function addCardBack(parent, index) {
    var cardBackNode = cards.addCardBack(parent, index, {
      classes: ["midlife"],
    });
    domStyle.set(cardBackNode, {
      "border-width": `${genericMeasurements.cardFrontBorderWidthPx}px`,
      "border-style": "solid",
    });
    var leftHalfNode = htmlUtils.addDiv(
      cardBackNode,
      ["half-shade", "left"],
      "left-half"
    );
    var rightHalfNode = htmlUtils.addDiv(
      cardBackNode,
      ["half-shade", "right"],
      "right-half"
    );
    return cardBackNode;
  }

  // This returned object becomes the defined value of this module
  return {
    addCardFront: addCardFront,
    addCardBack: addCardBack,
  };
});
