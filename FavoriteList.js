'use strict';

import  React, {Component} from 'react';

import {
    Image,
    ListView,
    TouchableHighlight,
    TouchableOpacity,
    TouchableWithoutFeedback,
    StyleSheet,
    Text,
    View,
    Dimensions,
    Modal,
    ToastAndroid,
} from 'react-native';

import SurfWeatherList      from './SurfWeatherList';
import GlidWeatherList      from './GlidingWeatherList';
import Ionicons             from 'react-native-vector-icons/Ionicons';

import {realmInstance}      from "./RealmHndler.js";
var FirebaseHndler = require('./FirebaseHndler');

var surfLocalData  = require('./jsData/SurfLocalData.json');
var glidfLocalData = require('./jsData/GlidingLocalData.json');
var pickerStyle    = require('./pickerStyle');
var dataSource     = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
var selectedRowData;
var favoriteDataList = [];

const WINDOW_WIDTH = Dimensions.get('window').width;


class FavoriteList extends Component {

    constructor(props) {
        super(props);

        console.log("now constructor runs");
        this._renderRow             = this._renderRow.bind(this);
        this._renderHeader          = this._renderHeader.bind(this);
        this.setSurfModalVisible    = this.setSurfModalVisible.bind(this);
        this.setGlidModalVisible    = this.setGlidModalVisible.bind(this);
        this._onPressButton         = this._onPressButton.bind(this);
        this.realmRead              = this.realmRead.bind(this);

        this.state = {
            surfModalVisible        : false,
            glidModalVisible        : false,
            viewMode                : this.props.viewMode,
        };
    }

    componentDidMount()          {  this.realmRead();    }

    setSurfModalVisible(visible) {  this.setState({surfModalVisible: visible});   }
    setGlidModalVisible(visible) {  this.setState({glidModalVisible: visible});   }

    _onPressButton(rowData) {

        if (rowData.theme === 'surfing') {
            selectedRowData = surfLocalData.local[rowData.index];
            this.setSurfModalVisible(!this.state.surfModalVisible);
        }

        else if (rowData.theme === 'gliding') {
            selectedRowData = glidfLocalData.local[rowData.index];
            this.setGlidModalVisible(!this.state.glidModalVisible);
        }
    }


    realmRead() {
        // READ all favorite surfing, gliding data
        realmInstance.write(() => {

            let AllFavorite_surfing = realmInstance.objects('FavoriteSurfing');
            let AllFavorite_glding  = realmInstance.objects('FavoriteGliding');

            favoriteDataList = [];

            if (this.props.viewMode == 'surf'){
                for (var i in AllFavorite_surfing) {
                    favoriteDataList.push({
                        "theme": "surfing",
                        "index": AllFavorite_surfing[i].index,
                        "name": AllFavorite_surfing[i].name,
                        "webcam": AllFavorite_surfing[i].webcam,
                        "shop": AllFavorite_surfing[i].shop
                    });
                }
            }

            else {
                for (var i in AllFavorite_glding) {
                    favoriteDataList.push({
                        "theme": "gliding",
                        "index": AllFavorite_glding[i].index,
                        "name": AllFavorite_glding[i].name,
                        "webcam": AllFavorite_glding[i].webcam,
                        "shop": AllFavorite_glding[i].shop
                    });
                }
            }
        });
        dataSource =  dataSource.cloneWithRows(favoriteDataList);
    }


    _renderHeader() {

        var varRenderHeader = '';

        if (this.props.viewMode == 'surf'){
            varRenderHeader = (
                <Image source={require('./image/fav_surfing.png')} style={styles.container}>
                    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                        <Text style={styles.sectionHeaderText}>서 핑</Text>
                    </View>
                </Image>);
        }
        else {
            varRenderHeader = (
                <Image source={require('./image/fav_paragliding.png')} style={styles.container}>
                    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                        <Text style={styles.sectionHeaderText}>패 러 글 라 이 딩</Text>
                    </View>
                </Image>);
        }

        return varRenderHeader;
    }

    _renderRow(rowData) {


        var shopShow = false, webcamShowJudge, shopIconImg;

        /* shoIconImg judge */
        if      (rowData.theme === 'surfing')      shopIconImg = (require('./image/surfShop.png'));
        else if (rowData.theme === 'gliding')      shopIconImg = (require('./image/glidingShop.png'));

        /* judge shop showing */
        if (Object.keys(rowData.shop) == "")       shopShow = false;
        else                                       shopShow = true;

        /* judge webcam showing */
        if (Object.keys(rowData.webcam) == "") {  webcamShowJudge = (<View style={{flexGrow: 1}}/>);        }
        else {
            webcamShowJudge = (
                <TouchableOpacity onPress={()=> { this.props.setWebCamModalVisible(true, rowData.webcam) }}>
                    <View style={styles.webcamIconView}>
                        <View style={pickerStyle.iconBorder}>
                            <Ionicons name="ios-videocam" style={{color: "rgba(156,0,16,1)", fontSize: 25}}/>
                        </View>
                    </View>
                </TouchableOpacity>
            );
        }

        return (
            <TouchableHighlight onPress={() => {  this._onPressButton(rowData)    }}>
                <View style={pickerStyle.listViewrow}>
                    <View style={pickerStyle.listViewrowDistrict}>
                        <Text style={pickerStyle.localListrowText}>{rowData.name}</Text>
                    </View>

                    {/* icons */}
                    <View style={pickerStyle.listViewrowCamShop}>
                        <View style={{marginRight:0}}>{webcamShowJudge}</View>
                        <View style={{marginRight:0,flex:1}}>
                            {shopShow &&
                            <TouchableOpacity onPress = {() => this.props.setShopModalVisible(true, rowData.shop)}>
                                <View style={styles.shopIconView}>
                                    <View style={pickerStyle.iconBorder}>
                                        <Image source={require('./image/surfShop.png')} style={{width: 35, height: 35}}/>
                                    </View>
                                </View>
                            </TouchableOpacity>}

                            { !shopShow &&  <View style={{width:35, height:35}}></View> }
                        </View>
                    </View>
                </View>
            </TouchableHighlight>

        );
    }

    render() {

        if (this.props.realmReload == true)          this.realmRead();

        return (
            <View style={{flex:1}}>
                <Modal
                    animationType={"slide"}
                    transparent={false}
                    visible={this.state.surfModalVisible}
                    onRequestClose={() => {  this.setSurfModalVisible(false)   }}>

                    <SurfWeatherList
                        modalVisible={this.setSurfModalVisible}
                        rowData={selectedRowData}
                    />
                </Modal>

                <Modal
                    animationType={"slide"}
                    transparent={false}
                    visible={this.state.glidModalVisible}
                    onRequestClose={() => {  this.setGlidModalVisible(false)  }}>

                    <GlidWeatherList
                        modalVisible={this.setGlidModalVisible}
                        rowData={selectedRowData}
                    />
                </Modal>

                <ListView
                    enableEmptySections={true}
                    dataSource={dataSource}
                    renderRow={this._renderRow}
                    renderHeader={this._renderHeader}
                />
            </View>
        )
    }
}

var styles = StyleSheet.create({
    container: {

        width: WINDOW_WIDTH,
        height: 150
    },

    listViewrow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingLeft: 20,
        backgroundColor: '#F6F6F6',
        borderBottomWidth: 1,
        borderBottomColor: '#e9e9e9',
        height: 35,
        alignItems: 'center',
    },
    listViewrowText: {
        fontSize: 15,
        fontWeight: "100",
        color: 'black',
    },
    sectionHeader: {
        flex: 1,
        height: 150,
        justifyContent: 'center',

    },
    sectionHeaderText: {
        fontFamily: 'bmdohyeon',
        fontSize: 15,
        color: 'white',

    },
    sectionHeaderIcon: {
        color: 'white',
        position: 'absolute',
        marginLeft: (WINDOW_WIDTH - 20) / 2,
        marginBottom: 0,
        opacity: 0
    },
    webcamIconView: { alignItems:'flex-end',height:50,width:50, paddingRight:10,justifyContent:'center' },
    shopIconView  : { alignItems:'flex-end',paddingRight:20, justifyContent:'center',flexGrow:1, height:50}


});

module.exports = FavoriteList;