module.exports = {
    webpack: {
      configure: (webpackConfig) => {
        webpackConfig.ignoreWarnings = [
          {
            module: /@turf\/jsts/,
            message: /Failed to parse source map/,
          },
        ];
        return webpackConfig;
      },
    },
  };
  