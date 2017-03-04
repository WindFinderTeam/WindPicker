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
    ToastAndroid,
} from 'react-native';

import Accordion            from 'react-native-collapsible/Accordion';
import SurfWeatherList      from './SurfWeatherList';
import GlidWeatherList      from './GlidingWeatherList';
import Ionicons             from 'react-native-vector-icons/Ionicons';

import {realmInstance}      from "./RealmHndler.js";

var surfLocalData = require('./jsData/SurfLocalData.json');
var glidfLocalData = require('./jsData/GlidingLocalData.json');

var pickerStyle = require('./pickerStyle');

var selectedRowData;
var ds1, ds2;
var favoriteGlidingList = [];
var favoriteSurfingList = [];

class FavoriteList extends Component {

    constructor(props) {
        super(props);

        this._renderRow = this._renderRow.bind(this);
        this._renderHeader = this._renderHeader.bind(this);
        this.setSurfModalVisible = this.setSurfModalVisible.bind(this);
        this.setGlidModalVisible = this.setGlidModalVisible.bind(this);
        this._onPressButton = this._onPressButton.bind(this);
        this.realmRead = this.realmRead.bind(this);
        this.realmDelete = this.realmDelete.bind(this);
        this._InnerDataRenderRow = this._InnerDataRenderRow.bind(this);


        ds1 = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        ds2 = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});


        this.state = {
            surfModalVisible: false
            , glidModalVisible: false
            , viewMode: this.props.viewMode
            , dataSource: [
                {
                    title: <Image source={require('./image/fav_surfing.png')} style={styles.container}>
                        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                            <Text style={styles.sectionHeaderText}>서 핑</Text>
                        </View>
                    </Image>
                    , innerDataSource: ds1.cloneWithRows(favoriteSurfingList)
                },
                {
                    title: <Image source={require('./image/fav_paragliding.png')} style={styles.container}>
                        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                            <Text style={styles.sectionHeaderText}>패 러 글 라 이 딩</Text>
                        </View>
                    </Image>
                    , innerDataSource: ds2.cloneWithRows(favoriteGlidingList)
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

        if (rowData.theme === 'surfing') {
            selectedRowData = surfLocalData.local[rowData.index];
            this.setSurfModalVisible(!this.state.surfModalVisible);
        }

        else if (rowData.theme === 'gliding') {
            selectedRowData = glidfLocalData.local[rowData.index];
            this.setGlidModalVisible(!this.state.glidModalVisible);
        }
    }


    realmRead() {

        // READ all favorite surfing, gliding data
        realmInstance.write(() => {

            let AllFavorite_surfing = realmInstance.objects('FavoriteSurfing');
            let AllFavorite_glding = realmInstance.objects('FavoriteGliding');

            favoriteSurfingList = [];
            favoriteGlidingList = [];

            favoriteSurfingList.push({"theme": "surfing", "index": '9999', "name": 'tempData'});
            favoriteGlidingList.push({"theme": "gliding", "index": '9999', "name": 'tempData'});

            for (var i in AllFavorite_surfing) {
                favoriteSurfingList.push({
                    "theme": "surfing",
                    "index": AllFavorite_surfing[i].index,
                    "name": AllFavorite_surfing[i].name,
                    "webcam": AllFavorite_surfing[i].webcam,
                    "shop": AllFavorite_surfing[i].shop
                });
            }

            for (var i in AllFavorite_glding) {
                favoriteGlidingList.push({
                    "theme": "gliding",
                    "index": AllFavorite_glding[i].index,
                    "name": AllFavorite_glding[i].name,
                    "webcam": AllFavorite_glding[i].webcam,
                    "shop": AllFavorite_glding[i].shop
                });
            }

            this.state.dataSource[0].innerDataSource = ds1.cloneWithRows(favoriteSurfingList);
            this.state.dataSource[1].innerDataSource = ds2.cloneWithRows(favoriteGlidingList);

        });
    }

    realmDelete(data, secId, rowId, rowMap) {

        realmInstance.write(() => {

            if (data.theme === "surfing") {
                let specificFavorite = realmInstance.objects('FavoriteSurfing').filtered('index = ' + '"' + data.index + '"');
                realmInstance.delete(specificFavorite); // Deletes the specific favorite
                favoriteSurfingList.splice(rowId, 1);
            }

            else if (data.theme === "gliding") {
                let specificFavorite = realmInstance.objects('FavoriteGliding').filtered('index = ' + '"' + data.index + '"');
                realmInstance.delete(specificFavorite); // Deletes the specific favorite
                favoriteGlidingList.splice(rowId, 1);
            }
        });

        this.state.dataSource[0].innerDataSource = ds1.cloneWithRows(favoriteSurfingList);
        this.state.dataSource[1].innerDataSource = ds2.cloneWithRows(favoriteGlidingList);


    }

    _renderHeader(section, key) {

        return (
            <View style={styles.sectionHeader}>
                {section.title}
            </View>
        )
    }

    _InnerDataRenderRow(rowData) {


        if (rowData.name === "tempData")
            return (<View style={{height: 1, backgroundColor: '#DDD'}}></View>);

        var shopShow = false, webcamShowJudge, shopIconImg;

        /* shoIconImg judge */
        if (rowData.theme === 'surfing')      shopIconImg = (require('./image/surfShop.png'));
        else if (rowData.theme === 'gliding') shopIconImg = (require('./image/glidingShop.png'));

        /* judge shop showing */
        if (Object.keys(rowData.shop) == "")  shopShow = false;
        else                                  shopShow = true;

        /* judge webcam showing */
        if (Object.keys(rowData.webcam) == "") {
            webcamShowJudge = (<View style={{flex: 1}}/>);
        }
        else {
            webcamShowJudge = (
                <TouchableOpacity onPress={()=> {
                    this.props.setWebCamModalVisible(true, rowData.webcam)
                }}>
                    <View style={{
                        flex: 1,
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: 50,
                        height: 50
                    }}>
                        <View style={pickerStyle.iconBorder}>
                            <Ionicons name="ios-videocam" style={{color: "rgba(156,0,16,1)", fontSize: 25}}/>
                        </View>
                    </View>
                </TouchableOpacity>
            );
        }

        return (
            <TouchableHighlight onPress={() => {

                this._onPressButton(rowData)
            }}>
                <View style={pickerStyle.listViewrow}>
                    <View style={pickerStyle.listViewrowDistrict}>
                        <Text style={pickerStyle.localListrowText}>{rowData.name}</Text>
                    </View>

                    {/* icons */}
                    <View style={pickerStyle.listViewrowCamShop}>

                        <View style={{flex: 1}}>{webcamShowJudge}</View>

                        <View style={{flex: 1}}>
                            {shopShow &&
                            <TouchableOpacity onPress={() => this.props.setShopModalVisible(true, rowData.shop)}>
                                <View style={{flex: 1, alignItems: 'center', justifyContent: 'center', height: 50}}>

                                    <View style={pickerStyle.iconBorder}>
                                        <Image source={shopIconImg} style={{width: 35, height: 35}}/>
                                    </View>
                                </View>
                            </TouchableOpacity>}
                        </View>


                    </View>
                </View>
            </TouchableHighlight>
        )
    }

    _renderRow(section) {

        this.realmRead();

        return (


            <ListView
                enableEmptySections={true}
                dataSource={section.innerDataSource}
                renderRow={(rowData) => this._InnerDataRenderRow(rowData)}/>

        );
    }

    render() {

        let singleModeDataSource = [];
        // whenever FavorieteList is called from AndroidFirstVIew, reload realm
        if (this.props.realmReload == true)          this.realmRead();

        if (this.props.viewMode == 'surf')   singleModeDataSource.push(this.state.dataSource[0]);
        else                                singleModeDataSource.push(this.state.dataSource[1]);


        return (
            <View>
                <Modal
                    animationType={"slide"}
                    transparent={false}
                    visible={this.state.surfModalVisible}
                    onRequestClose={() => {
                        this.setSurfModalVisible(false)
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
                        this.setGlidModalVisible(false)
                    }}>

                    <GlidWeatherList
                        modalVisible={this.setGlidModalVisible}
                        rowData={selectedRowData}
                    />
                </Modal>

                <Accordion
                    sections={singleModeDataSource}
                    renderHeader={this._renderHeader}
                    renderContent={this._renderRow}
                    activeSection={0}
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
    },


});

module.exports = FavoriteList;