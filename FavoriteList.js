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



var FavoriteList = React.createClass({

    getInitialState: function() {

        var getSectionData = function(dataBlob, sectionID) {
            return dataBlob[sectionID];
        };

        return {
            dataBlob: {},
            dataSource: new ListView.DataSource({
                getSectionData: getSectionData,
                rowHasChanged: (r1, r2) => r1 !== r2,
                sectionHeaderHasChanged: (s1, s2) => s1 !== s2,
            }).cloneWithRowsAndSections(this.generateRows()),
        };
    },

    renderSectionHeader: function(sectionData, sectionID) {
        return (
            <View style={styles.catListHeaderContainer}>
                <Text style={styles.catListTitle}>
                    Categories {sectionID}
                </Text>
            </View>
        );
    },

    render: function() {
        return (
            <ListView
                contentContainerStyle={styles.list}
                dataSource={this.state.dataSource}
                renderRow={this.renderRow}
                renderSectionHeader={this.renderSectionHeader}
            />
        );
    },

    renderRow: function(rowData: string, sectionID: number, rowID: number) {
        return (
            <TouchableHighlight underlayColor='rgba(0,0,0,0)'>
                <View>
                    <View style={styles.row}>
                        <Text style={styles.text}>
                            {rowData}
                        </Text>
                    </View>
                </View>
            </TouchableHighlight>
        );
    },

    generateRows: function(): Array<string> {
        var dataBlob = [];
        for (var ii = 0; ii < 50; ii++) {
            dataBlob.push('Cell ' + ii);
        }
        return [dataBlob, dataBlob];
    },

});

var styles = StyleSheet.create({
    list: {
    },
    row: {
        padding: 12,
        backgroundColor: '#F6F6F6',
        borderColor: '#eee',
        borderBottomWidth: 1,
    },
    text: {
    },
    catListTitle: {
        fontWeight: 'bold',
        color: '#ffffff',
    },
    catListHeaderContainer: {
        padding: 12,
        backgroundColor: '#402e24',
    }
});

module.exports = FavoriteList;