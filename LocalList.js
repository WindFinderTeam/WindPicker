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

var localData = [

    {
        "category":"surfing",
        "local":[
                 {"province":"제주", "district":"중문색달해변"}
                ,{"province":"제주", "district":"월정리해변"}
                ,{"province":"제주", "district":"곽지해수욕 장"}
                ,{"province":"서울", "district":"한강(마포대교)"}
                ,{"province":"서울", "district":"뚝섬"}
        ]
    }
]
var testData = [
    {"firstName":"Black","lastName":"Garrett"},
    {"firstName":"Morales","lastName":"Duncan"},
    {"firstName":"Ramos","lastName":"King"},
    {"firstName":"Dunn","lastName":"Collins"},
    {"firstName":"Fernandez","lastName":"Montgomery"},
    {"firstName":"Burns","lastName":"Fox"},
    {"firstName":"Richardson","lastName":"Kim"},
    {"firstName":"Hanson","lastName":"Evans"},
    {"firstName":"Anderson","lastName":"Hunt"},
    {"firstName":"Carter","lastName":"Grant"},
    {"firstName":"Ray","lastName":"Ruiz"},
    {"firstName":"Hart","lastName":"Schmidt"},
    {"firstName":"White","lastName":"Andrews"},
    {"firstName":"Hall","lastName":"Holmes"},
    {"firstName":"Hawkins","lastName":"Gomez"},
    {"firstName":"Bowman","lastName":"Sullivan"},
    {"firstName":"Brooks","lastName":"Evans"},
    {"firstName":"Reyes","lastName":"Perez"},
    {"firstName":"Dixon","lastName":"Barnes"},
    {"firstName":"Ward","lastName":"Lee"},
    {"firstName":"Berry","lastName":"Payne"},
    {"firstName":"Murray","lastName":"Rose"},
    {"firstName":"Stephens","lastName":"Fowler"},
    {"firstName":"Rodriguez","lastName":"Lewis"},
    {"firstName":"Cook","lastName":"Dean"}
];
var selectedRowData ;

import WeatherList from './WeatherList';

class SampleRow extends Component{


    render() {
        return (
                <View style={styles.listViewrow}>
                    <View>
                        <Text style={styles.text}>{this.props.district}</Text>
                    </View>
                </View>
        );
    }
};

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

        this.setModalVisible = this.setModalVisible.bind(this);
        this.renderRow = this.renderRow.bind(this);

        var ds = new ListView.DataSource({
            sectionHeaderHasChanged: (r1, r2) => r1 !== r2,
            rowHasChanged: (r1, r2) => r1 !== r2
        });

        var {data, sectionIds} = this.renderListViewData(localData);
        this.state = {dataSource : ds.cloneWithRowsAndSections(data, sectionIds)
                     ,modalVisible: false};

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

    renderRow(rowData) {
        //console.log('##### rowData >>>>>' + rowData.firstName);
        return (
            <TouchableOpacity   onPress={() => { this._onPressButton(rowData)}}>
                <SampleRow {...rowData} style={styles.row} />
            </TouchableOpacity>
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

                    <WeatherList modalVisible={this.setModalVisible} rowData = {selectedRowData} />


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