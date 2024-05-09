import 'package:flutter/cupertino.dart';

import '/common/libs.dart';

class AppRouter {
  static String splash = '/';
  static String intro = '/intro';
  static String word = '/word';
  static String wordHero = 'hero';
  static String dict = '/dict';
}

final appRouter = GoRouter(
  redirect: _handleRedirect,
  errorPageBuilder: (context, state) =>
      MaterialPage(child: PageNotFound(url: state.uri.toString())),
  routes: [
    ShellRoute(
      builder: (context, state, navigator) {
        return AppScaffold(child: navigator);
      },
      routes: [
        AppRoute(AppRouter.splash, (_) => Container(color: Colors.grey)),
        AppRoute(AppRouter.intro, (_) => const IntroScreen()),
        AppRoute(
          AppRouter.word,
          (_) => const WordScreen(),
          routes: [
            AppRoute(AppRouter.wordHero, (_) => const WordHeroPage()),
          ],
        ),
        AppRoute(AppRouter.dict, (_) => DictScreen()),
      ],
    ),
  ],
);

String? get initialDeeplink => _initialDeeplink;
String? _initialDeeplink;

String? _handleRedirect(BuildContext context, GoRouterState state) {
  // Prevent anyone from navigating away from `/` if app is starting up.
  if (!appManager.isBootstrapComplete && state.uri.path != AppRouter.splash) {
    debugPrint('Redirecting from ${state.uri.path} to ${AppRouter.splash}.');
    _initialDeeplink ??= state.uri.toString();
    return AppRouter.splash;
  }
  if (appManager.isBootstrapComplete && state.uri.path == AppRouter.splash) {
    debugPrint('Redirecting from ${state.uri.path} to ${AppRouter.word}');
    return AppRouter.word;
  }
  if (!kIsWeb) debugPrint('Navigate to: ${state.uri}');
  return null;
}

class AppRoute extends GoRoute {
  AppRoute(
    String path,
    Widget Function(GoRouterState s) builder, {
    List<GoRoute> routes = const [],
    this.useFade = false,
  }) : super(
          path: path,
          routes: routes,
          pageBuilder: (context, state) {
            final pageContent = Scaffold(
              body: builder(state),
              resizeToAvoidBottomInset: false,
            );
            if (useFade) {
              return CustomTransitionPage(
                key: state.pageKey,
                child: pageContent,
                transitionsBuilder:
                    (context, animation, secondaryAnimation, child) {
                  return FadeTransition(opacity: animation, child: child);
                },
              );
            }
            return CupertinoPage(child: pageContent);
          },
        );
  final bool useFade;
}
