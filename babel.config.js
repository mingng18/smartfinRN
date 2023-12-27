module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: [
      [
        "module-resolver",
        {
          root: ["./"],
          alias: {
            assets: "./assets/",
            components: "./components",
            constants: "./constans",
            i18n: "./i18n",
            navigation: "./navigation",
            screens: "./screens",
            store: "./store",
            util: "./util",
          },
        },
      ],
      "react-native-reanimated/plugin",
    ],
  };
};
