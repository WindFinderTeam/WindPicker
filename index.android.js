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


import ShopPage from './ShopPage';
import WeatherPage from './WeatherPage';
import FavoritePage from './FavoritePage';

class  WindFinder extends Component {


    //renderTabBar={() => <CustomTabbar />}

    openDrawer() {
        this.refs['DRAWER'].openDrawer()
    }

    render() {
        var navigationView =
        (
            <View style={styles.drawer}>
                <Text style={{margin: 10, fontSize: 15, textAlign: 'left'}}>I'm in the Drawer2!</Text>
            </View>
        );

        return (

            <DrawerLayoutAndroid
                drawerWidth={200}
                drawerPosition={DrawerLayoutAndroid.positions.Left}
                renderNavigationView={() => navigationView}
                ref={'drawer'}
            >


                <Ionicons.ToolbarAndroid
                    actions={[]}
                    navIconName="md-menu"
                    onIconClicked={() => this.refs['drawer'].openDrawer()}
                    style={styles.toolbar}
                    titleColor="white"
                    title="WindFinder"/>


                <ScrollableTabView tabBarUnderlineColor="#94000f" tabBarActiveTextColor="#94000f">

                    <ScrollView tabLabel="날씨상황" style={styles.tabView}>
                        <WeatherPage/>
                    </ScrollView>

                    <ScrollView tabLabel="즐겨찾기" style={styles.tabView}>
                        <ShopPage/>
                    </ScrollView>

                    <ScrollView tabLabel="샾랭킹" style={styles.tabView}>
                        <FavoritePage/>
                    </ScrollView>

                </ScrollableTabView>

            </DrawerLayoutAndroid>
        );
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
        backgroundColor: '#FFF111',
        flex: 1,
    },
    toolbar: {
        height: 56,
        backgroundColor: '#94000f',
    },
    tabView: {
        flex: 1,
        padding: 10,
        backgroundColor: 'rgba(0,0,0,0.01)',
    },


});

AppRegistry.registerComponent('WindFinder', () => WindFinder);
