import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

void main() {
  WidgetsFlutterBinding.ensureInitialized();
  SystemChrome.setPreferredOrientations([
    DeviceOrientation.landscapeLeft,
    DeviceOrientation.landscapeRight
  ]);
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return const MaterialApp(
      title: "Adaptive-App",
      home: HomePage(),
    );
  }
}

class HomePage extends StatefulWidget {
  const HomePage({Key? key}) : super(key: key);

  @override
  _HomePage createState() => _HomePage();
}

class _HomePage extends State<HomePage> with SingleTickerProviderStateMixin {
  var selectedValue = 0;
  var isLargeScreen = false;
  late TabController _tabController;

  @override
  void initState() {
    super.initState();
    _tabController = TabController(vsync: this, length: 2);
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
        appBar: AppBar(
          elevation: 0,
          shadowColor: Colors.green,
          shape: const ContinuousRectangleBorder(
              side: BorderSide(color: Colors.red, width: 5)),
          bottom: TabBar(
            controller: _tabController,
            tabs: const [
              Tab(
                text: "火车",
                icon: Icon(Icons.bus_alert),
              ),
              Tab(
                text: "汽车",
                icon: Icon(Icons.bus_alert),
              )
            ],
          ),
        ),
        body: ListWidget(20, (value) {
          Navigator.push(context, MaterialPageRoute(
            builder: (context) {
              return DetailPage(value);
            },
          ));
        }));
  }
}

class DetailPage extends StatefulWidget {
  final int data;

  const DetailPage(this.data, {Key? key}) : super(key: key);

  @override
  _DetailPage createState() => _DetailPage();
}

class _DetailPage extends State<DetailPage> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(appBar: AppBar(), body: DetailWidget(widget.data));
  }
}

typedef ItemSelectedCallback = Null Function(int value);

class ListWidget extends StatefulWidget {
  final int count;
  final ItemSelectedCallback onItemSelected;

  const ListWidget(this.count, this.onItemSelected, {Key? key})
      : super(key: key);

  @override
  _ListWidgetState createState() => _ListWidgetState();
}

class _ListWidgetState extends State<ListWidget> {
  @override
  Widget build(BuildContext context) {
    return ListView.builder(
        itemCount: widget.count,
        itemBuilder: (context, position) {
          return Padding(
            padding: const EdgeInsets.all(8.0),
            child: Card(
              child: InkWell(
                onTap: () {
                  widget.onItemSelected(position);
                },
                child: Row(
                  children: <Widget>[
                    Padding(
                      padding: const EdgeInsets.all(16.0),
                      child: Text(
                        position.toString(),
                        style: const TextStyle(fontSize: 22.0),
                      ),
                    )
                  ],
                ),
              ),
            ),
          );
        });
  }
}

class DetailWidget extends StatefulWidget {
  final int data;

  const DetailWidget(this.data, {Key? key}) : super(key: key);

  @override
  _DetailWidget createState() => _DetailWidget();
}

class _DetailWidget extends State<DetailWidget> {
  @override
  Widget build(BuildContext context) {
    return Container(
      color: Colors.blue,
      child: Center(
          child: Text(
        widget.data.toString(),
        style: const TextStyle(fontSize: 36.0, color: Colors.white),
      )),
    );
  }
}
