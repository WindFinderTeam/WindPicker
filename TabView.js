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
    Platform,
} from 'react-native';

//import CustomTabbar from './CustomTabbar';

import SimpleModal                           from 'react-native-simple-modal';
import Ionicons                              from 'react-native-vector-icons/Ionicons';
import GlidingLocalList                      from './GlidingLocalList';
import SurfLocalList                         from './SurfLocalList';
import FavoriteList                          from './FavoriteList';
import ScrollableTabView, {ScrollableTabBar} from 'react-native-scrollable-tab-view';


var ds;
var webCamView;
var pickerStyle = require('./pickerStyle');

class TabView extends Component {

    constructor(prop) {
        super(prop);

        this.setShopModalVisible   = this.setShopModalVisible.bind(this);
        this.setWebCamModalVisible = this.setWebCamModalVisible.bind(this);
        this.renderRow             = this.renderRow.bind(this);

        ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}); // shop ListView Data

        this.state = {

            viewMode            : this.props.viewMode,
            tabViewSelectedPage : this.props.tabViewSelectedPage,
            shopModalVisible    : false,
            webCamModalVisible  : false,
            realmReload         : false,
            dataSource          : ds.cloneWithRows(['row 1', 'row 2']),
            drawerAnimation     : new Animated.Value(0)
        };
    }


    setShopModalVisible(visible, shopRows) {
        this.setState({shopModalVisible: visible, dataSource: ds.cloneWithRows(shopRows)});
    }


    setWebCamModalVisible(visible, webcam) {

        webCamView = (
            <WebView
                mediaPlaybackRequiresUserAction  = {false}
                style                            = {pickerStyle.webView}
                automaticallyAdjustContentInsets = {true}
                source                           = {{uri: webcam[0].camUrl}}
                javaScriptEnabled                = {true}
                startInLoadingState              = {true}
                scalesPageToFit                  = {true}
            />
        );

        this.setState({webCamModalVisible: visible});
    }


    onChangeTab(obj) {

        this.setState({tabViewSelectedPage: -1});

        /* obj.i : 0 날씨정보, 1 즐겨찾기 */
        if      (obj.i == '1') this.setState({realmReload: true});
        else if (obj.i == '0') this.setState({realmReload: false});

    }

    renderRow(rowData) {   return (<View style={{height: 30,}}><Text>{rowData.name}</Text></View>);   }

    render() {

        var localList;
        if (this.props.viewMode == 'surf') localList = (<SurfLocalList    setShopModalVisible   = {this.setShopModalVisible}
                                                                          setWebCamModalVisible = {this.setWebCamModalVisible}/>);
        else                               localList = (<GlidingLocalList setShopModalVisible   = {this.setShopModalVisible}/>);


        return (

            <View style={{flex: 1}}>

                <ScrollableTabView tabBarUnderlineStyle    = {{backgroundColor: "#94000f"}}
                                   tabBarActiveTextColor   = "#94000f"
                                   tabBarInactiveTextColor = "#94000f"
                                   tabBarBackgroundColor   = "white"
                                   ref                     = {'scrollView'}
                                   locked                  = {false}
                                   page                    = {this.props.tabViewSelectedPage}
                                   tabBarTextStyle         = {styles.tabText}
                                   onChangeTab             = {(obj) => this.onChangeTab(obj)}
                                   style                   = {{height: 18}}>

                    <ScrollView tabLabel="날씨상황" style={styles.tabView} ref="LocalScrollView">
                        {(Platform.OS == 'ios') && <View style={pickerStyle.localListView}>
                            {localList}
                        </View>}
                        {!(Platform.OS == 'ios') && localList}
                    </ScrollView>
                    <ScrollView tabLabel="즐겨찾기" style={styles.tabView}>
                        <FavoriteList setShopModalVisible   = {this.setShopModalVisible}
                                      setWebCamModalVisible = {this.setWebCamModalVisible}
                                      realmReload           = {this.state.realmReload}
                                      viewMode              = {this.state.viewMode}
                        />
                    </ScrollView>
                </ScrollableTabView>


                {/* webCam Modal */}
                <Modal
                    animationType  = {"none"}
                    transparent    = {true}
                    visible        = {this.state.webCamModalVisible}
                    onRequestClose = {() => { this.setState({webCamModalVisible: false});  }}>

                    <View style={pickerStyle.modalContainer}>
                        <View style={[pickerStyle.closeIcon, {opacity: this.state.webCamModalVisible == true ? 1 : 0}]}>
                            <TouchableOpacity onPress={() => {  this.setState({webCamModalVisible: false})  }}>
                                <Ionicons name="md-close" size={40} color={'white'}/>
                            </TouchableOpacity>
                        </View>
                        <View style={{height: SCREEN_HEIGHT / 1.5}}>
                            <View style={styles.webCamWaitting}>
                                <Ionicons name="ios-checkmark-outline"
                                          style={{paddingTop: SCREEN_HEIGHT / 4, textAlign: 'center',}} size={30}
                                          color='gray'/>
                                <Text style={pickerStyle.camLoading}>잠시만 기다려 주세요. </Text>
                                <Text style={pickerStyle.camLoading}>캠이 점검중이면 실행되지 않을 수 있습니다. </Text>
                            </View>
                            {webCamView}
                        </View>
                    </View>
                </Modal>


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
            </View>

        );
    }
}

const SCREEN_HEIGHT = Dimensions.get('window').height;
const SCREEN_WIDTH = Dimensions.get('window').width;


const styles = StyleSheet.create({
    tabView: {
        flex: 1,
        padding: 0,
        backgroundColor: 'rgba(0,0,0,0.01)',
    },
    tabText: {
        fontSize: 17
    },
    webCamWaitting:{
        position: 'absolute',
        backgroundColor: 'white',
        width: SCREEN_WIDTH,
        height: SCREEN_HEIGHT / 1.5
    }

});

module.exports = TabView;
