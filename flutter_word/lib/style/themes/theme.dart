import '/common/libs.dart';

abstract class AppTheme {
  ThemeData light();

  ThemeData dark();

  static AppTheme create() {
    return GoldAppTheme();
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
