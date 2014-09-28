
/*
 * rapò
 * https://github.com/leny/rapo
 *
 * JS/COFFEE Document - /rapo.js - module entry point
 *
 * Copyright (c) 2014 Leny
 * Licensed under the MIT license.
 */
"use strict";
var phantom;

phantom = require("phantom");

module.exports = function(sURL, oOptions, fNext) {
  if (oOptions == null) {
    oOptions = {};
  }
  if (fNext == null) {
    fNext = null;
  }
  if (!sURL) {
    return typeof fNext === "function" ? fNext(new Error("no URL given!")) : void 0;
  }
  if (oOptions instanceof Function && fNext === null) {
    fNext = oOptions;
    oOptions = {};
  }
  return phantom.create(function(oPhantom) {
    return oPhantom.createPage(function(oPage) {
      return oPage.open(sURL, function(sStatus) {
        console.log("opened page? ", sStatus);
        return oPage.evaluate((function() {
          return document.title;
        }), function(sResult) {
          console.log('Page title is ' + sResult);
          oPhantom.exit();
          return typeof fNext === "function" ? fNext(null, {}) : void 0;
        });
      });
    });
  });
};
