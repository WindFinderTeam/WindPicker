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
} from 'react-native';

//import CustomTabbar from './CustomTabbar';

//https://github.com/crazycodeboy/react-native-easy-toast
import Toast, { DURATION } from 'react-native-easy-toast';

// https://www.npmjs.com/package/react-native-simple-modal
import SimpleModal from 'react-native-simple-modal';

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
var pickerStyle   = require('./pickerStyle');

class  AndroidFirstView extends Component {

    constructor(prop){
        super(prop);

        this.setConfigModalVisible = this.setConfigModalVisible.bind(this);
        this.setShopModalVisible   = this.setShopModalVisible.bind(this);
        this.setWebCamModalVisible   = this.setWebCamModalVisible.bind(this);
        this.openDrawer            = this.openDrawer.bind(this);
        this.renderRow             = this.renderRow.bind(this);

        ds = new ListView.DataSource({
            rowHasChanged: (r1, r2) => r1 !== r2
        }); // shop ListView Data
        this.state = {
            configModalOpen                : false,
            viewMode            : this.props.mode,
            loadingYn           :true ,
            shopModalVisible    : false,
            webCamModalVisible  : false,
            camLoadedOpa        : 0,
            dataSource          : ds.cloneWithRows(['row 1', 'row 2'])};

    }

    openDrawer() {
        this.refs['DRAWER'].openDrawer()
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
                webCamView = (
                    <View key="view1" style={{flex:1}}>
                        <WebView
                            modalVisible={this.setCamVisible}
                            onLoad={()=>{this.setState({camLoadedOpa:1})}}
                            style={pickerStyle.webView}
                            automaticallyAdjustContentInsets={true}
                            source={{uri: webcam[0].camUrl}}
                            javaScriptEnabled={true}
                            startInLoadingState={true}
                            scalesPageToFit={true}
                        />
                    </View>
                );

                webCamViewIndicator = (
                    <Text style={{fontSize:50, color:"#94000F", textAlign:'center'}}>•</Text>
                );
                break;
            case '1':
                webCamView = (
                    <Carousel animate={false} indicatorColor="#94000F" indicatorOffset={-68}>
                        <View key="view1" style={{flex:1}}>
                            <WebView
                                modalVisible={this.setCamVisible}
                                onLoad={()=>{this.setState({camLoadedOpa:1})}}
                                style={pickerStyle.webView}
                                automaticallyAdjustContentInsets={true}
                                source={{uri: webcam[0].camUrl}}
                                javaScriptEnabled={true}
                                startInLoadingState={true}
                                scalesPageToFit={true}
                            />
                        </View>
                        <View key="view2" style={{flex:1}}>
                            <WebView
                                modalVisible={this.setCamVisible}
                                onLoad={()=>{this.setState({camLoadedOpa:1})}}
                                style={pickerStyle.webView}
                                automaticallyAdjustContentInsets={true}
                                source={{uri: webcam[1].camUrl}}
                                javaScriptEnabled={true}
                                startInLoadingState={true}
                                scalesPageToFit={true}
                            />
                        </View>
                    </Carousel>
                );

                webCamViewIndicator = null;
                break;
            default: break;
        };

        this.setState({webCamModalVisible: visible});
    }

    onActionSelected(position) {

        if (position === 0) { // index of 'Settings'
            this.setConfigModalVisible(true);
        }
    }


    renderRow(rowData) {

        return (<View style={{height: 30,}}><Text>{rowData.name}</Text></View>);
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
        if(this.state.viewMode =='surf') localList =  (<SurfLocalList setShopModalVisible   ={this.setShopModalVisible}
                                                                      setWebCamModalVisible ={this.setWebCamModalVisible}/>);
        else                             localList =  (<GlidingLocalList setShopModalVisible={this.setShopModalVisible}/>);

        return (

            <DrawerLayoutAndroid
                drawerWidth          = {200}
                drawerPosition       = {DrawerLayoutAndroid.positions.Left}
                renderNavigationView = {() => navigationView}
                drawerLockMode       = 'locked-closed'
                ref                  = {'drawer'}>

                <Ionicons.ToolbarAndroid
                    // navIconName={require('./image/app_logo.png')}
                    // logo={require('./image/app_logo.png')}
                    // onIconClicked={() => this.refs['drawer'].openDrawer()}
                    style      = {styles.toolbar}
                    iconColor  = "#94000F"
                    titleColor = "#94000F"
                    //title= {this.state.school}
                    actions={[
                        { title: 'Settings', iconName: 'md-settings',iconColor:'gray', iconSize: 30, show: 'always' }
                    ]}
                    overflowIconName = "md-more"
                    onActionSelected = {(position) => this.onActionSelected(position)}
                />
                <View style={{position:'absolute', left:5,top:10}}>
                    <Image
                        source     = {require('./image/app_logo.png')}
                        resizeMode = "stretch"
                        style      = {{height:30,width:130}}
                    />
                </View>
                <ScrollableTabView tabBarUnderlineStyle    = {{backgroundColor:"#FFFFFF"}}
                                   tabBarActiveTextColor   = "#FFFFFF"
                                   tabBarInactiveTextColor = "#BDBDBD"
                                   tabBarBackgroundColor   = "#9c0010"
                                   ref                     = {'scrollView'}>
                    <ScrollView tabLabel="날씨상황"  style={styles.tabView} ref="LocalScrollView">
                        {localList}
                    </ScrollView>
                    <ScrollView tabLabel="즐겨찾기" style={styles.tabView}>
                        <FavoriteList setShopModalVisible={this.setShopModalVisible}
                                      setWebCamModalVisible={this.setWebCamModalVisible}/>
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

                    <View style={{margin:0,flex:1, backgroundColor:'#9c0010'}}>
                        <View style={{flex:2, backgroundColor:this.state.viewMode =='surf'?'#d4d4d4':'#F5F5F5'}}>
                            <TouchableOpacity
                                style={{margin: 5,flex:1,justifyContent:'center',alignItems:'flex-start' }}
                                onPress={() => {
                                    this.setState({viewMode:'surf',configModalOpen: false});
                                    this.refs.LocalScrollView.scrollTo({x: 0, y: 0});
                                    this.refs.toast.show('서핑모드 모드로 전환합니다',DURATION.LENGTH_LONG);
                                }}>
                                <Text style={{color:this.state.viewMode =='surf'?'#727272':'#727272', fontSize: 15}}>서                   핑    </Text>
                            </TouchableOpacity>
                        </View>
                        <View style={{flex:2, backgroundColor:this.state.viewMode =='gliding'?'#d4d4d4':'#F5F5F5'}}>
                            <TouchableOpacity
                                style   = {{margin: 5, flex:1,justifyContent:'center',alignItems:'flex-start' }}
                                onPress = {() => {
                                    this.setState({viewMode:'gliding',configModalOpen: false}) ;
                                    this.refs.LocalScrollView.scrollTo({x: 0, y: 0});
                                    this.refs.toast.show('페러글라이딩 모드로 전환합니다',DURATION.LENGTH_SHORT);
                                }}>
                                <Text style={{color:this.state.viewMode =='gliding'?'#727272':'#727272',fontSize: 15}}>패 러 글 라 이 딩    </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </SimpleModal>

                {/* webCam Modal */}
                <Modal
                    animationType={"fade"}
                    transparent={true}
                    visible={this.state.webCamModalVisible}
                    onRequestClose={() => {this.setState({webCamModalVisible: false});this.setState({camLoadedOpa:0 });}}>
                    <View style={pickerStyle.modalContainer}>
                        <View style={[pickerStyle.closeIcon, {opacity:this.state.camLoadedOpa}]}>
                            <TouchableOpacity onPress={()=>{this.setState({webCamModalVisible: false})}}>
                                <Ionicons name="md-close" size={35} color={'white'}/>
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

            </DrawerLayoutAndroid>
        );
    }
}

const SCREEN_HEIGHT = Dimensions.get('window').height;

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

module.exports = AndroidFirstView;
