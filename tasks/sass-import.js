/*
 * grunt-sass-import
 * https://github.com/eduardoboucas/grunt-sass-import
 *
 * Copyright (c) 2015 Eduardo Boucas
 * Licensed under the MIT license.
 */

'use strict';

var nodePath = require('path');

module.exports = function(grunt) {
  grunt.registerMultiTask('sass_import', 'Glob functionality for loading Sass partials', function() {
    var allowedExtensions = ['.scss'];
    var includeExtension = false;

    var options = this.options({
      includeExtension: false,
      basePath: ''
    });

    this.files.forEach(function (file) {
      var output = '';
      var destRoot = nodePath.dirname(options.basePath + file.dest);

      file.orig.src.forEach(function (path) {
        var resultFiles = [];

        // Advanced syntax
        if (typeof path == 'object') {
          // Handling *first* files
          if ('first' in path) {
            grunt.file.expand(options.basePath + path.first).forEach(function (match) {
              var file = splitFilename(match);

              // Discard if extension is now allowed
              if (allowedExtensions.indexOf(file.extension) == -1) {
                return;
              }

              resultFiles.push(options.includeExtension ? match : file.name);
            });
          }

          // Handling regular files
          grunt.file.expand(options.basePath + path.path).forEach(function (match) {
            var file = splitFilename(match);

              // Discard if extension is now allowed
              if (allowedExtensions.indexOf(file.extension) == -1) {
                return;
              }

              // Discard if already included in *first*
              if (('first' in path) && (options.basePath.concat(path.first).indexOf(file.name) != -1)) {
                return;
              }

              // Discard if present in *last*
              if (('last' in path) && (options.basePath.concat(path.last).indexOf(file.name) != -1)) {
                return;
              }

              resultFiles.push(options.includeExtension ? match : file.name);
          });

          // Handling *last* files
          if ('last' in path) {
            grunt.file.expand(options.basePath + path.last).forEach(function (match) {
              var file = splitFilename(match);

              // Discard if extension is now allowed
              if (allowedExtensions.indexOf(file.extension) == -1) {
                return;
              }

              resultFiles.push(options.includeExtension ? match : file.name);
            });
          }
        } else {
          // Simple syntax
          grunt.file.expand(options.basePath + path).forEach(function (match) {
            var file = splitFilename(match);

            // Discard if extension is now allowed
            if (allowedExtensions.indexOf(file.extension) == -1) {
              return;
            }

            resultFiles.push(options.includeExtension ? match : file.name);
          });
        }

        resultFiles.forEach(function (file) {
          file = nodePath.relative(destRoot, file).replace(/\\/g, '/');
          output += buildOutputLine(file.replace(options.basePath, ''));
        });
      });

      grunt.file.write(options.basePath + file.dest, output);
      grunt.log.writeln('File "' + file.dest + '" created.');
    });

    function splitFilename(filename) {
      var dot = filename.lastIndexOf('.');

      return {name: filename.substring(0, dot), extension: filename.substring(dot)};
    }

    function buildOutputLine(file) {
      return '@import \'' + file + '\';\n';
    }
  });
  
  grunt.registerMultiTask('sassImport', 'Glob functionality for loading Sass partials', function () {
    grunt.config.set('sass_import', grunt.config.get('sassImport'));
    grunt.task.run('sass_import');
  });

};
