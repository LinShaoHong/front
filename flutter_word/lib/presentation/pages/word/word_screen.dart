import '../../bloc/timer/timer_page.dart';
import '/common/libs.dart';

class WordScreen extends StatelessWidget {
  const WordScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return const Scaffold(
      body: Stack(
        children: [
          Column(
            children: [Expanded(child: SizedBox()), BottomBar()],
          )
        ],
      ),
    );
  }
}
