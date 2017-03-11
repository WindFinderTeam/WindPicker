import  React, {Component} from 'react';
import {
    AppRegistry,
    StyleSheet,
    ScrollView,
    Text,
    Image,
    TouchableOpacity,
    View,
    Linking,
    BackAndroid,
    StatusBar,
} from 'react-native';


import Modal               from 'react-native-simple-modal';
import VersionCheck        from 'react-native-version-check';
//import AndroidFirstView    from './AndroidFirstView';
import Toast, { DURATION } from 'react-native-easy-toast';

import { realmInstance } from "./RealmHndler.js";

var nowMode = "";
var lastMode ;

class  WindPicker extends Component {




    render() {

        return (

            <View><Text>SSSSS</Text></View>// LoadingView or AndroidFirstView
        );
    }
}



AppRegistry.registerComponent('WindPicker', () => WindPicker);