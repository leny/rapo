
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
var fGetResultsForViewportSize, phantom;

phantom = require("phantom");

fGetResultsForViewportSize = function(oPhantom, oOptions, fNext) {
  var iRequests, iResponses;
  iRequests = 0;
  iResponses = 0;
  return oPhantom.createPage(function(oPage) {
    oPage.set("viewportSize", {
      width: oOptions.width,
      height: oOptions.height
    });
    oPage.set("onResourceRequested", function(oRequest) {
      return console.log("Request (" + (++iRequests) + "):", "ID:" + oRequest.id, oRequest.url);
    });
    oPage.set("onResourceReceived", function(oResponse) {
      return console.log("Response (" + (++iResponses) + "):", "ID:" + oResponse.id, oResponse.url);
    });
    return oPage.open(oOptions.url, function(sStatus) {
      console.log("Total Requests:", iRequests);
      console.log("Total Responses:", iResponses);
      return typeof fNext === "function" ? fNext(null, {}) : void 0;
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
