import 'package:equatable/equatable.dart';

sealed class TimerState extends Equatable {
  final int duration;

  const TimerState(this.duration);

  @override
  List<Object> get props => [duration];
}

final class TimerInitialState extends TimerState {
  const TimerInitialState(super.duration);

  @override
  String toString() => 'TimerInitial { duration: $duration }';
}

final class TimerRunPauseState extends TimerState {
  const TimerRunPauseState(super.duration);

  @override
  String toString() => 'TimerRunPause { duration: $duration }';
}

final class TimerRunInProgressState extends TimerState {
  const TimerRunInProgressState(super.duration);

  @override
  String toString() => 'TimerRunInProgress { duration: $duration }';
}

final class TimerCompletedState extends TimerState {
  const TimerCompletedState() : super(0);

  @override
  String toString() => 'TimerCompleted { duration: $duration }';
}
