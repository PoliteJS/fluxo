
/*

this is the standard configuration to generate `build/fluxo.js` file which 
contains the Javascript library exported by this project.

run `webpack` to genereate a new build.  
(you need _Webpack_ to be installed globally on your machine)

see `Gulpfile.js` for more advanced tasks and configurations.

*/

'use strict';

module.exports = {
    entry: {
        'Fluxo' : './src/fluxo.js'
    },
    output: {
        filename: './build/[name].js',
        libraryTarget: 'umd',
        library: ['[name]']
    },
    resolve: {
        modulesDirectories: [
            'node_modules'
        ]
    },
    debug: true,
    devtool: '#source-map',
    watchDelay: 200
};
