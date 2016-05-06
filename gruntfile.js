// Grunt File should be changed to fit angular.

module.exports = function(grunt) {
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-compass');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-env');
  grunt.loadNpmTasks('grunt-shell');
  grunt.loadNpmTasks('grunt-concurrent');
  var frontendPort = parseInt(grunt.option('fport')) || 3000;
  grunt.initConfig({
    concurrent: {
      server: {
        tasks: ['shell:nm', 'watch'],
        options: {
          logConcurrentOutput: true
        }
      }
    },
    env: {
      stuff: {
        PORT: 4000,
        JWT_SECRET: 'LMAOTHISSECRETISEASYTOGUESS',
        FRONTENDPORT: frontendPort
      }
    },
    shell: {
      nm: {
        command: 'nodemon --watch app.js --watch models/ -L app.js'
      },
      prod: {
        command: 'node app.js'
      }
    },
    clean: ["public/js"],
    uglify: {
      my_target: {
        options: {
          mangle: false
        },
        files: {
          'public/js/script.js': ['source_js/script.js'],
          'public/js/app.js': ['source_js/app.js'],
          'public/js/controllers.js': ['source_js/controllers.js'],
          'public/js/services.js': ['source_js/services.js'],
        } //files
      } //my_target
    }, //uglify
    copy: {
      files: {
            expand : true,
            dest   : 'public/js',
            cwd    : 'js',
            src    : [
              '**/*.js'
            ]
      },
      chat_service: {
        files: [{
          cwd: 'node_modules/goodgoodstudy-server/client/',
          src: 'chatservice.js',
          dest: 'public/chat_lib/',
          expand: true
        }]
      }
    },
    compass: {
      dev: {
        options: {
          config: 'compass_config.rb'
        } //options
      } //dev
    }, //compass
    watch: {
      options: { livereload: true },
      scripts: {
        files: ['source_js/*.js'],
        tasks: ['clean','uglify']
      }, //script
      sass: {
        files: ['source_sass/*.scss'],
        tasks: ['compass:dev']
      }, //sass
      html: {
        files: ['public/*.html']
      }
    }
  }) //initConfig
  grunt.registerTask('default', ['clean', 'copy:chat_service', 'uglify', 'env:stuff', 'concurrent:server']);
  grunt.registerTask('prod', ['compass', 'clean', 'copy:chat_service', 'uglify', 'env:stuff', 'shell:prod']);
} //exports
