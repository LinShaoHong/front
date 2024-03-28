import '/common/libs.dart';

class WordScreen extends StatelessWidget {
  const WordScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return WithBottomBar(
      has: false,
      child: Center(
          child: InkWell(
        onTap: () {
          themeHolder.update(LimeAppTheme());
        },
        child: const Card(
          elevation: 6,
          child: Text(
            'aaaaa',
            style: TextStyle(fontSize: 14),
          ),
        ),
      )),
    );
  }
}
