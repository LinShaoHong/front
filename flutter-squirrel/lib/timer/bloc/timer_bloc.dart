import 'dart:async';

import 'package:bloc/bloc.dart';
import 'package:squirrel/ticker.dart';
import 'package:squirrel/timer/bloc/timer_event.dart';
import 'package:squirrel/timer/bloc/timer_state.dart';

class TimerBloc extends Bloc<TimerEvent, TimerState> {
  final Ticker _ticker;
  late int _duration = 60;
  StreamSubscription<int>? _tickerSubscription;

  TimerBloc({required Ticker ticker})
      : _ticker = ticker,
        super(const TimerInitialState(0)) {
    on<TimerInputDurationEvent>(_onTimerInputDurationEvent);
    on<TimerStartedEvent>(_onTimerStartedEvent);
    on<TimerTickedEvent>(_onTimerTickEvent);
    on<TimerPausedEvent>(_onTimerPausedEvent);
    on<TimerResumedEvent>(_onTimerResumedEvent);
    on<TimerResetEvent>(_onTimerResetEvent);
  }

  void _onTimerInputDurationEvent(
      TimerInputDurationEvent event, Emitter<TimerState> emit) {
    _duration = event.duration;
    _tickerSubscription?.cancel();
    emit(TimerInitialState(_duration));
  }

  void _onTimerStartedEvent(TimerStartedEvent event, Emitter<TimerState> emit) {
    emit(TimerRunInProgressState(event.duration));
    _tickerSubscription?.cancel();
    _tickerSubscription = _ticker
        .tick(ticks: event.duration)
        .listen((duration) => add(TimerTickedEvent(duration: duration)));
  }

  void _onTimerTickEvent(TimerTickedEvent event, Emitter<TimerState> emit) {
    emit(event.duration > 0
        ? TimerRunInProgressState(event.duration)
        : const TimerCompletedState());
  }

  void _onTimerPausedEvent(TimerPausedEvent event, Emitter<TimerState> emit) {
    if (state is TimerRunInProgressState) {
      _tickerSubscription?.pause();
      emit(TimerRunPauseState(state.duration));
    }
  }

  void _onTimerResumedEvent(TimerResumedEvent event, Emitter<TimerState> emit) {
    if (state is TimerRunPauseState) {
      _tickerSubscription?.resume();
      emit(TimerRunInProgressState(state.duration));
    }
  }

  void _onTimerResetEvent(TimerResetEvent event, Emitter<TimerState> emit) {
    _tickerSubscription?.cancel();
    emit(TimerInitialState(_duration));
  }
}
