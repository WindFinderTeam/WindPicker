import  React, {Component} from 'react';
import {
    AppRegistry,
    StyleSheet,
    ScrollView,
    Text,
    Image,
    ToolbarAndroid,
    DrawerLayoutAndroid,
    TouchableOpacity,
    View,
} from 'react-native';


import Toast, { DURATION } from 'react-native-easy-toast';
import Modal               from 'react-native-simple-modal';
import VersionCheck        from 'react-native-version-check';
import AndroidFirstView    from './AndroidFirstView';



class  WindFinder extends Component {

    constructor(prop){
        super(prop);
    }

    render() {

        console.log(VersionCheck.getPackageName());        // com.reactnative.app
        console.log(VersionCheck.getCurrentBuildNumber()); // 10
        console.log(VersionCheck.getCurrentVersion());     // 0.1.1

        VersionCheck.getLatestVersion()
            .then((latestVersion) => {
                console.log(latestVersion);    // 0.1.2
            });

        VersionCheck.needUpdate()
            .then((res) => {
                console.log(res.isNeeded);    // true
            });

        VersionCheck.needUpdate(2)
            .then((res) => {
                console.log(res.isNeeded);    // false; because first two fields of current and the lastest versions are the same as "0.1".
            });


        return (

            <AndroidFirstView/>
        );
    }
}


const styles = StyleSheet.create({

    instructions: {
        textAlign: 'center',
        color: '#333333',
        marginBottom: 5,
    },
    drawer: {
        backgroundColor: '#FFFFFF',
        flex: 1,
    },
    toolbar: {
        height: 56,
        backgroundColor: '#FFFFFF'
    },
    tabView: {
        flex: 1,
        padding: 0,
        backgroundColor: 'rgba(0,0,0,0.01)',
    },


});

AppRegistry.registerComponent('WindFinder', () => WindFinder);