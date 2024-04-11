import 'dart:ui';

import '/common/libs.dart';

class AppScaffold extends StatefulWidget {
  final Widget child;

  const AppScaffold({super.key, required this.child});

  @override
  State<StatefulWidget> createState() => AppScaffoldState();
}

class AppScaffoldState extends State<AppScaffold> {
  int navigationIndex = 0;

  static AppStyles _styles = AppStyles();

  static AppStyles get styles => _styles;

  @override
  Widget build(BuildContext context) {
    appManager.handleSizeChanged(context.mq.size);
    Animate.defaultDuration = $styles.times.fast;
    _styles = AppStyles(screenSize: context.mq.size);
    return KeyedSubtree(
      key: ValueKey($styles.scale),
      child: ScrollConfiguration(
          behavior: _AppScrollBehavior(),
          child: _buildScaffold(
            light: context.lightTheme,
            context: context,
          )),
    );
  }

  Scaffold _buildScaffold(
      {bool light = true, required BuildContext context, bool hasBar = true}) {
    final arr = _buildNavigationDestinations();
    if (hasBar) {
      return Scaffold(
        body: SafeArea(
          child: widget.child,
        ),
        bottomNavigationBar: NavigationBar(
          // backgroundColor: Color(
          //     CorePalette.of(const Color(0xffE8E971).value).neutral.get(96)),
          onDestinationSelected: (index) {
            navigationIndex = index;
            setState(() {});
            appRouter.go(arr[index].router);
          },
          selectedIndex: navigationIndex,
          destinations: arr,
        ),
      );
    } else {
      return Scaffold(
        body: SafeArea(
          child: widget.child,
        ),
      );
    }
  }

  List<_NavigationDestination> _buildNavigationDestinations() {
    return <_NavigationDestination>[
      _NavigationDestination(
        router: AppRouter.word,
        icon: const Icon(Icons.home_outlined),
        selectedIcon: const Icon(Icons.home),
        label: '单词',
      ),
      _NavigationDestination(
        router: AppRouter.intro,
        icon: const Icon(Icons.book_online),
        selectedIcon: const Icon(Icons.book),
        label: '阅读',
      ),
      _NavigationDestination(
        router: AppRouter.word,
        icon: const Icon(Icons.search_outlined),
        selectedIcon: const Icon(Icons.search),
        label: '词典',
      ),
      _NavigationDestination(
        router: AppRouter.intro,
        icon: const Icon(Icons.bar_chart_outlined),
        selectedIcon: const Icon(Icons.bar_chart),
        label: '工具',
      ),
      _NavigationDestination(
        router: AppRouter.word,
        icon: const Icon(Icons.settings_outlined),
        selectedIcon: const Icon(Icons.settings),
        label: '我的',
      ),
    ];
  }
}

class _NavigationDestination extends NavigationDestination {
  String router;

  _NavigationDestination(
      {required this.router,
      required Icon super.selectedIcon,
      required Icon super.icon,
      required super.label});
}

class _AppScrollBehavior extends ScrollBehavior {
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
