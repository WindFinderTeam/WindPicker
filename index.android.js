import  React, {Component} from 'react';
import {
    AppRegistry,
    StyleSheet,
    ScrollView,
    Text,
    Image,
    ToolbarAndroid,
    DrawerLayoutAndroid,
    TouchableOpacity,
    View,
    ToastAndroid
} from 'react-native';


// https://github.com/skv-headless/react-native-scrollable-tab-view
//var ScrollableTabView = require('react-native-scrollable-tab-view');
import ScrollableTabView, { ScrollableTabBar, } from 'react-native-scrollable-tab-view';
//import CustomTabbar from './CustomTabbar';

// https://www.npmjs.com/package/react-native-simple-modal
import Modal from 'react-native-simple-modal';

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

        this.setConfigModalVisible = this.setConfigModalVisible.bind(this);
        this.openDrawer            = this.openDrawer.bind(this);
        this.state = {school : 'Wind Finder2', open: false};

    }

    openDrawer() {
        this.refs['DRAWER'].openDrawer()
    }

    setConfigModalVisible(visible) {
        this.setState({open: visible});
    }


    onActionSelected(position) {

        if (position === 0) { // index of 'Settings'
            //ToastAndroid.show('Setting Cliked', ToastAndroid.SHORT);
            this.setConfigModalVisible(true);
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

                <Modal
                    offset={this.state.offset}
                    open={this.state.open}
                    modalDidOpen={() => console.log('modal did open')}
                    modalDidClose={() => this.setState({open: false})}
                    style={{alignItems: 'center'}}>
                    <View>
                        <Text style={{fontSize: 20, marginBottom: 10}}>모드선택</Text>
                        <TouchableOpacity
                            style={{margin: 5}}
                            onPress={() => this.setState({offset: -100})}>
                            <Text>서 핑</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={{margin: 5}}
                            onPress={() => this.setState({offset: 0})}>
                            <Text>페러글라이딩</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={{margin: 5}}
                            onPress={() => this.setState({open: false})}>
                            <Text>바다낚시</Text>
                        </TouchableOpacity>
                    </View>
                </Modal>

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
