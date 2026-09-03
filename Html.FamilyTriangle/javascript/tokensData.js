define([
  "sharedJavascript/debugLog",
  "sharedJavascript/htmlUtils",
  "javascript/gameInfo",
  "dojo/domReady!",
], function (debugLogModule, htmlUtils, gameInfo) {
  var debugLog = debugLogModule.debugLog;

  var gTokenDiceConfigs = null;

  function getPlayerTokenDieConfig() {
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

  function getVotingToolsDieConfig() {
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

    var voteFaceConfig = {
      classes: ["token", "voting-tool", "vote"],
      imageClasses: ["vote"],
      text: "Vote",
    };
    faceConfigs.push(voteFaceConfig);

    dieConfig.faces = faceConfigs;
    return dieConfig;
  }

  function generateTokenDiceConfigs() {
    if (gTokenDiceConfigs !== null) {
      return gTokenDiceConfigs;
    }

    gTokenDiceConfigs = [];
    var playerTokenDieConfig = getPlayerTokenDieConfig();
    gTokenDiceConfigs.push(playerTokenDieConfig);
    var singleTerrainTypeDieConfig = getSingleTerrainTypeDieConfig();
    gTokenDiceConfigs.push(singleTerrainTypeDieConfig);
    var passFailDieConfig = getVotingToolsDieConfig();
    gTokenDiceConfigs.push(passFailDieConfig);

    debugLog(
      "generateTokenDiceConfigs",
      "gTokenDiceConfigs = ",
      JSON.stringify(gTokenDiceConfigs),
    );

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
