#!/usr/bin/env node
/*
 * rapò
 * https://github.com/leny/rapo
 *
 * JS/COFFEE Document - /cli.js - cli entry point, commander setup and runner
 *
 * Copyright (c) 2014 Leny
 * Licensed under the MIT license.
 */
"use strict";
var chalk, error, pkg, program, rapo, sURL, spinner;

pkg = require("../package.json");

rapo = require("./rapo.js");

chalk = require("chalk");

error = function(oError) {
  console.log(chalk.bold.red("✘ " + oError + "."));
  return process.exit(1);
};

(spinner = require("simple-spinner")).change_sequence(["◓", "◑", "◒", "◐"]);

(program = require("commander")).version(pkg.version).usage("[options] <url>").description("Performance reviews for websites, using PhantomJS.").parse(process.argv);

if (!(sURL = program.args[0])) {
  error("No URL given!");
}

spinner.start(50);

rapo(sURL, {}, function(oError, oResults) {
  spinner.stop();
  return console.log(oResults);
});
