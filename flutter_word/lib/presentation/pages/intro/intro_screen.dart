import '/common/libs.dart';

class IntroScreen extends StatelessWidget {
  const IntroScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Column(
      children: List.generate(20, (index) {
        return const Text('bbb');
      }),
    );
  }
}