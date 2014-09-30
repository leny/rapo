
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
var ResourcesCollector, fGetResultsForViewportSize, phantom;

phantom = require("phantom");

ResourcesCollector = require("./metrics/resources-collector.js");

fGetResultsForViewportSize = function(oPhantom, oOptions, fNext) {
  var iRequests, iResponses;
  iRequests = 0;
  iResponses = 0;
  return oPhantom.createPage(function(oPage) {
    var oResourceCollector;
    oPage.set("viewportSize", {
      width: oOptions.width,
      height: oOptions.height
    });
    oResourceCollector = new ResourcesCollector(oPage);
    return oPage.open(oOptions.url, function(sStatus) {
      return typeof fNext === "function" ? fNext(null, oResourceCollector.generateStats()) : void 0;
    });
  });
};

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
    var oMobileViewportOptions;
    oMobileViewportOptions = {
      url: sURL,
      width: 320,
      height: 480
    };
    return fGetResultsForViewportSize(oPhantom, oMobileViewportOptions, function(oError, oResults) {
      return typeof fNext === "function" ? fNext(null, oResults) : void 0;
    });
  });
};
