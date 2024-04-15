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
  String selectedPage = '';

  @override
  void initState() {
    _tabController = TabController(length: 9, vsync: this);
    _progressController =
        AnimationController(duration: const Duration(seconds: 10), vsync: this);
    _progressController.repeat(reverse: true);
    super.initState();
  }

  @override
  void dispose() {
    _tabController.dispose();
    _progressController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Word'),
        surfaceTintColor: Colors.transparent,
      ),
      drawer: Drawer(
        shape: const RoundedRectangleBorder(),
        backgroundColor: context.theme.colorScheme.surface,
        surfaceTintColor: context.theme.colorScheme.surfaceTint,
        elevation: 3,
        width: context.mq.size.width * 0.8,
        child: ListView(
          padding: EdgeInsets.zero,
          children: <Widget>[
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
          ],
        ),
      ),
      body: Center(
        child: SingleChildScrollView(
          child: Column(
            children: [
              ...List.generate(1, (index) {
                return SizedBox(
                  width: 220,
                  height: 250,
                  child: Card(
                    child: Center(
                      child: Text(
                        'word',
                        style: TextStyle(
                          fontSize: 16,
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
                )
                    .animate()
                    .scale(
                        duration: const Duration(milliseconds: 600),
                        begin: const Offset(.88, .88),
                        end: const Offset(1, 1),
                        curve:
                            const Interval(0, 0.5, curve: Curves.fastOutSlowIn))
                    .fade(
                        duration: const Duration(milliseconds: 600),
                        curve:
                            const Interval(0, 1, curve: Curves.fastOutSlowIn))
                    .move(
                      duration: const Duration(milliseconds: 600),
                      begin: const Offset(0, 30),
                      end: const Offset(0, 0),
                      curve:
                          const Interval(0, 0.5, curve: Curves.fastOutSlowIn),
                    );
              }),
              const Gap(20),
              ..._buildText(),
              const Gap(20),
              const Text('Single choice'),
              const SingleChoice(),
              const Gap(20),
              const Text('Multiple choice'),
              const MultipleChoice(),
              const Gap(20),
              const Text('Mode choice'),
              const LightDarkChoice(),
              const Gap(20),
              Theme(
                data: context.theme.copyWith(
                  listTileTheme: const ListTileThemeData(
                    iconColor: Colors.grey,
                  ),
                ),
                child: SizedBox(
                  width: context.mq.size.width * 0.95,
                  child: Card.outlined(
                    child: ListView.separated(
                        shrinkWrap: true,
                        itemCount: 3,
                        separatorBuilder: (_, index) {
                          return LayoutBuilder(builder: (_, c) {
                            return Divider(
                              indent: c.maxWidth * .05,
                              endIndent: c.maxWidth * .05,
                              height: 1,
                              thickness: 0.2,
                            );
                          });
                        },
                        itemBuilder: (_, index) {
                          return ListTile(
                            onTap: () {
                              appRouter.go(AppRouter.intro);
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
                  ),
                ),
              ),
              const Gap(20),
              Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  const Spacer(),
                  SizedBox(
                    width: context.mq.size.width * 0.45,
                    height: 200,
                    child: Card.outlined(
                      clipBehavior: Clip.antiAliasWithSaveLayer,
                      child: Stack(
                        children: [
                          Positioned.fill(
                            child: Container(
                              decoration: BoxDecoration(
                                color: context
                                    .theme.colorScheme.secondaryContainer,
                              ),
                            ),
                          ),
                          Column(
                            children: [
                              ClipRRect(
                                borderRadius: const BorderRadius.only(
                                  bottomLeft: Radius.circular(15),
                                  bottomRight: Radius.circular(15),
                                ),
                                child: Image.asset(
                                  'assets/settings/card_top.jpg',
                                  fit: BoxFit.cover,
                                  height: 120,
                                ),
                              ),
                            ],
                          ),
                        ],
                      ),
                    ),
                  ),
                  const Spacer(),
                  SizedBox(
                    width: context.mq.size.width * 0.45,
                    height: 200,
                    child: const Card.outlined(),
                  ),
                  const Spacer(),
                ],
              ),
              const Gap(20),
              FloatingActionButton.large(
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
              ),
              const Gap(20),
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
                              Text(
                                  'Would you like to approve of this message?'),
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
                  ScaffoldMessenger.of(context).showSnackBar(const SnackBar(
                    content: Text('i am a snack bar...'),
                    duration: Duration(seconds: 1),
                  ));
                },
                label: const Text('Snack Burr'),
              ),
              const Gap(20),
              SearchAnchor(
                  builder: (BuildContext context, SearchController controller) {
                return SearchBar(
                  controller: controller,
                  padding: const MaterialStatePropertyAll<EdgeInsets>(
                      EdgeInsets.symmetric(horizontal: 16.0)),
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
              }, suggestionsBuilder:
                      (BuildContext context, SearchController controller) {
                return List<ListTile>.generate(5, (int index) {
                  final String item = 'item $index';
                  return ListTile(
                    title: Text(item),
                    onTap: () {
                      controller.closeView(item);
                    },
                  );
                });
              }),
              const Gap(20),
              Slider(
                value: _currentSliderValue,
                max: 100,
                divisions: 5,
                label: _currentSliderValue.round().toString(),
                onChanged: (double value) {
                  _currentSliderValue = value;
                  setState(() {});
                },
              ),
              const Gap(20),
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
              const Gap(20),
              AnimatedBuilder(
                animation: _progressController,
                builder: (_, w) {
                  return RefreshProgressIndicator(
                    value: _progressController.value,
                  );
                },
              ),
              const Gap(20),
              AnimatedBuilder(
                animation: _progressController,
                builder: (_, w) {
                  return CircularProgressIndicator(
                    value: _progressController.value,
                  );
                },
              ),
              const Gap(20),
              AnimatedBuilder(
                animation: _progressController,
                builder: (_, w) {
                  return LinearProgressIndicator(
                    value: _progressController.value,
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
              LayoutBuilder(builder: (_, c) {
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
              }),
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
            icon: Icon(Icons.calendar_view_day)),
        ButtonSegment<Calendar>(
            value: Calendar.week,
            label: Text('Week'),
            icon: Icon(Icons.calendar_view_week)),
        ButtonSegment<Calendar>(
            value: Calendar.month,
            label: Text('Month'),
            icon: Icon(Icons.calendar_view_month)),
        ButtonSegment<Calendar>(
            value: Calendar.year,
            label: Text('Year'),
            icon: Icon(Icons.calendar_today)),
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

List<Widget> _buildText() {
  return [
    Text.rich(
      TextSpan(
        children: [
          const TextSpan(
            text: 'multiple ',
          ),
          const TextSpan(
            text: 'styles',
          ),
          WidgetSpan(
            child: Container(
              margin: const EdgeInsets.only(left: 4, right: 4),
              child: const Stack(
                children: [
                  Text(
                    'Hello',
                    style: TextStyle(
                      fontSize: 18,
                      height: .5,
                      color: Colors.transparent,
                      decoration: TextDecoration.underline,
                      decorationStyle: TextDecorationStyle.solid,
                      decorationColor: Colors.orange,
                      decorationThickness: 8,
                    ),
                  ),
                  Text(
                    'Hello',
                    style: TextStyle(
                      height: 1,
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ],
              ),
            ),
          ),
          const TextSpan(
            text: 'world',
          ),
        ],
      ),
    ),
    const Gap(20),
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
    const Gap(20),
    AnimatedTextKit(
      animatedTexts: [
        FadeAnimatedText(
          'Product Name',
          textStyle: const TextStyle(
            fontSize: 30.0,
            fontWeight: FontWeight.bold,
          ),
          duration: const Duration(milliseconds: 500),
        ),
      ],
      totalRepeatCount: 4,
      pause: const Duration(milliseconds: 500),
    ),
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
  ];
}
