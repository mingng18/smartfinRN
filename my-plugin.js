const { withAndroidManifest } = require("@expo/config-plugins");

const withAndroidQueries = (config) => {
  return withAndroidManifest(config, (config) => {
    config.modResults.manifest.queries = [
      {
        intent: [
          {
            action: [{ $: { "android:name": "android.intent.action.DIAL" } }],
          },
        ],
      },
    ];

    return config;
  });
};

module.exports = withAndroidQueries;
