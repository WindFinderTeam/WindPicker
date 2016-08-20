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


import WeatherList from './WeatherList';
import Ionicons     from 'react-native-vector-icons/Ionicons';

var localData = require('./jsData/localData.json');
var selectedRowData ;
var selectedHeaderData ;


class LocalList extends Component{


    setModalVisible(visible) {
        this.setState({modalVisible: visible});
    }



    _onPressButton(rowData, headerData){
        //ToastAndroid.show('This is '+ rowData.lastName, ToastAndroid.SHORT);
        selectedRowData = rowData;
        selectedHeaderData = headerData;
        this.setModalVisible(true);
    }

    constructor(prop){
        super(prop);

        //---------------- Binding to Custom Func ----------------
        this.setModalVisible = this.setModalVisible.bind(this);
        this.renderRow = this.renderRow.bind(this);
        //---------------------------------------------------------

        var ds = new ListView.DataSource({
            sectionHeaderHasChanged: (r1, r2) => r1 !== r2,
            rowHasChanged: (r1, r2) => r1 !== r2
        });

        var {data, sectionIds} = this.renderListViewData(localData);
        this.state = {
                       dataSource          : ds.cloneWithRowsAndSections(data, sectionIds)
                      ,modalVisible        : false
                      ,heartFlag:false
                      ,heartColor:"gold"
        };
    }


    renderListViewData(localData) {

        var data = {}  ;      // Object
        var sectionIds = [];  // Array

        //if(서핑테마 일 경우)
        localData = localData[0].local;

        var province = null;

        for(var i=0; i< localData.length ; i++){

            if(province != localData[i].province){
                sectionIds.push(localData[i].province);
                data[localData[i].province]=[];
                province = localData[i].province;
            }

            data[localData[i].province].push(localData[i]);
        }

        return {data, sectionIds};
    }

    renderSectionHeader(data, sectionId) {
        //console.log('##### sectionData  >>>>>' + data[0].lastName);  // Garrett
        //console.log('##### sectionData >>>>>' + data[1].lastName); // Duncan

        return (
            <View style={styles.sectionHeader}>
                <Text style={styles.sectionHeaderText}>{sectionId}</Text>
            </View>
        );
    }


    renderRow(rowData, headerData) {
        console.log('#LocalList headerData >' + headerData);
        var heartColor="#FFF"
        return (
            <TouchableHighlight
                underlayColor="rgb(255,0,0)"
                onPress={() => { this._onPressButton(rowData, headerData)}}>
                <View style={styles.listViewrow}>
                    <View>
                        <Text style={styles.text}>{rowData.district}</Text>
                    </View>
                    <TouchableOpacity onPress={() => {
                                                        console.log("###### > "+ this.state.heartColor);
                                                        if(this.state.heartFlag)
                                                            {
                                                              this.setState({heartFlag:false
                                                                            ,heartColor:"gold"});
                                                            }
                                                         else
                                                         {
                                                                   this.setState({heartFlag:true
                                                                            ,heartColor:"red"});
                                                         }
                                                        }
                                                  }>
                        <View style={{marginRight:20}}>
                            <Ionicons name="ios-heart" size={30} color={this.state.heartColor} />
                        </View>
                    </TouchableOpacity>
                </View>
            </TouchableHighlight>
        )
    }


    render() {
        return (
            <View>
                <Modal
                    animationType={"slide"}
                    transparent={false}
                    visible={this.state.modalVisible}
                    onRequestClose={() => {this.setModalVisible(false)}}>

                    <WeatherList
                        modalVisible={this.setModalVisible}
                        rowData = {selectedRowData}
                        headerData = {selectedHeaderData}/>

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
        fontSize: 16,
        fontWeight: "100",
        color: 'black',
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#402e24',
        height:30
    },
    sectionHeaderText: {
        fontSize: 16,
        color: 'white',
        marginLeft: 10
    }
});


module.exports = LocalList;