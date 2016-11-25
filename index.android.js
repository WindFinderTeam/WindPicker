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

import { realmInstance } from "./RealmHndler.js";

class  WindFinder extends Component {

    constructor(prop){
        super(prop);

        this.startCountDown = this.startCountDown.bind(this);
        this.loadProcess  = this.loadProcess.bind(this);
        this.state = {
            loadingYn : true,
            open      : false
        };
        setTimeout(this.loadProcess, 1000);
    }

    startCountDown(){

        this.setState({loadingYn: false});

    }

    loadProcess(){


         console.log(VersionCheck.getPackageName());//get current my package name  ex) com.windfinder
         console.log(VersionCheck.getCurrentBuildNumber());// 1.0

        realmInstance.write(() => {

            let AllFavorite_surfing = realmInstance.objects('FavoriteSurfing');
            console.log("write in in in ");
            console.log(AllFavorite_surfing);

        });

        VersionCheck.getLatestVersion() // from market
            .then((latestVersion) => {
                console.log(latestVersion);    // 0.1.2
            })
            .catch((error) => { // if network state is unstable
            console.warn(error);
            setTimeout(this.startCountDown, 3000); // go to first AndroidFirstView page after 3s
            return ;

        });

        VersionCheck.needUpdate()
            .then((res) => {
                console.log("# currentVersion : "+res.currentVersion);    // false; because first two fields of current and the lastest versions are the same as "0.1".
                console.log("# latestVersion : "+res.latestVersion);
                console.log(res.isNeeded);    // true

                if(res.isNeeded == true) this.setState({open: true});// if update is required
                else                     setTimeout(this.startCountDown, 3000);
            });


    }

    render() {


        var mainView;

        if(this.state.loadingYn == true)
        {
            mainView = (<View style={styles.loadingView}>

                <Text style={styles.logoText}> 윈드피커 </Text>

                <Modal
                    offset        = {this.state.offset}
                    open          = {this.state.open}
                    modalDidOpen  = {() => console.log('modal did open')}
                    modalDidClose = {() => this.setState({open: false,loadingYn:false})}
                    style         = {{alignItems: 'center'}}>
                    <View>
                        <Text style = {{fontSize: 20, marginBottom: 10, color:'#94000F'}}>업데이트 알림</Text>
                        <View style = {{flexDirection:'row',justifyContent:'center',alignItems:'center',}}>
                            <TouchableOpacity
                                style   = {{margin: 15,flex:1,justifyContent:'center',alignItems:'center' }}
                                onPress = {() => this.setState({open: false})}>
                                <Text>업데이트 시작</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>

            </View>);
        }
        else mainView = (<AndroidFirstView/>);
        return (
            mainView  // LoadingView or AndroidFirstView

        );
    }
}


const styles = StyleSheet.create({

    logoText:{
        fontSize    : 20,
        marginBottom: 10,
        color       :'#FFFF',
        fontFamily  :'BMJUA',
        fontStyle   :'italic',
        fontWeight  :'bold'
    },

    loadingView:{
        flex:1
        ,backgroundColor: '#94000F'
        ,justifyContent:'center'
        ,alignItems:'center'
    }


});

AppRegistry.registerComponent('WindFinder', () => WindFinder);