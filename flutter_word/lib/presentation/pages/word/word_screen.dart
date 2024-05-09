import 'dart:ui';

import 'package:material_symbols_icons/symbols.dart';

import '/common/libs.dart';

class WordScreen extends StatefulWidget {
  const WordScreen({super.key});

  @override
  State<WordScreen> createState() => _WordScreenState();
}

class _WordScreenState extends State<WordScreen> with TickerProviderStateMixin {
  double _currentSliderValue = 20;
  int _tabIndex = 0;
  late TabController _tabController;
  late AnimationController _progressController;
  late AnimationController _gradientController;

  String selectedPage = '';
  static final ValueNotifier<bool> cardSwitch = ValueNotifier(false);
  static final ValueNotifier<bool> cardFade = ValueNotifier(false);

  late AnimationController _moveController;
  late Animation<Offset> _moveButtonAnimation;
  late Animation<Offset> _moveRectAnimation;
  late final List<int> _moveQueue = [];
  late Timer _moveTimer;
  final ValueNotifier<List<_MoveModel>> _moveWidgets = ValueNotifier([]);

  late MenuController _menuController;
  late AnimationController _textController;
  late final GlobalKey _textKey = GlobalKey();

  @override
  void initState() {
    _tabController = TabController(length: 9, vsync: this);
    _progressController =
        AnimationController(duration: const Duration(seconds: 10), vsync: this);
    _progressController.repeat(reverse: true);

    _gradientController =
        AnimationController(duration: const Duration(seconds: 2), vsync: this);
    _gradientController.repeat(reverse: true);

    _moveController =
        AnimationController(duration: const Duration(seconds: 2), vsync: this);
    _moveController.forward();

    CurvedAnimation curve = CurvedAnimation(
      parent: _moveController,
      curve: Curves.bounceOut,
    );
    _moveButtonAnimation = Tween(
      begin: const Offset(-1.5, 0),
      end: const Offset(0, 0),
    ).animate(curve);

    _moveRectAnimation = Tween(
      begin: const Offset(2, 0),
      end: const Offset(0, 0),
    ).animate(curve);

    _moveTimer = Timer.periodic(const Duration(milliseconds: 500), (timer) {
      if (_moveQueue.isNotEmpty) {
        final controller = AnimationController(
          duration: const Duration(seconds: 2),
          vsync: this,
        );
        _moveWidgets.value.removeWhere((element) {
          if (element.controller.isCompleted) {
            element.controller.dispose();
            return true;
          }
          return false;
        });
        int len = _moveWidgets.value.length;
        _moveWidgets.value.add(
          _MoveModel(
            controller: controller,
            content: len,
          ),
        );
        _moveWidgets.value = List.from(_moveWidgets.value);
        controller.forward();
        _moveQueue.removeAt(0);
      }
    });

    _menuController = MenuController();
    _textController = AnimationController(
      duration: const Duration(milliseconds: 200),
      vsync: this,
    );
    super.initState();
  }

  @override
  void dispose() {
    _tabController.dispose();
    _progressController.dispose();
    _gradientController.dispose();
    _moveController.dispose();
    _moveTimer.cancel();
    _textController.dispose();
    for (_MoveModel c in _moveWidgets.value) {
      c.controller.dispose();
    }
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Word'),
        scrolledUnderElevation: 0,
      ),
      drawer: Drawer(
        elevation: 3,
        shape: const RoundedRectangleBorder(),
        width: context.mq.size.width * 0.8,
        child: ListView(
          padding: EdgeInsets.zero,
          children: _buildDrawer(),
        ),
      ),
      body: Center(
        child: SingleChildScrollView(
          child: SeparatedColumn(
            separatorBuilder: () {
              return const Gap(20);
            },
            children: [
              ..._buildCards(context),
              ..._buildText(context),
              _buildMove(context),
              ..._buildGradient(context),
              _buildTestValueNotifier(context),
              const SingleChoice(),
              const MultipleChoice(),
              const LightDarkChoice(),
              _buildSetting(context),
              _buildFloatingBar(context),
              ..._buildChips(context),
              _buildSearch(),
              _buildSlider(),
              ..._buildTabBar(),
              ..._buildProgressIndicator(),
            ],
          ),
        ),
      ),
    );
  }

  List<Widget> _buildDrawer() {
    return [
      const DrawerHeader(
        decoration: BoxDecoration(),
        child: Text(
          'Drawer Header',
          style: TextStyle(
            fontSize: 24,
          ),
        ),
      ),
      ListTile(
        leading: const Icon(Icons.message),
        title: const Text('Messages'),
        onTap: () {
          setState(() {
            selectedPage = 'Messages';
          });
        },
      ),
      ListTile(
        leading: const Icon(Icons.account_circle),
        title: const Text('Profile'),
        onTap: () {
          setState(() {
            selectedPage = 'Profile';
          });
        },
      ),
      ListTile(
        leading: const Icon(Icons.settings),
        title: const Text('Settings'),
        onTap: () {
          setState(() {
            selectedPage = 'Settings';
          });
        },
      ),
    ];
  }

  Widget _buildMove(BuildContext context) {
    return LayoutBuilder(
      builder: (BuildContext context, BoxConstraints constraints) {
        return Container(
          width: constraints.maxWidth,
          height: 50,
          decoration: const BoxDecoration(
            color: Colors.transparent,
          ),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              SlideTransition(
                position: _moveButtonAnimation,
                child: FloatingActionButton.small(
                  heroTag: 'a',
                  onPressed: () {
                    _moveQueue.add(0);
                  },
                  child: const Icon(Icons.arrow_circle_right_outlined),
                ),
              ),
              const Gap(10),
              SlideTransition(
                position: _moveRectAnimation,
                child: Container(
                  width: 200,
                  height: 50,
                  clipBehavior: Clip.hardEdge,
                  decoration: BoxDecoration(
                    color: context.colorSchema.primary,
                  ),
                  child: ValueListenableBuilder<List<_MoveModel>>(
                    valueListenable: _moveWidgets,
                    builder: (
                      BuildContext context,
                      List<_MoveModel> value,
                      Widget? child,
                    ) {
                      return RepaintBoundary(
                        child: Stack(
                          alignment: Alignment.center,
                          children: [
                            ..._moveWidgets.value.map((e) {
                              Animation<Offset> offsetAnimation = Tween(
                                begin: const Offset(-2.5, 0),
                                end: const Offset(2.5, 0),
                              ).animate(e.controller);
                              return SlideTransition(
                                position: offsetAnimation,
                                child: Container(
                                  width: 50,
                                  height: 20,
                                  color: context.colorSchema.onPrimary,
                                  child: Text(
                                    '${e.content}',
                                    textAlign: TextAlign.center,
                                  ),
                                ),
                              );
                            }),
                          ],
                        ),
                      );
                    },
                  ),
                ),
              ),
            ],
          ),
        );
      },
    );
  }

  List<Widget> _buildGradient(BuildContext context) {
    Animation<Alignment> topSeq = TweenSequence<Alignment>(
      [
        TweenSequenceItem(
          tween: Tween<Alignment>(
            begin: Alignment.topLeft,
            end: Alignment.topRight,
          ),
          weight: 1,
        ),
        TweenSequenceItem(
          tween: Tween<Alignment>(
            begin: Alignment.topRight,
            end: Alignment.bottomRight,
          ),
          weight: 1,
        ),
        TweenSequenceItem(
          tween: Tween<Alignment>(
            begin: Alignment.bottomRight,
            end: Alignment.bottomLeft,
          ),
          weight: 1,
        ),
        TweenSequenceItem(
          tween: Tween<Alignment>(
            begin: Alignment.bottomLeft,
            end: Alignment.topLeft,
          ),
          weight: 1,
        ),
      ],
    ).animate(_gradientController);

    Animation<Alignment> btSeq = TweenSequence<Alignment>(
      [
        TweenSequenceItem(
          tween: Tween<Alignment>(
            begin: Alignment.bottomRight,
            end: Alignment.bottomLeft,
          ),
          weight: 1,
        ),
        TweenSequenceItem(
          tween: Tween<Alignment>(
            begin: Alignment.bottomLeft,
            end: Alignment.topLeft,
          ),
          weight: 1,
        ),
        TweenSequenceItem(
          tween: Tween<Alignment>(
            begin: Alignment.topLeft,
            end: Alignment.topRight,
          ),
          weight: 1,
        ),
        TweenSequenceItem(
          tween: Tween<Alignment>(
            begin: Alignment.topRight,
            end: Alignment.bottomRight,
          ),
          weight: 1,
        ),
      ],
    ).animate(_gradientController);

    return [
      RepaintBoundary(
        child: AnimatedBuilder(
          animation: _gradientController,
          builder: (_, c) {
            return Container(
              width: 280,
              height: 70,
              decoration: BoxDecoration(
                border: _GradientBoxBorder(
                  gradient: LinearGradient(
                    transform: _LinearGradientTransform(
                      _gradientController.value,
                      70 * 70 / 280,
                    ),
                    stops: const [0.0, 0.3, 0.6, 0.8, 1.0],
                    colors: [
                      context.colorSchema.secondaryContainer,
                      context.colorSchema.tertiaryContainer,
                      context.colorSchema.primary,
                      context.colorSchema.tertiaryContainer,
                      context.colorSchema.secondaryContainer,
                    ],
                    begin: topSeq.value,
                    end: btSeq.value,
                  ),
                ),
              ),
            );
          },
        ),
      ),
      RepaintBoundary(
        child: AnimatedBuilder(
          animation: _gradientController,
          builder: (_, c) {
            return Transform.scale(
              alignment: Alignment.centerLeft,
              scaleX: _gradientController.value,
              child: Container(
                width: 300,
                height: 10,
                decoration: BoxDecoration(
                  gradient: LinearGradient(
                    // stops: const [0.0, 0.3, 0.6, 0.8, 1.0],
                    // transform: _LinearGradientTransform(
                    //   _gradientController.value,
                    //   100 * 100 / 300,
                    // ),
                    // tileMode: TileMode.repeated,
                    // begin: topSeq.value,
                    // end: btSeq.value,
                    stops: const [0.0, 0.5, 1.0],
                    colors: [
                      context.colorSchema.surface,
                      context.colorSchema.secondaryContainer,
                      context.colorSchema.primary,
                      // context.colorSchema.secondaryContainer,
                      // context.colorSchema.surface,
                    ],
                  ),
                ),
              ),
            );
          },
        ),
      ),
      RepaintBoundary(
        child: AnimatedBuilder(
          animation: _gradientController,
          builder: (BuildContext context, Widget? child) {
            return Container(
              width: 100,
              height: 100,
              decoration: BoxDecoration(
                borderRadius: BorderRadius.circular(100),
                gradient: RadialGradient(
                  radius: _gradientController.value,
                  stops: const [0.0, 0.3, 1.0],
                  colors: [
                    context.colorSchema.surface,
                    context.colorSchema.secondaryContainer,
                    context.colorSchema.primary,
                  ],
                ),
              ),
            );
          },
        ),
      ),
      RepaintBoundary(
        child: AnimatedBuilder(
          animation: _gradientController,
          builder: (BuildContext context, Widget? child) {
            return Container(
              width: 100,
              height: 100,
              decoration: BoxDecoration(
                borderRadius: BorderRadius.circular(100),
                gradient: SweepGradient(
                  startAngle: _gradientController.value,
                  stops: const [0.0, 0.4, 1.0],
                  colors: [
                    context.colorSchema.surface,
                    context.colorSchema.secondaryContainer,
                    context.colorSchema.primary,
                  ],
                ),
              ),
            );
          },
        ),
      ),
    ];
  }

  Widget _buildSlider() {
    return Slider(
      value: _currentSliderValue,
      max: 100,
      divisions: 5,
      label: _currentSliderValue.round().toString(),
      onChanged: (double value) {
        _currentSliderValue = value;
        setState(() {});
      },
    );
  }

  List<Widget> _buildTabBar() {
    return [
      SizedBox(
        height: 55,
        child: TabBar(
          isScrollable: true,
          controller: _tabController,
          onTap: (index) {
            _tabIndex = index;
            setState(() {});
          },
          tabs: [
            Tab(
              icon: Icon(
                Icons.directions_car,
                color: _tabIndex == 0
                    ? context.theme.colorScheme.primary
                    : Colors.grey,
              ),
              iconMargin: const EdgeInsets.only(bottom: 0),
              text: 'car',
            ),
            Tab(
              icon: Icon(
                Icons.directions_transit,
                color: _tabIndex == 1
                    ? context.theme.colorScheme.primary
                    : Colors.grey,
              ),
              iconMargin: const EdgeInsets.only(bottom: 0),
              text: 'transit',
            ),
            Tab(
              icon: Icon(
                Icons.directions_bike,
                color: _tabIndex == 2
                    ? context.theme.colorScheme.primary
                    : Colors.grey,
              ),
              iconMargin: const EdgeInsets.only(bottom: 0),
              text: 'bike',
            ),
            Tab(
              icon: Icon(
                Icons.directions_car,
                color: _tabIndex == 3
                    ? context.theme.colorScheme.primary
                    : Colors.grey,
              ),
              iconMargin: const EdgeInsets.only(bottom: 0),
              text: 'car',
            ),
            Tab(
              icon: Icon(
                Icons.directions_transit,
                color: _tabIndex == 4
                    ? context.theme.colorScheme.primary
                    : Colors.grey,
              ),
              iconMargin: const EdgeInsets.only(bottom: 0),
              text: 'transit',
            ),
            Tab(
              icon: Icon(
                Icons.directions_bike,
                color: _tabIndex == 5
                    ? context.theme.colorScheme.primary
                    : Colors.grey,
              ),
              iconMargin: const EdgeInsets.only(bottom: 0),
              text: 'bike',
            ),
            Tab(
              icon: Icon(
                Icons.directions_car,
                color: _tabIndex == 6
                    ? context.theme.colorScheme.primary
                    : Colors.grey,
              ),
              iconMargin: const EdgeInsets.only(bottom: 0),
              text: 'car',
            ),
            Tab(
              icon: Icon(
                Icons.directions_transit,
                color: _tabIndex == 7
                    ? context.theme.colorScheme.primary
                    : Colors.grey,
              ),
              iconMargin: const EdgeInsets.only(bottom: 0),
              text: 'transit',
            ),
            Tab(
              icon: Icon(
                Icons.directions_bike,
                color: _tabIndex == 8
                    ? context.theme.colorScheme.primary
                    : Colors.grey,
              ),
              iconMargin: const EdgeInsets.only(bottom: 0),
              text: 'bike',
            ),
          ],
        ),
      ),
      SizedBox(
        height: 100,
        child: TabBarView(
          controller: _tabController,
          children: const [
            Card(
              margin: EdgeInsets.all(10),
              child: Icon(
                Icons.directions_car,
              ),
            ),
            Card(
              margin: EdgeInsets.all(10),
              child: Icon(
                Icons.directions_transit,
              ),
            ),
            Card(
              margin: EdgeInsets.all(10),
              child: Icon(
                Icons.directions_bike,
              ),
            ),
            Card(
              margin: EdgeInsets.all(10),
              child: Icon(
                Icons.directions_car,
              ),
            ),
            Card(
              margin: EdgeInsets.all(10),
              child: Icon(
                Icons.directions_transit,
              ),
            ),
            Card(
              margin: EdgeInsets.all(10),
              child: Icon(
                Icons.directions_bike,
              ),
            ),
            Card(
              margin: EdgeInsets.all(10),
              child: Icon(
                Icons.directions_car,
              ),
            ),
            Card(
              margin: EdgeInsets.all(10),
              child: Icon(
                Icons.directions_transit,
              ),
            ),
            Card(
              margin: EdgeInsets.all(10),
              child: Icon(
                Icons.directions_bike,
              ),
            ),
          ],
        ),
      ),
    ];
  }

  List<Widget> _buildProgressIndicator() {
    return [
      AnimatedBuilder(
        animation: _progressController,
        builder: (_, w) {
          return RefreshProgressIndicator(
            value: _progressController.value,
          );
        },
      ),
      AnimatedBuilder(
        animation: _progressController,
        builder: (_, w) {
          return CircularProgressIndicator(
            value: _progressController.value,
          );
        },
      ),
      AnimatedBuilder(
        animation: _progressController,
        builder: (_, w) {
          return LinearProgressIndicator(
            value: _progressController.value,
          );
        },
      ),
    ];
  }

  List<Widget> _buildText(BuildContext context) {
    TextPainter tp = TextPainter(
      text: const TextSpan(
        text: "Hello",
        style: TextStyle(
          height: 1,
          fontSize: 18,
          fontWeight: FontWeight.bold,
        ),
      ),
      textDirection: TextDirection.ltr,
    );
    tp.layout();
    double maxWidth = context.mq.size.width;
    double maxHeight = context.mq.size.height;
    return [
      Text.rich(
        TextSpan(
          children: [
            WidgetSpan(
              child: Container(
                margin: const EdgeInsets.only(left: 4, right: 4),
                child: MenuAnchor(
                  controller: _menuController,
                  style: MenuStyle(
                    padding: MaterialStateProperty.all(EdgeInsets.zero),
                    backgroundColor:
                        MaterialStateProperty.all(Colors.transparent),
                    shadowColor: MaterialStateProperty.all(Colors.transparent),
                    surfaceTintColor:
                        MaterialStateProperty.all(Colors.transparent),
                  ),
                  menuChildren: [
                    RepaintBoundary(
                      child: Container(
                        width: maxWidth * 0.5,
                        height: maxHeight * 0.3,
                        decoration: BoxDecoration(
                          borderRadius:
                              const BorderRadius.all(Radius.circular(5)),
                          border: Border.all(
                            color: context.colorSchema.outlineVariant,
                          ),
                          color: context.colorSchema.secondaryContainer,
                        ),
                      ).animate().scale(
                            duration: const Duration(milliseconds: 200),
                            begin: const Offset(0, 0),
                            end: const Offset(1, 1),
                            alignment: Alignment.center,
                          ),
                    ),
                  ],
                  builder: (
                    BuildContext context,
                    MenuController controller,
                    Widget? child,
                  ) {
                    return GestureDetector(
                      onTapDown: (details) async {
                        if (controller.isOpen) {
                          controller.close();
                        } else {
                          controller.open(position: const Offset(0, 20));
                        }
                      },
                      child: Stack(
                        key: _textKey,
                        children: [
                          Positioned(
                            bottom: 2,
                            child: Container(
                              width: tp.width,
                              height: tp.height / 3,
                              decoration: BoxDecoration(
                                gradient: LinearGradient(
                                  colors: [
                                    Colors.orange,
                                    context.colorSchema.surface,
                                  ],
                                  begin: Alignment.bottomCenter,
                                  end: Alignment.topCenter,
                                ),
                              ),
                            ),
                          ),
                          const Text(
                            'Hello',
                            style: TextStyle(
                              height: 1,
                              fontSize: 18,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                        ],
                      ),
                    );
                  },
                ),
              ),
            ),
            const TextSpan(
              text: 'world',
            ),
          ],
        ),
      ),
      AnimatedTextKit(
        animatedTexts: [
          TyperAnimatedText(
            'Flutter is Awesome',
            textStyle: const TextStyle(
              fontSize: 20.0,
              fontWeight: FontWeight.bold,
            ),
            speed: const Duration(milliseconds: 200),
          ),
        ],
        totalRepeatCount: 4,
        pause: const Duration(milliseconds: 1000),
        displayFullTextOnTap: true,
        stopPauseOnTap: true,
      ),
      // AnimatedTextKit(
      //   animatedTexts: [
      //     FadeAnimatedText(
      //       'Product Name',
      //       textStyle: const TextStyle(
      //         fontSize: 30.0,
      //         fontWeight: FontWeight.bold,
      //       ),
      //       duration: const Duration(milliseconds: 500),
      //     ),
      //   ],
      //   totalRepeatCount: 4,
      //   pause: const Duration(milliseconds: 500),
      // ),
      AnimatedTextKit(
        animatedTexts: [
          TypewriterAnimatedText(
            'User Name',
            textStyle: const TextStyle(
              fontSize: 20.0,
              fontWeight: FontWeight.bold,
            ),
            speed: const Duration(milliseconds: 200),
          ),
        ],
        totalRepeatCount: 4,
        pause: const Duration(milliseconds: 1000),
        displayFullTextOnTap: true,
        stopPauseOnTap: true,
      ),
      Container(
        decoration: BoxDecoration(
          border: Border.all(color: context.colorSchema.outlineVariant),
          borderRadius: const BorderRadius.all(Radius.circular(10)),
        ),
        width: 80,
        height: 20,
        child: _MarqueeWidget(
          axis: Axis.vertical,
          itemCount: 10,
          itemBuilder: (_, index) {
            return Text(
              index.toString(),
              textAlign: TextAlign.center,
            );
          },
        ),
      ),
      Row(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          TextButton(
            onPressed: () {
              if (_NotifierTestState.value.value == 1) {
                _NotifierTestState.value.value = 0;
              } else {
                _NotifierTestState.value.value = 1;
              }
            },
            child: const Text(
              'Change',
              style: TextStyle(
                fontSize: 16,
              ),
            ),
          ),
          const Gap(5),
          const _NotifierTest(),
        ],
      ),
    ];
  }
}

enum Calendar { day, week, month, year }

class LightDarkChoice extends StatefulWidget {
  const LightDarkChoice({super.key});

  @override
  State<LightDarkChoice> createState() => _LightDarkChoiceState();
}

class _LightDarkChoiceState extends State<LightDarkChoice> {
  ThemeMode mode = ThemeMode.light;

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: context.mq.size.width * 0.95,
      child: Card.outlined(
        child: Padding(
          padding: const EdgeInsets.all(10.0),
          child: Row(
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Image.asset(
                    context.theme.brightness == Brightness.light
                        ? 'assets/settings/mode.png'
                        : 'assets/settings/mode_dark.png',
                    width: 18,
                    height: 18,
                  ),
                  const Gap(5),
                  const Text(
                    '肤色',
                    style: TextStyle(
                      fontSize: 14,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ],
              ),
              const Gap(10),
              LayoutBuilder(
                builder: (_, c) {
                  return SegmentedButton(
                    style: ButtonStyle(
                      visualDensity: const VisualDensity(vertical: -4),
                      shape: MaterialStateProperty.all<RoundedRectangleBorder>(
                        const RoundedRectangleBorder(
                          borderRadius: BorderRadius.all(Radius.circular(5)),
                        ),
                      ),
                    ),
                    // showSelectedIcon: false,
                    segments: <ButtonSegment<ThemeMode>>[
                      ButtonSegment(
                        value: ThemeMode.light,
                        label: Text(
                          '浅色',
                          style: TextStyle(
                            fontSize: 12,
                            fontWeight: mode == ThemeMode.light
                                ? FontWeight.bold
                                : FontWeight.normal,
                          ),
                        ),
                      ),
                      ButtonSegment(
                        value: ThemeMode.dark,
                        label: Text(
                          '深色',
                          style: TextStyle(
                            fontSize: 12,
                            fontWeight: mode == ThemeMode.dark
                                ? FontWeight.bold
                                : FontWeight.normal,
                          ),
                        ),
                      ),
                      ButtonSegment(
                        value: ThemeMode.system,
                        label: Text(
                          '自动',
                          style: TextStyle(
                            fontSize: 12,
                            fontWeight: mode == ThemeMode.system
                                ? FontWeight.bold
                                : FontWeight.normal,
                          ),
                        ),
                      ),
                    ],
                    selected: <ThemeMode>{mode},
                    onSelectionChanged: (Set<ThemeMode> set) {
                      mode = set.first;
                      themeHolder.themeMode.value = mode;
                      setState(() {});
                    },
                  );
                },
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class SingleChoice extends StatefulWidget {
  const SingleChoice({super.key});

  @override
  State<SingleChoice> createState() => _SingleChoiceState();
}

class _SingleChoiceState extends State<SingleChoice> {
  Calendar calendarView = Calendar.day;

  @override
  Widget build(BuildContext context) {
    return SegmentedButton<Calendar>(
      segments: const <ButtonSegment<Calendar>>[
        ButtonSegment<Calendar>(
          value: Calendar.day,
          label: Text('Day'),
          icon: Icon(Icons.calendar_view_day),
        ),
        ButtonSegment<Calendar>(
          value: Calendar.week,
          label: Text('Week'),
          icon: Icon(Icons.calendar_view_week),
        ),
        ButtonSegment<Calendar>(
          value: Calendar.month,
          label: Text('Month'),
          icon: Icon(Icons.calendar_view_month),
        ),
        ButtonSegment<Calendar>(
          value: Calendar.year,
          label: Text('Year'),
          icon: Icon(Icons.calendar_today),
        ),
      ],
      selected: <Calendar>{calendarView},
      onSelectionChanged: (Set<Calendar> newSelection) {
        setState(() {
          // By default there is only a single segment that can be
          // selected at one time, so its value is always the first
          // item in the selected set.
          calendarView = newSelection.first;
        });
      },
    );
  }
}

enum _Sizes { extraSmall, small, medium, large, extraLarge }

class MultipleChoice extends StatefulWidget {
  const MultipleChoice({super.key});

  @override
  State<MultipleChoice> createState() => _MultipleChoiceState();
}

class _MultipleChoiceState extends State<MultipleChoice> {
  Set<_Sizes> selection = <_Sizes>{_Sizes.large, _Sizes.extraLarge};

  @override
  Widget build(BuildContext context) {
    return SegmentedButton<_Sizes>(
      segments: const <ButtonSegment<_Sizes>>[
        ButtonSegment<_Sizes>(value: _Sizes.extraSmall, label: Text('XS')),
        ButtonSegment<_Sizes>(value: _Sizes.small, label: Text('S')),
        ButtonSegment<_Sizes>(value: _Sizes.medium, label: Text('M')),
        ButtonSegment<_Sizes>(
          value: _Sizes.large,
          label: Text('L'),
        ),
        ButtonSegment<_Sizes>(value: _Sizes.extraLarge, label: Text('XL')),
      ],
      selected: selection,
      onSelectionChanged: (Set<_Sizes> newSelection) {
        setState(() {
          selection = newSelection;
        });
      },
      multiSelectionEnabled: true,
    );
  }
}

Widget _buildSetting(BuildContext context) {
  return Theme(
    data: context.theme.copyWith(
      listTileTheme: const ListTileThemeData(
        iconColor: Colors.grey,
      ),
    ),
    child: SizedBox(
      width: context.mq.size.width * 0.95,
      child: Card.outlined(
        child: SeparatedColumn(
          separatorBuilder: () {
            return LayoutBuilder(
              builder: (_, c) {
                return Divider(
                  indent: c.maxWidth * .05,
                  endIndent: c.maxWidth * .05,
                  height: 1,
                  thickness: 0.2,
                );
              },
            );
          },
          children: [
            ...List.generate(3, (index) {
              return ListTile(
                onTap: () {
                  appRouter.go(AppRouter.intro);
                  AppScaffoldState.navigationIndex.value = 1;
                },
                title: const Text('Lins'),
                leading: const SizedBox(
                  width: 25,
                  child: CircleAvatar(
                    backgroundColor: Colors.green,
                  ),
                ),
                trailing: const Icon(
                  Symbols.arrow_forward_ios,
                  size: 15,
                  weight: 600,
                ),
              );
            }),
          ],
        ),
      ),
    ),
  );
}

List<Widget> _buildCards(BuildContext context) {
  final picCard = Row(
    mainAxisAlignment: MainAxisAlignment.center,
    children: [
      const Spacer(),
      SizedBox(
        width: context.mq.size.width * 0.45,
        height: 200,
        child: Card.outlined(
          elevation: 3,
          shadowColor: Colors.transparent,
          clipBehavior: Clip.antiAliasWithSaveLayer,
          child: Column(
            children: [
              GestureDetector(
                child: Hero(
                  tag: 'card_top_hero',
                  flightShuttleBuilder: (
                    BuildContext flightContext,
                    Animation<double> animation,
                    HeroFlightDirection flightDirection,
                    BuildContext fromHeroContext,
                    BuildContext toHeroContext,
                  ) {
                    final Hero toHero = toHeroContext.widget as Hero;
                    //--------------rotate------------
                    return RotationTransition(
                      turns: animation,
                      child: toHero.child,
                    );
                    //-----------fade---------------
                    // return FadeTransition(
                    //   opacity: animation.drive(
                    //     Tween<double>(begin: 0.0, end: 1.0).chain(
                    //       CurveTween(
                    //         curve: Interval(
                    //           0.0,
                    //           1.0,
                    //           curve: _ValleyQuadraticCurve(),
                    //         ),
                    //       ),
                    //     ),
                    //   ),
                    //   child: toHero.child,
                    // );
                    //------------scale--------------
                    // return ScaleTransition(
                    //   scale: animation.drive(
                    //     Tween<double>(begin: 0.0, end: 1.0).chain(
                    //       CurveTween(
                    //         curve: Interval(0.0, 1.0,
                    //             curve: _PeakQuadraticCurve()),
                    //       ),
                    //     ),
                    //   ),
                    //   child: toHero.child,
                    // );
                    //-------------migrate--------------
                    // return ScaleTransition(
                    //   scale: animation.drive(
                    //     Tween<double>(begin: 0.0, end: 1.0).chain(
                    //       CurveTween(
                    //         curve: Interval(
                    //           0.0,
                    //           1.0,
                    //           curve: _PeakQuadraticCurve(),
                    //         ),
                    //       ),
                    //     ),
                    //   ),
                    //   child: flightDirection == HeroFlightDirection.push
                    //       ? RotationTransition(
                    //           turns: animation,
                    //           child: toHero.child,
                    //         )
                    //       : FadeTransition(
                    //           opacity: animation.drive(
                    //             Tween<double>(begin: 0.0, end: 1.0).chain(
                    //               CurveTween(
                    //                 curve: Interval(
                    //                   0.0,
                    //                   1.0,
                    //                   curve: _ValleyQuadraticCurve(),
                    //                 ),
                    //               ),
                    //             ),
                    //           ),
                    //           child: toHero.child,
                    //         ),
                    // );
                  },
                  child: ClipRRect(
                    borderRadius: const BorderRadius.only(
                      bottomLeft: Radius.circular(12),
                      bottomRight: Radius.circular(12),
                    ),
                    child: Image.asset(
                      'assets/settings/card_top.jpg',
                      fit: BoxFit.cover,
                      height: 120,
                    ),
                  ),
                ),
                onTap: () {
                  appRouter.go('/word/hero');
                },
              ),
            ],
          ),
        ),
      ),
      const Spacer(),
      Stack(
        children: <Widget>[
          SizedBox(
            width: context.mq.size.width * 0.45,
            height: 200,
            child: const Card(),
          ),
          ClipRect(
            child: BackdropFilter(
              filter: ImageFilter.blur(
                sigmaX: 5.0,
                sigmaY: 5.0,
              ),
              child: Container(
                width: context.mq.size.width * 0.45,
                height: 200,
                color: Colors.transparent,
              ),
            ),
          ),
        ],
      ),
      const Spacer(),
    ],
  );

  Widget build(value) {
    return SizedBox(
      key: ValueKey<String>(
        _WordScreenState.cardFade.value ? 'fd1' : 'fd2',
      ),
      width: value ? 220 : 110,
      height: value ? 250 : 125,
      child: GestureDetector(
        onTap: () {
          _WordScreenState.cardFade.value = !_WordScreenState.cardFade.value;
        },
        child: Card(
          child: Center(
            child: Text(
              'CrossFade',
              style: TextStyle(
                fontSize: value ? 16 : 12,
                height: 1,
                fontWeight: FontWeight.bold,
                background: Paint()
                  ..style = PaintingStyle.fill
                  ..strokeWidth = .1
                  ..color = Colors.orange,
              ),
            ),
          ),
        ),
      ),
    );
  }

  List<Widget> cards = [
    const Gap(20),
    ValueListenableBuilder(
      valueListenable: _WordScreenState.cardFade,
      builder: (BuildContext context, bool value, Widget? child) {
        return AnimatedCrossFade(
          duration: const Duration(milliseconds: 500),
          firstChild: build(true),
          secondChild: GestureDetector(
            onTap: () {
              _WordScreenState.cardFade.value =
                  !_WordScreenState.cardFade.value;
            },
            child: const SizedBox(
              width: 110,
              height: 125,
              child: CircleAvatar(
                backgroundImage: AssetImage(
                  'assets/settings/card_top.jpg',
                ),
              ),
            ),
          ),
          crossFadeState:
              value ? CrossFadeState.showFirst : CrossFadeState.showSecond,
        );
      },
    ),
    ValueListenableBuilder(
      valueListenable: _WordScreenState.cardSwitch,
      builder: (BuildContext context, bool value, Widget? child) {
        return AnimatedSwitcher(
          duration: const Duration(milliseconds: 300),
          transitionBuilder: (child, animation) {
            return SlideTransition(
              position: Tween<Offset>(
                begin: const Offset(-0.33, -0.55),
                end: const Offset(0, 0),
              ).animate(
                animation,
              ),
              child: FadeTransition(
                opacity: animation,
                child: child,
              ),
            );
          },
          child: SizedBox(
            key: ValueKey<String>(
              _WordScreenState.cardSwitch.value ? 'sw1' : 'sw2',
            ),
            width: value ? 220 : 110,
            height: value ? 250 : 125,
            child: GestureDetector(
              onTap: () {
                _WordScreenState.cardSwitch.value =
                    !_WordScreenState.cardSwitch.value;
              },
              child: Card(
                child: Center(
                  child: Text(
                    'Switcher',
                    style: TextStyle(
                      fontSize: value ? 16 : 12,
                      height: 1,
                      fontWeight: FontWeight.bold,
                      background: Paint()
                        ..style = PaintingStyle.fill
                        ..strokeWidth = .1
                        ..color = Colors.orange,
                    ),
                  ),
                ),
              ),
            ),
          ),
        );
      },
    ),
  ];

  cards.add(picCard);
  return cards;
}

Widget _buildFloatingBar(BuildContext context) {
  return FloatingActionButton.large(
    heroTag: 'b',
    onPressed: () {
      showModalBottomSheet<void>(
        context: context,
        builder: (BuildContext context) {
          return SizedBox(
            height: 200,
            child: Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                mainAxisSize: MainAxisSize.min,
                children: <Widget>[
                  const Text('Modal BottomSheet1'),
                  const SizedBox(height: 10),
                  const Divider(
                    indent: 10,
                    endIndent: 10,
                  ),
                  const SizedBox(height: 10),
                  ElevatedButton(
                    child: const Text('Close BottomSheet'),
                    onPressed: () => Navigator.pop(context),
                  ),
                ],
              ),
            ),
          );
        },
      );
    },
    tooltip: 'Large',
    child: const Icon(Icons.add),
  );
}

class _NotifierTest extends StatefulWidget {
  const _NotifierTest();

  @override
  State<_NotifierTest> createState() => _NotifierTestState();
}

class _NotifierTestState extends State<_NotifierTest> {
  static ValueNotifier<int> value = ValueNotifier(0);

  @override
  Widget build(BuildContext context) {
    return Center(
      child: ValueListenableBuilder<int>(
        valueListenable: value,
        builder: (BuildContext context, int value, Widget? child) {
          return Text(
            value.toString(),
            style: const TextStyle(
              fontSize: 16,
            ),
          );
        },
      ),
    );
  }
}

class _MarqueeWidget extends StatefulWidget {
  const _MarqueeWidget({
    required this.itemCount,
    required this.itemBuilder,
    this.loopDuration = const Duration(seconds: 1),
    this.axis = Axis.horizontal,
  });

  final int itemCount;
  final Duration loopDuration;
  final Axis axis;
  final IndexedWidgetBuilder itemBuilder;

  @override
  State<StatefulWidget> createState() => _MarqueeWidgetState();
}

class _MarqueeWidgetState extends State<_MarqueeWidget> {
  late PageController _controller;
  late Timer _timer;

  @override
  void initState() {
    _controller = PageController();
    _timer = Timer.periodic(widget.loopDuration, (timer) {
      if (_controller.page != null) {
        if (_controller.page!.round() >= widget.itemCount) {
          _controller.jumpToPage(0);
        }
        _controller.nextPage(
          duration: const Duration(seconds: 1),
          curve: Curves.linear,
        );
      }
    });
    super.initState();
  }

  @override
  void dispose() {
    _controller.dispose();
    _timer.cancel();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return PageView.builder(
      controller: _controller,
      scrollDirection: widget.axis,
      itemCount: widget.itemCount + 1,
      itemBuilder: (_, index) {
        final page = index % widget.itemCount;
        return widget.itemBuilder(context, page);
      },
    );
  }
}

class _LinearGradientTransform extends GradientTransform {
  final double value;
  final double offset;

  const _LinearGradientTransform(this.value, this.offset);

  @override
  Matrix4? transform(Rect bounds, {TextDirection? textDirection}) {
    final dist = value * (bounds.width + offset);
    return Matrix4.identity()..translate(-dist);
  }
}

class _GradientBoxBorder extends BoxBorder {
  final double width;
  final Gradient gradient;

  const _GradientBoxBorder({required this.gradient, this.width = 1.0});

  @override
  BorderSide get bottom => BorderSide.none;

  @override
  EdgeInsetsGeometry get dimensions => EdgeInsets.all(width);

  @override
  bool get isUniform => true;

  @override
  ShapeBorder scale(double t) {
    return this;
  }

  @override
  BorderSide get top => BorderSide.none;

  @override
  void paint(
    Canvas canvas,
    Rect rect, {
    TextDirection? textDirection,
    BoxShape shape = BoxShape.rectangle,
    BorderRadius? borderRadius,
  }) {
    switch (shape) {
      case BoxShape.circle:
        assert(
          borderRadius == null,
          'A borderRadius can only be given for rectangular boxes.',
        );
        _paintCircle(canvas, rect);
        break;
      case BoxShape.rectangle:
        if (borderRadius != null) {
          _paintRRect(canvas, rect, borderRadius);
          return;
        }
        _paintRect(canvas, rect);
        break;
    }
  }

  void _paintRect(Canvas canvas, Rect rect) {
    canvas.drawRect(rect.deflate(width / 2), _getPaint(rect));
  }

  void _paintRRect(Canvas canvas, Rect rect, BorderRadius borderRadius) {
    final rrect = borderRadius.toRRect(rect).deflate(width / 2);
    canvas.drawRRect(rrect, _getPaint(rect));
  }

  void _paintCircle(Canvas canvas, Rect rect) {
    final paint = _getPaint(rect);
    final radius = (rect.shortestSide - width) / 2.0;
    canvas.drawCircle(rect.center, radius, paint);
  }

  Paint _getPaint(Rect rect) {
    return Paint()
      ..style = PaintingStyle.stroke
      ..strokeWidth = width
      ..shader = gradient.createShader(rect);
  }
}

List<Widget> _buildChips(BuildContext context) {
  return [
    FilterChip(
      onSelected: (_) {
        showDialog<void>(
          context: context,
          barrierDismissible: false, // user must tap button!
          builder: (BuildContext context) {
            return AlertDialog(
              title: const Text('AlertDialog Title'),
              content: const SingleChildScrollView(
                child: ListBody(
                  children: <Widget>[
                    Text('This is a demo alert dialog.'),
                    Text('Would you like to approve of this message?'),
                  ],
                ),
              ),
              actions: <Widget>[
                TextButton(
                  child: const Text('Approve'),
                  onPressed: () {
                    Navigator.of(context).pop();
                  },
                ),
              ],
            );
          },
        );
      },
      label: const Text('Aaron Burr'),
    ),
    FilterChip(
      onSelected: (_) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('i am a snack bar...'),
            duration: Duration(seconds: 1),
          ),
        );
      },
      label: const Text('Snack Burr'),
    ),
  ];
}

Widget _buildSearch() {
  return SearchAnchor(
    builder: (BuildContext context, SearchController controller) {
      return SearchBar(
        controller: controller,
        padding: const MaterialStatePropertyAll<EdgeInsets>(
          EdgeInsets.symmetric(horizontal: 16.0),
        ),
        onTap: () {
          controller.openView();
        },
        onChanged: (_) {
          controller.openView();
        },
        leading: const Icon(Icons.search),
        trailing: <Widget>[
          Tooltip(
            message: 'Change brightness mode',
            child: IconButton(
              isSelected: false,
              onPressed: () {},
              icon: const Icon(Icons.wb_sunny_outlined),
              selectedIcon: const Icon(Icons.brightness_2_outlined),
            ),
          ),
        ],
      );
    },
    suggestionsBuilder: (BuildContext context, SearchController controller) {
      return List<ListTile>.generate(5, (int index) {
        final String item = 'item $index';
        return ListTile(
          title: Text(item),
          onTap: () {
            controller.closeView(item);
          },
        );
      });
    },
  );
}

Widget _buildTestValueNotifier(context) {
  return _TestVNWidget();
}

class _TestVNModel {
  late int number = 0;
  late List<String> text = [];
}

class _TestVNSingle extends ValueNotifier<_TestVNModel> {
  _TestVNSingle._newInstance() : super(_TestVNModel());

  static final _TestVNSingle instance = _TestVNSingle._newInstance();

  void add({required String s}) {
    value.text.add(s);
    value.number = value.text.length;
    notifyListeners();
  }

  void remove({required String s}) {
    value.text.remove(s);
    value.number = value.text.length;
    notifyListeners();
  }

  void clear() {
    value.number = 0;
    value.text.clear();
    notifyListeners();
  }
}

class _TestVNWidget extends StatelessWidget {
  final _TestVNSingle instance = _TestVNSingle.instance;
  final ValueNotifier<_TestVNModel> model = ValueNotifier(_TestVNModel());

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        ValueListenableBuilder(
          valueListenable: instance,
          builder: (BuildContext context, _TestVNModel value, Widget? child) {
            return Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                FloatingActionButton.small(
                  heroTag: 'c',
                  onPressed: () {
                    instance.add(
                      s: instance.value.text.length.toString(),
                    );
                  },
                  child: const Icon(Icons.add),
                ),
                const Gap(10),
                FloatingActionButton.small(
                  heroTag: 'd',
                  onPressed: () {
                    instance.remove(
                      s: (instance.value.text.length - 1).toString(),
                    );
                  },
                  child: const Icon(Icons.remove),
                ),
                const Gap(10),
                Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    ...List.generate(
                      instance.value.text.length,
                      (index) {
                        return Text(instance.value.text[index].toString());
                      },
                    ),
                  ],
                ),
              ],
            );
          },
        ),
        Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            FloatingActionButton.small(
              heroTag: 'e',
              onPressed: () {
                model.value = _TestVNModel()..number = model.value.number + 1;
              },
              child: const Text(
                'Change',
                style: TextStyle(fontSize: 8),
              ),
            ),
            const Gap(10),
            ValueListenableBuilder(
              valueListenable: model,
              builder:
                  (BuildContext context, _TestVNModel value, Widget? child) {
                return Text(
                  "${value.number}",
                  style: const TextStyle(fontSize: 16),
                );
              },
            ),
          ],
        ),
      ],
    );
  }
}

class _MoveModel {
  final AnimationController controller;
  final int content;

  _MoveModel({
    required this.controller,
    required this.content,
  });
}

class WordHeroPage extends StatelessWidget {
  const WordHeroPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Hero(
        tag: 'card_top_hero',
        child: Padding(
          padding: const EdgeInsets.all(10),
          child: Column(
            children: [
              Image.asset(
                // width: constraints.biggest.width,
                'assets/settings/card_top.jpg',
                fit: BoxFit.fitWidth,
              ),
              const Gap(20),
              const Expanded(
                child: Text('Hello World'),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class _ValleyQuadraticCurve extends Curve {
  @override
  double transform(double t) {
    assert(t >= 0.0 && t <= 1.0);
    return 4 * pow(t - 0.5, 2) as double;
  }
}

class _PeakQuadraticCurve extends Curve {
  @override
  double transform(double t) {
    assert(t >= 0.0 && t <= 1.0);
    return -15 * pow(t, 2) + 15 * t + 1;
  }
}
