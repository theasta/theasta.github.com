module.exports = function (grunt) {
  grunt.initConfig({
      uglify: {
          main: {
              options: {
                  sourceMap: true
              },
              files: {
                  "source/js/script.js": [ "source_/js/*.js" ]
              }

          }
      },
      cssmin: {
          main: {
              files: {
                  "source/css/style.css": [ "source_/css/*.css" ]
              }
          }
      }
  });

  require('load-grunt-tasks')(grunt);

  grunt.registerTask("assets", ["uglify", "cssmin"]);

};