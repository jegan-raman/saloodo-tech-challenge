const path = require('path');

module.exports = {
    entry: './src/index.js',
    output: {
        path: path.resolve(__dirname, 'public'),
        filename: 'bundle.js'
    },
    module: {
        rules: [
            { 
                test: /\.jsx?$/, 
                loader: 'babel-loader', 
                exclude: /node_modules/ 
            },
            {
                test: /\.css$/,
                use: [ 'style-loader', 'css-loader' ]
            },
            {
                test: /\.(woff|woff2|eot|ttf|svg)$/,
                loader: 'url-loader?limit=100000'
            }
        ]
    },
    devServer: {
        contentBase: './public',
        host: '0.0.0.0',
        compress: true,
        port: 9000, // port number
        historyApiFallback: true,
        quiet: true,
        publicPath: '/'
    },
    resolve: {
        alias: {
            Actions: path.resolve(__dirname, 'src/actions/'),
            Components: path.resolve(__dirname, 'src/components/'),
            Util: path.resolve(__dirname, 'src/util/'),
            Constants: path.resolve(__dirname, 'src/constants/'),
            Api: path.resolve(__dirname, 'src/api/')
        }
    },
};
