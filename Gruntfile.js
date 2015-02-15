module.exports = function(grunt) {

	// Project configuration.
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		uglify: {
			options: {
				banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n',
				beautify: true,
				mangle: false
			},
			build: {
				files: {
					'js/app.min.js': [
						'js/app/src/**/*.js',
						'js/app/src/*.js',
						'js/src/**/*.js',
						'js/src/*.js',
					],
					'js/integrated.min.js': [
						'js/integrated/src/**/*.js',
						'js/integrated/src/*.js',
						'js/src/**/*.js',
						'js/src/*.js',
					],
					'js/admin.min.js' : [
						'js/admin/src/*.js'
					],
					'vendor/all.min.js' : [
						'vendor/angular/angular.min.js',
						'vendor/angular-enhance-text/build/angular-enhance-text.min.js',
						'vendor/angular-resource/angular-resource.min.js',
						'vendor/angular-sanitize/angular-sanitize.min.js',
						'vendor/jquery-autosize/jquery.autosize.min.js',
						'vendor/moment/min/moment.min.js',
						'vendor/rangyinputs-jquery-src/index.js',
						'vendor/strophe/strophe.min.js',
						'vendor/emojione/lib/js/emojione.min.js'
					]
				}
			}
		},
		cssmin: {
			combine: {
				files: {
					'css/main.min.css': [
						'css/src/*.css',
						'!css/admin',
						'!css/integrated'
					],
					'css/admin.min.css' : [
						'css/admin/src/*.css'
					]					,
					'css/integrated.min.css' : [
						'css/integrated/src/*.css'
					]
				}
			}
		},
		karma: {
			unit: {
				configFile: 'karma.conf.js'
			}
		},
		htmlmin: {
			dist: {
				options: {
					removeComments: true,
					collapseWhitespace: true
				},
				files: {
					'integrated.min.html': 'integrated.html'
				}
			}
		}

	});

	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-contrib-htmlmin');
	grunt.loadNpmTasks('grunt-karma');
	grunt.registerTask('default', ['uglify', 'cssmin', 'htmlmin']);

};