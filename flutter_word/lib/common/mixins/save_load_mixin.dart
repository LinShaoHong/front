import '/common/libs.dart';

mixin ThrottledSaveLoadMixin {
  late final _file = _JsonPrefsFile(fileName);
  final _throttle = Throttler(const Duration(seconds: 2));

  Future<void> load() async {
    final results = await _file.load();
    try {
      copyFromJson(results);
    } on Exception catch (e) {
      debugPrint(e.toString());
    }
  }

  Future<void> save() async {
    if (!kIsWeb) debugPrint('Saving...');
    try {
      await _file.save(toJson());
    } on Exception catch (e) {
      debugPrint(e.toString());
    }
  }

  Future<void> scheduleSave() async => _throttle.call(save);

  /// Serialization
  String get fileName;

  Map<String, dynamic> toJson();

  void copyFromJson(Map<String, dynamic> value);
}

class _JsonPrefsFile {
  _JsonPrefsFile(this.name);

  final String name;

  Future<Map<String, dynamic>> load() async {
    final p = (await SharedPreferences.getInstance()).getString(name);
    return Map<String, dynamic>.from(jsonDecode(p ?? '{}'));
  }

  Future<void> save(Map<String, dynamic> data) async {
    await (await SharedPreferences.getInstance())
        .setString(name, jsonEncode(data));
  }
}
