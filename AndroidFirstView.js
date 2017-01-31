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
    DrawerLayoutAndroid,
    TouchableOpacity,
    View,
    WebView,
    Modal,
    Dimensions,
    StatusBar
} from 'react-native';

//import CustomTabbar from './CustomTabbar';

//https://github.com/crazycodeboy/react-native-easy-toast
import Toast, { DURATION } from 'react-native-easy-toast';

// https://www.npmjs.com/package/react-native-simple-modal
import SimpleModal from 'react-native-simple-modal';

//https://github.com/jordansexton/react-native-webview-crosswalk
import CrosswalkWebView from 'react-native-webview-crosswalk';

import Carousel        from 'react-native-carousel';

//https://github.com/oblador/react-native-vector-icons
import Ionicons     from 'react-native-vector-icons/Ionicons';

// import ShopPage          from './ShopPage';
import GlidingLocalList  from './GlidingLocalList';
import SurfLocalList     from './SurfLocalList';
import FavoriteList      from './FavoriteList';

// https://github.com/skv-headless/react-native-scrollable-tab-view
import ScrollableTabView, { ScrollableTabBar } from 'react-native-scrollable-tab-view';
// import MenuList from './MenuList';

var ds;
var webCamView, webCamViewIndicator ;
var webView0, webView1, webView2;
var pickerStyle   = require('./pickerStyle');

import MyToolbar from './MyToolbar';

class  AndroidFirstView extends Component {

    constructor(prop){
        super(prop);

        this.setConfigModalVisible = this.setConfigModalVisible.bind(this);
        this.setShopModalVisible   = this.setShopModalVisible.bind(this);
        this.setWebCamModalVisible   = this.setWebCamModalVisible.bind(this);
        this.openDrawer            = this.openDrawer.bind(this);
        this.renderRow             = this.renderRow.bind(this);
        this.setTabLock            = this.setTabLock.bind(this);

        ds = new ListView.DataSource({
            rowHasChanged: (r1, r2) => r1 !== r2
        }); // shop ListView Data

        this.state = {
            configModalOpen     : false,
            viewMode            : this.props.mode,
            loadingYn           : true,
            tabLock             : false,
            tabViewSelectedPage : -1,
            shopModalVisible    : false,
            webCamModalVisible  : false,
            realmReload         : false,
            camLoadError        : false,
            dataSource          : ds.cloneWithRows(['row 1', 'row 2'])};
    }

    openDrawer() {
        this.refs['DRAWER'].openDrawer()
    }

    setTabLock(lock) {
        this.setState({tabLock: lock});
    }
    setConfigModalVisible(visible) {
        this.setState({configModalOpen: visible});
    }

    setShopModalVisible(visible,shopRows) {
        this.setState({shopModalVisible: visible,  dataSource: ds.cloneWithRows(shopRows)});
    }

    setWebCamModalVisible(visible, webcam) {

        {/* count i */}
        for(var i in webcam){}

        switch (i) {
            case '0':
                webView0 = (
                    <CrosswalkWebView
                        onLoad={()=>{console.log("onLoad!!!")}}
                        mediaPlaybackRequiresUserAction={false}
                        style={pickerStyle.webView}
                        automaticallyAdjustContentInsets={true}
                        source={{uri:webcam[0].camUrl}}
                        javaScriptEnabled={true}
                        startInLoadingState={true}
                        scalesPageToFit={true}
                    />
                    );

                webCamView = webView0;

                webCamViewIndicator = (
                    <Text style={{fontSize:50, color:"#94000F", textAlign:'center'}}>•</Text>
                );
                break;
            case '1':
                webView1 = (
                    <CrosswalkWebView
                        onLoad={()=>{console.log("onLoad!!!")}}
                        mediaPlaybackRequiresUserAction={false}
                        style={pickerStyle.webView}
                        automaticallyAdjustContentInsets={true}
                        source={{uri: webcam[0].camUrl}}
                        javaScriptEnabled={true}
                        startInLoadingState={true}
                        scalesPageToFit={true}
                    />
                );

                webView2 = (
                    <CrosswalkWebView
                        onLoad={()=>{console.log("onLoad!!!")}}
                        mediaPlaybackRequiresUserAction={false}
                        style={pickerStyle.webView}
                        automaticallyAdjustContentInsets={true}
                        source={{uri: webcam[1].camUrl}}
                        javaScriptEnabled={true}
                        startInLoadingState={true}
                        scalesPageToFit={true}
                    />
                );

                webCamView = (
                    <Carousel animate={false} indicatorColor="#94000F" indicatorOffset={-68}>
                        {webView1}
                        {webView2}
                    </Carousel>
                );

                webCamViewIndicator = null;
                break;
            default: break;
        };

        this.setState({webCamModalVisible: visible, camLoadError:false});
    }

    onActionSelected(position) {

        console.log("xx",position);
        if (position === 0) { // index of 'Settings'
            this.setConfigModalVisible(true);
        }
    }

    onChangeTab(obj){

        this.setState({tabViewSelectedPage:-1});

        /* obj.i : 0 날씨정보, 1 즐겨찾기 */
        if(obj.i == '1')        this.setState({realmReload: true});
        else if(obj.i == '0')   this.setState({realmReload: false});

    }


    renderRow(rowData) {

        return (<View style={{height: 30,}}><Text>{rowData.name}</Text></View>);
    }

    render() {

        var localList ;
        if(this.state.viewMode =='surf') localList =  (<SurfLocalList setShopModalVisible   ={this.setShopModalVisible}
                                                                      setWebCamModalVisible ={this.setWebCamModalVisible}/>);
        else                             localList =  (<GlidingLocalList setShopModalVisible={this.setShopModalVisible}/>);

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
        };

        return (

            <View style={{flex:1}}>
                <MyToolbar modeTitle={modeTitle} onActionSelected={(position)=>this.onActionSelected(position)}/>

                <ScrollableTabView tabBarUnderlineStyle    = {{backgroundColor:"#FFFFFF"}}
                                   tabBarActiveTextColor   = "#FFFFFF"
                                   tabBarInactiveTextColor = "#BDBDBD"
                                   tabBarBackgroundColor   = "#9c0010"
                                   ref                     = {'scrollView'}
                                   locked                  = {this.state.tabLock}
                                   page                    = {this.state.tabViewSelectedPage}
                                   onChangeTab             = {(obj)=>this.onChangeTab(obj)}>
                    <ScrollView tabLabel="날씨상황"  style={styles.tabView} ref="LocalScrollView">
                        {localList}
                    </ScrollView>
                    <ScrollView tabLabel="즐겨찾기" style={styles.tabView}>
                        <FavoriteList setShopModalVisible   ={this.setShopModalVisible}
                                      setWebCamModalVisible ={this.setWebCamModalVisible}
                                      setTabLock            = {this.setTabLock}
                                      realmReload           = {this.state.realmReload}
                                      viewMode              = {this.state.viewMode}
                        />
                    </ScrollView>

                    {/* <ScrollView tabLabel="샾랭킹" style={styles.tabView}>
                        <ShopPage/>
                        </ScrollView>*/}
                </ScrollableTabView>

                {/* configMode selection Modal */}
                <SimpleModal
                    offset        = {this.state.offset}
                    open          = {this.state.configModalOpen}
                    modalDidOpen  = {() => console.log('modal did open')}
                    modalDidClose = {() => this.setState({configModalOpen: false})}
                    style         = {{flex:1,borderRadius: 2}}>

                    <Text style={{fontSize: 20, marginBottom: 10, color:'#94000F'}}>모드선택</Text>

                    <View style={{margin:0,flex:1}}>
                        <View style={{flex:2, height:40}}>
                            <TouchableOpacity
                                style={{margin: 5,flex:1,justifyContent:'center',alignItems:'flex-start' }}
                                onPress={() => {
                                    this.setState({viewMode:'surf',configModalOpen: false,tabViewSelectedPage:0});
                                    this.refs.LocalScrollView.scrollTo({x: 0, y: 0});
                                    this.refs.toast.show('서핑모드 모드로 전환합니다',DURATION.LENGTH_LONG);
                                }}>
                                <View style={{ flexDirection:'row'}}>
                                    <Text style={{color:'#727272', fontSize: 18}}>서                   핑    </Text>
                                    {this.state.viewMode=='surf' && <Ionicons name="md-checkmark" size={20} color={'#94000f'} />}
                                </View>
                            </TouchableOpacity>
                        </View>
                        <View style={{flex:2, flexDirection:'row', height:40}}>
                            <TouchableOpacity
                                style   = {{margin: 5, flex:1,justifyContent:'center',alignItems:'flex-start' }}
                                onPress = {() => {
                                    this.setState({viewMode:'gliding',configModalOpen: false,tabViewSelectedPage:0}) ;
                                    this.refs.LocalScrollView.scrollTo({x: 0, y: 0});
                                    this.refs.toast.show('페러글라이딩 모드로 전환합니다',DURATION.LENGTH_SHORT);
                                }}>
                                <View style={{ flexDirection:'row'}}>
                                    <Text style={{color:'#727272',fontSize: 18}}>패 러 글 라 이 딩    </Text>
                                    {this.state.viewMode=='gliding' && <Ionicons name="md-checkmark" size={20} color={'#94000f'}/>}
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
                    onRequestClose={() => {webView0=false; webView1 = false; webView2 = false; this.setState({webCamModalVisible: false, camLoadError: false})}}>
                    <View style={pickerStyle.modalContainer}>
                        <View style={[pickerStyle.closeIcon, {opacity:this.state.webCamModalVisible==true?1:0}]}>
                            <TouchableOpacity onPress={()=>{this.setState({webCamModalVisible: false})}}>
                                <Ionicons name="md-close" size={50} color={'white'}/>
                            </TouchableOpacity>
                        </View>
                        <View style={{height:SCREEN_HEIGHT/2}}>
                            {webCamView}
                        </View>
                        <View style={pickerStyle.circleIcon}>{webCamViewIndicator}</View>

                    </View>
                </Modal>

                <Toast
                    ref      = "toast"
                    style    = {{backgroundColor:'#222222'}}
                    position = 'bottom'/>

                {/* shopList Modal */}
                <SimpleModal
                    open          = {this.state.shopModalVisible}
                    modalDidOpen  = {() => console.log('modal did open')}
                    modalDidClose = {() => this.setState({shopModalVisible: false})}
                    style         = {{alignItems: 'center'}}>
                    <Text style={{fontSize: 20, marginBottom: 15, color:'#94000F'}}>주변샾</Text>
                        <ListView
                            dataSource={this.state.dataSource}
                            renderRow ={this.renderRow}
                        />
                </SimpleModal>

            </View>
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

});

module.exports = AndroidFirstView;
