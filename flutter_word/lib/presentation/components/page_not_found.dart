import '/common/libs.dart';

class PageNotFound extends StatelessWidget {
  final String url;

  const PageNotFound({super.key, required this.url});

  @override
  Widget build(BuildContext context) {
    return const Scaffold(
      body: Text("404"),
    );
  }
}
