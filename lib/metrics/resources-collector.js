
/*
 * rapò
 * https://github.com/leny/rapo
 *
 * JS/COFFEE Document - /metrics/resources-collector.js - Page Resources Collector
 *
 * Copyright (c) 2014 Leny
 * Licensed under the MIT license.
 */
"use strict";
var ResourcesCollector;

module.exports = ResourcesCollector = (function() {
  var _DOMContentIsLoaded, _createResource, _documentIsLoaded, _formatResource, _getTypeOf, _loadStarted, _oResources, _oTimes, _storeResponse;

  _oResources = {};

  _oTimes = {
    start: 0,
    "DOMContentLoaded": 0,
    load: 0,
    absolute: []
  };

  function ResourcesCollector(oPage) {
    oPage.onConsoleMessage(function(sMessage) {
      if (sMessage.indexOf("_documentIsLoaded:") > -1) {
        _oTimes.load = +(sMessage.replace("_documentIsLoaded:", "").trim());
      }
      if (sMessage.indexOf("_DOMContentIsLoaded:") > -1) {
        return _oTimes["DOMContentLoaded"] = +(sMessage.replace("_DOMContentIsLoaded:", "").trim());
      }
    });
    oPage.set("onLoadStarted", function() {
      _oTimes.start = (new Date()).getTime();
      return oPage.evaluate(function() {
        document.addEventListener("DOMContentLoaded", (function() {
          return console.log("_DOMContentIsLoaded:", (new Date()).getTime());
        }), false);
        return document.addEventListener("load", console.log("_documentIsLoaded:", (new Date()).getTime()), false);
      });
    });
    oPage.set("onResourceRequested", _createResource);
    oPage.set("onResourceReceived", _storeResponse);
  }

  ResourcesCollector.prototype.generateStats = function() {
    var oMetrics, oRawResource, oResource, sID;
    oMetrics = {
      total: {
        time: {
          "DOMContentLoaded": _oTimes["DOMContentLoaded"] - _oTimes.start,
          load: _oTimes.load - _oTimes.start,
          total: Math.max.apply(null, _oTimes.absolute)
        },
        requests: 0,
        size: 0,
        resources: []
      },
      documents: {
        requests: 0,
        size: 0,
        resources: []
      },
      fonts: {
        requests: 0,
        size: 0,
        resources: []
      },
      images: {
        requests: 0,
        size: 0,
        resources: []
      },
      scripts: {
        requests: 0,
        size: 0,
        resources: []
      },
      stylesheets: {
        requests: 0,
        size: 0,
        resources: []
      },
      other: {
        requests: 0,
        size: 0,
        resources: []
      }
    };
    for (sID in _oResources) {
      oRawResource = _oResources[sID];
      oResource = _formatResource(oRawResource);
      oMetrics.total.requests++;
      oMetrics.total.size += oRawResource.size;
      oMetrics.total.resources[(+sID) - 1] = oResource;
      oMetrics[oRawResource.type].requests++;
      oMetrics[oRawResource.type].size += oRawResource.size;
      oMetrics[oRawResource.type].resources.push(oResource);
    }
    return oMetrics;
  };

  _loadStarted = function() {
    return _oTimes.start = (new Date()).getTime();
  };

  _DOMContentIsLoaded = function() {
    return console.log("_DOMContentIsLoaded:", (new Date()).getTime());
  };

  _documentIsLoaded = function() {
    return console.log("_documentIsLoaded:", (new Date()).getTime());
  };

  _createResource = function(oRequest) {
    if (oRequest.id === 1) {
      _oTimes.start = (new Date(oRequest.time)).getTime();
    }
    return _oResources[oRequest.id] = {
      url: oRequest.url,
      method: oRequest.method,
      time: {
        request: (new Date(oRequest.time)).getTime()
      }
    };
  };

  _storeResponse = function(oResponse) {
    var iEnd;
    if (oResponse.stage === "start") {
      _oResources[oResponse.id].size = oResponse.bodySize;
      _oResources[oResponse.id].mime = oResponse.contentType;
      _oResources[oResponse.id].type = _getTypeOf(oResponse.contentType);
      _oResources[oResponse.id].status = oResponse.status;
      _oResources[oResponse.id].time.send = (new Date(oResponse.time)).getTime();
    }
    if (oResponse.stage === "end") {
      _oResources[oResponse.id].time.end = (iEnd = (new Date(oResponse.time)).getTime());
      return _oTimes.absolute.push(iEnd - _oTimes.start);
    }
  };

  _formatResource = function(oRawResource) {
    var oResource;
    return oResource = {
      url: oRawResource.url,
      method: oRawResource.method,
      time: {
        wait: oRawResource.time.send - oRawResource.time.request,
        receive: oRawResource.time.end - oRawResource.time.send
      }
    };
  };

  _getTypeOf = function(sMimeType) {
    switch (false) {
      case !sMimeType.match(/text\/html/i):
        return "documents";
      case !sMimeType.match(/text\/css/i):
        return "stylesheets";
      case !sMimeType.match(/javascript/i):
        return "scripts";
      case !sMimeType.match(/image\/*/i):
        return "images";
      case !sMimeType.match(/font|svg\+xml/i):
        return "fonts";
      default:
        return "other";
    }
  };

  return ResourcesCollector;

})();
