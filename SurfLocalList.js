'use strict';

import  React, {Component} from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    ListView,
    TouchableOpacity,
    Modal,
    Image,
    Platform,
    Dimensions } from 'react-native';

import SurfWeatherList   from './SurfWeatherList';
import { realmInstance } from "./RealmHndler.js";
import Analytics         from 'react-native-firebase-analytics';

var FirebaseHndler = require('./FirebaseHndler');
var pickerStyle    = require('./pickerStyle') ;
var selectedRowData ;

class LocalList extends Component{

    setModalVisible(visible) {     this.setState({modalVisible: visible});   }


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
            sectionHeaderHasChanged : (r1, r2) => r1 !== r2,
            rowHasChanged           : (r1, r2) => r1 !== r2
        });

        this.state = {
            dataSource: new ListView.DataSource({
                sectionHeaderHasChanged: (r1, r2) => r1 !== r2,
                rowHasChanged: (r1, r2) => r1 !== r2
            })
            ,modalVisible        : false
            ,spinnerVisible      : true

        };

        this.controlModeRealm();

    }

    componentWillMount(){
        this.props.setSpinnerVisible(true);
    }

    componentDidMount(){

        var that = this;

        FirebaseHndler.getSurfLocalListItem().then(function (items) {
            that.setState({dataSource:that.state.dataSource.cloneWithRowsAndSections(items)});
            that.props.setSpinnerVisible(false);
        }, function(err){
            console.log(err)
        });

        Platform.select({
            ios    : () => Analytics.setUserId('My_ios'),
            android: () => Analytics.setUserId('My_android')}
        );

        Analytics.setUserProperty('user_property_surfing', 'user_property_surfing_value');

        Analytics.logEvent("Surf View", {
            'ITEM_NAME': 'surfEventValue'
        });

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
            //Already exists. update mode to 'S'
            realmInstance.create('ModeLastStay', {index: 'lastmode', mode: 'S'}, true);

        });
    }

    renderRow(rowData) {

        var shopShow = false;

        if(rowData.shop == "")      shopShow   = false;
        else                        shopShow   = true;

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
                    animationType  = {"fade"}
                    transparent    = {false}
                    visible        = {this.state.modalVisible}
                    onRequestClose = {() => {this.setModalVisible(false)}}>

                    <SurfWeatherList
                        modalVisible = {this.setModalVisible}
                        rowData      = {selectedRowData}/>
                </Modal>
                <ListView
                    ref                 = "listView"
                    scrollsToTop        = {true}
                    dataSource          = {this.state.dataSource}
                    renderSectionHeader = {this.renderSectionHeader}
                    renderRow           = {this.renderRow}
                    automaticallyAdjustContentInsets={false}
                />
            </View>
        );
    }
};


module.exports = LocalList;
