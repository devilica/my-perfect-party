const { withAndroidManifest, AndroidConfig, createRunOncePlugin } = require('expo/config-plugins');

const PERMISSIONS_TO_REMOVE = [
  'android.permission.READ_MEDIA_IMAGES',
  'android.permission.READ_MEDIA_VIDEO',
  'android.permission.READ_MEDIA_AUDIO',
  'android.permission.READ_MEDIA_VISUAL_USER_SELECTED',
];

/**
 * Play Photo/Video Permissions policy: this app only saves invitation images
 * (write), so broad READ_MEDIA_* must not appear in the merged manifest.
 */
function withRemoveMediaReadPermissions(config) {
  return withAndroidManifest(config, (config) => {
    config.modResults = AndroidConfig.Permissions.removePermissions(
      config.modResults,
      PERMISSIONS_TO_REMOVE
    );

    const manifest = config.modResults.manifest;
    if (!manifest.$) manifest.$ = {};
    if (!manifest.$['xmlns:tools']) {
      manifest.$['xmlns:tools'] = 'http://schemas.android.com/tools';
    }

    const usesPermissions = manifest['uses-permission'] ?? [];
    for (const name of PERMISSIONS_TO_REMOVE) {
      usesPermissions.push({
        $: {
          'android:name': name,
          'tools:node': 'remove',
        },
      });
    }
    manifest['uses-permission'] = usesPermissions;

    return config;
  });
}

module.exports = createRunOncePlugin(
  withRemoveMediaReadPermissions,
  'with-remove-media-read-permissions',
  '1.0.0'
);
