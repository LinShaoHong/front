import '/common/libs.dart';

class AppRouter {
  static String splash = '/';
  static String home = '/home';

  final appRouter = GoRouter(
      redirect: _handleRedirect,
      errorPageBuilder: (context, state) =>
          MaterialPage(child: PageNotFound(url: state.uri.toString())),
      routes: [
        ShellRoute(
            builder: (context, state, navigator) {
              return AppScaffold(child: navigator);
            },
            routes: [])
      ]);
}

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
    debugPrint('Redirecting from ${state.uri.path} to ${AppRouter.home}');
    return AppRouter.home;
  }
  if (!kIsWeb) debugPrint('Navigate to: ${state.uri}');
  return null;
}
