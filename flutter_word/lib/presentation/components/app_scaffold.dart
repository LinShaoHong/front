import 'dart:ui';

import '/common/libs.dart';

class AppScaffold extends StatelessWidget {
  final Widget child;

  static AppStyles _styles = AppStyles();

  static AppStyles get styles => _styles;

  const AppScaffold({super.key, required this.child});

  @override
  Widget build(BuildContext context) {
    final mq = MediaQuery.of(context);
    appManager.handleSizeChanged(mq.size);
    Animate.defaultDuration = styles.times.fast;
    _styles = AppStyles(screenSize: context.sizePx);
    return ResponsiveBreakpoints.builder(
        child: KeyedSubtree(
          key: ValueKey($styles.scale),
          child: Theme(
            data: $styles.colors.toThemeData(),
            child: DefaultTextStyle(
              style: $styles.text.body,
              child: ScrollConfiguration(
                behavior: AppScrollBehavior(),
                child: child,
              ),
            ),
          ),
        ),
        breakpoints: [
          const Breakpoint(start: 0, end: 360, name: 'SMALL_MOBILE'),
          const Breakpoint(start: 361, end: 450, name: MOBILE),
          const Breakpoint(start: 451, end: 800, name: TABLET),
          const Breakpoint(start: 801, end: 1920, name: DESKTOP),
          const Breakpoint(start: 1921, end: double.infinity, name: '4K')
        ]);
  }
}

class AppScrollBehavior extends ScrollBehavior {
  @override
  Set<PointerDeviceKind> get dragDevices {
    final devices = Set<PointerDeviceKind>.from(super.dragDevices);
    devices.add(PointerDeviceKind.mouse);
    return devices;
  }

  @override
  ScrollPhysics getScrollPhysics(BuildContext context) {
    return const BouncingScrollPhysics();
  }

  @override
  Widget buildScrollbar(
      BuildContext context, Widget child, ScrollableDetails details) {
    if (Platforms.isMobile) return child;
    return RawScrollbar(
      controller: details.controller,
      thumbVisibility: Platforms.isDesktopOrWeb,
      thickness: 8,
      interactive: true,
      child: child,
    );
  }
}
