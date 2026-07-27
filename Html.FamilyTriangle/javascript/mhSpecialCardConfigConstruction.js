/*
Functions for putting together card configs.

See candConfigUtils for description of a cardConfig.
*/

define([
  "sharedJavascript/cards",
  "sharedJavascript/debugLog",
  "dojo/domReady!",
], function (cards, debugLogModule) {
  var debugLog = debugLogModule.debugLog;

  const gSmallerFontSize = "18px";

  const gMHSpecialCardCConfigs = [
    {
      metaClass: "mh",
      count: 2,
      textSections: [
        {
          subsections: ["All other colors have beef with this color"],
        },
        {
          subsections: ["This color has beef with all other colors"],
        },
      ],
    },
    {
      metaClass: "mh",
      count: 2,
      textSections: [
        {
          subsections: ["Remove one marker from this color's 'Beef' column"],
        },
        {
          subsections: ["Remove one marker from this color's 'Beef' row"],
        },
      ],
    },
    {
      metaClass: "mh",
      count: 2,
      customFontSize: gSmallerFontSize,
      textSections: [
        {
          subsections: ["This color has 'Beef' with itself (mark the red X)"],
        },
        {
          subsections: [
            "For any contiguous clusters of 3 or more occupied rooms of this color: Score +1 per sector.",
          ],
        },
      ],
      //
    },
    {
      metaClass: "mh",
      count: 2,
      customFontSize: gSmallerFontSize,
      textSections: [
        {
          subsections: [
            "Score +1 for each occupied sector of this color adjacent to a buffer",
          ],
        },
        {
          subsections: [
            "Score -1 for each occupied sector of this color adjacent to a buffer",
          ],
        },
      ],
    },
    {
      metaClass: "mh",
      count: 2,
      customFontSize: gSmallerFontSize,
      textSections: [
        {
          subsections: [
            "Score +1 for each occupied sector of this color adjacent to the edge of your tableau",
          ],
        },
        {
          subsections: [
            "Score -1 for each occupied sector of this color adjacent to the edge of your tableau",
          ],
        },
      ],
    },
    {
      metaClass: "mh",
      count: 2,
      textSections: [
        {
          subsections: ["Add two markers to this color's Beef column."],
        },
        {
          subsections: ["Add two markers to this color's Beef row."],
        },
      ],
    },
    {
      metaClass: "mh",
      count: 2,
      textSections: [
        {
          subsections: [
            "Player with the most occupied rooms of this color score +7.",
          ],
        },
        {
          subsections: [
            "Player with the fewest occupied rooms of this color score -7.",
          ],
        },
      ],
    },
  ];

  function getCardConfigs() {
    return gMHSpecialCardCConfigs;
  }

  // This returned object becomes the defined value of this module
  return {
    getCardConfigs: getCardConfigs,
  };
});
