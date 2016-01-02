module.exports = function (config) {
    config.set({
        basePath: '',
        frameworks: ['jasmine'],
        files: [
            'client/formula.js',
            'spec/*.js'
        ],
        browsers: ['Chrome'],
        singleRun: true,
        reporters: ['progress', 'coverage'],
        preprocessors: {
            'client/formula.js': ['coverage']
        }
    });
};