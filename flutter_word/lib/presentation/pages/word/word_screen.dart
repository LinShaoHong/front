import '/common/libs.dart';

class WordScreen extends StatelessWidget {
  const WordScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return const WithBottomBar(
       has:false,
        child: Card(
      elevation: 6,
      child: Text(
        'aaaaa',
        style: TextStyle(fontSize: 14),
      ),
    ));
  }
}
