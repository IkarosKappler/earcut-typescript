"use strict";
/* Imports and exports for webpack */

// Expose all triangulation functions to the global scope, as an object called `earcut`.
globalThis.earcut = require("./earcut.js").earcut;
