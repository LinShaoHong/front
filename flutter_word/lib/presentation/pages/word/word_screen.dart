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

  @override
  void initState() {
    _tabController = TabController(length: 9, vsync: this);
    _progressController =
        AnimationController(duration: const Duration(seconds: 1), vsync: this)
          ..addListener(() {
            setState(() {});
          });
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
    return SingleChildScrollView(
      child: Column(
        children: [
          const Gap(20),
          ...List.generate(1, (index) {
            return const SizedBox(
              width: 220,
              height: 250,
              child: Card(
                child: Center(
                  child: Text('aaa'),
                ),
              ),
            )
                .animate()
                .scale(
                    duration: const Duration(milliseconds: 600),
                    begin: const Offset(.88, .88),
                    end: const Offset(1, 1),
                    curve: const Interval(0, 0.5, curve: Curves.fastOutSlowIn))
                .fade(
                    duration: const Duration(milliseconds: 600),
                    curve: const Interval(0, 1, curve: Curves.fastOutSlowIn))
                .move(
                    duration: const Duration(milliseconds: 600),
                    begin: const Offset(0, 30),
                    end: const Offset(0, 0),
                    curve: const Interval(0, 0.5, curve: Curves.fastOutSlowIn));
          }),
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
                )
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
          CircularProgressIndicator(
            value: _progressController.value,
          ),
          const Gap(20),
          RefreshProgressIndicator(
            value: _progressController.value,
          ),
          const Gap(20),
          LinearProgressIndicator(
            value: _progressController.value,
          ),
        ],
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
