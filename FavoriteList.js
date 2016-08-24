'use strict';

import  React, {Component} from 'react';
import {
    Image,
    ListView,
    TouchableHighlight,
    StyleSheet,
    Text,
    View,

} from 'react-native';



import Accordion from 'react-native-accordion';

class FavoriteList extends Component {

    constructor(props){
        super(props);

        this._renderRow = this._renderRow.bind(this);


        var ds = new ListView.DataSource(
            {
                rowHasChanged:(r1, r2) => r1 !== r2
            }
        );

        this.state = {
            dataSource : ds.cloneWithRows(
                [
                    'SURFING',
                    'PARAGLIDING'
                ]
            ),

            dataSource2 : ds.cloneWithRows(
                [

                 'YANGYANG', 'MALIPO', 'JOONGMUN'

                ]

            ),
        };
    }

    _renderRow(rowData){
        var header = (
            <View style={styles.sectionHeader}>
                <Text style={styles.sectionHeaderText}>{rowData}</Text>
            </View>
        );

        var content = (
            <ListView
                dataSource = {this.state.dataSource2}
                renderRow = {(rowData) => (
                    <View style={styles.listViewrow}>
                        <Text style={styles.listViewrowText}>{rowData}</Text>
                    </View>
                    )
                }
            />

        );

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
            <ListView
                dataSource = {this.state.dataSource}
                renderRow = {this._renderRow}
            />

        )
    }


}

var styles = StyleSheet.create({

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
    }
});

module.exports = FavoriteList;