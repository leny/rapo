###
 * rapò
 * https://github.com/leny/rapo
 *
 * JS/COFFEE Document - /metrics/resources-collector.js - Page Resources Collector
 *
 * Copyright (c) 2014 Leny
 * Licensed under the MIT license.
###

"use strict"

module.exports = class ResourcesCollector

    _oResources = {}

    _oTimes =
        start: 0
        "DOMContentLoaded": 0
        load: 0
        absolute: []

    constructor: ( oPage ) ->
        oPage.onConsoleMessage ( sMessage ) ->
            if sMessage.indexOf( "_documentIsLoaded:" ) > -1
                _oTimes.load = +( sMessage.replace( "_documentIsLoaded:", "" ).trim() )
            if sMessage.indexOf( "_DOMContentIsLoaded:" ) > -1
                _oTimes[ "DOMContentLoaded" ] = +( sMessage.replace( "_DOMContentIsLoaded:", "" ).trim() )

        oPage.set "onLoadStarted", ->
            _oTimes.start = ( new Date() ).getTime()
            oPage.evaluate ->
                # TODO DOMContentLoaded is not fired.
                document.addEventListener "DOMContentLoaded", ( -> console.log "_DOMContentIsLoaded:", ( new Date() ).getTime() ), no
                document.addEventListener "load", ( console.log "_documentIsLoaded:", ( new Date() ).getTime() ), no

        oPage.set "onResourceRequested", _createResource
        oPage.set "onResourceReceived", _storeResponse
        # TODO : onResourceError
        # TODO : onResourceTimeout

    generateStats: ->
        oMetrics =
            total:
                time:
                    "DOMContentLoaded": _oTimes[ "DOMContentLoaded" ] - _oTimes.start
                    load: _oTimes.load - _oTimes.start
                    total: Math.max.apply null, _oTimes.absolute
                requests: 0
                size: 0
                resources: []
            documents:
                requests: 0
                size: 0
                resources: []
            fonts:
                requests: 0
                size: 0
                resources: []
            images:
                requests: 0
                size: 0
                resources: []
            scripts:
                requests: 0
                size: 0
                resources: []
            stylesheets:
                requests: 0
                size: 0
                resources: []
            other:
                requests: 0
                size: 0
                resources: []

        for sID, oRawResource of _oResources

            oResource = _formatResource oRawResource

            oMetrics.total.requests++
            oMetrics.total.size += oRawResource.size
            oMetrics.total.resources[ ( ( +sID ) - 1 ) ] = oResource

            oMetrics[ oRawResource.type ].requests++
            oMetrics[ oRawResource.type ].size += oRawResource.size
            oMetrics[ oRawResource.type ].resources.push oResource

        oMetrics

    _loadStarted = ->
        _oTimes.start = ( new Date() ).getTime()

    _DOMContentIsLoaded = ->
        console.log "_DOMContentIsLoaded:", ( new Date() ).getTime()
        # _oTimes[ "DOMContentLoaded" ] = ( new Date() ).getTime()

    _documentIsLoaded = ->
        console.log "_documentIsLoaded:", ( new Date() ).getTime()
        # _oTimes.load = ( new Date() ).getTime()

    _createResource = ( oRequest ) ->
        _oTimes.start = ( new Date oRequest.time ).getTime() if oRequest.id is 1
        _oResources[ oRequest.id ] =
            url: oRequest.url
            method: oRequest.method
            time:
                request: ( new Date oRequest.time ).getTime()

    _storeResponse = ( oResponse ) ->
        if oResponse.stage is "start"
            _oResources[ oResponse.id ].size = oResponse.bodySize
            _oResources[ oResponse.id ].mime = oResponse.contentType
            _oResources[ oResponse.id ].type = _getTypeOf oResponse.contentType
            _oResources[ oResponse.id ].status = oResponse.status
            _oResources[ oResponse.id ].time.send = ( new Date oResponse.time ).getTime()
        if oResponse.stage is "end"
            _oResources[ oResponse.id ].time.end = ( iEnd = ( new Date oResponse.time ).getTime() )
            _oTimes.absolute.push iEnd - _oTimes.start

    _formatResource = ( oRawResource ) ->
        oResource =
            url: oRawResource.url
            method: oRawResource.method
            time:
                wait: oRawResource.time.send - oRawResource.time.request
                receive: oRawResource.time.end - oRawResource.time.send

    _getTypeOf = ( sMimeType ) ->
        switch
            when sMimeType.match /text\/html/i then "documents"
            when sMimeType.match /text\/css/i then "stylesheets"
            when sMimeType.match /javascript/i then "scripts"
            when sMimeType.match /image\/*/i then "images"
            when sMimeType.match /font|svg\+xml/i then "fonts" # FIXME dissociate svg fonts & svg images :(
            else "other"
