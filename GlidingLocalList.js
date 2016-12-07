'use strict';

import  React, {Component} from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    ListView,
    TextInput,
    TouchableHighlight,
    TouchableOpacity,
    DeviceEventEmitter,
    ToastAndroid,
    Modal,
    Image } from 'react-native';


import GlidingWeatherList         from './GlidingWeatherList';

import {
    GoogleAnalyticsTracker,
    GoogleTagManager,
    GoogleAnalyticsSettings
} from 'react-native-google-analytics-bridge';

import { realmInstance } from "./RealmHndler.js";

var tracker1 = new GoogleAnalyticsTracker('UA-87305241-1');

var glidingLocalData = require('./jsData/GlidingLocalData.json');
var pickerStyle      = require('./pickerStyle') ;

var selectedRowData ;




class LocalList extends Component{

    setModalVisible(visible) {
        this.setState({modalVisible: visible});
    }



    _onPressButton(rowData){
        selectedRowData = rowData;
        this.setModalVisible(true);
    }

    constructor(prop){
        super(prop);

        //---------------- Binding to Custom Func ----------------
        this.setModalVisible = this.setModalVisible.bind(this);
        this.renderRow       = this.renderRow.bind(this);
        //---------------------------------------------------------

        this.ds = new ListView.DataSource({
            sectionHeaderHasChanged: (r1, r2) => r1 !== r2,
            rowHasChanged          : (r1, r2) => r1 !== r2
        });

        var {data, sectionIds} = this.renderListViewData(glidingLocalData);
        this.state = {
             dataSource      : this.ds.cloneWithRowsAndSections(data, sectionIds)
            ,modalVisible    : false

        };

        this.controlModeRealm();

    }


    componentWillMount() // before rendering
    {
        tracker1.trackScreenView('패러글라이딩');
        tracker1.trackEvent('지역리스트뷰', '활공장 목록');

        // The GoogleAnalyticsSettings is static, and settings are applied across all trackers:
        GoogleAnalyticsSettings.setDispatchInterval(30);
        GoogleAnalyticsSettings.setDryRun(true);

        // GoogleTagManager is also static, and works only with one container. All functions here are Promises:
      /*  GoogleTagManager.openContainerWithId("활공장")
            .then(() => {
                return GoogleTagManager.stringForKey("pack");
            })
            .then((pack) => {
                console.log("Pack: ", pack);
            })
            .catch((err) => {
                console.log(err);
            });*/
    }

    renderListViewData(glidingLocalData) {

        var data = {}  ;      // Object
        var sectionIds = [];  // Array

        //if(서핑테마 일 경우)
        glidingLocalData = glidingLocalData.local;

        var province = null;

        for(var i=0; i< glidingLocalData.length ; i++){

            if(province != glidingLocalData[i].province){
                sectionIds.push(glidingLocalData[i].province);
                data[glidingLocalData[i].province]=[];
                province = glidingLocalData[i].province;
            }

            data[glidingLocalData[i].province].push(glidingLocalData[i]);
        }

        return {data, sectionIds};
    }

    controlModeRealm(){

        realmInstance.write(() => {

            let lastModeChk = realmInstance.objects('ModeLastStay').filtered('index = "lastmode"');

            console.log("before mode is >> " + lastModeChk[0].mode);

            if(Object.keys(lastModeChk) == ""){
                //generate an row
                realmInstance.create('ModeLastStay', {
                    index   : 'lastmode',
                    mode    : 'G'
                });

            } else {
                //Already exists. update mode to 'S'
                realmInstance.create('ModeLastStay', {
                    index: 'lastmode', mode: 'G'}, true);

                lastModeChk = realmInstance.objects('ModeLastStay').filtered('index = "lastmode"');
            }
            console.log("after mode is >> " + lastModeChk[0].mode);
        });
    }

    renderSectionHeader(data, sectionId) {

        return (
            <View style={styles.sectionHeader}>
                <Text style={styles.sectionHeaderText}>{sectionId}</Text>
            </View>
        );
    }


    renderRow(rowData) {

        var shopShow = false;

        if( typeof rowData.shop == "undefined"){
            shopShow = false;
        } else {
            shopShow = true;
        }

        return (
            <TouchableOpacity onPress={() => { this._onPressButton(rowData)}}>
                {/* row style */}
                <View style={pickerStyle.listViewrow}>
                    {/* distict */}
                    <View style={pickerStyle.listViewrowDistrict}>
                        <Text style={pickerStyle.localListrowText}>{rowData.district}</Text>
                    </View>

                    {/* icons */}
                    <View style={pickerStyle.listViewrowCam}>
                        {/* space-around을 쓰기땜에 shop 아이콘 부분과 동일한 간격 띄워둠 */}
                        <Text>        </Text>

                        {/* shop icon showing control */}
                        <TouchableOpacity  onPress = {() => this.props.setShopModalVisible(true , rowData.shop)}>
                            <View style={[pickerStyle.iconBorder, {opacity:shopShow==false?0:1}]}>
                                <Image source={require('./image/glidingShop.png')}
                                       style={{opacity:shopShow==false?0:1, width:24, height:24}}/>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
            </TouchableOpacity>



        )
    }


    render() {
        return (
            <View>
                <Modal
                    animationType={"fade"}
                    transparent={false}
                    visible={this.state.modalVisible}
                    onRequestClose={() => {this.setModalVisible(false)}}>

                    <GlidingWeatherList
                        modalVisible={this.setModalVisible}
                        rowData = {selectedRowData} />

                </Modal>

                <ListView
                    ref="listView"
                    automaticallyAdjustContentInsets={false}
                    dataSource={this.state.dataSource}
                    renderSectionHeader={this.renderSectionHeader}
                    renderRow={this.renderRow}
                />

            </View>
        );
    }
};


var styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: '#F5FCFF',
    },
    listViewrow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingLeft: 20,
        backgroundColor: '#F6F6F6',
        borderBottomWidth: 1,
        borderBottomColor: '#e9e9e9',
        height:40,
        alignItems: 'center',
    },

    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#d4d4d4',
        height:30,
        marginTop:0,

    },
    sectionHeaderText: {
        fontSize: 15,
        color: '#424242',
        marginLeft: 10
    }
});


module.exports = LocalList;