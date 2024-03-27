sealed class TimerEvent {
  const TimerEvent();
}

final class TimerInputDurationEvent extends TimerEvent {
  final int duration;

  const TimerInputDurationEvent({required this.duration});
}

final class TimerStartedEvent extends TimerEvent {
  final int duration;

  const TimerStartedEvent({required this.duration});
}

final class TimerPausedEvent extends TimerEvent {
  const TimerPausedEvent();
}

final class TimerResumedEvent extends TimerEvent {
  const TimerResumedEvent();
}

final class TimerResetEvent extends TimerEvent {
  const TimerResetEvent();
}

final class TimerTickedEvent extends TimerEvent {
  final int duration;

  const TimerTickedEvent({required this.duration});
}
