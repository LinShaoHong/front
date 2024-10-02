import 'dart:ui';

import '/common/libs.dart';

class IntroScreen extends StatelessWidget {
  const IntroScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return LayoutBuilder(
      builder: (BuildContext context, BoxConstraints constraints) {
        return Padding(
          padding: const EdgeInsets.only(
            top: 18.0,
            left: 8,
            right: 8,
            bottom: 8,
          ),
          child: ConstrainedBox(
            constraints: BoxConstraints(
              minHeight: context.mq.size.height,
            ),
            child: SingleChildScrollView(
              child: SeparatedColumn(
                separatorBuilder: () {
                  return const Gap(10);
                },
                children: [
                  _buildBackCover(),
                  const Divider(),
                  _buildTextOverlay(constraints.biggest.height),
                ],
              ),
            ),
          ),
        );
      },
    );
  }

  Widget _buildTextOverlay(double maxHeight) {
    List<String> tokens =
        "   With Flutter's animation library, you can add motion and create visual effects for the widgets in your UI. One part of the library is an assortment of widgets that manage animations for you. These widgets are collectively referred to as implicit animations, or implicitly animated widgets, deriving their name from the ImplicitlyAnimatedWidget class that they implement. The following set of resources provide many ways to learn about implicit animations in Flutter With Flutter's animation library, you can add motion and create visual effects for the widgets in your UI. One part of the library is an assortment of widgets that manage animations for you. These widgets are collectively referred to as implicit animations, or implicitly animated widgets, deriving their name from the ImplicitlyAnimatedWidget class that they implement. The following set of resources provide many ways to learn about implicit animations in Flutter With Flutter's animation library, you can add motion and create visual effects for the widgets in your UI. One part of the library is an assortment of widgets that manage animations for you. These widgets are collectively referred to as implicit animations, or implicitly animated widgets, deriving their name from the ImplicitlyAnimatedWidget class that they implement. The following set of resources provide many ways to learn about implicit animations in Flutter With Flutter's animation library, you can add motion and create visual effects for the widgets in your UI. One part of the library is an assortment of widgets that manage animations for you. These widgets are collectively referred to as implicit animations, or implicitly animated widgets, deriving their name from the ImplicitlyAnimatedWidget class that they implement. The following set of resources provide many ways to learn about implicit animations in Flutter"
            .split(" ");
    return LayoutBuilder(
      builder: (BuildContext context, BoxConstraints constraints) {
        return Text.rich(
          TextSpan(
            children: tokens.map((token) {
              return WidgetSpan(
                child: Container(
                  margin: const EdgeInsets.only(right: 6),
                  child: _TokenWidget(
                    maxHeight: maxHeight,
                    token: token,
                    viewportHeight: constraints.maxHeight,
                  ),
                ),
              );
            }).toList(),
          ),
        );
      },
    );
  }
}

class _TokenWidget extends StatefulWidget {
  const _TokenWidget({
    required this.maxHeight,
    required this.viewportHeight,
    required this.token,
  });

  final double maxHeight;
  final double viewportHeight;
  final String token;

  @override
  State<_TokenWidget> createState() => _TokenWidgetState();
}

class _TokenWidgetState extends State<_TokenWidget>
    with TickerProviderStateMixin {
  late AnimationController _fadeController;
  late AnimationController _scaleController;
  late final OverlayPortalController _overlayController =
      OverlayPortalController();
  late OverlayEntry entry;
  late double overlayHeight = 200.0;
  final int duration = 200;
  final double opacity = 0.2;
  final ValueNotifier<bool> flat = ValueNotifier(false);

  @override
  void initState() {
    _scaleController = AnimationController(
      duration: Duration(milliseconds: duration),
      vsync: this,
    );
    _fadeController = AnimationController(
      duration: Duration(milliseconds: (duration / 2).floor()),
      vsync: this,
    );
    super.initState();
  }

  @override
  void dispose() {
    _scaleController.dispose();
    _fadeController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: () {
        _overlayController.toggle();
        _scaleController.forward();
        _fadeController.forward();
      },
      child: OverlayPortal(
        controller: _overlayController,
        overlayChildBuilder: (_) {
          return _buildOverlayEntry(context, widget.token);
        },
        child: _buildContent(widget.token),
      ),
    );
  }

  Widget _buildOverlayEntry(BuildContext context, String token) {
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
    bool down = position.pixels - offsetRevealToTop.offset - box.size.height >
        overlayHeight;
    double overlayWidth = context.mq.size.width * 0.9;
    double alignX =
        (-offset.dx + box.size.width / 2 - context.mq.size.width / 2) /
            (overlayWidth / 2);
    return Stack(
      children: [
        Positioned.fill(
          child: GestureDetector(
            onTap: () {
              _scaleController.reverse();
              _fadeController.reverse();
              if (flat.value) {
                flat.value = !flat.value;
              }
              Future.delayed(Duration(milliseconds: duration))
                  .then((value) => _overlayController.toggle());
            },
            child: FadeTransition(
              opacity: _fadeController,
              child: Container(
                color: Colors.black.withOpacity(opacity),
              ),
            ),
          ),
        ),
        ValueListenableBuilder<bool>(
          valueListenable: flat,
          builder: (BuildContext context, bool value, Widget? child) {
            return Positioned(
              top: flat.value
                  ? 0.05 * widget.maxHeight
                  : (down
                      ? (box.size.height -
                          offset.dy -
                          appManager.safeAreaPaddingTop)
                      : (-offset.dy -
                          overlayHeight -
                          appManager.safeAreaPaddingTop)),
              left: context.mq.size.width * 0.05,
              child: AnimatedCrossFade(
                duration: const Duration(milliseconds: 200),
                crossFadeState: !flat.value
                    ? CrossFadeState.showSecond
                    : CrossFadeState.showFirst,
                layoutBuilder: (
                  Widget topChild,
                  Key topChildKey,
                  Widget bottomChild,
                  Key bottomChildKey,
                ) {
                  return Stack(
                    clipBehavior: Clip.none,
                    children: <Widget>[
                      Positioned(
                        key: bottomChildKey,
                        top: 0.9 * widget.maxHeight,
                        child: bottomChild,
                      ),
                      Positioned(
                        key: topChildKey,
                        child: topChild,
                      ),
                    ],
                  );
                },
                firstChild: _buildOverlayContent(alignX, down, token, value),
                secondChild: _buildOverlayContent(alignX, down, token, value),
              ),
            );
          },
        ),
      ],
    );
  }

  Widget _buildOverlayContent(
    double alignX,
    bool down,
    String token,
    bool value,
  ) {
    return ScaleTransition(
      key: ValueKey<String>(flat.value ? 'tk1' : 'tk2'),
      scale: _scaleController,
      alignment: Alignment(alignX, down ? -1.0 : 1.0),
      child: GestureDetector(
        onTap: () {
          flat.value = !flat.value;
        },
        child: CustomPaint(
          painter: _OverlayPainter(
            alignX: alignX,
            down: down,
            color: context.colorSchema.surface,
            hasPoint: !value,
          ),
          child: SizedBox(
            width: context.mq.size.width * 0.9,
            height: value ? 0.9 * widget.maxHeight : overlayHeight,
            child: Padding(
              padding: down
                  ? const EdgeInsets.only(top: 10)
                  : const EdgeInsets.only(bottom: 10),
              child: Center(
                child: Text(
                  token,
                  style: const TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildContent(String token) {
    return Text(token)
        .animate()
        .scale(
          duration: const Duration(milliseconds: 600),
          begin: const Offset(.88, .88),
          end: const Offset(1, 1),
          curve: const Interval(0, 0.5, curve: Curves.fastOutSlowIn),
        )
        .fade(
          duration: const Duration(milliseconds: 600),
          curve: const Interval(0, 1, curve: Curves.fastOutSlowIn),
        )
        .move(
          duration: const Duration(milliseconds: 600),
          begin: const Offset(0, 30),
          end: const Offset(0, 0),
          curve: const Interval(0, 0.5, curve: Curves.fastOutSlowIn),
        );
  }
}

class _OverlayPainter extends CustomPainter {
  final bool down;
  final double alignX;
  final Color color;
  final bool hasPoint;

  _OverlayPainter({
    required this.down,
    required this.alignX,
    required this.color,
    required this.hasPoint,
  });

  @override
  void paint(Canvas canvas, Size size) {
    final path = Path();
    const double radius = 10;
    double len = hasPoint ? 10 : 0;
    double pos = (1 + alignX) * size.width / 2;
    pos = pos < radius ? radius : pos;
    pos = pos > size.width - radius ? size.width - radius : pos;

    path.moveTo(0, down ? len : size.height - len);
    path.arcTo(
      Rect.fromLTWH(
        0,
        down ? len : (size.height - len - radius),
        radius,
        radius,
      ),
      pi,
      down ? 0.5 * pi : -0.5 * pi,
      false,
    );
    path.lineTo(pos - len / 2, down ? len : size.height - len);
    path.lineTo(pos, down ? 0 : size.height);
    path.lineTo(pos + len / 2, down ? len : size.height - len);
    path.lineTo(size.width, down ? len : size.height - len);
    path.arcTo(
      Rect.fromLTWH(
        size.width - radius,
        down ? len : size.height - len - radius,
        radius,
        radius,
      ),
      down ? 1.5 * pi : 0.5 * pi,
      down ? 0.5 * pi : -0.5 * pi,
      false,
    );
    path.lineTo(size.width, down ? size.height : 0);
    path.arcTo(
      Rect.fromLTWH(
        size.width - radius,
        down ? size.height - radius : 0,
        radius,
        radius,
      ),
      0,
      down ? 0.5 * pi : -0.5 * pi,
      false,
    );
    path.lineTo(0, down ? size.height : 0);
    path.arcTo(
      Rect.fromLTWH(
        0,
        down ? size.height - radius : 0,
        radius,
        radius,
      ),
      down ? 0.5 * pi : 1.5 * pi,
      down ? 0.5 * pi : -0.5 * pi,
      false,
    );
    path.lineTo(0, down ? len : size.height - len);
    path.close();

    Paint paint = Paint()..color = color;
    canvas.drawPath(path, paint);
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) {
    return true;
  }
}

Widget _buildBackCover() {
  return Container(
    height: 200,
    //整体渐变色
    decoration: const BoxDecoration(
      gradient: LinearGradient(
        begin: Alignment.topCenter,
        end: Alignment.bottomCenter,
        colors: <Color>[
          Color(0xFF677897),
          Color(0xFF6C6D97),
        ],
      ),
    ),
    child: Stack(
      children: [
        Positioned(
          top: 26,
          right: 63,
          child: Container(
            height: 130,
            width: 130,
            decoration: const BoxDecoration(
              color: Color(0xFF9A8AA7),
              borderRadius: BorderRadius.all(Radius.circular(65)),
            ),
          ),
        ),
        Positioned(
          top: 117,
          left: -35,
          child: Container(
            height: 130,
            width: 130,
            decoration: const BoxDecoration(
              color: Color(0xFFA7948A),
              borderRadius: BorderRadius.all(Radius.circular(65)),
            ),
          ),
        ),
        Positioned(
          top: 52,
          right: -14,
          child: Container(
            height: 130,
            width: 130,
            decoration: const BoxDecoration(
              color: Color(0xFF505EB4),
              borderRadius: BorderRadius.all(Radius.circular(65)),
            ),
          ),
        ),
        BackdropFilter(
          filter: ImageFilter.blur(sigmaX: 15, sigmaY: 15),
          child: Container(
            color: Colors.white.withAlpha(0),
          ),
        ),
      ],
    ),
  );
}
