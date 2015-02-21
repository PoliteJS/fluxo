/*

this configuration executes all the specs from `test/` budling the 
required source files from `src/`.

it generates a code coverage report in `text-coverage`.

*/

'use strict';

module.exports = function(config) {
    config.set({
        
        // base path that will be used to resolve all patterns (eg. files, exclude)
        basePath: '',

        // list of files / patterns to load in the browser
        files: [
            'test/**/*.spec.js'
        ],

        // start these browsers
        // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
        browsers: [
            'PhantomJS', 
            // 'Chrome', 
            // 'ChromeCanary', 
            // 'Firefox', 
            // 'Safari', 
            // 'Opera'
        ],

        // frameworks to use
        // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
        frameworks: [
            'mocha', 
            'chai', 
            'sinon'
        ],

        // test results reporter to use
        // possible values: 'dots', 'progress'
        // available reporters: https://npmjs.org/browse/keyword/karma-reporter
        reporters: [
            'progress',
            'coverage', 
            'osx'
        ],

        // configure the way Karma reports the code coverage analysys
        coverageReporter: {
            reporters: [
                { type: 'html', dir: 'test-coverage' },
                { type: 'text-summary', dir: 'test-coverage' }
            ]
        },
        
        // preprocess matching files before serving them to the browser
        // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
        preprocessors: {
            'test/**/*.spec.js' : ['webpack']
        },

        webpack: {
            resolve: {
                modulesDirectories: [
                    'node_modules'
                ]
            },
            module: {
                postLoaders: [{
                    test: /\.js$/,
                    exclude: /(node_modules|specs)\//,
                    loader: 'istanbul-instrumenter'
                }]
            }
        },

        // web server port
        port: 9876,


        // enable / disable colors in the output (reporters and logs)
        colors: true,


        // level of logging
        // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
        logLevel: config.LOG_INFO,


        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: true,


        // Continuous Integration mode
        // if true, Karma captures browsers, runs the tests and exits
        singleRun: false
    });
};
