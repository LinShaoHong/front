import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:word/common/injection.dart';
import 'package:word/presentation/bloc/timer/timer_state.dart';
import 'package:word/presentation/components/bottom_bar.dart';
import 'package:word/presentation/bloc/timer/timer_bloc.dart';

import 'ticker.dart';
import 'timer_event.dart';

class TimerPage extends StatelessWidget {
  const TimerPage({super.key});

  @override
  Widget build(BuildContext context) {
    return BlocProvider(
      create: (_) => TimerBloc(ticker: const Ticker()),
      child: const TimerView(),
    );
  }
}

class TimerView extends StatelessWidget {
  const TimerView({super.key});

  @override
  Widget build(BuildContext context) {
    return Container(
      color: $styles.colors.offWhite,
      child: const Scaffold(
        body: Stack(
          children: [
            Background(),
            // Column(
            //   mainAxisAlignment: MainAxisAlignment.center,
            //   children: <Widget>[
            //     DurationInput(),
            //     Padding(
            //       padding: EdgeInsets.symmetric(vertical: 100),
            //       child: Center(
            //         child: TimerText(),
            //       ),
            //     ),
            //     Actions(),
            //   ],
            // ),
            Column(
              children: [Expanded(child: SizedBox()), BottomBar()],
            )
          ],
        ),
      ),
    );
  }
}

class DurationInput extends StatelessWidget {
  const DurationInput({super.key});

  @override
  Widget build(BuildContext context) {
    return BlocBuilder<TimerBloc, TimerState>(
      buildWhen: (prev, state) => prev.runtimeType != state.runtimeType,
      builder: (context, state) {
        return SizedBox(
            height: 55,
            width: 200,
            child: TextField(
              keyboardType: TextInputType.number,
              decoration: const InputDecoration(
                  counterText: '',
                  border: InputBorder.none,
                  hintText: 'please input duration',
                  hintStyle: TextStyle(
                    fontSize: 14,
                  )),
              onChanged: (value) {
                context
                    .read<TimerBloc>()
                    .add(TimerInputDurationEvent(duration: int.parse(value)));
              },
            ));
      },
    );
  }
}

class TimerText extends StatelessWidget {
  const TimerText({super.key});

  @override
  Widget build(BuildContext context) {
    final duration = context.select((TimerBloc bloc) => bloc.state.duration);
    final minute = ((duration / 60) % 60).floor().toString().padLeft(2, '0');
    final second = (duration % 60).toString().padLeft(2, '0');
    return Text(
      '$minute:$second',
      style: Theme.of(context)
          .textTheme
          .displayLarge
          ?.copyWith(fontWeight: FontWeight.w500),
    );
  }
}

class Actions extends StatelessWidget {
  const Actions({super.key});

  @override
  Widget build(BuildContext context) {
    return BlocBuilder<TimerBloc, TimerState>(
      buildWhen: (prev, state) => prev.runtimeType != state.runtimeType,
      builder: (context, state) {
        return Row(
          mainAxisAlignment: MainAxisAlignment.spaceEvenly,
          children: [
            ...switch (state) {
              TimerInitialState() => [
                  FloatingActionButton(
                    child: const Icon(Icons.play_arrow),
                    onPressed: () => context
                        .read<TimerBloc>()
                        .add(TimerStartedEvent(duration: state.duration)),
                  ),
                ],
              TimerRunPauseState() => [
                  FloatingActionButton(
                    child: const Icon(Icons.play_arrow),
                    onPressed: () {
                      context.read<TimerBloc>().add(const TimerResumedEvent());
                    },
                  ),
                  FloatingActionButton(
                    child: const Icon(Icons.replay),
                    onPressed: () {
                      context.read<TimerBloc>().add(const TimerResetEvent());
                    },
                  ),
                ],
              TimerRunInProgressState() => [
                  FloatingActionButton(
                    child: const Icon(Icons.pause),
                    onPressed: () {
                      context.read<TimerBloc>().add(const TimerPausedEvent());
                    },
                  ),
                  FloatingActionButton(
                    child: const Icon(Icons.replay),
                    onPressed: () {
                      context.read<TimerBloc>().add(const TimerResetEvent());
                    },
                  ),
                ],
              TimerCompletedState() => [
                  FloatingActionButton(
                    child: const Icon(Icons.replay),
                    onPressed: () {
                      context.read<TimerBloc>().add(const TimerResetEvent());
                    },
                  ),
                ],
            }
          ],
        );
      },
    );
  }
}

class Background extends StatelessWidget {
  const Background({super.key});

  @override
  Widget build(BuildContext context) {
    return SizedBox.expand(
      child: DecoratedBox(
        decoration: BoxDecoration(
            gradient: LinearGradient(
                begin: Alignment.topCenter,
                end: Alignment.bottomCenter,
                colors: [Colors.blue.shade50, Colors.blue.shade500])),
      ),
    );
  }
}
