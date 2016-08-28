'use strict';

import  React, {Component} from 'react';
import {
    Image,
    ListView,
    TouchableHighlight,
    StyleSheet,
    Text,
    View,
    Dimensions

} from 'react-native';




import Accordion from 'react-native-accordion';

class FavoriteList extends Component {

    constructor(props){
        super(props);

        this._renderRow = this._renderRow.bind(this);


        var ds = new ListView.DataSource(
            {
                rowHasChanged:(r1, r2) => r1 !== r2,
                sectionHeaderHasChanged: (r1, r2) => r1 !== r2
            }
        );

        this.state = {
            dataSource_local : ds.cloneWithRows(
                [

                    <Image ref="surf" resizeMode={Image.resizeMode.contain} source={require('./image/surfing.jpg')} />,
                    <Image ref="para" resizeMode={Image.resizeMode.contain} source={require('./image/paragliding.jpg')} />

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
            ),

        };
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
                            <Text style={styles.listViewrowText}>{rowData}</Text>
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
                            <Text style={styles.listViewrowText}>{rowData}</Text>
                        </View>
                    )
                    }
                />

            );
        } else {
            console.log (rowData );
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
            <ListView
                dataSource = {this.state.dataSource_local}
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
        flex:1,
        height:100,
        alignSelf: 'stretch',
        justifyContent: 'center',
        alignItems: 'center',


    },
    sectionHeaderText: {
        fontSize: 15,
        color: '#424242',
        marginLeft: 10
    }
});

module.exports = FavoriteList;