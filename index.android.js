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
} from 'react-native';



//import CustomTabbar from './CustomTabbar';

//https://github.com/crazycodeboy/react-native-easy-toast
import Toast, { DURATION } from 'react-native-easy-toast';

// https://www.npmjs.com/package/react-native-simple-modal
import Modal from 'react-native-simple-modal';

//https://github.com/oblador/react-native-vector-icons
import Ionicons     from 'react-native-vector-icons/Ionicons';
import FontAwesome  from 'react-native-vector-icons/FontAwesome';


import ShopPage          from './ShopPage';
import GlidingLocalList  from './GlidingLocalList';
import SurfLocalList     from './SurfLocalList';
import FavoriteList      from './FavoriteList';
// https://github.com/skv-headless/react-native-scrollable-tab-view
import ScrollableTabView, { ScrollableTabBar } from 'react-native-scrollable-tab-view';
import MenuList from './MenuList';

class  WindFinder extends Component {


    //renderTabBar={() => <CustomTabbar />}

    constructor(prop){
        super(prop);

        this.setConfigModalVisible = this.setConfigModalVisible.bind(this);
        this.openDrawer            = this.openDrawer.bind(this);
        this.state = {school : 'Wind Finder2', open: false, viewMode:'surf'};

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

                    {/* <MenuList/> */}
                </View>
            );

        var localList ;
        if(this.state.viewMode =='surf'){
            localList =  (<SurfLocalList/>);
        } else {
            localList =  (<GlidingLocalList/>);
        }

        return (

            <DrawerLayoutAndroid
                drawerWidth={200}
                drawerPosition={DrawerLayoutAndroid.positions.Left}
                renderNavigationView={() => navigationView}
                drawerLockMode ='locked-closed'
                ref={'drawer'}>

                <Ionicons.ToolbarAndroid
                    //navIconName={require('./image/app_logo.png')}
                    //logo={require('./image/app_logo.png')}
                    // onIconClicked={() => this.refs['drawer'].openDrawer()}
                    style={styles.toolbar}
                    iconColor="#94000F"
                    titleColor="#94000F"
                    //title= {this.state.school}
                    actions={[
                        { title: 'Settings', iconName: 'md-settings',iconColor:'gray', iconSize: 30, show: 'always' }
                    ]}
                    overflowIconName="md-more"
                    onActionSelected={(position) => this.onActionSelected(position)}
                />
                <View style={{position:'absolute', left:5,top:10}}>
                    <Image
                        source={require('./image/app_logo.png')}
                        resizeMode="stretch"
                        style={{height:30,width:130}}
                    />
                </View>
                <ScrollableTabView tabBarUnderlineStyle={{backgroundColor:"#FFFFFF"}}
                                   tabBarActiveTextColor="#FFFFFF"
                                   tabBarInactiveTextColor="#BDBDBD"
                                   tabBarBackgroundColor="#9c0010"
                                   ref={'scrollView'}>
                    <ScrollView tabLabel="날씨상황" style={styles.tabView}>
                        {localList}
                    </ScrollView>
                    <ScrollView tabLabel="즐겨찾기" style={styles.tabView}>
                        <FavoriteList/>
                    </ScrollView>

                    {/* <ScrollView tabLabel="샾랭킹" style={styles.tabView}>

                        <ShopPage/>
                    </ScrollView>*/}
                </ScrollableTabView>

                <Modal
                    offset={this.state.offset}
                    open={this.state.open}
                    modalDidOpen={() => console.log('modal did open')}
                    modalDidClose={() => this.setState({open: false})}
                    style={{alignItems: 'center'}}>
                    <View>
                        <Text style={{fontSize: 20, marginBottom: 10, color:'#94000F'}}>모드선택</Text>
                        <TouchableOpacity
                            style={{margin: 5}}
                            onPress={() => {
                                this.setState({viewMode:'surf',open: false});
                                this.refs.toast.show('서핑모드 모드로 전환합니다',DURATION.LENGTH_LONG);
                            }
                            }>
                            <Text>서 핑</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={{margin: 5}}
                            onPress={() => {
                                this.setState({viewMode:'gliding',open: false});
                                this.refs.toast.show('페러글라이딩 모드로 전환합니다',DURATION.LENGTH_SHORT);

                            }
                            }>
                            <Text>페러글라이딩</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={{margin: 5}}
                            onPress={() => this.setState({open: false})}>
                            <Text>Close</Text>
                        </TouchableOpacity>

                    </View>
                </Modal>
                <Toast
                    ref="toast"
                    style={{backgroundColor:'#222222'}}
                    position='bottom'
                />
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
        backgroundColor: '#FFFFFF'
    },
    tabView: {
        flex: 1,
        padding: 0,
        backgroundColor: 'rgba(0,0,0,0.01)',
    },


});

AppRegistry.registerComponent('WindFinder', () => WindFinder);