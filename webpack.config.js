const webpack = require("webpack");
const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");

const mode =
    process.env.NODE_ENV === "production" ? "production" : "development";

console.log(`NOTE: building in ${mode} mode`);

const commonConfig = {
    context: path.resolve(__dirname, "src/"),

    mode,

    // Enable sourcemaps for debugging webpack's output.
    devtool: "source-map",

    resolve: {
        // Add '.ts' and '.tsx' as resolvable extensions.
        extensions: [".ts", ".tsx", ".js"],
    },

    module: {
        rules: [
            // All files with a '.ts' or '.tsx' extension will be handled by 'awesome-typescript-loader'.
            { test: /\.tsx?$/, loader: "awesome-typescript-loader" },

            // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
            { enforce: "pre", test: /\.js$/, loader: "source-map-loader" },
        ],
    },
};

const serverConfig = {
    ...commonConfig,

    target: "node",

    node: {
        __dirname: false,
        __filename: false,
    },

    entry: {
        main: "./main.ts",
    },

    output: {
        filename: "main.js",
        path: path.resolve(__dirname, "dist/server/"),
    },
};

const clientConfig = {
    ...commonConfig,

    target: "web",

    entry: {
        index: "./index.tsx",
    },

    output: {
        filename: "index.js",
        path: path.resolve(__dirname, "dist/public/"),
    },

    // When importing a module whose path matches one of the following, just
    // assume a corresponding global variable exists and use that instead.
    // This is important because it allows us to avoid bundling all of our
    // dependencies, which allows browsers to cache those libraries between builds.
    externals: {
        react: "React",
        "react-dom": "ReactDOM",
    },

    plugins: [
        new CopyPlugin([
            {
                from: "../static",
                to: "static",
            },
            {
                from: `../index_${mode === "production" ? "dist" : "dev"}.html`,
                to: "index.html",
            },
        ]),
    ],
};

module.exports = [serverConfig, clientConfig];