define([
  "sharedJavascript/debugLog",
  "sharedJavascript/htmlUtils",
  "javascript/gameInfo",
  "dojo/domReady!",
], function (debugLogModule, htmlUtils, gameInfo) {
  var debugLog = debugLogModule.debugLog;

  var gTokenDiceConfigs = null;

  function getPlayerTokensConfig() {
    var dieConfig = {};
    dieConfig.classes = ["tokens", "player"];

    var faceConfigs = [];

    for (var i = 0; i < gameInfo.numPlayers; i++) {
      var faceConfig = {
        classes: ["token", "player-" + i],
        imageClasses: ["player-icon-" + i],
      };
      faceConfigs.push(faceConfig);
    }

    dieConfig.faces = faceConfigs;
    return dieConfig;
  }

  function getSingleTerrainTypeDieConfig() {
    var dieConfig = {};
    dieConfig.classes = ["tokens", "terrain", "single"];

    var faceConfigs = [];

    for (var i = 0; i < gameInfo.scoringTerrainTypesArray.length; i++) {
      var terrainType = gameInfo.scoringTerrainTypesArray[i];
      var faceConfig = {
        classes: ["token", "terrain", "single"],
        imageClasses: ["square-" + terrainType],
      };
      faceConfigs.push(faceConfig);
    }

    dieConfig.faces = faceConfigs;
    return dieConfig;
  }

  function getPassFailTokensConfig() {
    var dieConfig = {};
    dieConfig.classes = ["tokens", "voting-tools"];

    var faceConfigs = [];

    var passFaceConfig = {
      classes: ["token", "voting-tool", "pass"],
      imageClasses: ["green-check"],
      text: "Passed",
    };
    faceConfigs.push(passFaceConfig);

    var failFaceConfig = {
      classes: ["token", "voting-tool", "fail"],
      imageClasses: ["red-x"],
      text: "Failed",
    };

    faceConfigs.push(failFaceConfig);

    dieConfig.faces = faceConfigs;
    return dieConfig;
  }

  function getIncomeTokensConfig() {
    var dieConfig = {};
    dieConfig.classes = ["tokens", "income"];

    var faceConfigs = [];

    var passFaceConfig = {
      classes: ["token", "income", "yes"],
      imageClasses: ["green-check"],
      text: "$",
    };
    faceConfigs.push(passFaceConfig);

    var failFaceConfig = {
      classes: ["token", "income", "no"],
      imageClasses: ["red-x"],
      text: "$",
    };

    faceConfigs.push(failFaceConfig);

    dieConfig.faces = faceConfigs;
    return dieConfig;
  }

  function getGameEndDieConfig() {
    var dieConfig = {};
    dieConfig.classes = ["tokens", "game-end"];

    var faceConfigs = [
      {
        classes: ["token"],
        text: "1",
      },
      {
        classes: ["token"],
        text: "1",
      },
      {
        classes: ["token"],
        text: "2",
      },
      {
        classes: ["token"],
        text: "2",
      },
      {
        classes: ["token"],
        text: "3",
      },
      {
        classes: ["token"],
        text: "4",
      },
    ];

    dieConfig.faces = faceConfigs;
    return dieConfig;
  }

  function generateTokenDiceConfigs() {
    if (gTokenDiceConfigs !== null) {
      return gTokenDiceConfigs;
    }

    gTokenDiceConfigs = [];
    var playerTokenDieConfig = getPlayerTokensConfig();
    gTokenDiceConfigs.push(playerTokenDieConfig);

    return gTokenDiceConfigs;
  }

  function getTokenDiceConfigs() {
    generateTokenDiceConfigs();
    return gTokenDiceConfigs;
  }

  return {
    getTokenDiceConfigs: getTokenDiceConfigs,
  };
});
