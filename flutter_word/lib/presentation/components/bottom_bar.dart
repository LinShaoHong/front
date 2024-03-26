import '/common/libs.dart';

class BottomBar extends StatefulWidget {
  final Function(int index)? changeIndex;

  const BottomBar({super.key, this.changeIndex});

  @override
  BottomBarState createState() => BottomBarState();
}

class BottomBarState extends State<BottomBar> with TickerProviderStateMixin {
  AnimationController? animationController;

  @override
  void initState() {
    animationController =
        AnimationController(vsync: this, duration: const Duration(seconds: 1));
    animationController?.forward();
    super.initState();
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      color: $styles.colors.white,
      alignment: Alignment.bottomCenter,
      child: Column(
        children: [
          SizedBox(
            height: 62,
            child: Padding(
              padding: const EdgeInsets.only(left: 8, right: 8, top: 4),
              child: buildTabs(),
            ),
          ),
          SizedBox(height: MediaQuery.of(context).padding.bottom)
        ],
      ),
    );
  }

  Widget buildTabs() {
    List<_TabModel> list = _TabModel.tabIconsList;
    return Row(children: [
      Expanded(child: _Tab(tab: list[0])),
      Expanded(child: _Tab(tab: list[1])),
      Expanded(child: _Tab(tab: list[2])),
      Expanded(child: _Tab(tab: list[3]))
    ]);
  }
}

class _Tab extends StatefulWidget {
  final _TabModel? tab;

  const _Tab({this.tab});

  @override
  _TabState createState() => _TabState();
}

class _TabState extends State<_Tab> with TickerProviderStateMixin {
  @override
  void initState() {
    widget.tab!.animationController = AnimationController(
        vsync: this, duration: const Duration(microseconds: 400))
      ..addStatusListener((status) {
        if (status == AnimationStatus.completed) {
          if (!mounted) return;
          widget.tab?.animationController?.reverse();
        }
      });
    super.initState();
  }

  @override
  Widget build(BuildContext context) {
    return AspectRatio(
      aspectRatio: 1,
      child: Center(
        child: InkWell(
          splashColor: Colors.transparent,
          focusColor: Colors.transparent,
          highlightColor: Colors.transparent,
          hoverColor: Colors.transparent,
          onTap: () {
            if (!widget.tab!.isSelected) {
              widget.tab?.animationController?.forward();
            }
          },
          child: IgnorePointer(
            child: Image.asset(widget.tab!.image())
                .animate(controller: widget.tab?.animationController)
                .scale(
                    begin: const Offset(.88, .88),
                    end: const Offset(1, 1),
                    curve: Curves.fastOutSlowIn),
          ),
        ),
      ),
    );
  }
}

class _TabModel {
  _TabModel({
    this.imagePath = '',
    this.index = 0,
    this.selectedImagePath = '',
    this.isSelected = false,
    this.animationController,
  });

  String imagePath;
  String selectedImagePath;
  bool isSelected;
  int index;

  AnimationController? animationController;

  String image() {
    return isSelected ? selectedImagePath : imagePath;
  }

  static List<_TabModel> tabIconsList = <_TabModel>[
    _TabModel(
      imagePath: 'assets/tabs/tab_1.png',
      selectedImagePath: 'assets/tabs/tab_1s.png',
      index: 0,
      isSelected: true,
      animationController: null,
    ),
    _TabModel(
      imagePath: 'assets/tabs/tab_2.png',
      selectedImagePath: 'assets/tabs/tab_2s.png',
      index: 1,
      isSelected: false,
      animationController: null,
    ),
    _TabModel(
      imagePath: 'assets/tabs/tab_3.png',
      selectedImagePath: 'assets/tabs/tab_3s.png',
      index: 2,
      isSelected: false,
      animationController: null,
    ),
    _TabModel(
      imagePath: 'assets/tabs/tab_4.png',
      selectedImagePath: 'assets/tabs/tab_4s.png',
      index: 3,
      isSelected: false,
      animationController: null,
    ),
  ];
}
