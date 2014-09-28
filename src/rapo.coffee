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

        oPage.set "onResourceRequested", ( oRequest ) ->
            console.log "Request (#{ ++iRequests }):", "ID:#{ oRequest.id }", oRequest.url
            # console.log "Request:", JSON.stringify oRequest, undefined, 4
            # TODO : analyze & store request

        oPage.set "onResourceReceived", ( oResponse ) ->
            console.log "Response (#{ ++iResponses }):", "ID:#{ oResponse.id }", oResponse.url
            # console.log "Response:", JSON.stringify oResponse, undefined, 4
            # TODO : analyze & store response, build metrics

        oPage.open oOptions.url, ( sStatus ) ->
            console.log "Total Requests:", iRequests
            console.log "Total Responses:", iResponses
            fNext? null, {}

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
