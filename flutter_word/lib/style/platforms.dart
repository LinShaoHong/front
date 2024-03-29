import '/common/libs.dart';

class Platforms {
  static const _desktopPlatforms = [
    TargetPlatform.macOS,
    TargetPlatform.windows,
    TargetPlatform.linux
  ];

  static const _mobilePlatforms = [TargetPlatform.android, TargetPlatform.iOS];

  static bool get isDesktop =>
      _desktopPlatforms.contains(defaultTargetPlatform) && !kIsWeb;

  static bool get isDesktopOrWeb => isDesktop || kIsWeb;

  static bool get isMobile =>
      _mobilePlatforms.contains(defaultTargetPlatform) && !kIsWeb;

  static double get pixelRatio =>
      WidgetsBinding.instance.platformDispatcher.views.first.devicePixelRatio;

  static bool get isWindows => defaultTargetPlatform == TargetPlatform.windows;

  static bool get isLinux => defaultTargetPlatform == TargetPlatform.linux;

  static bool get isMacOS => defaultTargetPlatform == TargetPlatform.macOS;

  static bool get isAndroid => defaultTargetPlatform == TargetPlatform.android;

  static bool get isIOS => defaultTargetPlatform == TargetPlatform.iOS;

  static Future<bool> get isConnected async =>
      await InternetConnectionChecker().hasConnection;

  static Future<bool> get isDisconnected async => (await isConnected) == false;
}

extension PlatformContext on BuildContext {
  bool get isDesktop => Platforms.isDesktop;

  bool get isMobile => Platforms.isMobile;

  double get pixelRatio => Platforms.pixelRatio;

  bool get isWindows => Platforms.isWindows;

  bool get isLinux => Platforms.isLinux;

  bool get isMacOS => Platforms.isMacOS;

  bool get isIOS => Platforms.isIOS;

  Future<bool> get isConnected => Platforms.isConnected;

  Future<bool> get isDisconnected => Platforms.isDisconnected;
}
