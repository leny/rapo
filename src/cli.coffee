###
 * rapò
 * https://github.com/leny/rapo
 *
 * JS/COFFEE Document - /cli.js - cli entry point, commander setup and runner
 *
 * Copyright (c) 2014 Leny
 * Licensed under the MIT license.
###

"use strict"

pkg = require "../package.json"

rapo = require "./rapo.js"

chalk = require "chalk"
error = ( oError ) ->
    console.log chalk.bold.red "✘ #{ oError }."
    process.exit 1
( spinner = require "simple-spinner" )
    .change_sequence [
        "◓"
        "◑"
        "◒"
        "◐"
    ]

( program = require "commander" )
    .version pkg.version
    .usage "[options] <urm>"
    .description "Performance reviews for websites, using PhantomJS."
    .parse process.argv

console.log "There's so many things TODO here... :)"