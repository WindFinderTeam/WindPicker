import  React, {Component} from 'react';
import {
    AppRegistry,
    StyleSheet,
    ScrollView,
    Text,
    Image,
    ToolbarAndroid,
    DrawerLayoutAndroid,
    View,
    ToastAndroid
} from 'react-native';


// https://github.com/skv-headless/react-native-scrollable-tab-view
//var ScrollableTabView = require('react-native-scrollable-tab-view');
import ScrollableTabView, { ScrollableTabBar, } from 'react-native-scrollable-tab-view';
import CustomTabbar from './CustomTabbar';

//https://github.com/oblador/react-native-vector-icons
import Ionicons     from 'react-native-vector-icons/Ionicons';
import FontAwesome  from 'react-native-vector-icons/FontAwesome';


import ShopPage     from './ShopPage';
import WeatherPage  from './WeatherPage';
import FavoritePage from './FavoritePage';

import MenuList from './MenuList';

class  WindFinder extends Component {


    //renderTabBar={() => <CustomTabbar />}

    constructor(prop){
        super(prop);

        this.openDrawer = this.openDrawer.bind(this);
        this.state = {school : 'Wind Finder2'};

    }

    openDrawer() {
        this.refs['DRAWER'].openDrawer()
    }



    onActionSelected(position) {

    if (position === 0) { // index of 'Settings'
        ToastAndroid.show('Setting Cliked', ToastAndroid.SHORT);
    }
}


    render() {
        var navigationView =
        (
            <View style={styles.drawer}>
                <Text style={{margin: 10, fontSize: 15, textAlign: 'left'}}>메뉴목록</Text>

                <MenuList/>
            </View>
        );


        return (

            <DrawerLayoutAndroid
                drawerWidth={200}
                drawerPosition={DrawerLayoutAndroid.positions.Left}
                renderNavigationView={() => navigationView}
                drawerLockMode ='locked-closed'
                ref={'drawer'}>

               <Ionicons.ToolbarAndroid
                    //actions={[]}
                    //navIconName="md-menu"

                   // onIconClicked={() => this.refs['drawer'].openDrawer()}
                    style={styles.toolbar}
                    iconColor="white"
                    titleColor="white"
                    title= {this.state.school}
                    actions={[
                        { title: 'Settings', iconName: 'md-settings', iconSize: 30, show: 'always' },
                        { title: 'Follow me on Twitter', iconName: 'md-menu', iconColor: "#4099FF", show: 'ifRoom' },
                      ]}
                    overflowIconName="md-more"
                    onActionSelected={(position) => this.onActionSelected(position)}
                />


                <ScrollableTabView tabBarUnderlineColor="#FFFFFF"
                                   tabBarActiveTextColor="#FFFFFF"
                                   tabBarInactiveTextColor="#BDBDBD"
                                   tabBarBackgroundColor="#9c0010">
                    <ScrollView tabLabel="날씨상황" style={styles.tabView}>
                        <WeatherPage/>
                    </ScrollView>
                    <ScrollView tabLabel="즐겨찾기" style={styles.tabView}>
                        <FavoritePage/>
                    </ScrollView>

                    <ScrollView tabLabel="샾랭킹" style={styles.tabView}>
                        <ShopPage/>
                    </ScrollView>
                </ScrollableTabView>

            </DrawerLayoutAndroid>
        );
    }
}




const styles = StyleSheet.create({

    instructions: {
        textAlign: 'center',
        color: '#333333',
        marginBottom: 5,
    },
    drawer: {
        backgroundColor: '#FFFFFF',
        flex: 1,
    },
    toolbar: {

        height: 56,
        backgroundColor: '#94000F',
    },
    tabView: {
        flex: 1,
        padding: 0,
        backgroundColor: 'rgba(0,0,0,0.01)',
    },


});

AppRegistry.registerComponent('WindFinder', () => WindFinder);
