import '/common/libs.dart';

void main() async {
  WidgetsBinding widgetsBinding = WidgetsFlutterBinding.ensureInitialized();
  FlutterNativeSplash.preserve(widgetsBinding: widgetsBinding);
  GoRouter.optionURLReflectsImperativeAPIs = true;
  AppInjection.registerSingletons();
  runApp(App());
  await appManager.bootstrap();
  FlutterNativeSplash.remove();
}

class App extends StatelessWidget with GetItMixin {
  App({super.key});

  @override
  Widget build(BuildContext context) {
    // final theme = watchX((ThemeHolder s) => s.theme);
    final theme = AppTheme.create();
    final locale = watchX((SettingManager s) => s.currentLocale);
    return MaterialApp.router(
      routeInformationProvider: appRouter.routeInformationProvider,
      routeInformationParser: appRouter.routeInformationParser,
      locale: locale == null ? null : Locale(locale),
      debugShowCheckedModeBanner: false,
      routerDelegate: appRouter.routerDelegate,
      theme: theme.light(),
      darkTheme: theme.dark(),
      localizationsDelegates: const [
        AppLocalizations.delegate,
        GlobalMaterialLocalizations.delegate,
        GlobalWidgetsLocalizations.delegate,
        GlobalCupertinoLocalizations.delegate,
      ],
      supportedLocales: AppLocalizations.supportedLocales,
    );
  }
}
