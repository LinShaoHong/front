import '/common/libs.dart';

class SettingManager with ThrottledSaveLoadMixin {
  late final currentLocale = ValueNotifier<String?>(null)
    ..addListener(scheduleSave);

  late final hasCompletedOnboarding = ValueNotifier<bool?>(null)
    ..addListener(scheduleSave);

  @override
  String get fileName => "settings.json";

  @override
  void copyFromJson(Map<String, dynamic> value) {}

  @override
  Map<String, dynamic> toJson() {
    throw UnimplementedError();
  }
}
