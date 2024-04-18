import '/common/libs.dart';

class IntroScreen extends StatelessWidget {
  const IntroScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(top: 18),
      child: SingleChildScrollView(
        scrollDirection: Axis.horizontal,
        child: Center(
          child: Row(
            children: List.generate(20, (index) {
              return const SizedBox(
                width: 100,
                height: 100,
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
                      curve:
                          const Interval(0, 0.5, curve: Curves.fastOutSlowIn))
                  .fade(
                      duration: const Duration(milliseconds: 600),
                      curve: const Interval(0, 1, curve: Curves.fastOutSlowIn))
                  .move(
                    duration: const Duration(milliseconds: 600),
                    begin: const Offset(0, 30),
                    end: const Offset(0, 0),
                    curve: const Interval(0, 0.5, curve: Curves.fastOutSlowIn),
                  );
            }),
          ),
        ),
      ),
    );
  }
}
