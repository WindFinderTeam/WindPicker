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
import SurfLocalListMap                      from './SurfLocalListMap';
import GlidLocalListMap                      from './GlidLocalListMap';
import ScrollableTabView                     from 'react-native-scrollable-tab-view';
import Spinner                               from 'react-native-spinkit';


var ds;
var pickerStyle = require('./pickerStyle');
var shopUrl = 'http://mercicandle.cafe24.com/web/windPicker/preparing.html';


class TabView extends Component {

    constructor(prop) {
        super(prop);

        this.setShopModalVisible = this.setShopModalVisible.bind(this);
        this.renderRow = this.renderRow.bind(this);
        this.setSpinnerVisible = this.setSpinnerVisible.bind(this);

        ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}); // shop ListView Data

        this.state = {

            viewMode: this.props.viewMode,
            tabViewSelectedPage: this.props.tabViewSelectedPage,
            shopModalVisible: false,
            shopDetailVisible: false,
            dataSource: ds.cloneWithRows(['row 1', 'row 2']),
            drawerAnimation: new Animated.Value(0),
            spinnerVisible:true
        };
    }

    componentWillReceiveProps() {
        //this.refs.scrollableTabView.goToPage(0);
        this.refs.LocalScrollView.scrollTo({x: 0, y: 0});
    }

    setShopModalVisible(visible, shopRows) {
        this.setState({shopModalVisible: visible, dataSource: ds.cloneWithRows(shopRows)});
    }

    onChangeTab(obj) {
        /* obj.i : 0 날씨정보, 1 즐겨찾기 */
        if (obj.i == '1') {
            this.setState({realmReload: true});
            this.props.setListIconShow(false);
        }
        else if (obj.i == '0') {
            this.setState({realmReload: false});
            this.props.setListIconShow(true);
        }
    }

    setSpinnerVisible(val){
        this.setState({spinnerVisible:val});
    }

    renderRow(rowData) {   // shop ListView

        return (
            <View style={{height: 40, justifyContent:'center'}}><Text style={{fontSize:15}}>{rowData.name}</Text></View>
        );
    }

    render() {

        console.log(this.props.showmap);

        var localList;
        if (this.props.viewMode == 'surf')
            localList = (this.props.showmap ?
                <SurfLocalListMap />:<SurfLocalList setShopModalVisible={this.setShopModalVisible}  setSpinnerVisible={this.setSpinnerVisible}
                    />);
        else if (this.props.viewMode == 'gliding')
            localList = (this.props.showmap ?
                <GlidLocalListMap />:<GlidingLocalList setShopModalVisible={this.setShopModalVisible} setSpinnerVisible={this.setSpinnerVisible}
                />);

        return (

            <View style={{flex: 1}}>

                <ScrollableTabView tabBarUnderlineStyle={{backgroundColor: "#94000f"}}
                                   tabBarActiveTextColor="#94000f"
                                   tabBarInactiveTextColor="#94000f"
                                   tabBarBackgroundColor="white"
                                   ref={'scrollableTabView'}
                                   locked={false}
                                   tabBarTextStyle={styles.tabText}
                                   onChangeTab={(obj) => this.onChangeTab(obj)}
                                   style={{height: 18}}>

                    <ScrollView tabLabel="날씨상황" style={styles.tabView} ref="LocalScrollView">
                        {(Platform.OS == 'ios') && <View style={pickerStyle.localListView}>
                            {localList}
                        </View>}
                        {!(Platform.OS == 'ios') && <View style={{height:this.props.showmap==true?SCREEN_HEIGHT:null}}>{localList}</View>}
                    </ScrollView>

                    <ScrollView tabLabel="즐겨찾기" style={styles.tabView}>
                        <FavoriteList setShopModalVisible={this.setShopModalVisible  }
                                      realmReload={this.state.realmReload    }
                                      viewMode={this.props.viewMode       }
                        />
                    </ScrollView>
                </ScrollableTabView>


                {/* shopList Modal */}
                <SimpleModal
                    open={this.state.shopModalVisible}
                    modalDidOpen={() => console.log('modal did open')}
                    modalDidClose={() => this.setState({shopModalVisible: false})}
                    style={{alignItems: 'center'}}>

                    <Text style={{fontSize: 20, marginBottom: 15, color: '#94000F'}}>주변샾</Text>

                    <ListView dataSource={this.state.dataSource} renderRow={this.renderRow}/>

                </SimpleModal>

                {/*------ Shop Detail Modal ------- */}
                <Modal
                    animationType={"none"}
                    transparent={true}
                    visible={this.state.shopDetailVisible}
                    onRequestClose={() => { this.setState({shopDetailVisible: false});  }}>

                    <View style={pickerStyle.modalContainer}>
                        <View style={[pickerStyle.closeIcon, {opacity: this.state.shopDetailVisible == true ? 1 : 0}]}>
                            <TouchableOpacity onPress={() => {  this.setState({shopDetailVisible: false})  }}>
                                <Ionicons name="md-close" size={40} color={'white'}/>
                            </TouchableOpacity>
                        </View>
                        <View style={{height: SCREEN_HEIGHT / 1.2 ,marginLeft:20, marginRight:20 }}>

                            <WebView
                                mediaPlaybackRequiresUserAction={false}
                                style={pickerStyle.webView}
                                automaticallyAdjustContentInsets={true}
                                source={{uri: shopUrl}}
                                javaScriptEnabled={true}
                                startInLoadingState={true}
                                scalesPageToFit={true}
                            />
                        </View>

                    </View>
                </Modal>
                <Spinner style={pickerStyle.spinnerLocal} isVisible={this.state.spinnerVisible} size={80} type={"Bounce"}
                         color={'#94000F'}/>
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
    tabText: {
        fontSize: 17
    }

});

module.exports = TabView;