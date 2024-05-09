import '/common/libs.dart';

class DictScreen extends StatefulWidget {
  const DictScreen({super.key});

  @override
  State<DictScreen> createState() => _DictScreenState();
}

class _DictScreenState extends State<DictScreen> with TickerProviderStateMixin {
  final _shufflePlayer = AudioPlayer();
  final _openPlayer = AudioPlayer();

  final Duration duration = const Duration(milliseconds: 162);

  // final Duration duration = const Duration(seconds: 1);
  late AnimationController _posController;
  late AnimationController _shuffleController;
  late AnimationController _openController;
  late bool inShuffle = false;
  late int count = 8;
  late double maxHeight = 0.0;
  late double step = 0.02;
  late ValueNotifier<List<_Card>> _cards;
  late final ValueNotifier<bool> _overlay = ValueNotifier(false);

  @override
  void initState() {
    _shufflePlayer.setAsset(
      'assets/settings/vod1.m4a',
    );
    _openPlayer.setAsset(
      'assets/settings/vod2.m4a',
    );

    _shuffleController = AnimationController(
      duration: duration,
      vsync: this,
    )..addStatusListener((status) {
        if (status == AnimationStatus.completed) {
          List<_Card> cards = [];
          _Card card = _cards.value[_cards.value.length - 1];
          cards.add(
            card.copyWith(
              prevTop: 0.15 * maxHeight,
              currTop: 0.15 * maxHeight,
              prevScale: 0.9,
              currScale: 0.9,
            ),
          );
          for (int i = 0; i < _cards.value.length - 1; i++) {
            cards.add(
              _Card(
                prevTop: _cards.value[i].currTop,
                currTop: (0.15 + (i + 1) * step) * maxHeight,
                prevScale: _cards.value[i].currScale,
                currScale: 0.9 + (i + 1) * 0.03,
              ),
            );
          }
          _cards.value = cards;
          _shuffleController.reverse();
          _posController.forward(from: 0.0);

          Future.delayed(duration).then((value) {
            _cards.value[0] = _cards.value[0].copyWith(
              shuffle: false,
            );
            _Card card = _cards.value[_cards.value.length - 1];
            _cards.value[_cards.value.length - 1] = card.copyWith(
              shuffle: true,
            );
          });
        }
      });

    _posController = AnimationController(
      duration: duration,
      vsync: this,
    );

    _openController = AnimationController(
      duration: const Duration(milliseconds: 400),
      vsync: this,
    )..addStatusListener((status) {
        if (status == AnimationStatus.forward) {
          _overlay.value = true;
        }
        if (status == AnimationStatus.dismissed) {
          _overlay.value = false;
        }
      });
    super.initState();
  }

  @override
  void dispose() {
    _posController.dispose();
    _shuffleController.dispose();
    _openController.dispose();
    _shufflePlayer.dispose();
    _openPlayer.dispose();
    super.dispose();
  }

  void _initCards() {
    _cards = ValueNotifier(
      List.generate(count, (index) {
        return _Card(
          prevTop: (0.15 + index * step) * maxHeight,
          currTop: (0.15 + index * step) * maxHeight,
          prevScale: 0.9 + index * 0.03,
          currScale: 0.9 + index * 0.03,
          shuffle: index == count - 1,
        );
      }),
    );
  }

  Future<void> _shuffle() async {
    inShuffle = true;
    _shuffleController.forward();
    await Future.delayed(
      Duration(
        milliseconds: duration.inMilliseconds * 2 + 20,
      ),
    );
    _shuffleController.forward();
    await Future.delayed(
      Duration(
        milliseconds: duration.inMilliseconds * 2 + 20,
      ),
    );
    _shuffleController.forward();
    await Future.delayed(
      Duration(
        milliseconds: duration.inMilliseconds * 2 + 20,
      ),
    );
    _shuffleController.forward();
    inShuffle = false;
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        const Gap(20),
        const _RibbonWidget(),
        const Gap(20),
        Expanded(
          child: LayoutBuilder(
            builder: (BuildContext context, BoxConstraints constraints) {
              maxHeight = constraints.maxHeight;
              _initCards();
              return Stack(
                clipBehavior: Clip.antiAlias,
                fit: StackFit.expand,
                alignment: Alignment.center,
                children: [
                  Positioned.fill(
                    child: Image.asset(
                      'assets/settings/card_back.png',
                      fit: BoxFit.cover,
                    ),
                  ),
                  Positioned(
                    top: 0.1 * maxHeight,
                    right: 0,
                    child: Container(
                      height: 0.06 * maxHeight,
                      width: 80,
                      decoration: const BoxDecoration(
                        borderRadius: BorderRadius.only(
                          topLeft: Radius.circular(20),
                          bottomLeft: Radius.circular(20),
                        ),
                        gradient: LinearGradient(
                          colors: [
                            Color(0xff6a82fb),
                            Color(0xff5D0C95),
                          ],
                        ),
                      ),
                      child: const Center(
                        child: Text(
                          '联系客服',
                          textAlign: TextAlign.center,
                          style: TextStyle(
                            fontSize: 12,
                            color: Colors.white,
                          ),
                        ),
                      ),
                    ),
                  ),
                  Positioned(
                    bottom: 0.05 * maxHeight,
                    child: SizedBox(
                      width: constraints.maxWidth,
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          GestureDetector(
                            onTap: () {
                              if (inShuffle) {
                                return;
                              }
                              _shufflePlayer.seek(Duration.zero);
                              _shufflePlayer.playerStateStream
                                  .listen((playerState) async {
                                if (playerState.processingState ==
                                    ProcessingState.ready) {
                                  await _shuffle();
                                }
                              });
                              _shufflePlayer.play();
                            },
                            child: Image.asset(
                              'assets/settings/card_xp.png',
                              height: 0.07 * maxHeight,
                              fit: BoxFit.fitHeight,
                            ),
                          ),
                          const Gap(10),
                          GestureDetector(
                            onTap: () {
                              if (inShuffle) {
                                return;
                              }
                              if (_overlay.value) {
                                _openController.reverse();
                              } else {
                                _openPlayer.seek(Duration.zero);
                                _openPlayer.playerStateStream
                                    .listen((playerState) {
                                  if (playerState.processingState ==
                                      ProcessingState.ready) {
                                    _openController.forward();
                                  }
                                });
                                _openPlayer.play();
                              }
                            },
                            child: Image.asset(
                              'assets/settings/card_kp.png',
                              height: _overlay.value
                                  ? 0.09 * maxHeight
                                  : 0.07 * maxHeight,
                              fit: BoxFit.fitHeight,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                  ValueListenableBuilder(
                    valueListenable: _overlay,
                    builder: (BuildContext context, value, Widget? child) {
                      return value
                          ? Positioned.fill(
                              child: FadeTransition(
                                opacity: _openController,
                                child: Container(
                                  color: Colors.black.withOpacity(0.6),
                                ),
                              ),
                            )
                          : Container();
                    },
                  ),
                  ...List.generate(_cards.value.length, (index) {
                    final card = _cards.value[index];
                    if (card.shuffle) {
                      return AnimatedBuilder(
                        animation: _posController,
                        builder: (BuildContext context, Widget? child) {
                          return Positioned(
                            top: Tween(
                              begin: _cards.value[index].prevTop,
                              end: _cards.value[index].currTop,
                            ).evaluate(_posController),
                            child: _FlipWidget(
                              height: maxHeight,
                              controller: _openController,
                              front: _buildCard(
                                index,
                                true,
                                Image.asset(
                                  'assets/settings/card.png',
                                  height: 0.5 * maxHeight,
                                  fit: BoxFit.fitHeight,
                                ),
                              ),
                              back: _buildCard(
                                index,
                                true,
                                Column(
                                  children: [
                                    IgnorePointer(
                                      child: Image.asset(
                                        'assets/settings/card_front.png',
                                        height: 0.5 * maxHeight,
                                        fit: BoxFit.fitHeight,
                                      ),
                                    ),
                                    Gap(min(0.04 * maxHeight, 10)),
                                    Stack(
                                      alignment: Alignment.center,
                                      children: [
                                        Image.asset(
                                          'assets/settings/foot_bg.png',
                                          height: 0.055 * maxHeight,
                                          fit: BoxFit.fitHeight,
                                        ),
                                        const Text(
                                          '已完成游戏惩罚',
                                          textAlign: TextAlign.center,
                                          style: TextStyle(
                                            fontSize: 9,
                                            color: Colors.white,
                                          ),
                                        ),
                                      ],
                                    ),
                                  ],
                                ),
                              ),
                              callback: () {
                                _openController.reverse();
                              },
                              scale: () {
                                final bottom = maxHeight -
                                    (card.currTop + 0.57 * maxHeight + 10);

                                return 1 + (bottom / (0.57 * maxHeight + 10));
                              },
                            ),
                          );
                        },
                      );
                    }
                    return _buildCard(
                      index,
                      false,
                      Image.asset(
                        'assets/settings/card.png',
                        height: 0.5 * maxHeight,
                        fit: BoxFit.fitHeight,
                      ),
                    );
                  }),
                ],
              );
            },
          ),
        ),
        ...List.generate(1, (index) {
          return const SizedBox(
            width: 350,
            height: 100,
            child: Card(
              child: Center(
                child: Text('海克斯喝酒卡牌'),
              ),
            ),
          );
        }),
      ],
    );
  }

  Widget _buildCard(int index, bool shuffle, Widget w) {
    Widget build() {
      return AnimatedBuilder(
        animation: _shuffleController,
        builder: (BuildContext context, Widget? child) {
          return Transform.scale(
            alignment: Alignment.center,
            scale: Tween(
              begin: _cards.value[index].prevScale,
              end: _cards.value[index].currScale,
            ).evaluate(_posController),
            child: Transform.translate(
              offset: _cards.value[index].shuffle
                  ? Tween(
                      begin: Offset.zero,
                      end: const Offset(0, -150),
                    ).evaluate(_shuffleController)
                  : Offset.zero,
              child: Transform.rotate(
                angle: _cards.value[index].shuffle
                    ? Tween(begin: 0.0, end: -pi / 10.0)
                        .evaluate(_shuffleController)
                    : 0,
                child: w,
              ),
            ),
          );
        },
      );
    }

    return AnimatedBuilder(
      animation: _posController,
      builder: (BuildContext context, Widget? child) {
        return shuffle
            ? build()
            : Positioned(
                top: Tween(
                  begin: _cards.value[index].prevTop,
                  end: _cards.value[index].currTop,
                ).evaluate(_posController),
                child: build(),
              );
      },
    );
  }
}

class _Card {
  final double prevTop;
  final double currTop;
  final double prevScale;
  final double currScale;
  final bool shuffle;

  _Card({
    required this.prevTop,
    required this.currTop,
    required this.prevScale,
    required this.currScale,
    this.shuffle = false,
  });

  _Card copyWith({
    double? prevTop,
    double? currTop,
    double? prevScale,
    double? currScale,
    bool? shuffle,
  }) {
    return _Card(
      prevTop: prevTop ?? this.prevTop,
      currTop: currTop ?? this.currTop,
      prevScale: prevScale ?? this.prevScale,
      currScale: currScale ?? this.currScale,
      shuffle: shuffle ?? this.shuffle,
    );
  }
}

class _FlipWidget extends StatefulWidget {
  const _FlipWidget({
    required this.height,
    required this.controller,
    required this.callback,
    required this.front,
    required this.back,
    required this.scale,
  });

  final double height;
  final AnimationController controller;
  final void Function() callback;
  final Widget front;
  final Widget back;
  final double Function() scale;

  @override
  State<_FlipWidget> createState() => _FlipWidgetState();
}

class _FlipWidgetState extends State<_FlipWidget>
    with SingleTickerProviderStateMixin {
  late Animation<double> _frontAnimation;
  late Animation<double> _frontScaleAnimation;
  late Animation<double> _backAnimation;
  late Animation<double> _backScaleAnimation;

  @override
  void initState() {
    _frontScaleAnimation = Tween(
      begin: 1.0,
      end: widget.scale(),
    ).animate(
      CurvedAnimation(
        parent: widget.controller,
        curve: const Interval(0.0, .5),
      ),
    );

    _frontAnimation = Tween(begin: 0.0, end: pi / 2).animate(
      CurvedAnimation(
        parent: widget.controller,
        curve: const Interval(0.0, .5),
      ),
    );

    _backScaleAnimation = Tween(
      begin: 1.0,
      end: widget.scale(),
    ).animate(
      CurvedAnimation(
        parent: widget.controller,
        curve: const Interval(0.5, 1.0),
      ),
    );

    _backAnimation = Tween(begin: -pi / 2, end: 0.0).animate(
      CurvedAnimation(
        parent: widget.controller,
        curve: const Interval(.5, 1.0),
      ),
    );
    super.initState();
  }

  @override
  Widget build(BuildContext context) {
    return AnimatedBuilder(
      animation: widget.controller,
      builder: (BuildContext context, Widget? child) {
        return SizedBox(
          height: widget.height,
          child: Stack(
            children: [
              Transform(
                transform: Matrix4.identity()
                  ..setEntry(3, 2, 0.0004)
                  ..rotateY(_frontAnimation.value)
                  ..scale(
                    _frontScaleAnimation.value,
                    _frontScaleAnimation.value,
                  ),
                alignment: Alignment.center,
                child: widget.front,
              ),
              GestureDetector(
                onTap: () {
                  widget.callback();
                },
                child: Transform(
                  transform: Matrix4.identity()
                    ..setEntry(3, 2, 0.0004)
                    ..rotateY(_backAnimation.value)
                    ..scale(
                      _backScaleAnimation.value,
                      _backScaleAnimation.value,
                    ),
                  alignment: Alignment.center,
                  child: widget.back,
                ),
              ),
            ],
          ),
        );
      },
    );
  }
}

class _RibbonWidget extends StatelessWidget {
  const _RibbonWidget();

  @override
  Widget build(BuildContext context) {
    return Stack(
      children: [
        Positioned.fill(
          child: Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              _buildEnd(false),
              const Spacer(),
              _buildEnd(true),
            ],
          ),
        ),
        Container(
          height: 48,
          color: const Color(0xFFE4935D),
          padding: const EdgeInsets.symmetric(horizontal: 16),
          margin: const EdgeInsets.only(bottom: 10),
          // this aligns the text vertically, without expanding the container:
          child: const Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Text("海克斯喝酒卡牌", textAlign: TextAlign.center),
            ],
          ),
        ),
      ],
    );
  }

  Widget _buildEnd(bool flip) {
    Widget end = Image.asset('assets/settings/ribbon-end.png', height: 48);
    if (flip) end = Transform.scale(scaleX: -1, child: end);
    double m = flip ? 1 : -1;
    return end.animate().move(
          begin: Offset(m * 8, 2),
          end: Offset(m * 32, 10),
          duration: 400.ms,
          curve: Curves.easeOut,
        );
  }
}
