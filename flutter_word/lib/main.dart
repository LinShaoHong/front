import 'package:dynamic_color/dynamic_color.dart';

import '/common/libs.dart';

void main() async {
  WidgetsBinding widgetsBinding = WidgetsFlutterBinding.ensureInitialized();
  FlutterNativeSplash.preserve(widgetsBinding: widgetsBinding);
  GoRouter.optionURLReflectsImperativeAPIs = true;
  AppInjection.registerSingletons();
  runApp(App());
  await appManager.bootstrap();
  FlutterNativeSplash.remove();
//   runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    const String appTitle = 'Flutter layout demo';
    return MaterialApp(
      title: appTitle,
      home: Scaffold(
        appBar: AppBar(
          title: const Text(appTitle),
        ),
        body: PageView.builder(
          controller: PageController(
            viewportFraction: 0.5,
            initialPage: 999,
          ),
          itemBuilder: (_, index) {
            return Column(
              children: [
                _MyCard(index: index),
                ListTile(
                  title: Text(
                    'Itemaaaaaaaaaaaaaaaaaa $index',
                    overflow: TextOverflow.ellipsis,
                  ),
                  subtitle: Text(
                    'Subtitlebbbbbbbbbbbbbbbbbbbbbbbbb $index',
                    overflow: TextOverflow.ellipsis,
                  ),
                  // trailing: const Icon(Icons.arrow_forward),
                  onTap: () {
                    // Handle item tap
                  },
                ),
                const Divider(
                  height: 1,
                  thickness: .5,
                  color: Colors.red,
                ).animate().scale(
                    duration: const Duration(seconds: 2),
                    alignment: Alignment.centerLeft),
              ],
            );
          },
        ),
      ),
    );
  }
}

class _MyCard extends StatefulWidget with GetItStatefulWidgetMixin {
  _MyCard({required this.index});

  final int index;

  @override
  State<_MyCard> createState() => _MyCardState();
}

class V extends ChangeNotifier {
  int _v;

  V(int v) : _v = v;

  void inc() {
    _v += 1;
    notifyListeners();
  }

  int get v => _v;
}

class _MyCardState extends State<_MyCard> with GetItStateMixin {
  late final v = V(widget.index);

  @override
  void initState() {
    super.initState();
  }

  void _inc() {
    v.inc();
  }

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: 100,
      height: 100,
      child: InkWell(
        onTap: _inc,
        child: AnimatedBuilder(
          animation: v,
          builder: (_, child) {
            return Card(
              child: Center(
                child: Text((v.v % 10).toString()),
              ),
            );
          },
        ),
      ),
    );
  }
}

class App extends StatefulWidget {
  const App({super.key});

  @override
  State<App> createState() => _AppState();
}

class _AppState extends State<App> {
  late ColorScheme s = ColorScheme.fromSeed(seedColor: Colors.green);

  @override
  Widget build(BuildContext context) {
    ColorScheme.fromImageProvider(
            provider: const NetworkImage(
                'https://flutter.github.io/assets-for-api-docs/assets/material/content_based_color_scheme_1.png'))
        .then((value) {
      s = value;
      setState(() {});
    });
    return MaterialApp.router(
      routeInformationProvider: appRouter.routeInformationProvider,
      routeInformationParser: appRouter.routeInformationParser,
      // locale: locale == null ? null : Locale(locale),
      debugShowCheckedModeBanner: false,
      routerDelegate: appRouter.routerDelegate,
      theme: ThemeData(
        colorSchemeSeed: s.primary,
        // colorSchemeSeed: const Color(0xffE8E971),
        // colorSchemeSeed: const Color(0xff5F9906),
      ),
      darkTheme: ThemeData(
        colorSchemeSeed: s.primary,
        // colorSchemeSeed: const Color(0xffE8E971),
        // colorSchemeSeed: const Color(0xff5F9906),
        brightness: Brightness.dark,
      ),
      themeMode: themeHolder.themeMode.value,
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
