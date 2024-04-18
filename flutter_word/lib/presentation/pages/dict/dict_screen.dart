import '/common/libs.dart';

class DictScreen extends StatelessWidget {
  DictScreen({super.key});

  final ValueNotifier<_Pos> _pos =
      ValueNotifier(_Pos(topPosition: 0.0, leftPosition: 0.0));

  double generateTopPosition(double top) => Random().nextDouble() * top;

  double generateLeftPosition(double left) => Random().nextDouble() * left;

  @override
  Widget build(BuildContext context) {
    final appBar = AppBar(title: const Text('AnimatedPositioned'));
    final topPadding = MediaQuery.of(context).padding.top;
    return Scaffold(
      appBar: appBar,
      body: LayoutBuilder(
        builder: (BuildContext context, BoxConstraints constraints) {
          return SizedBox(
            height: constraints.maxHeight,
            width: constraints.maxWidth,
            child: Stack(
              children: [
                ValueListenableBuilder<_Pos>(
                  valueListenable: _pos,
                  builder: (BuildContext context, _Pos value, Widget? child) {
                    return AnimatedPositioned(
                      top: value.topPosition,
                      left: value.leftPosition,
                      duration: const Duration(seconds: 1),
                      child: InkWell(
                        onTap: () {
                          double top = constraints.maxHeight -
                              (appBar.preferredSize.height + topPadding + 50);
                          double left = constraints.maxWidth - 150;
                          _pos.value = _Pos(
                            topPosition: generateTopPosition(top),
                            leftPosition: generateTopPosition(left),
                          );
                        },
                        child: Container(
                          alignment: Alignment.center,
                          width: 150,
                          height: 50,
                          color: Theme.of(context).primaryColor,
                          child: Text(
                            'Click Me',
                            style: TextStyle(
                              color: Theme.of(context)
                                  .buttonTheme
                                  .colorScheme!
                                  .onPrimary,
                            ),
                          ),
                        ),
                      ),
                    );
                  },
                ),
              ],
            ),
          );
        },
      ),
    );
  }
}

class _Pos {
  final double topPosition;
  final double leftPosition;

  _Pos({required this.topPosition, required this.leftPosition});
}
