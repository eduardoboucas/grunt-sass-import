/*
 * grunt-sass-import
 * https://github.com/eduardoboucas/grunt-sass-import
 *
 * Copyright (c) 2015 Eduardo Boucas
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    // Configuration to be run (and then tested).
    sass_import: {
      options: {
        basePath: 'sass/'
      },
      dist: {
        files: {
          'main.scss': [{last: 'global/_global.scss', path: 'global/*'}, 'mixins/*']
        }
      }
    },
  });

  // Actually load this plugin's task(s).
  grunt.loadTasks('tasks');

  grunt.registerTask('default', ['sass_import']);
};