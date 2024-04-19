import '/common/libs.dart';

void main() async {
  WidgetsBinding widgetsBinding = WidgetsFlutterBinding.ensureInitialized();
  FlutterNativeSplash.preserve(widgetsBinding: widgetsBinding);
  GoRouter.optionURLReflectsImperativeAPIs = true;
  AppInjection.registerSingletons();
  runApp(const App());
  await appManager.bootstrap();
  FlutterNativeSplash.remove();
}

class App extends StatelessWidget {
  const App({super.key});

  @override
  Widget build(BuildContext context) {
    return ValueListenableBuilder<ThemeMode>(
      valueListenable: themeHolder.themeMode,
      builder: (BuildContext context, ThemeMode value, Widget? child) {
        return MaterialApp.router(
          routeInformationProvider: appRouter.routeInformationProvider,
          routeInformationParser: appRouter.routeInformationParser,
          // locale: locale == null ? null : Locale(locale),
          debugShowCheckedModeBanner: false,
          routerDelegate: appRouter.routerDelegate,
          theme: ThemeData(
            // colorSchemeSeed: s.primary,
            // colorSchemeSeed: const Color(0xffE8E971),
            colorSchemeSeed: const Color(0xff5F9906),
          ),
          darkTheme: ThemeData(
            // colorSchemeSeed: s.primary,
            // colorSchemeSeed: const Color(0xffE8E971),
            colorSchemeSeed: const Color(0xff5F9906),
            brightness: Brightness.dark,
          ),
          themeMode: value,
          localizationsDelegates: const [
            AppLocalizations.delegate,
            GlobalMaterialLocalizations.delegate,
            GlobalWidgetsLocalizations.delegate,
            GlobalCupertinoLocalizations.delegate,
          ],
          supportedLocales: AppLocalizations.supportedLocales,
        );
      },
    );
  }
}
