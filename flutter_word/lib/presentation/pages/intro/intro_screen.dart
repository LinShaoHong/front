import '/common/libs.dart';

class IntroScreen extends StatelessWidget {
  const IntroScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(
        top: 18.0,
      ),
      child: LayoutBuilder(
        builder: (BuildContext context, BoxConstraints constraints) {
          return Center(
            child: SingleChildScrollView(
              scrollDirection: Axis.vertical,
              child: SeparatedColumn(
                separatorBuilder: () {
                  return const Gap(20);
                },
                children: List.generate(20, (index) {
                  return _CardItem(
                    viewportHeight: constraints.maxHeight,
                  );
                }),
              ),
            ),
          );
        },
      ),
    );
  }
}

class _CardItem extends StatefulWidget {
  const _CardItem({required this.viewportHeight});

  final double viewportHeight;

  @override
  State<_CardItem> createState() => _CardItemState();
}

class _CardItemState extends State<_CardItem> {
  late OverlayEntry entry;
  late double overlayHeight = 200.0;

  void _createOverlay(BuildContext context) {
    ScrollableState scrollableState = Scrollable.of(context);
    ScrollPosition position = scrollableState.position;
    RenderBox box = context.findRenderObject() as RenderBox;
    Offset offset = box.globalToLocal(Offset.zero);
    RenderAbstractViewport viewport = RenderAbstractViewport.of(box);
    RevealedOffset offsetRevealToTop = viewport.getOffsetToReveal(
      box,
      1.0,
      rect: Rect.zero,
    );
    bool bottom = position.pixels - offsetRevealToTop.offset - box.size.height >
        overlayHeight;
    entry = OverlayEntry(
      builder: (context) {
        return Stack(
          children: [
            Positioned.fill(
              child: GestureDetector(
                onTap: () {
                  _removeOverlay();
                },
                child: Container(
                  color: Colors.black.withOpacity(0.1),
                ),
              ),
            ).animate().fade(
                  duration: const Duration(milliseconds: 100),
                ),
            Positioned(
              top: bottom
                  ? (box.size.height -
                      offset.dy -
                      appManager.safeAreaPaddingTop)
                  : (-offset.dy -
                      overlayHeight -
                      appManager.safeAreaPaddingTop),
              left: context.mq.size.width * 0.05,
              child: Container(
                width: context.mq.size.width * 0.9,
                height: overlayHeight,
                decoration: BoxDecoration(
                  color: context.colorSchema.surface,
                  borderRadius: BorderRadius.circular(10),
                  boxShadow: <BoxShadow>[
                    BoxShadow(
                      color: context.colorSchema.surfaceVariant,
                      blurRadius: 12,
                    ),
                  ],
                ),
              ).animate().scale(
                    duration: const Duration(milliseconds: 200),
                    alignment:
                        bottom ? Alignment.topCenter : Alignment.bottomCenter,
                  ),
            ),
          ],
        );
      },
    );
    Overlay.of(context).insert(entry!);
  }

  void _removeOverlay() {
    entry.remove();
  }

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: () {
        _createOverlay(context);
      },
      child: const SizedBox(
        width: 100,
        height: 50,
        child: Card(
          child: Center(
            child: Text('Hello'),
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
            curve: const Interval(0, 0.5, curve: Curves.fastOutSlowIn),
          ),
    );
  }
}
