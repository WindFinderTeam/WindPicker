'use strict';

import  React, {Component} from 'react';

import {
    Image,
    ListView,
    TouchableHighlight,
    TouchableOpacity,
    TouchableWithoutFeedback,
    StyleSheet,
    Text,
    View,
    Dimensions,
    Modal,
    ToastAndroid
} from 'react-native';

import Accordion           from 'react-native-collapsible/Accordion';
import SurfWeatherList         from './SurfWeatherList';
import GlidWeatherList         from './GlidingWeatherList';

import {realmInstance}   from "./RealmHndler.js";

var surfLocalData = require('./jsData/SurfLocalData.json');
var glidfLocalData = require('./jsData/GlidingLocalData.json');

var selectedRowData;
var ds1;
var ds2;
var favoriteGlidingList = [];
var favoriteSurfingList = [];
var readRealmFlag = true;
var tempObject = [];

class FavoriteList extends Component {

    constructor(props) {
        super(props);

        this._renderRow = this._renderRow.bind(this);
        this._renderHeader = this._renderHeader.bind(this);
        this.setSurfModalVisible = this.setSurfModalVisible.bind(this);
        this.setGlidModalVisible = this.setGlidModalVisible.bind(this);

        this._onPressButton = this._onPressButton.bind(this);

        this.realmRead = this.realmRead.bind(this);
        this._InnerDataRenderRow = this._InnerDataRenderRow.bind(this);


        ds1 = new ListView.DataSource(
            {
                rowHasChanged: (r1, r2) => r1 !== r2,
            }
        );


        ds2 = new ListView.DataSource(
            {
                rowHasChanged: (r1, r2) => r1 !== r2,
            }
        );


        this.state = {
             surfModalVisible: false
            ,glidModalVisible: false
            , isCollapsed: false

            , dataSource: [
                {
                    title: <Image source={require('./image/fav_surfing.png')} style={styles.container}>
                        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                            <Text style={styles.sectionHeaderText}>서 핑</Text>
                        </View>
                    </Image>,
                    innerDataSource: ds1.cloneWithRows(favoriteSurfingList)
                },
                {
                    title: <Image source={require('./image/fav_paragliding.png')} style={styles.container}>
                        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                            <Text style={styles.sectionHeaderText}>패 러 글 라 이 딩</Text>
                        </View>
                    </Image>,
                    innerDataSource: ds2.cloneWithRows(favoriteGlidingList)
                }]
        };

    }

    setSurfModalVisible(visible) {
        this.setState({surfModalVisible: visible});
    }

    setGlidModalVisible(visible) {
        this.setState({glidModalVisible: visible});
    }

    _onPressButton(rowData) {

        for (var i in tempObject) {
            if (rowData == tempObject[i].name) {
                if(tempObject[i].theme == "surfing"){
                    selectedRowData = surfLocalData.local[tempObject[i].index];
                    console.log("surfing" + tempObject[i].index + "," + tempObject[i].name + "," + selectedRowData.district);
                    this.setSurfModalVisible(!this.state.surfModalVisible);
                } else if(tempObject[i].theme == "gliding"){
                    selectedRowData = glidfLocalData.local[tempObject[i].index];
                    console.log("gliding" + tempObject[i].index + "," + tempObject[i].name + "," + selectedRowData.district);
                    this.setGlidModalVisible(!this.state.glidModalVisible);
                }

                break;
            }

        }
        // selectedRowData = rowData;

    }


    realmRead() {

        console.log("realmRead in ");
        // READ all favorite surfing, gliding data
        realmInstance.write(() => {

            let AllFavorite_surfing = realmInstance.objects('FavoriteSurfing');
            let AllFavorite_glding  = realmInstance.objects('FavoriteGliding');

            favoriteSurfingList = [];
            favoriteGlidingList = [];
            tempObject          = [];

            favoriteSurfingList.push("tempData");
            favoriteGlidingList.push("tempData");

            for (var i in AllFavorite_surfing)
            {
                favoriteSurfingList.push(AllFavorite_surfing[i].name);
                tempObject.push({"theme":"surfing", "index":AllFavorite_surfing[i].index, "name":AllFavorite_surfing[i].name});
            }

            for (var i in AllFavorite_glding)
            {
                favoriteGlidingList.push(AllFavorite_glding[i].name);
                tempObject.push({"theme":"gliding","index": AllFavorite_glding[i].index, "name": AllFavorite_glding[i].name});
            }

            this.state.dataSource[0].innerDataSource = ds1.cloneWithRows(favoriteSurfingList);
            this.state.dataSource[1].innerDataSource = ds2.cloneWithRows(favoriteGlidingList);

            readRealmFlag =false;
        });
    }

    _renderHeader(section, key) {

        return (
            <View style={styles.sectionHeader}>
                {section.title}
            </View>
        )
    }

    _InnerDataRenderRow(rowData){

        if(rowData==="tempData")
            return (<View style={{height:1, backgroundColor:'transparent'}}></View>);


        console.log(rowData);
        return (
            <TouchableOpacity onPress={() => {
                this._onPressButton(rowData)
            }}>
                <View style={styles.listViewrow}>
                    <Text style={styles.listViewrowText}>{rowData}</Text>
                </View>
            </TouchableOpacity>
        )
    }

    _renderRow(section) {

        this.realmRead();

        return (
            <ListView
                enableEmptySections={true}
                dataSource={section.innerDataSource}
                renderRow={(rowData) => this._InnerDataRenderRow(rowData)}
            />
        );
    }

    render() {


        return (
            <View>
                <Modal
                    animationType={"slide"}
                    transparent={false}
                    visible={this.state.surfModalVisible}
                    onRequestClose={() => {
                        this.setModalVisible(false)
                    }}>

                    <SurfWeatherList
                        modalVisible={this.setSurfModalVisible}
                        rowData={selectedRowData}
                    />
                </Modal>

                <Modal
                    animationType={"slide"}
                    transparent={false}
                    visible={this.state.glidModalVisible}
                    onRequestClose={() => {
                        this.setModalVisible(false)
                    }}>

                    <GlidWeatherList
                        modalVisible={this.setGlidModalVisible}
                        rowData={selectedRowData}
                    />
                </Modal>

                <Accordion
                    sections={this.state.dataSource}
                    renderHeader={this._renderHeader}
                    renderContent={this._renderRow}
                    initiallyActiveSection={0}
                />
            </View>


        )
    }


}
const WINDOW_WIDTH = Dimensions.get('window').width;

var styles = StyleSheet.create({
    container: {

        width: WINDOW_WIDTH,
        height: 150
    },

    listViewrow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingLeft: 20,
        backgroundColor: '#F6F6F6',
        borderBottomWidth: 1,
        borderBottomColor: '#e9e9e9',
        height: 35,
        alignItems: 'center',
    },
    listViewrowText: {
        fontSize: 15,
        fontWeight: "100",
        color: 'black',
    },
    sectionHeader: {
        flex: 1,
        height: 150,
        justifyContent: 'center',

    },
    sectionHeaderText: {
        fontFamily: 'bmdohyeon',
        fontSize: 15,
        color: 'white',

    },
    sectionHeaderIcon: {
        color: 'white',
        position: 'absolute',
        marginLeft: (WINDOW_WIDTH - 20) / 2,
        marginBottom: 0,
        opacity: 0

    }
});

module.exports = FavoriteList;