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

module.exports = ( sURL, oOptions = {}, fNext = null ) ->

    # check url

    return fNext? new Error "no URL given!" unless sURL # TODO : check URL consistence

    # parse arguments

    if oOptions instanceof Function and fNext is null
        fNext = oOptions
        oOptions = {}

    # phantom magic (basic, cf. https://www.npmjs.org/package/phantom)

    phantom.create ( oPhantom ) ->
        oPhantom.createPage ( oPage ) ->
            oPage.open sURL, ( sStatus ) ->
                console.log "opened page? ", sStatus
                oPage.evaluate ( -> document.title ), ( sResult ) ->
                    console.log 'Page title is ' + sResult
                    oPhantom.exit()



                    fNext? null, {}

    # TODO
    # Fetch all requests
    # Fetch requests by viewport size
    # Compute data as total requests size
    # …
