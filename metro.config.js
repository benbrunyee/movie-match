const { getDefaultConfig } = require("expo/metro-config");

module.exports = (() => {
  {
    const config = getDefaultConfig(__dirname);

    const { resolver, transformer } = config;

    config.resolver = {
      ...resolver,
      assetExts: resolver.assetExts.filter((ext) => ext !== "svg"),
      sourceExts: [...resolver.sourceExts, "svg"],
    };
    config.transformer = {
      ...transformer,
      getTransformOptions: async () => ({
        transform: {
          experimentalImportSupport: false,
          inlineRequires: false,
        },
      }),
      babelTransformerPath: require.resolve("react-native-svg-transformer"),
    };

    return config;
  }
})();
