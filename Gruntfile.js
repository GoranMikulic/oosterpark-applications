module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    includeSource: {
        options: {
          basePath: 'public',
          baseUrl: '/',
          templates: {
            html: {
              js: '<script src="{filePath}"></script>',
            }
          }
        },
        myTarget: {
          files: {
            'public/index.html': 'public/index.tpl.html'
          }
        }
      }
  });

  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-include-source');

  // Default task(s).
  grunt.registerTask('default', ['includeSource']);

};
