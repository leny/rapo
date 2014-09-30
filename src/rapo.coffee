###
 * rapò
 * https://github.com/leny/rapo
 *
 * JS/COFFEE Document - /rapo.js - module entry point
 *
 * Copyright (c) 2014 Leny
 * Licensed under the MIT license.
###

"use strict"

phantom = require "phantom"

ResourcesCollector = require "./metrics/resources-collector.js"

fGetResultsForViewportSize = ( oPhantom, oOptions, fNext ) ->

    # TODO
    # Compute data as total requests size
    # Time
    # …

    iRequests = 0
    iResponses = 0

    oPhantom.createPage ( oPage ) ->
        oPage.set "viewportSize",
            width: oOptions.width
            height: oOptions.height

        oResourceCollector = new ResourcesCollector oPage

        oPage.open oOptions.url, ( sStatus ) ->
            fNext? null, oResourceCollector.generateStats()

module.exports = ( sURL, oOptions = {}, fNext = null ) ->

    # check url

    return fNext? new Error "no URL given!" unless sURL # TODO : check URL consistence

    # parse arguments

    if oOptions instanceof Function and fNext is null
        fNext = oOptions
        oOptions = {}

    phantom.create ( oPhantom ) ->

        # TMP code
        oMobileViewportOptions =
            url: sURL
            width: 320
            height: 480

        fGetResultsForViewportSize oPhantom, oMobileViewportOptions, ( oError, oResults ) ->
            fNext? null, oResults

        # TODO : multiple viewport sizes analysis
