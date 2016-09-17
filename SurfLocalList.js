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
    Image } from 'react-native';


import SurfWeatherList from './SurfWeatherList';
import Ionicons        from 'react-native-vector-icons/Ionicons';

var surfLocalData = require('./jsData/SurfLocalData.json');

var selectedRowData ;
var selectedHeaderData ;


class LocalList extends Component{


    setModalVisible(visible) {
        this.setState({modalVisible: visible});
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

        };
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
            <View style={styles.sectionHeader}>
                <Text style={styles.sectionHeaderText}>{sectionId}</Text>
            </View>
        );
    }


    showWebcam1(rowData) {
        return (
            <WebView
                ref='WebView1'
                automaticallyAdjustContentInsets={false}
                style={styles.webView}
                source={{uri: rowData.webcam1}}
                javaScriptEnabled={true}
                domStorageEnabled={true}

                startInLoadingState={true}
                scalesPageToFit={true}

            />
        );
    }


    renderRow(rowData) {
        return (
            <View style={{flex:1, flexDirection:'row'}}>
                <View style={{flex:1}}>
                    <TouchableOpacity
                        onPress={() => { this._onPressButton(rowData)}}>
                        <View style={styles.listViewrow}>
                                <Text style={styles.text}>{rowData.district}</Text>
                        </View>
                    </TouchableOpacity>
                </View>
                <View style={{flex:1}}>
                        <View style={styles.listViewrow}>
                            <TouchableOpacity onPress={()=>{this.showWebcam1(rowData)}}>
                                <Ionicons name="ios-videocam-outline" size={30} color="#94000F"/>
                            </TouchableOpacity>
                        </View>

                </View>
            </View>
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
        height:35,
        alignItems: 'center',
    },
    text: {
        fontSize: 15,
        fontWeight: "100",
        color: 'black',
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
    },
    webView: {
        backgroundColor: 'white',
        opacity:0.8,
        height: 350,
    },
});

module.exports = LocalList;