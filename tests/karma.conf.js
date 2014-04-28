module.exports = function(config){
  config.set({

    basePath : '../',

    files : [
      'tests/rtd/lib/*-stubs.js',
      'tests/rtd/lib/*-stubs.coffee',
      'tests/helper/jquery.js',
      '.meteor/local/bower/angular/angular.js',
      '.meteor/local/bower/angular-route/angular-route.js',
      '.meteor/local/bower/angular-animate/angular-animate.js',
      'tests/helper/angular-mocks.js',
      'tests/helper/angularite-mock.js',
      'client/**/*.coffee',
      'client/**/*.js',
      'server/**/*.js',
      'common/**/*.js',
      'tests/unit/**/*.js'
    ],

    autoWatch : true,

    frameworks: ['jasmine'],

    browsers : ['Chrome'],

    plugins : [
            'karma-chrome-launcher',
            'karma-firefox-launcher',
            'karma-jasmine',
            'karma-coffee-preprocessor'
            ],

    junitReporter : {
      outputFile: 'test_out/unit.xml',
      suite: 'unit'
    },

    preprocessors: {
      '**/*.coffee': ['coffee']
    }

  });
};