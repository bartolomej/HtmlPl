const path = require('path');

module.exports = {
    mode: 'production',
    entry: {
        'bundle.js': [
            path.resolve(__dirname, './src/targets/web.ts')
        ]
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
            {
                test: /.js$/,
                use: 'babel-loader'
            }
        ],
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
    },
    plugins: [],
    output: {
        path: path.resolve(__dirname, 'docs'),
        filename: '[name]'
    }
};
