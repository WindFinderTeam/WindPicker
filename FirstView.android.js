import  React, {
    Component
} from 'react';

import {
    AppRegistry,
    StyleSheet,
    ScrollView,
    Text,
    Image,
    ListView,
    ToolbarAndroid,
    TouchableOpacity,
    View,
    WebView,
    Modal,
    Dimensions,
    StatusBar,
    DrawerLayoutAndroid,
    Animated,

} from 'react-native';

//import CustomTabbar from './CustomTabbar';

import Toast, {DURATION} from 'react-native-easy-toast';
import SimpleModal from 'react-native-simple-modal';
import Ionicons     from 'react-native-vector-icons/Ionicons';
import GlidingLocalList  from './GlidingLocalList';
import SurfLocalList     from './SurfLocalList';
import FavoriteList      from './FavoriteList';
import ScrollableTabView, {ScrollableTabBar} from 'react-native-scrollable-tab-view';

import MenuList  from './MenuList';
import MyToolbar from './MyToolbar';

var ds;
var webCamView;
var pickerStyle = require('./pickerStyle');

class FirstViewAndroid extends Component {

    constructor(prop) {
        super(prop);

        this.setConfigModalVisible = this.setConfigModalVisible.bind(this);
        this.setShopModalVisible = this.setShopModalVisible.bind(this);
        this.setWebCamModalVisible = this.setWebCamModalVisible.bind(this);
        this.renderRow = this.renderRow.bind(this);
        this.openDrawerLayout = this.openDrawerLayout.bind(this);
        this.setModeChange = this.setModeChange.bind(this);

        ds = new ListView.DataSource({
            rowHasChanged: (r1, r2) => r1 !== r2
        }); // shop ListView Data

        this.state = {
            configModalOpen: false,
            viewMode: this.props.mode,
            loadingYn: true,
            tabViewSelectedPage: -1,
            shopModalVisible: false,
            webCamModalVisible: false,
            realmReload: false,
            camLoadError: false,
            dataSource: ds.cloneWithRows(['row 1', 'row 2']),
            drawerAnimation: new Animated.Value(0)
        };
    }


    openDrawerLayout() {
        this.refs._drawer.openDrawer();
    }

    setConfigModalVisible(visible) {
        this.setState({configModalOpen: visible});
    }

    setShopModalVisible(visible, shopRows) {
        console.log("shopRows", shopRows);
        this.setState({shopModalVisible: visible, dataSource: ds.cloneWithRows(shopRows)});
    }

    setModeChange(mode) {

        console.log("mode::::", mode)
        var nowMode_han;

        if (mode == 'surf') this.setState({viewMode: 'surf', tabViewSelectedPage: 0});
        else                  this.setState({viewMode: 'gliding', tabViewSelectedPage: 0});

        if (this.state.viewMode == 'surf') nowMode_han = '서핑';
        else                                        nowMode_han = '패러글라이딩';

        this.refs._drawer.closeDrawer();

        // this.refs.LocalScrollView.scrollTo({x: 0, y: 0});
        // this.refs.toast.show({nowMode_han} + '모드로 전환합니다',DURATION.LENGTH_LONG);

    }

    setWebCamModalVisible(visible, webcam) {


        webCamView = (
            <WebView
                onLoad={() => {
                    console.log("onLoad!!!")
                }}
                onError={() => {
                    console.log("onError!!!")
                }}
                renderError={() => {
                    console.log("renderError!!!");
                }}
                mediaPlaybackRequiresUserAction={false}
                style={pickerStyle.webView}
                automaticallyAdjustContentInsets={true}
                source={{uri: webcam[0].camUrl}}
                javaScriptEnabled={true}
                startInLoadingState={true}
                scalesPageToFit={true}
            />
        );

        this.setState({webCamModalVisible: visible, camLoadError: false});
    }

    onActionSelected(position) {

        console.log("xx", position);
        if (position === 0) { // index of 'Settings'
            this.setConfigModalVisible(true);
        }
    }

    onChangeTab(obj) {

        this.setState({tabViewSelectedPage: -1});

        /* obj.i : 0 날씨정보, 1 즐겨찾기 */
        if (obj.i == '1') this.setState({realmReload: true});
        else if (obj.i == '0') this.setState({realmReload: false});

    }

    renderRow(rowData) {

        return (<View style={{height: 30,}}><Text>{rowData.name}</Text></View>);
    }

    render() {

        var localList;
        if (this.state.viewMode == 'surf') localList = (<SurfLocalList setShopModalVisible={this.setShopModalVisible}
                                                                       setWebCamModalVisible={this.setWebCamModalVisible}/>);
        else                             localList = (
            <GlidingLocalList setShopModalVisible={this.setShopModalVisible}/>);

        var modeTitle;


        switch (this.state.viewMode) {
            case 'surf':
                modeTitle = '서핑';
                break;
            case 'gliding':
                modeTitle = '패러글라이딩';
                break;
            default :
                modeTitle = '패러글라이딩';
                break;
        }
        ;

        return (

            <DrawerLayoutAndroid
                drawerWidth={250}
                drawerPosition={DrawerLayoutAndroid.positions.Left}
                ref={'_drawer'}
                renderNavigationView={() => <MenuList modeTitle={modeTitle}
                                                      setModeChange={(mode) => this.setModeChange(mode)}/>}>


                <MyToolbar modeTitle={modeTitle} onActionSelected={(position) => this.onActionSelected(position)}
                           openDrawerLayout={() => this.openDrawerLayout()}/>

                <ScrollableTabView tabBarUnderlineStyle={{backgroundColor: "#94000f"}}
                                   tabBarActiveTextColor="#94000f"
                                   tabBarInactiveTextColor="#94000f"
                                   tabBarBackgroundColor="white"
                                   ref={'scrollView'}
                                   locked={false}
                                   page={this.state.tabViewSelectedPage}
                                   tabBarTextStyle={styles.tabText}
                                   onChangeTab={(obj) => this.onChangeTab(obj)}
                                   style={{height: 18}}>
                    <ScrollView tabLabel="날씨상황" style={styles.tabView} ref="LocalScrollView">
                        {localList}
                    </ScrollView>
                    <ScrollView tabLabel="즐겨찾기" style={styles.tabView}>
                        <FavoriteList setShopModalVisible={this.setShopModalVisible}
                                      setWebCamModalVisible={this.setWebCamModalVisible}
                                      realmReload={this.state.realmReload}
                                      viewMode={this.state.viewMode}
                        />
                    </ScrollView>

                </ScrollableTabView>

                {/* configMode selection Modal */}
                <SimpleModal
                    offset={this.state.offset}
                    open={this.state.configModalOpen}
                    modalDidOpen={() => console.log('modal did open')}
                    modalDidClose={() => this.setState({configModalOpen: false})}
                    style={{flex: 1, borderRadius: 2}}>

                    <Text style={{fontSize: 20, marginBottom: 10, color: '#94000F'}}>모드선택</Text>

                    <View style={{margin: 0, flex: 1}}>
                        <View style={{flex: 2, height: 40}}>
                            <TouchableOpacity
                                style={{margin: 5, flex: 1, justifyContent: 'center', alignItems: 'flex-start'}}
                                onPress={() => {
                                    this.setState({viewMode: 'surf', configModalOpen: false, tabViewSelectedPage: 0});
                                    this.refs.LocalScrollView.scrollTo({x: 0, y: 0});
                                    this.refs.toast.show('서핑모드 모드로 전환합니다', DURATION.LENGTH_LONG);
                                }}>
                                <View style={{flexDirection: 'row'}}>
                                    <Text style={{color: '#727272', fontSize: 18}}>서 핑 </Text>
                                    {this.state.viewMode == 'surf' &&
                                    <Ionicons name="md-checkmark" size={20} color={'#94000f'}/>}
                                </View>
                            </TouchableOpacity>
                        </View>
                        <View style={{flex: 2, flexDirection: 'row', height: 40}}>
                            <TouchableOpacity
                                style={{margin: 5, flex: 1, justifyContent: 'center', alignItems: 'flex-start'}}
                                onPress={() => {
                                    this.setState({
                                        viewMode: 'gliding',
                                        configModalOpen: false,
                                        tabViewSelectedPage: 0
                                    });
                                    this.refs.LocalScrollView.scrollTo({x: 0, y: 0});
                                    this.refs.toast.show('페러글라이딩 모드로 전환합니다', DURATION.LENGTH_SHORT);
                                }}>
                                <View style={{flexDirection: 'row'}}>
                                    <Text style={{color: '#727272', fontSize: 18}}>패 러 글 라 이 딩 </Text>
                                    {this.state.viewMode == 'gliding' &&
                                    <Ionicons name="md-checkmark" size={20} color={'#94000f'}/>}
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                </SimpleModal>

                {/* webCam Modal */}
                <Modal
                    animationType={"none"}
                    transparent={true}
                    visible={this.state.webCamModalVisible}
                    onRequestClose={() => {
                        this.setState({webCamModalVisible: false, camLoadError: false});
                    }}>
                    <View style={pickerStyle.modalContainer}>
                        <View style={[pickerStyle.closeIcon, {opacity: this.state.webCamModalVisible == true ? 1 : 0}]}>
                            <TouchableOpacity onPress={() => {
                                this.setState({webCamModalVisible: false})
                            }}>
                                <Ionicons name="md-close" size={40} color={'white'}/>
                            </TouchableOpacity>
                        </View>
                        <View style={{height: parseInt(SCREEN_HEIGHT / 1.5)}}>
                            {webCamView}
                        </View>
                    </View>
                </Modal>

                <Toast
                    ref="toast"
                    style={{backgroundColor: '#222222'}}
                    position='bottom'/>

                {/* shopList Modal */}
                <SimpleModal
                    open={this.state.shopModalVisible}
                    modalDidOpen={() => console.log('modal did open')}
                    modalDidClose={() => this.setState({shopModalVisible: false})}
                    style={{alignItems: 'center'}}>
                    <Text style={{fontSize: 20, marginBottom: 15, color: '#94000F'}}>주변샾</Text>
                    <ListView
                        dataSource={this.state.dataSource}
                        renderRow={this.renderRow}/>
                </SimpleModal>
            </DrawerLayoutAndroid>

        );
    }
}

const SCREEN_HEIGHT = Dimensions.get('window').height;


const styles = StyleSheet.create({
    tabView: {
        flex: 1,
        padding: 0,
        backgroundColor: 'rgba(0,0,0,0.01)',
    },
    tabText: {
        fontSize: 17
    }

});

module.exports = FirstViewAndroid;
