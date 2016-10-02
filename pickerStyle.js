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
});

module.exports = pickerStyle;