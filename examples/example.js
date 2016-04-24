"use strict";

var ploper = require('..');

// load plopfile and specify custom output target
var plop = ploper.plop(__dirname + '/generator/plopfile', __dirname + '/temp');

plop.prompt('[EXAMPLE] Select an action to perform').then(plop.run).then(plop.report).catch(function (err) {
  console.error('[ERROR]'.red, err.message, err.stack);
  process.exit(1);
});

