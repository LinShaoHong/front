import '/common/libs.dart';

class Throttler {
  final Duration interval;

  Throttler(this.interval);

  VoidCallback? _action;
  Timer? _timer;

  void call(VoidCallback? action, {bool immediateCall = true}) {
    _action = action;
    if (_timer == null) {
      if (immediateCall) {
        _callAction();
      }
      _timer = Timer(interval, _callAction);
    }
  }

  void _callAction() {
    _action?.call();
    _action = null;
    _timer = null;
  }

  void _reset() {
    _action = null;
    _timer = null;
  }
}
