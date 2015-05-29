module.exports = function(grunt) {

	'use strict';

	grunt.initConfig({
		// config
		pkg : grunt.file.readJSON('package.json'),
		
		// non-task-specific properties
		srcPath: 'src/javascript',
		distPath: 'public/javascript',
		
		// tasks
		autoprefixer: {
			no_dist : {
				src: ['src/stylesheets/style.min.css']
			}
		},
		
		less : {
			options : {
				compress : true
			},
			dist : {
				files : {
					'src/stylesheets/style.min.css' : [ 'src/less/**/*.less']
				}
			}
		},
		
		watch : {
			css : {
				files: ['src/less/**/*.less'],
				tasks : ['less', 'autoprefixer', 'concat', 'clean']
			},
			javascript : {
				files: ['<%= srcPath %>/engine/**/*.js'],
				tasks : ['browserify', 'uglify']
			}
		},
		
		jshint : {
			options: {
		      curly: true,
		    },
			files : [ 'Gruntfile.js', '<%= srcPath %>/**/*' ]
		},
		
		browserify: {
	      dist: {
	        src: ['<%= srcPath %>/engine/**/*.js'],
	        dest: '<%= distPath %>/bundle.js'
	      }
		},
		
		uglify : {
			options : {
				banner : '/* Version: <%= pkg.version %>, <%= grunt.template.today("dd-mm-yyyy") %> */\n'
			},
			dist : {
				files : {
					'<%= distPath %>/bundle.min.js' : [ '<%= browserify.dist.dest %>' ]
				}
			}
		},
		
		concat : {
			options : {
				separator : '\n'
			},
			dist : {
				src : [ 'src/stylesheets/bootstrap.min.css', 'src/stylesheets/bootstrap-theme.min.css', 'src/stylesheets/style.min.css' ],
				dest : 'public/stylesheets/bundle.min.css'
			}
		},
		
		clean: ['src/stylesheets/style.min.css']
	});

	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-less');
	grunt.loadNpmTasks('grunt-autoprefixer');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-browserify');

	grunt.registerTask('default', [ 'browserify', 'uglify', 'less', 'autoprefixer', 'concat', 'clean' ]);
};