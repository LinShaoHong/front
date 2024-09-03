import '/common/libs.dart';

class LocaleManager {
  final Locale _defaultLocale = const Locale('zh');

  AppLocalizations? _strings;

  AppLocalizations get strings => _strings!;

  bool get isLoaded => _strings != null;

  bool get isChinese => strings.localeName == 'zh';

  Future<void> load() async {
    Locale locale = _defaultLocale;
    final localeCode =
        settingManager.currentLocale.value ?? await findSystemLocale();
    locale = Locale(localeCode.split('_')[0]);
    if (kDebugMode) {
      // locale = Locale('zh'); // uncomment to test chinese
    }
    if (AppLocalizations.supportedLocales.contains(locale) == false) {
      locale = _defaultLocale;
    }
    settingManager.currentLocale.value = locale.languageCode;
    _strings = await AppLocalizations.delegate.load(locale);
  }
}
