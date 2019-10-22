var path = require('path');
var HtmlWebpackPlugin =  require('html-webpack-plugin');

module.exports = {
    entry : './app/index.js',
    output : {
        path : path.resolve(__dirname , 'dist'),
        filename: 'index_bundle.js',
        publicPath: "/",
    },
    // target:"node",
    // to resolve can't resolve fs module, add the following line
    // node: {
    //     fs: "empty"
    // },
    module : {
        rules : [
            {test : /\.(js)$/, use:{
                loader: 'babel-loader',
                    options: {
                        // exclude: "/(node_modules|bower_components)/",
                        customize: require.resolve(
                        'babel-preset-react-app/webpack-overrides'
                        ),
                    }
                }
            },
            {test : /\.css$/, use:['style-loader', 'css-loader']}
        ]
    },
    devServer: {
        historyApiFallback: true,
    },
    mode:'development',
    plugins : [ 
        new HtmlWebpackPlugin ({
            template : 'app/index.html'
        })
    ]
}
