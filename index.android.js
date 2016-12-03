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

import { realmInstance }   from "./RealmHndler.js";


var mode ="";

class  WindFinder extends Component {

    constructor(prop){
        super(prop);

        this.startCountDown = this.startCountDown.bind(this);
        this.loadProcess    = this.loadProcess.bind(this)   ;
        this.state = {
            loadingYn       : true ,
            updateInfoModal : false,
            chooseModeModal : false
        };
        setTimeout(this.loadProcess, 500);
    }

    startCountDown(){
        this.setState({loadingYn: false});
    }

    loadProcess(){
         //console.log(VersionCheck.getPackageName());//get current my package name  ex) com.windfinder
         //console.log(VersionCheck.getCurrentBuildNumber());// 1.0
         //realmInstance.write(() => {
         //    let AllFavorite_surfing = realmInstance.objects('FavoriteSurfing');
         //});

        VersionCheck.getLatestVersion() // from market
            .then((latestVersion) => {
                console.log(latestVersion);    // 0.1.2
            })
            .catch((error) => { // if network state is unstable
            console.warn(error);
            setTimeout(this.startCountDown, 2000); // go to first AndroidFirstView page after 3s
            return ;

        });

        VersionCheck.needUpdate()
            .then((res) => {
            if(res.isNeeded == true) this.setState({updateInfoModal: true,chooseModeModal:false});// if update is required
            else {
                //if( if needed choise) {
                this.setState({updateInfoModal: false, chooseModeModal: true});
                //}

                //else setTimeout(this.startCountDown, 2000); // Jump to AndroidFirstView
            }

            //    console.log("# currentVersion : "+res.currentVersion);    // false; because first two fields of current and the lastest versions are the same as "0.1".
            //    console.log("# latestVersion : "+res.latestVersion);
            //    console.log(res.isNeeded);    // true
            });
    }

    render() {

        var mainView;

        if(this.state.loadingYn == true)
        {
            mainView = (<View style={styles.loadingView}>

                <Text style={styles.logoText}> 윈드피커 </Text>

                <Modal
                    open          = {this.state.updateInfoModal}
                    modalDidOpen  = {() => console.log('modal did open')}
                    modalDidClose = {() => {
                                            mode="surf";
                                            this.setState({updateInfoModal: false,loadingYn:false})
                                            }
                                    }
                    style         = {{alignItems: 'center'}}>
                    <View>
                        <Text style = {{fontSize: 20, marginBottom: 10, color:'#94000F'}}>업데이트 알림</Text>
                        <View style = {{flexDirection:'row',justifyContent:'center',alignItems:'center',}}>
                            <TouchableOpacity
                                style   = {{margin: 15,flex:1,justifyContent:'center',alignItems:'center' }}
                                onPress = {() => this.setState({updateInfoModal: false})}>
                                <Text>업데이트 시작</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>

                <Modal
                    open          = {this.state.chooseModeModal}
                    modalDidOpen  = {() => console.log('modal did open')}
                    modalDidClose = {() => this.setState({chooseModeModal: false,loadingYn:false})}
                    style         = {{flex:1,borderRadius: 2}}>

                    <Text style={{fontSize: 20, marginBottom: 10, color:'#94000F'}}>모드선택</Text>

                    <View style={{margin:0,flex:1, backgroundColor:'#9c0010'}}>
                        <View style={{flex:2, backgroundColor:this.state.viewMode =='surf'?'#d4d4d4':'#F5F5F5'}}>
                            <TouchableOpacity
                                style={{margin: 5,flex:1,justifyContent:'center',alignItems:'flex-start' }}
                                onPress={() => {
                                    mode="surf";
                                    this.setState({chooseModeModal: false}) ;
                                    setTimeout(this.startCountDown, 2000); // Jump to AndroidFirstView
                                }}>
                                <Text style={{color:this.state.viewMode =='surf'?'#727272':'#727272', fontSize: 15}}>서                   핑    </Text>
                            </TouchableOpacity>
                        </View>
                        <View style={{flex:2, backgroundColor:this.state.viewMode =='gliding'?'#d4d4d4':'#F5F5F5'}}>
                            <TouchableOpacity
                                style   = {{margin: 5, flex:1,justifyContent:'center',alignItems:'flex-start' }}
                                onPress = {() => {
                                    mode="gliding";
                                    this.setState({chooseModeModal: false}) ;
                                    setTimeout(this.startCountDown, 2000); // Jump to AndroidFirstView
                                }}>
                                <Text style={{color:this.state.viewMode =='gliding'?'#727272':'#727272',fontSize: 15}}>패 러 글 라 이 딩  </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>

            </View>);
        }

        else mainView = (<AndroidFirstView mode = {mode}/>);
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