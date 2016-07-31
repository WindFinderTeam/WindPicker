import  React, {Component} from 'react';
import {
    AppRegistry,
    StyleSheet,
    ScrollView,
    Text,
    Image,
    ToolbarAndroid,
    DrawerLayoutAndroid,
    View
} from 'react-native';


// https://github.com/skv-headless/react-native-scrollable-tab-view
var ScrollableTabView = require('react-native-scrollable-tab-view');
import CustomTabbar from './CustomTabbar';

//https://github.com/oblador/react-native-vector-icons
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

class WindFinder extends Component {

  openDrawer() {
    this.refs['DRAWER'].openDrawer()
  }

  render() {
    var navigationView = (
        <View style={styles.drawer}>
  <Text style={{margin: 10, fontSize: 15, textAlign: 'left'}}>I'm in the Drawer2!</Text>
    </View>
  );

    return (
        <DrawerLayoutAndroid
    drawerWidth={300}
    drawerPosition={DrawerLayoutAndroid.positions.Left}
    renderNavigationView={() => navigationView}
    ref={'drawer'}
        >

        <Ionicons.ToolbarAndroid
    actions={[]}
    navIconName="md-open"
    onIconClicked={() => this.refs['drawer'].openDrawer()}
    style={styles.toolbar}
    titleColor="white"
    title="Moida"/>

        <ScrollableTabView tabBarUnderlineColor="yellow" renderTabBar={() => <CustomTabbar />}>

  <ScrollView tabLabel="ios-paper" style={styles.tabView}>
  <ReactPage/>
    </ScrollView>

    <ScrollView tabLabel="ios-barcode" style={styles.tabView}>
  <FlowPage/>
    </ScrollView>

    <ScrollView tabLabel="annotate" style={styles.tabView}>
  <JestPage/>
    </ScrollView>

    </ScrollableTabView>

    </DrawerLayoutAndroid>
  );
  }
}


class ReactPage extends Component {

  render() {

    return (
        <ScrollView>
        <Ionicons name="ios-book" size={30} color="#4F8EF7"/>
        <Image source={{uri: "http://sc5.io/blog/wp-content/uploads/2014/06/react.png"}}
    style={{flex: 1, height: 320}} resizeMode="cover"
        />
        <Text>
        JUST THE UI Lots of people use React as the V in MVC. Since React makes no assumptions about the
    rest of your technology stack, it's easy to try it out on a small feature in an existing project.
    VIRTUAL DOM React abstracts away the DOM from you, giving a simpler programming model and better
    performance. React can also render on the server using Node, and it can power native apps using
    React Native. DATA FLOW React implements one-way reactive data flow which reduces boilerplate and is
    easier to reason about than traditional data binding.
    </Text>
    <Image source={{uri: "http://sc5.io/blog/wp-content/uploads/2014/06/react.png"}}
    style={{flex: 1, height: 320}} resizeMode="cover"/>
        </ScrollView>
  )
  }
}


class JestPage extends Component {
  render() {
    return (
        <ScrollView>
        <Image source={{uri: "http://facebook.github.io/jest/img/opengraph.png"}}
    style={{flex: 1, height: 320}} resizeMode="cover"/>
        <Image source={{uri: "http://facebook.github.io/jest/img/opengraph.png"}}
    style={{flex: 1, height: 320}} resizeMode="cover"/>
        <Image source={{uri: "http://facebook.github.io/jest/img/opengraph.png"}}
    style={{flex: 1, height: 320}} resizeMode="cover"/>
        </ScrollView>
  )
  }
}


class FlowPage extends Component {
  render() {
    return (
        <ScrollView>
        <Image source={{uri: "http://www.adweek.com/socialtimes/files/2014/11/FlowLogo650.jpg"}}
    style={{flex: 1, height: 320}} resizeMode="contain"/>
        <Image source={{uri: "http://www.adweek.com/socialtimes/files/2014/11/FlowLogo650.jpg"}}
    style={{flex: 1, height: 320}} resizeMode="contain"/>
        <Image source={{uri: "http://www.adweek.com/socialtimes/files/2014/11/FlowLogo650.jpg"}}
    style={{flex: 1, height: 320}} resizeMode="contain"/>
        </ScrollView>
  )
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  drawer: {
    backgroundColor: '#FFF',
    flex: 1,
  },
  toolbar: {
    height: 56,
    backgroundColor: '#e9eaed',
  },
  tabView: {
    flex: 1,
    padding: 10,
    backgroundColor: 'rgba(0,0,0,0.01)',
  },


});

AppRegistry.registerComponent('WindFinder', () => WindFinder);
