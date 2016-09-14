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

import Accordion from 'react-native-collapsible/Accordion';
import WeatherList from './SurfWeatherList';

var selectedRowData ;
var collapsedTF = true;
var ds;
class FavoriteList extends Component {

    constructor(props){
        super(props);

        this._renderRow     = this._renderRow.bind(this);
        this._renderHeader   = this._renderHeader.bind(this);
        this.setModalVisible = this.setModalVisible.bind(this);
        this._onPressButtonHeader = this._onPressButtonHeader.bind(this);
        this._onPressButton = this._onPressButton.bind(this);

        ds = new ListView.DataSource(
            {
                rowHasChanged:(r1, r2) => r1 !== r2,
                sectionHeaderHasChanged: (r1, r2) => r1 !== r2
            }
        );

        this.state = {
            dataSource_local :
                [{
                    title :
                        <Image ref="surf" source={require('./image/surfing.jpg')} style={styles.container}>
                            <View style={{ flex:1, alignItems :'center',justifyContent:'center'}}>
                                <Text style={styles.sectionHeaderText}>서 핑</Text>
                            </View>
                        </Image>,
                    content : ds.cloneWithRows(
                        [
                            '금일해당화 해수욕장','다대포 해수욕장','한섬 해수욕장','경포 해수욕장','꽃지 해수욕장','만리포 해수욕장'

                        ])
                },
                    {title:<Image ref="para" source={require('./image/paragliding.jpg')}  style={styles.container}>
                        <View style={{ flex:1, alignItems :'center',justifyContent:'center'}}>
                            <Text style={styles.sectionHeaderText}>패 러 글 라 이 딩</Text>
                        </View>
                    </Image>,
                        content : ds.cloneWithRows(
                            [
                                '연천군 갈말 이륙장','포천시 운천 이륙장','홍성군 백월산 이륙장'
                            ])
                    }]

            ,modalVisible        : false
            ,isCollapsed         : false

        };
    }

    setModalVisible(visible) {
        this.setState({modalVisible: visible});
    }


    _onPressButton(rowData, headerData){

        selectedRowData = rowData;
        this.setModalVisible(!this.state.modalVisible);
    }

    _onPressButtonHeader() {
        console.log("dfsfsdf");
        this.setState({isCollapsed: !this.state.isCollapsed});
        console.log("dfsdf ->" + collapsedTF);
        collapsedTF = this.state.isCollapsed;
        console.log("dfsdf2 ->" + collapsedTF);


    }

    _renderHeader(section){
        return (
            <View style={styles.sectionHeader}>
                {section.title}
            </View>
        )
    }



    _renderRow(section){


        var dataSourceList = this.state + `.section.content`;


        return(
            <ListView
                dataSource = {section.content}
                renderRow = {(rowData, rowID) => (
                    <TouchableOpacity onPress={() => { this._onPressButton(rowData)}}>
                        <View style = {styles.listViewrow}>
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
                    onRequestClose={() => {this.setModalVisible(false)}}>

                    <WeatherList
                        modalVisible={this.setModalVisible}
                        rowData = {selectedRowData}
                    />

                </Modal>

                <Accordion
                    sections = {this.state.dataSource_local}
                    renderHeader  = {this._renderHeader}
                    renderContent = {this._renderRow}
                />
            </View>


        )
    }


}
const WINDOW_WIDTH = Dimensions.get('window').width;

var styles = StyleSheet.create({
    container: {

        width: WINDOW_WIDTH,
        height:150
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
    listViewrowText: {
        fontSize: 15,
        fontWeight: "100",
        color: 'black',
    },
    sectionHeader: {
        flex:1,
        height:150,
        justifyContent: 'center',

    },
    sectionHeaderText: {
        fontFamily : 'bmdohyeon',
        fontSize: 15,
        color: 'white',

    },
    sectionHeaderIcon: {
        color: 'white',
        position:'absolute',
        marginLeft : (WINDOW_WIDTH-20)/2,
        marginBottom : 0,
        opacity: 0

    }
});

module.exports = FavoriteList;