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


import GlidingWeatherList from './GlidingWeatherList';
import { realmInstance }  from "./RealmHndler.js";


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

        this.state = {
            dataSource      : this.ds.cloneWithRowsAndSections(this.renderListViewData())
            ,modalVisible    : false
        };

        this.setModeRealm();
    }


    renderListViewData() {  

        var localListMap = {}  ;

        Array.from(glidingLocalData.local).forEach(function (myItem){ 
            if(!localListMap[myItem.province]){ 
                localListMap[myItem.province] = []; 
            } 
            localListMap[myItem.province].push(myItem);  
        });  

        return localListMap;  

    }

    setModeRealm(){

        realmInstance.write(() => {

            let lastModeChk = realmInstance.objects('ModeLastStay').filtered('index = "lastmode"');

            //Already exists. update mode to 'G'
            realmInstance.create('ModeLastStay', {
                index: 'lastmode', mode: 'G'}, true);

            console.log("after mode is >> " + lastModeChk[0].mode);
        });
    }

    renderSectionHeader(data, sectionId) {

        return (
            <View style={pickerStyle.localSectionHeader}>
                <Text style={pickerStyle.localSectionHeaderText}>{sectionId}</Text>
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
                    <View style={pickerStyle.listViewrowCamShop}>
                        {/* space-around을 쓰기땜에 shop 아이콘 부분과 동일한 간격 띄워둠 */}
                        <View style={{flex:1}}></View>

                        <View style={{flex:1}}>
                            {shopShow && <TouchableOpacity onPress = {() => this.props.setShopModalVisible(true, rowData.shop)}>
                                <View style={{alignItems:'center', justifyContent:'center',height:50}}>

                                    <View style={pickerStyle.iconBorder}>
                                        <Image source={require('./image/glidingShop.png')} style={{width: 35, height: 35}}/>
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




module.exports = LocalList;