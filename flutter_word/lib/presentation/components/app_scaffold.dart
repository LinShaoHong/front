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
        child: _buildScaffold(light: context.lightTheme),
      ),
    );
  }

  Scaffold _buildScaffold({bool light = true, bool hasBar = true}) {
    if (hasBar) {
      List<_NavigationBarItem> items = _buildNavigationBarItems();
      return Scaffold(
        body: SafeArea(
          child: widget.child,
        ),
        bottomNavigationBar: Container(
          decoration: BoxDecoration(
              // borderRadius: BorderRadius.all(Radius.circular(10)),
              boxShadow: [
                BoxShadow(
                  color:
                      light ? const Color(0xFFE4EAF3) : const Color(0xFF6B6C6F),
                  blurRadius: 6,
                  offset: const Offset(-1, -1),
                )
              ]),
          child: BottomNavigationBar(
            type: BottomNavigationBarType.fixed,
            currentIndex: navigationIndex,
            selectedFontSize: 12,
            unselectedFontSize: 10,
            selectedLabelStyle: const TextStyle(
              fontWeight: FontWeight.w600,
            ),
            unselectedLabelStyle: const TextStyle(
              fontWeight: FontWeight.w600,
            ),
            onTap: (int index) {
              setState(() {
                if (navigationIndex != index) {
                  navigationIndex = index;
                  appRouter.go(items[index].router);
                }
              });
            },
            items: items,
          ),
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

  List<_NavigationBarItem> _buildNavigationBarItems() {
    return <_NavigationBarItem>[
      _NavigationBarItem(
        router: AppRouter.word,
        icon: const Icon(Icons.home),
        label: '单词',
      ),
      _NavigationBarItem(
        router: AppRouter.intro,
        icon: const Icon(Icons.book),
        label: '阅读',
      ),
      _NavigationBarItem(
        router: AppRouter.word,
        icon: const Icon(Icons.search),
        label: '词典',
      ),
      _NavigationBarItem(
        router: AppRouter.intro,
        icon: const Icon(Icons.bar_chart),
        label: '工具',
      ),
      _NavigationBarItem(
        router: AppRouter.word,
        icon: const Icon(Icons.settings),
        label: '我的',
      ),
    ];
  }
}

class _NavigationBarItem extends BottomNavigationBarItem {
  String router;

  _NavigationBarItem(
      {required this.router, required Icon super.icon, super.label});
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
