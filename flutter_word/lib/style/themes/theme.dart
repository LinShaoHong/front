import '/common/libs.dart';

abstract class AppTheme {
  ThemeData light();

  ThemeData dark();
}

class ThemeHolder {
  final AppTheme defaultTheme = GreenAppTheme();

  late final ValueNotifier<AppTheme> theme =
      ValueNotifier<AppTheme>(defaultTheme);

  void update(AppTheme value) {
    theme.value = value;
  }
}
