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
import WeatherList         from './SurfWeatherList';

import { realmInstance }   from "./RealmHndler.js";

var surfLocalData = require('./jsData/SurfLocalData.json');

var selectedRowData;
var ds;
var favoriteGlidingList=[];
var favoriteSurfingList=[];

var tempObject=[];

class FavoriteList extends Component {

    constructor(props) {
        super(props);

        this._renderRow = this._renderRow.bind(this);
        this._renderHeader = this._renderHeader.bind(this);
        this.setModalVisible = this.setModalVisible.bind(this);
        this._onPressButton = this._onPressButton.bind(this);

        ds = new ListView.DataSource(
            {
                rowHasChanged: (r1, r2) => r1 !== r2,
            sectionHeaderHasChanged: (r1, r2) => r1 !== r2
    }
    );


        this.state = {
            dataSource_local: [
                {
                    title: <Image source={require('./image/surfing.jpg')} style={styles.container}>
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
    <Text style={styles.sectionHeaderText}>서                      핑</Text>
        </View>
        </Image>,
            content: ds.cloneWithRows(favoriteSurfingList)
    },
        {
            title: <Image source={require('./image/paragliding.jpg')} style={styles.container}>
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
        <Text style={styles.sectionHeaderText}>패 러 글 라 이 딩</Text>
        </View>
        </Image>,
            content: ds.cloneWithRows(favoriteGlidingList)
        }]

    , modalVisible: false
            , isCollapsed: false
    };
    }

    setModalVisible(visible) {
        this.setState({modalVisible: visible});
    }

    _onPressButton(rowData) {

        console.log("====favoriteList== _onPressButton");

        console.log(rowData);
        for (var i in tempObject) {
            if(rowData == tempObject[i].name){
                console.log("stop!");
                selectedRowData = surfLocalData.local[tempObject[i].index];
                console.log(tempObject[i].index +"," + tempObject[i].name + "," + selectedRowData.district);
                break;
            }
        }
        // selectedRowData = rowData;
        this.setModalVisible(!this.state.modalVisible);
    }


    realmRead(){


        console.log("realmRead in ");
        // READ all favorite surfing, gliding data
        realmInstance.write(() => {

            /* surfing looping */
            let AllFavorite_surfing = realmInstance.objects('FavoriteSurfing');
        // let AllFavorite_glding = realm.objects(FavoriteGliding);

        if (Object.keys(AllFavorite_surfing) == "") {
            console.log(Object.keys(AllFavorite_surfing));
            favoriteSurfingList = [];
        }
        else {
            console.log(Object.keys(AllFavorite_surfing));
            favoriteSurfingList = [];
            for (var i in AllFavorite_surfing) {
                favoriteSurfingList.push(AllFavorite_surfing[i].name);
            }
            //for display
            for (var i in favoriteSurfingList) {
                tempObject.push({"index":AllFavorite_surfing[i].index, "name":AllFavorite_surfing[i].name});
                console.log("--------tempObject for surfing--------");
                console.log(favoriteSurfingList[i]);
            }
        }

        /* surfing looping */
        let AllFavorite_glding = realmInstance.objects('FavoriteGliding');

        if (Object.keys(AllFavorite_glding) == "") {}
        else {
            favoriteGlidingList = [];
            for (var i in AllFavorite_glding) {
                favoriteGlidingList.push(AllFavorite_glding[i].name);
            }
            //for display
            for (var i in favoriteGlidingList) {
                tempObject.push({"index":AllFavorite_glding[i].index, "name":AllFavorite_glding[i].name});
                console.log("--------favoriteGlidingList for gliding--------");
                console.log(favoriteGlidingList[i]);
            }
        }

    });
        console.log(this.state.dataSource_local[0].content);
    }

    _renderHeader(section, key) {

        console.log("====== _renderHeader ======");


        return (
            <View style={styles.sectionHeader}>
        {section.title}
    </View>
    )
    }


    _renderRow(section) {

        this.realmRead();

        this.state.dataSource_local[0].content = ds.cloneWithRows(favoriteSurfingList);
        this.state.dataSource_local[1].content = ds.cloneWithRows(favoriteGlidingList);

        return (
            <ListView
        enableEmptySections={true}
        dataSource={section.content}
        renderRow={(rowData, rowID) => (
        <TouchableOpacity onPress={() => {
            this._onPressButton(rowData)
        }}>
    <View style={styles.listViewrow}>
    <Text style={styles.listViewrowText}>{rowData}</Text>
        </View>
        </TouchableOpacity>
    )
    }
    />
    );
    }

    render() {


        return (
            <View>
            <Modal
        animationType={"slide"}
        transparent={false}
        visible={this.state.modalVisible}
        onRequestClose={() => {
            this.setModalVisible(false)
        }}>

    <WeatherList
        modalVisible={this.setModalVisible}
        rowData={selectedRowData}
            />
            </Modal>

            <Accordion
        sections={this.state.dataSource_local}
        renderHeader={this._renderHeader}
        renderContent={this._renderRow}
        onChange={()=>{
            this.realmRead();
            this.state.dataSource_local[0].content = ds.cloneWithRows(favoriteSurfingList);
            this.state.dataSource_local[1].content = ds.cloneWithRows(favoriteGlidingList);
        }}
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