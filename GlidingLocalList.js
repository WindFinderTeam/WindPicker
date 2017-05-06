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
    Platform,
    Modal,
    Image } from 'react-native';

import GlidingWeatherList from './GlidingWeatherList';
import { realmInstance }  from "./RealmHndler.js";
import FirebaseHndler     from './FirebaseHndler';
import Analytics          from 'react-native-firebase-analytics';

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
            // dataSource      : this.ds.cloneWithRowsAndSections(this.renderListViewData())
            // dataSource      : this.ds.cloneWithRowsAndSections(this.listenForItems(Firebase.ref().child('GlidingLocalData')))
            dataSource: new ListView.DataSource({
                sectionHeaderHasChanged: (r1, r2) => r1 !== r2,
                rowHasChanged: (r1, r2) => r1 !== r2
            })
            ,modalVisible    : false
        };

        this.setModeRealm();

    }

    componentWillMount(){
        this.props.setSpinnerVisible(true);
    }

    setRealmReload(){
        //It is nothing to do, but necessary
    }

    componentDidMount(){

        var that = this;
        that.props.setSpinnerVisible(true);


        FirebaseHndler.getGlidLocalListItem().then(function(item){
            that.setState({dataSource:that.state.dataSource.cloneWithRowsAndSections(item)});
            that.props.setSpinnerVisible(false);
        }, function(error) {
            console.log("error!", error);
        });

        Platform.select({
            ios    : () => Analytics.setUserId('My_ios'),
            android: () => Analytics.setUserId('My_android')}
        );

        Analytics.setUserProperty('user_property_gliding', 'user_property_gliding_value');

        Analytics.logEvent("Gliding_View", {
            'ITEM_NAME': 'glideEventValue'
        });
    }

    setModeRealm(){

        realmInstance.write(() => {
            //Already exists. update mode to 'G'
            realmInstance.create('ModeLastStay', { index: 'lastmode', mode: 'G'}, true);
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

        if( rowData.shop == "")     shopShow = false;
        else                        shopShow = true;

        return (
            <TouchableOpacity onPress={() => { this._onPressButton(rowData)}}>
                {/* row style */}
                <View style={pickerStyle.listViewrow}>
                    {/* distict */}
                    <View style={pickerStyle.listViewrowDistrict}>
                        <Text style={pickerStyle.localListrowText}>{rowData.district}</Text>
                    </View>

                    {/* icons */}
                    {shopShow &&
                    <TouchableOpacity onPress = {() => this.props.setShopModalVisible(true, rowData.shop)}>
                        <View style={pickerStyle.shopIconView}>
                            <View style={pickerStyle.iconBorder}>
                                <Image source={require('./image/surfShop.png')} style={{width: 35, height: 35}}/>
                            </View>
                        </View>
                    </TouchableOpacity>}

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
                        rowData = {selectedRowData}
                        realmReload    = {this.setRealmReload}
                    />

                </Modal>

                <ListView
                    ref="listView"
                    automaticallyAdjustContentInsets={false}
                    scrollsToTop={true}
                    dataSource={this.state.dataSource}
                    renderSectionHeader={this.renderSectionHeader}
                    renderRow={this.renderRow}
                />
            </View>
        );
    }
};

module.exports = LocalList;