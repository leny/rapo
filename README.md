# rapò

[![NPM version](http://img.shields.io/npm/v/rapo.svg)](https://www.npmjs.org/package/rapo) ![Dependency Status](https://david-dm.org/leny/rapo.svg) ![Downloads counter](http://img.shields.io/npm/dm/rapo.svg)

> Performance reviews for websites, using PhantomJS.

* * *

## How it works ?

_soon_

## Usage as node.js module

### Installation

To use **rapò** as a node.js module, install it first to your project.

    npm install --save rapo
    
### Usage

Using **rapò** is simple, after require it : 

    rapo = require( "rapo" );
    
    rapo( "http://awesome.site.me", {}, function( oError, oResults ) {
        // do awesome things here.
    } );
    
### Signature

    rapo( sURL, [ oOptions [, fCallback ] ] )
    
#### Arguments

- `sURL` is the URL of the site to test
- `oOptions` is an object of options (_soon_)
- `fCallback` is the callback function, which returns two arguments : 
    - `oError`: if an error occurs during the process
    - `oResults`: an object of collected informations
    
## Usage as *command-line tool*

### Installation

To use **rapò** as a command-line tool, it is preferable to install it globally.

    (sudo) npm install -g rapo

### Usage

Using **rapò** is simple: 

    rapo [options] <URL>
    
    Options:

        -h, --help             output usage information
        -V, --version          output the version number

#### Options

##### help (`-h`,`--help`)

Output usage information.

##### version (`-v`,`--version`)

Output **rapò**' version number.

## Contributing

In lieu of a formal styleguide, take care to maintain the existing coding style. Lint your code using [Grunt](http://gruntjs.com/).

## Release History

* **0.0.0**: Starting project (*28/09/14*)
    
## License
Copyright (c) 2014 Leny  
Licensed under the MIT license.
