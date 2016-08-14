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
    ScrollView,
    ToastAndroid,
    Modal,
    Image } from 'react-native';

import Spinner from 'react-native-loading-spinner-overlay';

import Ionicons     from 'react-native-vector-icons/Ionicons';

class SampleRow extends Component{
    render() {
        return (
            <View style={styles.wrapper}>
                <View>
                    <Text style={styles.text}>
                        {this.props.nameTitle}, {this.props.nameFirst} {this.props.nameLast}</Text>
                </View>
            </View>
        );
    }
};
var API_URL = 'http://demo9383702.mockable.io/users';

class WeatherList extends Component{

    _onPressButton(rowData){
        ToastAndroid.show('This is '+ rowData.name.first, ToastAndroid.SHORT);
    }

    constructor(prop){
        super(prop);

        this.renderRow = this.renderRow.bind(this);

        var getSectionData = (dataBlob, sectionID) => {
            return dataBlob[sectionID];
        }

        var getRowData = (dataBlob, sectionID, rowID) => {
            return dataBlob[sectionID + ':' + rowID];
        }

        var ds = new ListView.DataSource({

            getSectionData: getSectionData,
            getRowData: getRowData,
            sectionHeaderHasChanged: (r1, r2) => r1 !== r2,
            rowHasChanged: (r1, r2) => r1 !== r2
        });

        this.state = {dataSource : ds
            ,modalVisible: false
            ,spinnerVisible: true
        };

        this.fetchData();


    }

    fetchData() {
        console.log("dd");
        fetch(API_URL).then((response) => response.json()).then((responseData) => {
            var organizations = responseData.results,
                length = organizations.length,
                dataBlob = {},
                sectionIDs = [],
                rowIDs = [],
                organization,
                users,
                userLength,
                user,
                i,
                j;

            for (i = 0; i < length; i++) {
                organization = organizations[i];

                sectionIDs.push(organization.id);
                dataBlob[organization.id] = organization.organization;

                users = organization.users;
                userLength = users.length;

                rowIDs[i] = [];

                for (j = 0; j < userLength; j++) {
                    user = users[j].user;
                    rowIDs[i].push(user.md5);

                    dataBlob[organization.id + ':' + user.md5] = user;
                }
            }
            console.log("loaded endend dataBlob",dataBlob);
            this.setState({
                dataSource: this.state.dataSource.cloneWithRowsAndSections(dataBlob, sectionIDs, rowIDs),
                loaded: true,
                spinnerVisible: !this.state.spinnerVisible

            });

        }).done();
    }

    renderSectionHeader(sectionData, sectionID) {
        console.log('##### sectionData  >>>>>' + sectionData);

        return (
            <View style={styles.sectionHeader}>
                <Text style={styles.sectionHeaderText}>{sectionData}</Text>
            </View>
        );
    }

    renderRow(rowData) {
        console.log('##### rowData >>>>>' + rowData.name.first);
        return (
            <TouchableOpacity   onPress={() => { this._onPressButton(rowData)}}>
                <SampleRow
                    nameTitle={rowData.name.title} nameFirst={rowData.name.first} nameLast={rowData.name.last} style={styles.row} />
            </TouchableOpacity>
        )
        // return <SampleRow {...rowData} style={styles.row} />  is same  as above
    }


    render() {
        return (
            <ScrollView>
                <Spinner visible={this.state.spinnerVisible}
                         overlayColor="rgba(255, 0, 0, 0.5)"
                         size="large"
                />
                <Ionicons.ToolbarAndroid
                    actions={[]}
                    navIconName="ios-arrow-back"
                    onIconClicked={()=>this.props.modalVisible(false)}//() => this.refs['drawer'].openDrawer()}
                    style={styles.toolbar}
                    iconColor="white"
                    titleColor="white"
                    title= {"SEOUL"}/>

                <ListView
                    ref="listView"
                    automaticallyAdjustContentInsets={false}
                    dataSource={this.state.dataSource}
                    renderSectionHeader={this.renderSectionHeader}
                    renderRow={this.renderRow}
                />
            </ScrollView>
        );
    }
};


var styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: '#F5FCFF',
    },
    wrapper: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingRight: 10,
        backgroundColor: '#FF5E00',
        borderBottomWidth: 1,
        borderBottomColor: '#e9e9e9',

    },
    text: {
        fontSize: 24,
        fontWeight: "100",
        color: 'black',
    },
    sectionHeader: {
        backgroundColor: '#5F00FF',

    },
    sectionHeaderText: {
        fontFamily: 'AvenirNext-Medium',
        fontSize: 16,
        color: 'white',
        paddingLeft: 10,

    },
    toolbar: {
        height: 56,
        backgroundColor: '#94000f'
    },
});


module.exports = WeatherList;