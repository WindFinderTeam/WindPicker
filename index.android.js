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
    Linking,
    BackAndroid
} from 'react-native';


import Modal               from 'react-native-simple-modal';
import VersionCheck        from 'react-native-version-check';
import AndroidFirstView    from './AndroidFirstView';

import { realmInstance } from "./RealmHndler.js";

var nowMode = "";
var lastMode ;

class  WindFinder extends Component {

    constructor(prop){
        super(prop);

        this.startCountDown         = this.startCountDown.bind(this)    ;
        this.loadProcess            = this.loadProcess.bind(this)       ;

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
                this.getLastModeFromRealm();
                setTimeout(this.startCountDown, 2000); // go to first AndroidFirstView page after 3s
                return ;

            });

        VersionCheck.needUpdate()
            .then((res) => {

                this.getLastModeFromRealm();
                console.log("lastMode >> " + lastMode);

                /* if update is required */
                if(res.isNeeded == true)    this.setState({updateInfoModal: true,chooseModeModal:false});
                /* the last version. update is not required */
                else {
                    if (lastMode == '')     this.setState({chooseModeModal: true});
                    else                    setTimeout(this.startCountDown, 1000); // Jump to AndroidFirstView
                }
            });
    }

    goToMarket(){
        Linking.openURL("https://play.google.com/store/apps/details?id=shufflebrother.mobile.searchthelaw").catch(err => console.error('An error occurred', err));
        BackAndroid.exitApp(); // Finish this App
    }

    getLastModeFromRealm(){

        realmInstance.write(() => {


            let lastModeRealm = realmInstance.objects('ModeLastStay').filtered('index = "lastmode"');

            // when it visits at first
            if(Object.keys(lastModeRealm) == "" ){

                realmInstance.create('ModeLastStay', {
                    index: 'lastmode',
                    mode:''
                });

                // default nowMode is surfing
                lastMode = lastModeRealm[0].mode;

            } else {

                lastMode = lastModeRealm[0].mode;

                if     (lastMode == 'G')      nowMode = "gliding";
                else if(lastMode == 'S')      nowMode = "surf";
            }
        });
    }


    render() {

        var mainView;

        if(this.state.loadingYn == true)
        {
            mainView = (<View style={styles.loadingView}>
                <Image source={require('./image/loadingLogo.png')}
                       style={{width:100 , height:100 }}/>
                <Text style={styles.logoText}> 윈드피커 </Text>
                <Modal
                    open          = {this.state.updateInfoModal}
                    modalDidOpen  = {() => console.log('update modal did open')}
                    modalDidClose = {() => {
                                            {/*nowMode="surf";*/}
                                            this.setState({updateInfoModal: false,loadingYn:false});
                                            }
                                    }
                    style         = {{alignItems: 'center'}}>
                    <View>
                        <Text style = {{fontSize: 20, marginBottom: 10, color:'#94000F'}}>업데이트 알림</Text>
                        <View style = {{flexDirection:'row',justifyContent:'center',alignItems:'center',}}>
                            <TouchableOpacity
                                style   = {{margin: 15,flex:1,justifyContent:'center',alignItems:'center' }}
                                onPress = {() => {
                                    //this.setState({updateInfoModal: false, loadingYn: false});
                                    this.goToMarket();
                                }}>
                                <Text>업데이트 시작</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>

                <Modal
                    open          = {this.state.chooseModeModal}
                    modalDidOpen  = {() => console.log('nowMode choice modal did open')}
                    modalDidClose = {() => this.setState({chooseModeModal: false,loadingYn:false})}
                    style         = {{flex:1,borderRadius: 2}}>

                    <Text style={{fontSize: 20, marginBottom: 10, color:'#94000F'}}>모드선택</Text>

                    <View style={{margin:0,flex:1, backgroundColor:'#9c0010'}}>
                        <View style={{flex:2, backgroundColor:this.state.viewMode =='surf'?'#d4d4d4':'#F5F5F5'}}>
                            <TouchableOpacity
                                style={{margin: 5,flex:1,justifyContent:'center',alignItems:'flex-start' }}
                                onPress={() => {
                                    nowMode="surf";
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
                                    nowMode="gliding";
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

        else {
            mainView = (<AndroidFirstView mode = {nowMode}/>);
        }

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