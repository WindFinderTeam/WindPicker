'use strict';

import  React from 'react';
import {
    StyleSheet,
    Dimensions
} from 'react-native';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;

const SPINNER_SIZE = 80;
const NAVI_HEIGHT = 60;

const pickerStyle = StyleSheet.create({

    row: {
        flexDirection: 'row',
            justifyContent: 'space-between',
            paddingLeft: 0,
            borderBottomWidth: 1,
            borderBottomColor: '#e9e9e9',
            height: 40,
            alignItems: 'center',
    },
    sectionHeaderText: {
        fontSize: 13,
        color: '#424242',
        marginLeft: 5,

    },

    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: 25,
        borderBottomWidth: 1,
        borderBottomColor: '#e9e9e9',
    },
    menusView:{
        flex:1,
        justifyContent:'center',
        alignItems: 'center',
        flexDirection: 'row',
    },

    menuText: {
        color: '#FFFFFF',
        textAlign: 'center',
        fontSize: 15,
    },

    rowListText:{
        color: 'black',
        textAlign: 'center',
        fontSize: 13,
    },
    headerViewStyle:{
        height: 25,
        width: SCREEN_WIDTH,
    },
    rowViewStyle: {
        height: 40,
        width: SCREEN_WIDTH,
    },

    heartView:{
        borderRadius:100,
        width:40,height:40,
        borderWidth: 1,
        marginRight:10,
        borderColor: 'white',
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent:'center'
    },

    headerDistrictText: {
        color: 'white',
        fontSize: 30,
        paddingTop: 0
    },

    container: {
        flex: 1,
        backgroundColor: 'white',
    },

    sunInfo: {
        borderRadius: 20,
        width: 90,
        height: 30,
        borderWidth: 1,
        borderColor: '#FFF',
        alignItems: 'center',
        justifyContent: 'center',
        margin: 5
    },

    spinner: {
        position: 'absolute',
        left: (SCREEN_WIDTH - SPINNER_SIZE) / 2,
        top: (SCREEN_HEIGHT - SPINNER_SIZE) / 2 + 60,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex:1000
    },
    navigator:{
        flex:1,
        flexDirection: 'row',
        justifyContent:'center',
        alignItems:'center',
        position: 'absolute',
        left: 0,
        top: 0,
        width:SCREEN_WIDTH,
        height:NAVI_HEIGHT ,
        zIndex:1000,
    },
    offlineView :{
        flex:1,
        flexDirection: 'column',
        justifyContent:'center',
        alignItems:'center',
        paddingBottom:70,
        backgroundColor: '#E7E7E7',
    },
    listViewrow: {
        flex:1,
        flexDirection:'row',
        height:40
    },
    listViewrowDistrict: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingLeft: 20,
        backgroundColor: '#F6F6F6',
        borderBottomWidth: 1,
        borderBottomColor: '#e9e9e9',
        alignItems: 'center',
        flex:1
    },
    listViewrowCam: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems :'center',
        backgroundColor: '#F6F6F6',
        borderBottomWidth: 1,
        borderBottomColor: '#e9e9e9',
        flex:1
    },
    iconBorder:{
        borderRadius:100,
        width:30,height:30,
        borderWidth: 1,
        borderColor: '#94000F',
        alignItems: 'center',
        justifyContent:'center'
    },
});

module.exports = pickerStyle;