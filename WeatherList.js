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


var testData = [
    {"firstName":"Black","lastName":"Garrett"},
    {"firstName":"Morales","lastName":"Duncan"},
    {"firstName":"Ramos","lastName":"King"},
    {"firstName":"Dunn","lastName":"Collins"},
    {"firstName":"Fernandez","lastName":"Montgomery"},
    {"firstName":"Burns","lastName":"Fox"},
    {"firstName":"Richardson","lastName":"Kim"},
    {"firstName":"Hanson","lastName":"Evans"},
    {"firstName":"Anderson","lastName":"Hunt"},
    {"firstName":"Carter","lastName":"Grant"},
    {"firstName":"Ray","lastName":"Ruiz"},
    {"firstName":"Hart","lastName":"Schmidt"},
    {"firstName":"White","lastName":"Andrews"},
    {"firstName":"Hall","lastName":"Holmes"},
    {"firstName":"Hawkins","lastName":"Gomez"},
    {"firstName":"Bowman","lastName":"Sullivan"},
    {"firstName":"Brooks","lastName":"Evans"},
    {"firstName":"Reyes","lastName":"Perez"},
    {"firstName":"Dixon","lastName":"Barnes"},
    {"firstName":"Ward","lastName":"Lee"},
    {"firstName":"Berry","lastName":"Payne"},
    {"firstName":"Murray","lastName":"Rose"},
    {"firstName":"Stephens","lastName":"Fowler"},
    {"firstName":"Rodriguez","lastName":"Lewis"},
    {"firstName":"Cook","lastName":"Dean"}
];


import Ionicons     from 'react-native-vector-icons/Ionicons';


class SampleRow extends Component{


    render() {
        return (
                <View style={styles.wrapper}>
                    <View>
                        <Text style={styles.text}>{this.props.lastName}, {this.props.firstName}</Text>
                    </View>
                </View>
        );
    }
};

class WeatherList extends Component{



    _onPressButton(rowData){
        ToastAndroid.show('This is '+ rowData.lastName, ToastAndroid.SHORT);

    }

    constructor(prop){
        super(prop);

        this.renderRow = this.renderRow.bind(this);

        var ds = new ListView.DataSource({
            sectionHeaderHasChanged: (r1, r2) => r1 !== r2,
            rowHasChanged: (r1, r2) => r1 !== r2
        });

        var {data, sectionIds} = this.renderListViewData(testData);
        this.state = {dataSource : ds.cloneWithRowsAndSections(data, sectionIds)
                     ,modalVisible: false};

    }


    renderListViewData(users) {

        var data = {}  ;      // Object
        var sectionIds = [];  // Array

        sectionIds.push('Marketing');
        data['Marketing']=[];
        data['Marketing'].push(users[0]);
        data['Marketing'].push(users[1]);
        data['Marketing'].push(users[2]);

        sectionIds.push('Sales');
        data['Sales']=[];
        data['Sales'].push(users[3]);
        data['Sales'].push(users[4]);
        data['Sales'].push(users[5]);

        sectionIds.push('Account');
        data['Account']=[];
        data['Account'].push(users[6]);
        data['Account'].push(users[7]);
        data['Account'].push(users[8]);
        data['Account'].push(users[8]);
        data['Account'].push(users[9]);
        data['Account'].push(users[10]);
        data['Account'].push(users[11]);
        data['Account'].push(users[12]);
        data['Account'].push(users[12]);
        data['Account'].push(users[12]);
        data['Account'].push(users[12]);
        data['Account'].push(users[12]);
        data['Account'].push(users[12]);
        data['Account'].push(users[6]);
        data['Account'].push(users[7]);
        data['Account'].push(users[8]);
        data['Account'].push(users[8]);
        data['Account'].push(users[9]);
        data['Account'].push(users[10]);
        data['Account'].push(users[11]);
        data['Account'].push(users[12]);
        data['Account'].push(users[12]);
        data['Account'].push(users[12]);
        data['Account'].push(users[12]);
        data['Account'].push(users[12]);
        data['Account'].push(users[12]);

        return {data, sectionIds};
    }

    renderSectionHeader(data, sectionId) {
        console.log('##### sectionData  >>>>>' + data[0].lastName);  // Garrett
        console.log('##### sectionData >>>>>' + data[1].lastName); // Duncan

        return (
            <View style={styles.sectionHeader}>
                <Text style={styles.sectionHeaderText}>{sectionId}</Text>
            </View>
        );
    }

    renderRow(rowData) {
        console.log('##### rowData >>>>>' + rowData.firstName);
        return (
            <TouchableOpacity   onPress={() => { this._onPressButton(rowData)}}>
                <SampleRow firstName={rowData.firstName} lastName={rowData.lastName} style={styles.row} />
            </TouchableOpacity>
        )
        // return <SampleRow {...rowData} style={styles.row} />  is same  as above
    }


    render() {
        return (
            <View style={{flex:1}}>
                <Ionicons.ToolbarAndroid
                    actions={[]}
                    navIconName="ios-arrow-back"
                    onIconClicked={()=>this.props.modalVisible(false)}//() => this.refs['drawer'].openDrawer()}
                    style={styles.toolbar}
                    iconColor="white"
                    titleColor="white"
                    title= {"SEOUL"}/>

                <ScrollView>
                    <ListView
                        ref="listView"
                        automaticallyAdjustContentInsets={false}
                        dataSource={this.state.dataSource}
                        renderSectionHeader={this.renderSectionHeader}
                        renderRow={this.renderRow}
                    />
                </ScrollView>
            </View>
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
        backgroundColor: '#5F00FF'
    },
    sectionHeaderText: {
        fontFamily: 'AvenirNext-Medium',
        fontSize: 16,
        color: 'white',
        paddingLeft: 10
    },
    toolbar: {
        height: 56,
        backgroundColor: '#94000f'
    },
});


module.exports = WeatherList;