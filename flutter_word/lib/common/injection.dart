import 'package:flutter_gen/gen_l10n/app_localizations.dart';
import 'package:get_it/get_it.dart';

import '../presentation/components/app_scaffold.dart';
import '../style/styles.dart';
import '../style/themes/theme.dart';
import 'manager/app_manager.dart';
import 'manager/locale_manager.dart';
import 'manager/setting_manager.dart';

class AppInjection {
  static void registerSingletons() {
    GetIt.I.registerLazySingleton<ThemeHolder>(() => ThemeHolder());
    GetIt.I.registerLazySingleton<AppManager>(() => AppManager());
    GetIt.I.registerLazySingleton<LocaleManager>(() => LocaleManager());
    GetIt.I.registerLazySingleton<SettingManager>(() => SettingManager());
  }
}

ThemeHolder get themeHolder => GetIt.I.get<ThemeHolder>();

AppManager get appManager => GetIt.I.get<AppManager>();

LocaleManager get localeManager => GetIt.I.get<LocaleManager>();

SettingManager get settingManager => GetIt.I.get<SettingManager>();

AppLocalizations get $strings => localeManager.strings;

AppStyles get $styles => AppScaffold.styles;
