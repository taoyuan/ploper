"use strict";

var path = require('path');
var fs = require('fs-extra');
var colors = require('colors');
var inquirer = require('inquirer');

/**
 * Load plopfile, enhance plop and return the plop instance.
 *
 * @param {String} plopfile The plopfile path.
 * @param {String|Object} [output] The output directory where files generated. Default is same with plopfile.
 * @param {Object} [options]
 * @returns {*}
 */
exports.plop = function (plopfile, output, options) {
  var logic = require('plop/mod/logic');
  var plop = require('plop/mod/plop-base');

  if (typeof output !== 'string') {
    options = output;
    output = null;
  }
  options = options || {};
  output = output || options.output || path.dirname(plopfile);

  if (!fs.existsSync(output)) {
    fs.mkdirpSync(output);
  }

  Object.defineProperty(plop, 'generators', {
    get: function () {
      return plop.getGeneratorList();
    }
  });

  /**
   * Resolve output file from output
   *
   * @param file
   * @returns {string}
     */
  plop.resolve = function (file) {
    return path.resolve(output, file);
  };

  /**
   * Prompt to select generator
   *
   * @param message
   * @returns {Promise}
     */
  plop.prompt = function (message) {
    message = message || '[PLOP]'.blue + ' Please choose a generator.';
    var generators = plop.getGeneratorList();
    return inquirer.prompt([{
      type: 'list',
      name: 'generator',
      message: message,
      choices: generators.map(function (g) {
        return {
          name: g.name + colors.gray(!!g.description ? ' - ' + g.description : ''),
          value: g.name
        };
      })
    }]).then(function (result) {
      return result.generator;
    });
  };

  /**
   *
   * @param {String} generator The generator name selected
   * @returns {Promise}
   */
  plop.run = function (generator) {
    return logic.getPlopData(generator).then(logic.executePlop);
  };

  /**
   * Report the result to console for run
   *
   * @param result
   */
  plop.report = function (result) {
    result.changes.forEach(function (line) {
      console.log('[SUCCESS]'.green, line.type, line.path);
    });
    result.failures.forEach(function (line) {
      console.log('[FAILED]'.red, line.type, line.path, line.error);
    });
  };

  plop.output = output;
  plop.folder = path.basename(output);
  plop.options = options;
  plop.setPlopfilePath(path.dirname(plopfile));

  // load plopfile
  require(plopfile)(plop);

  return plop;
};
