const env = require(process.env.IS_PROD ? './env.prod.json' : './env.json')
module.exports = {
  expo: {
    name: "ExpoAuthApp",
    slug: "ExpoAuthApp",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/images/icon.png",
    scheme: "expoauthapp",
    userInterfaceStyle: "automatic",
    plugins: [[
      "react-native-fbsdk-next", {
        "appID": env.FACEBOOK_ID,
        "clientToken": env.FACEBOOK_TOKEN,
        "displayName": env.DISPLAY_NAME,
        "scheme": "fb" + env.FACEBOOK_ID,
        "advertiserIDCollectionEnabled": false,
        "autoLogAppEventsEnabled": false,
        "isAutoInitEnabled": true,
        "iosUserTrackingPermission": "This identifier will be used to deliver personalized ads to you."
      }
    ]],
    extra: {
      eas: {
        projectId: "5d9af16d-5106-46c0-9b3a-beb1be233dc6"
      }
    },
    splash: {
      image: "./assets/images/splash.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff"
    },
    updates: {
      fallbackToCacheTimeout: 0
    },
    assetBundlePatterns: [
      "**/*"
    ],
    ios: {
      supportsTablet: true,
      bundleIdentifier: env.BUNDLE_ID
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/images/adaptive-icon.png",
        backgroundColor: "#ffffff"
      },
      package: env.BUNDLE_ID
    },
    web: {
      favicon: "./assets/images/favicon.png"
    },
    facebookAppId: env.FACEBOOK_ID,
    facebookDisplayName: env.DISPLAY_NAME,
  }
}
