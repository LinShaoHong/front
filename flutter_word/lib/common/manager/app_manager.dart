import 'dart:ui';

import '/common/libs.dart';

class AppManager {
  Size _size = Size.zero;
  bool isBootstrapComplete = false;

  List<Axis> supportedOrientations = [Axis.vertical, Axis.horizontal];

  Display get display => PlatformDispatcher.instance.displays.first;

  List<Axis>? _supportedOrientationsOverride;

  set supportedOrientationsOverride(List<Axis>? value) {
    if (_supportedOrientationsOverride != value) {
      _supportedOrientationsOverride = value;
      _updateSystemOrientation();
    }
  }

  void handleSizeChanged(Size size) {
    bool isSmall = display.size.shortestSide / display.devicePixelRatio < 600;
    supportedOrientations =
        isSmall ? [Axis.vertical] : [Axis.vertical, Axis.horizontal];
    _updateSystemOrientation();
    _size = size;
  }

  void _updateSystemOrientation() {
    final orientations = <DeviceOrientation>[];
    final axisList = _supportedOrientationsOverride ?? supportedOrientations;
    if (axisList.contains(Axis.vertical)) {
      orientations.add(DeviceOrientation.portraitUp);
      orientations.add(DeviceOrientation.portraitDown);
    }
    if (axisList.contains(Axis.horizontal)) {
      orientations.add(DeviceOrientation.landscapeLeft);
      orientations.add(DeviceOrientation.landscapeRight);
    }
    SystemChrome.setPreferredOrientations(orientations);
  }

  Future<void> bootstrap() async {
    if (Platforms.isDesktop) {
      await DesktopWindow.setMinWindowSize($styles.sizes.minAppSize);
    }
    if (kIsWeb) {
      WidgetsFlutterBinding.ensureInitialized().ensureSemantics();
    }

    if (!kIsWeb && Platforms.isAndroid) {
      await FlutterDisplayMode.setHighRefreshRate();
    }
    isBootstrapComplete = true;
  }
}
