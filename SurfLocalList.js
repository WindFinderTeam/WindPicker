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
    WebView,
    Modal,
    Image,
    Dimensions } from 'react-native';


import SurfWeatherList from './SurfWeatherList';
import Ionicons        from 'react-native-vector-icons/Ionicons';
import { realmInstance } from "./RealmHndler.js";

var pickerStyle   = require('./pickerStyle') ;
var surfLocalData = require('./jsData/SurfLocalData.json');
var selectedRowData ;

class LocalList extends Component{

    setModalVisible(visible) {
        this.setState({modalVisible: visible});
        //console.log("changed !!! this.state.modalVisible :" + this.state.modalVisible);
    }

    setRgba(alpha) {
        var myAlpha = alpha;
        return `"rgba(156,0,16,` + `${myAlpha})"`;
    }


    _onPressButton(rowData){
        //ToastAndroid.show('This is '+ rowData.lastName, ToastAndroid.SHORT);
        selectedRowData = rowData;
        this.setModalVisible(true);
    }

    constructor(prop){
        super(prop);

        //---------------- Binding to Custom Func ----------------
        this.setModalVisible = this.setModalVisible.bind(this);
        this.renderRow = this.renderRow.bind(this);
        //---------------------------------------------------------
        this.ds = new ListView.DataSource({
            sectionHeaderHasChanged: (r1, r2) => r1 !== r2,
            rowHasChanged: (r1, r2) => r1 !== r2
        });

        var {data, sectionIds} = this.renderListViewData(surfLocalData);
        this.state = {
            dataSource          : this.ds.cloneWithRowsAndSections(data, sectionIds)
            ,modalVisible        : false
            ,dataSource_fb : new ListView.DataSource({
            rowHasChanged: (row1, row2) => row1 !== row2,
        })

        };

        this.controlModeRealm();

    }

    renderListViewData(surfLocalData) {

        var data = {}  ;      // Object
        var sectionIds = [];  // Array

        //if(서핑테마 일 경우)
        surfLocalData = surfLocalData.local;

        var province = null;

        for(var i=0; i< surfLocalData.length ; i++){

            if(province != surfLocalData[i].province){
                sectionIds.push(surfLocalData[i].province);
                data[surfLocalData[i].province]=[];
                province = surfLocalData[i].province;
            }

            data[surfLocalData[i].province].push(surfLocalData[i]);
        }

        return {data, sectionIds};
    }

    renderSectionHeader(data, sectionId) {

        return (
            <View style={pickerStyle.localSectionHeader}>
                <Text style={pickerStyle.localSectionHeaderText}>{sectionId}</Text>
            </View>
        );
    }

    controlModeRealm(){

        realmInstance.write(() => {

            let lastModeChk = realmInstance.objects('ModeLastStay').filtered('index = "lastmode"');

            //Already exists. update mode to 'S'
            realmInstance.create('ModeLastStay', {
                index: 'lastmode', mode: 'S'}, true);

            console.log("after mode is >> " + lastModeChk[0].mode);
        });
    }

    renderRow(rowData) {

        var webcamShow = false, shopShow = false, webcamShowJudge;

        if(typeof rowData.webcam == "undefined")    webcamShow = false;
        else                                        webcamShow = true;

        if( typeof rowData.shop == "undefined")     shopShow = false;
        else                                        shopShow = true;

        if (webcamShow == true) {
            webcamShowJudge = (
                <TouchableOpacity onPress={()=>{if(webcamShow==true){this.props.setWebCamModalVisible(true, rowData.webcam)}}}>
                    <View style={{alignItems:'center', justifyContent:'center',width:webcamShow==false?0:50,height:webcamShow==false?0:50}}>
                            <View style={[pickerStyle.iconBorder, {opacity:webcamShow==false?0:1}]}>
                                <Ionicons name="ios-videocam" style={{color:webcamShow==false?this.setRgba(0):this.setRgba(1), fontSize:25}}/>
                            </View>
                    </View>
                </TouchableOpacity>
            );
        } else {
            //space-around을 쓰기땜에 shop 아이콘 부분과 동일한 간격 띄워둠
            webcamShowJudge = (<View style={{flex:1}}/>);

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
                    <View style={pickerStyle.listViewrowCamShop}>
                        <View style={{flex:1}}>{webcamShowJudge}</View>

                        <View style={{flex:1 }}>
                             {shopShow && <TouchableOpacity onPress = {() => this.props.setShopModalVisible(true, rowData.shop)}>
                                <View style={{alignItems:'center', justifyContent:'center',height:50}}>

                                    <View style={pickerStyle.iconBorder}>
                                        <Image source={require('./image/surfShop.png')} style={{width: 35, height: 35}}/>
                                    </View>
                                </View>
                            </TouchableOpacity>}
                        </View>

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

                    <SurfWeatherList
                        modalVisible={this.setModalVisible}
                        rowData = {selectedRowData}/>
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


const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;

var styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: '#F5FCFF',
    },


    innerContainer:{
        backgroundColor:'rgba(0, 0, 0, 0.5)',
        height:SCREEN_HEIGHT/2,
    },
    closeContain:{
        backgroundColor:'gray',
        borderRadius: 100,
        width: 30,
        height: 30,
        borderWidth: 1,
        borderColor: '#FFF',
        alignItems: 'center',
        marginLeft: SCREEN_WIDTH-45
    },


});

module.exports = LocalList;
