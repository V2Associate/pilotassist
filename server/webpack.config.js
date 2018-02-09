const path = require("path");
const webpack = require("webpack");

const config = {
  context: path.join(__dirname, "client"),
  entry: {
    app: "./index.jsx"
  },
  output: {
    path: path.join(__dirname, "public/dist"),
    filename: "pilotassist.bundle.js",
    publicPath: "/public/dist/"
  },
  module: {
    rules: [
      {
        enforce: "pre",
        loader: "eslint-loader",
        test: /\.jsx?$/,
        exclude: "/node_modules/"
      },
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: "babel-loader"
      }
    ]
  },
  resolve: {
    modules: [path.join(__dirname, "node_modules")],
    extensions: [".js", ".jsx", ".json"]
  },
  plugins: []
};

if (process.env.NODE_ENV === "production") {
  config.plugins.push(new webpack.optimize.UglifyJsPlugin({ minimize: true }));
} else {
  config.devtool = "cheap-eval-source-map";
  config.devServer = {
    publicPath: "/public/",
    port: 5000,
    host: "0.0.0.0",
    historyApiFallback: true
  };
}

module.exports = config;
