import '/common/libs.dart';

abstract class AppTheme {
  ThemeData light();

  ThemeData dark();

  static AppTheme create() {
    return LimeAppTheme();
  }
}
