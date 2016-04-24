"use strict";

var path = require('path');
var fs = require('fs-extra');
var colors = require('colors');
var inquirer = require('inquirer');

/**
 * Load plopfile, enhance plop and return the plop instance.
 *
 * @param {String} plopfile The plopfile path.
 * @param {String} [target] The target directory where files generated. Default is same with plopfile.
 * @returns {*}
 */
exports.plop = function (plopfile, target) {
  var logic = require('plop/mod/logic');
  var plop = require('plop/mod/plop-base');

  target = target || path.dirname(plopfile);

  if (!fs.existsSync(target)) {
    fs.mkdirpSync(target);
  }

  Object.defineProperty(plop, 'generators', {
    get: function () {
      return plop.getGeneratorList();
    }
  });

  /**
   * Resolve output file from target
   *
   * @param file
   * @returns {string}
     */
  plop.resolve = function (file) {
    return path.resolve(target, file);
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

  plop.setPlopfilePath(path.dirname(plopfile));

  // load plopfile
  require(plopfile)(plop);

  return plop;
};
