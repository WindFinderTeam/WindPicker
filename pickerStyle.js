'use strict';

import  React from 'react';
import {
    StyleSheet,

} from 'react-native';

const pickerStyle = StyleSheet.create({

row: {
    flexDirection: 'row',
        justifyContent: 'space-between',
        paddingLeft: 0,
      //  backgroundColor: '#F6F6F6',
        borderBottomWidth: 1,
        borderBottomColor: '#e9e9e9',
        height: 40,
        alignItems: 'center',
},

sectionHeader: {
    flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        //backgroundColor: '#d4d4d4',
        height: 25,

}

});

module.exports = pickerStyle;