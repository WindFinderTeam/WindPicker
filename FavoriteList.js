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

import Accordion from 'react-native-accordion';
import WeatherList from './WeatherList';
import Ionicons from 'react-native-vector-icons/Ionicons';

var selectedRowData ;
var collapsedTF = true;
var ds;
class FavoriteList extends Component {

    constructor(props){
        super(props);

        this._renderRow     = this._renderRow.bind(this);
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
            dataSource_local : ds.cloneWithRows(
                [

                    <Image ref="surf" source={require('./image/surfing.jpg')} style={styles.container}>
                        <Ionicons name={this.isCollapsed===true?"ios-arrow-down":"ios-arrow-up"} size={20} style={styles.sectionHeaderIcon}/>
                        <Text style={styles.sectionHeaderText}>서                   핑</Text>
                    </Image>

                    ,
                    <Image ref="para" source={require('./image/paragliding.jpg')}  style={styles.container}>
                        <Ionicons name={this.isCollapsed===true?"ios-arrow-down":"ios-arrow-up"} size={20} style={styles.sectionHeaderIcon}/>
                        <Text style={styles.sectionHeaderText}>패 러 글 라 이 딩</Text>
                    </Image>


                ]
            ),

            dataSource_fav_Sur : ds.cloneWithRows(
                [
                    'YANGYANG','INGU','MALIPO','HAJODAE','SONGJEONG','SONGJIHO'

                ]
            ),

            dataSource_fav_Par : ds.cloneWithRows(
                [
                    'DANYANG','MOUNTAING','HILL'
                ]
            )

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

        this.setState(ds.cloneWithRows(
            [
                'YANGYANG','INGU','MALIPO','HAJODAE','SONGJEONG','SONGJIHO'

            ]
        ));
    }



    _renderRow(rowData){


        var header = (

                <View style={styles.sectionHeader}>
                    {rowData}
                </View>

        );

        if (rowData.ref == 'surf'){

            var content = (

                <ListView
                    dataSource = {this.state.dataSource_fav_Sur}
                    renderRow = {(rowData, rowID) => (
                        <View style = {styles.listViewrow}>
                            <TouchableOpacity
                                onPress={() => { this._onPressButton(rowData)}}>
                                <Text style={styles.listViewrowText}>{rowData}</Text>
                            </TouchableOpacity>

                        </View>
                    )
                    }
                />

            );
        } else if (rowData.ref == 'para'){

        var content = (

            <ListView
                dataSource = {this.state.dataSource_fav_Par}
                renderRow = {(rowData, rowID) => (
                    <View style = {styles.listViewrow}>
                        <TouchableOpacity
                            onPress={() => { this._onPressButton(rowData)}}>
                            <Text style={styles.listViewrowText}>{rowData}</Text>
                        </TouchableOpacity>
                    </View>
                )
                }
            />

            );
        }

        return (
            <Accordion
                header={header}
                content={content}
                easing="easeOutCubic"
            />
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

                    <WeatherList
                        modalVisible={this.setModalVisible}
                        rowData = {selectedRowData}
                    />

                </Modal>

                <ListView
                    dataSource = {this.state.dataSource_local}
                    renderRow  = {this._renderRow}
                />
            </View>


        )
    }


}
const WINDOW_WIDTH = Dimensions.get('window').width;

var styles = StyleSheet.create({
    container: {
        flex: 1,
        width: WINDOW_WIDTH,
        height: 250,
        justifyContent: 'center',
        alignItems: 'center'
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
        height:200,
        justifyContent: 'center',

    },
    sectionHeaderText: {
        fontSize: 15,
        color: 'white',
        position:'absolute',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        textAlign:'center',
        marginLeft : (WINDOW_WIDTH-100)/2,
        marginTop : 15


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