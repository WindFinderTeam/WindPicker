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
import Ionicons          from 'react-native-vector-icons/Ionicons';
import { realmInstance } from "./RealmHndler.js";
import Firebase          from './FirebaseHndler';
import Analytics         from 'react-native-firebase-analytics';

var pickerStyle   = require('./pickerStyle') ;
var selectedRowData ;

class LocalList extends Component{

    setModalVisible(visible) {     this.setState({modalVisible: visible});   }

    setRgba(alpha) {
        var myAlpha = alpha;
        return `"rgba(156,0,16,` + `${myAlpha})"`;
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
            sectionHeaderHasChanged : (r1, r2) => r1 !== r2,
            rowHasChanged           : (r1, r2) => r1 !== r2
        });

        this.state = {
            // dataSource          : this.ds.cloneWithRowsAndSections(this.renderListViewData())
            // dataSource      : this.ds.cloneWithRowsAndSections(this.listenForItems(Firebase.ref().child('SurfLocalData')))
            dataSource: new ListView.DataSource({
                sectionHeaderHasChanged: (r1, r2) => r1 !== r2,
                rowHasChanged: (r1, r2) => r1 !== r2
            })
            ,modalVisible        : false
        };

        this.controlModeRealm();

        this.itemsRef = Firebase.ref().child('SurfLocalData');

    }

    componentWillMount() {
        // this.listenForItems(Firebase.ref().child('SurfLocalData'));
        this.listenForItems(this.itemsRef);
    }

    componentDidMount(){
        Analytics.setUserId('SurfLocal_notSelected');

        Platform.select({
            ios    : () => Analytics.setUserId('SurfLocal_ios'),
            android: () => Analytics.setUserId('SurfLocal_android')}
            );

        Analytics.setUserProperty('propertyName_surf', 'propertyValue_surf');

        Analytics.logEvent('view_item', {
            'item_id': 'SurfLocalList'
        });
    }

    listenForItems(itemsRef) {

        // get children as an array
        var localListMap = {};

        var district, province;

        itemsRef.on('value', (snap) => {

            snap.forEach((child) => {

                district = child.val().district;
                province = child.val().province;

                if (!localListMap[province]) localListMap[province] = [];
                localListMap[province].push(child.val());
            });

            this.setState({dataSource:this.state.dataSource.cloneWithRowsAndSections(localListMap)});
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

        var webcamShow = false, shopShow = false, webcamShowJudge;

        if(rowData.webcam == "")    webcamShow = false;
        else                        webcamShow = true;

        if(rowData.shop == "")      shopShow   = false;
        else                        shopShow   = true;

        if (webcamShow == true) {
            webcamShowJudge = (
                <TouchableOpacity onPress={()=>{if(webcamShow==true){this.props.setWebCamModalVisible(true, rowData.webcam)}}}>
                    <View style={[styles.webcamIconView ,{width:webcamShow==false?0:50,height:webcamShow==false?0:50 }]}>
                        <View style={[pickerStyle.iconBorder, {opacity:webcamShow==false?0:1}]}>
                            <Ionicons name="ios-videocam" style={{color:webcamShow==false?this.setRgba(0):this.setRgba(1), fontSize:25}}/>
                        </View>
                    </View>
                </TouchableOpacity>
            );
        }
        else    webcamShowJudge = (<View style={{flex:1}}/>);

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


var styles = StyleSheet.create({

    webcamIconView: { alignItems:'flex-end', justifyContent:'center',paddingRight:10  },
    shopIconView  : { alignItems:'flex-end',paddingRight:20, justifyContent:'center',flexGrow:1, height:50}
});

module.exports = LocalList;
