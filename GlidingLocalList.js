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
                        <Text style={styles.text}>{rowData.district}</Text>
                    </View>

                    {/* icons */}
                    <View style={pickerStyle.listViewrowCam}>
                        {/* space-around을 쓰기땜에 shop 아이콘 부분과 동일한 간격 띄워둠 */}
                        <Text>        </Text>

                        {/* shop icon showing control */}
                        <TouchableOpacity  onPress = {() => this.props.setShopModalVisible(true , rowData.shop)}>
                            <View style={[pickerStyle.iconBorder, {opacity:shopShow==false?0:1}]}>
                                <Image source={require('./image/surfShop.png')}
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
    }
});


module.exports = LocalList;