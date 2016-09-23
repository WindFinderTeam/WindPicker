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

var surfLocalData = require('./jsData/SurfLocalData.json');
var camUri = "", webcamClicked="";
var selectedRowData ;
var selectedHeaderData ;


class LocalList extends Component{


    setCamVisible(visible) {

        this.setState({camVisible: visible});
        console.log("changed !!!!!!! this.state.camVisible :" + this.state.camVisible + " camUri  : " + camUri);
        // off camLOadedOpa
        this.setState({camLoadedOpa:0 });

    }

    setCamLoadedOK(visible) {
        if(visible == '1'){
            this.setState({camLoadedOpa:1 });
        }

        console.log("ccamLoadedOpa: visible OK OK :" + this.state.camLoadedOpa);
    }

    setModalVisible(visible) {
        this.setState({modalVisible: visible});
        console.log("changed !!! this.state.modalVisible :" + this.state.modalVisible);
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



    _onPressWebcam(cam, webcam) {

        webcamClicked = cam;

        camUri = webcam;

        this.setCamVisible(true);
        console.log("webcamClicked cam is : " + webcamClicked , " state :" + this.state.camVisible + " camUri : " + camUri);
    }

    constructor(prop){
        super(prop);

        //---------------- Binding to Custom Func ----------------
        this.setModalVisible = this.setModalVisible.bind(this);
        this.setCamVisible = this.setCamVisible.bind(this);
        this.renderRow = this.renderRow.bind(this);
        this.setCamLoadedOK = this.setCamLoadedOK.bind(this)
        //---------------------------------------------------------

        this.ds = new ListView.DataSource({
            sectionHeaderHasChanged: (r1, r2) => r1 !== r2,
            rowHasChanged: (r1, r2) => r1 !== r2
        });

        var {data, sectionIds} = this.renderListViewData(surfLocalData);
        this.state = {
            dataSource          : this.ds.cloneWithRowsAndSections(data, sectionIds)
            ,modalVisible        : false
            ,camVisible          : false
            ,camLoadedOpa         : 0

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



    renderRow(rowData) {


        var webcam1 = "", webcam2 = "";

        if(typeof rowData.webcam1 == "undefined"){
            webcam1 = "";
        } else {
            webcam1 = rowData.webcam1;
        }

        if(typeof rowData.webcam2 == "undefined"){
            webcam2 = "";
        } else {
            webcam2 = rowData.webcam2;
        }

        return (
            <View style={{flex:1, flexDirection:'row'}}>
                <View style={{flex:1}}>

                    <View style={styles.listViewrow}>
                        <TouchableOpacity
                            onPress={() => { this._onPressButton(rowData)}}>
                            <Text style={styles.text}>{rowData.district}</Text>
                        </TouchableOpacity>
                    </View>

                </View>
                <View style={{flex:1}}>
                    <View style={styles.listViewrowCam}>
                        <TouchableOpacity onPress={()=>{this._onPressWebcam("cam1", rowData.webcam1)}}>
                            <Ionicons name="ios-videocam-outline" size={30} color={webcam1==""?this.setRgba(0):this.setRgba(1)}/>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={()=>{this._onPressWebcam("cam2", rowData.webcam2)}}>
                            <Ionicons name="ios-videocam-outline" size={30} color={webcam2==""?this.setRgba(0):this.setRgba(1)}/>
                        </TouchableOpacity>
                    </View>

                </View>
            </View>
        )
    }

    render() {
        var myHeader = `User-Agent: Samsung SHV-E300S stagefright/Beyonce/1.1.9 (Linux;Android 5.0.1) (SKT-HLS; SKT-SS-p.0.1; SHV-E300S)
allow-cross-domain-redirect: false
Host: liveserver.iptime.org:82
Connection: Keep-Alive
Accept-Encoding: gzip` ;

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

                <Modal
                    animationType={"fade"}
                    transparent={true}
                    visible={this.state.camVisible}
                    onRequestClose={() => {this.setCamVisible(false)}}>
                    <View style={styles.modalContainer}>
                        <View>
                            <View style={[styles.closeContain, {opacity:this.state.camLoadedOpa}]}>
                                <TouchableOpacity onPress={()=>{this.setCamVisible(false)}}>
                                    <Ionicons name="md-close" size={25} color={'#94000F'}/>
                                </TouchableOpacity>
                            </View>
                            <WebView
                                ref='WebView1'
                                modalVisible={this.setCamVisible}
                                onLoad={()=>{this.setCamLoadedOK("1")}}
                                style={styles.webView}
                                automaticallyAdjustContentInsets={true}
                                source={{uri: camUri}}
                                javaScriptEnabled={true}
                                startInLoadingState={true}
                                scalesPageToFit={true}
                            />
                        </View>
                    </View>
                </Modal>
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
    listViewrowCam: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        backgroundColor: '#F6F6F6',
        borderBottomWidth: 1,
        borderBottomColor: '#e9e9e9',
        height:35,
    },
    text: {
        fontSize: 15,
        fontWeight: "100",
        color: 'black',
    },
    modalContainer:{
        justifyContent: 'center',
        backgroundColor:'rgba(0, 0, 0, 0.5)',
        flex:1

    },
    innerContainer:{
        backgroundColor:'rgba(0, 0, 0, 0.5)',
        height:SCREEN_HEIGHT/2,
    },
    webView: {
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor:'white',
        width:SCREEN_WIDTH,
        height:SCREEN_HEIGHT/2
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