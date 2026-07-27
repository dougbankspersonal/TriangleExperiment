define([
  "dojo/dom-class",
  "dojo/dom-style",
  "sharedJavascript/cards",
  "sharedJavascript/debugLog",
  "sharedJavascript/htmlUtils",
  "javascript/teCardUtils",
  "dojo/domReady!",
], function (
  domClass,
  domStyle,
  cards,
  debugLogModule,
  htmlUtils,
  teCardUtils
) {
  var debugLog = debugLogModule.debugLog;
  var gCardConfigs = null;

  //-----------------------------------
  //
  // Constants
  //
  //-----------------------------------

  //-----------------------------------
  //
  // Functions
  //
  //-----------------------------------
  function addTextSection(parentNode, cardConfig, textSection, index) {
    debugLog("addTextSection", "textSection = ", JSON.stringify(textSection));
    var indexClass = "instance-" + index;
    var textSectionNode = htmlUtils.addDiv(
      parentNode,
      ["text-section", indexClass],
      "text-section-" + index
    );

    for (var j = 0; j < textSection.subsections.length; j++) {
      var subsection = textSection.subsections[j];
      var subsectionClass = "instance-" + j;
      var subsectionNode = htmlUtils.addDiv(
        textSectionNode,
        ["text-subsection", subsectionClass],
        "text-subsection-" + j,
        subsection
      );
      if (cardConfig.customFontSize) {
        domStyle.set(subsectionNode, {
          "font-size": cardConfig.customFontSize,
        });
      }
    }

    return textSectionNode;
  }

  function addCardFront(parentNode, index) {
    debugLog("addCardFront", "index = ", JSON.stringify(index));
    var cardConfig = cards.getCardConfigAtIndex(gCardConfigs, index);
    debugLog("addCardFront", "cardConfig = ", JSON.stringify(cardConfig));

    var [cardFrontNode, frontWrapperNode] = teCardUtils.addCardFrontAndWrapper(
      parentNode,
      cardConfig,
      index
    );

    domClass.add(cardFrontNode, cardConfig.metaClass);
    for (var i = 0; i < cardConfig.textSections.length; i++) {
      var textSection = cardConfig.textSections[i];
      debugLog("addCardFront", "textSection = ", JSON.stringify(textSection));
      var textSectionNode = addTextSection(
        frontWrapperNode,
        cardConfig,
        textSection,
        i
      );
    }

    return cardFrontNode;
  }

  function addCardBack(parent, index) {
    var cardConfig = cards.getCardConfigAtIndex(gCardConfigs, index);

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

  function setCardConfigs(cardConfigs) {
    console.assert(gCardConfigs === null, "setCardConfigs called twice");
    gCardConfigs = cardConfigs;
  }

  // This returned object becomes the defined value of this module
  return {
    addCardFront: addCardFront,
    addCardBack: addCardBack,
    setCardConfigs: setCardConfigs,
  };
});
