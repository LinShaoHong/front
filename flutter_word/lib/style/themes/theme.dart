import '/common/libs.dart';

abstract class AppTheme {
  ThemeData light();

  ThemeData dark();

  static AppTheme create() {
    return MaterialAppTheme();
  }
}

class ThemeHolder {
  // final AppTheme defaultTheme = MaterialAppTheme();
  //
  // late final ValueNotifier<AppTheme> theme =
  //     ValueNotifier<AppTheme>(defaultTheme);
  //
  // void update(AppTheme value) {
  //   theme.value = value;
  // }
}

extension ThemedContext on BuildContext {
  ThemeData get theme => Theme.of(this);

  ColorScheme get colorSchema => Theme.of(this).colorScheme;

  bool get lightTheme => Theme.of(this).brightness == Brightness.light;

  bool get darkTheme => Theme.of(this).brightness == Brightness.dark;
}
