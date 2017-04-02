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
    Platform
} from 'react-native';


import Modal               from 'react-native-simple-modal' ;
import VersionCheck        from 'react-native-version-check';
import FirstView           from './FirstView.android'       ;
import Toast, { DURATION } from 'react-native-easy-toast'   ;
import { realmInstance }   from "./RealmHndler.js"          ;

var nowMode = "surf";
var lastMode ;

// START: iOS Only

if (Platform.OS === 'ios') {

    VersionCheck.setAppID(APP_ID);                    // Your App ID for App Store URL
    VersionCheck.setAppName(APP_NAME);                // Your App Name for App Store URL
}
// Your app's id, name and country info will be use for App Store URL like
// https://itunes.apple.com/{COUNTRY}/app/{APP_NAME}/id{APP_ID}

// END: iOS Only

class  Loading extends Component {

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

    startCountDown(){   this.setState({loadingYn: false});   }

    loadProcess(){

        VersionCheck.getLatestVersion() // from market
            .then((latestVersion) => {      console.log(latestVersion);          })
            .catch((error) => { // if network state is unstable
                console.warn(error);
                this.getLastModeFromRealm();
                setTimeout(this.startCountDown, 2000); // go to first FirstView page after 3s
                return ;
            });

        VersionCheck.needUpdate()
            .then((res) => {

                this.getLastModeFromRealm();
                /* if update is required */
                if(res.isNeeded == true)    this.setState({updateInfoModal: true,chooseModeModal:false});
                /* the last version. update is not required */
                else {
                    if (lastMode == '')     this.setState({chooseModeModal: true});
                    else                    setTimeout(this.startCountDown, 1000); // Jump to FirstView
                }
            });
    }

    goToMarket(){
        if (Platform.OS === 'ios')  Linking.openURL("http://itunes.apple.com/app/id431472195?mt=8").catch(err => console.error('An error occurred', err));
        else{
            Linking.openURL("https://play.google.com/store/apps/details?id=com.windpicker").catch(err => console.error('An error occurred', err));
            BackAndroid.exitApp(); // Finish this App
        }
    }

    getLastModeFromRealm(){

        realmInstance.write(() => {
            let lastModeRealm = realmInstance.objects('ModeLastStay').filtered('index = "lastmode"');

            // when it visits for the first time
            if(Object.keys(lastModeRealm) == "" ){

                realmInstance.create('ModeLastStay', {
                    index: 'lastmode',
                    mode : ''
                });

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
            mainView = (
                <View style={styles.loadingView}>
                    <StatusBar   backgroundColor = "#94000F"   barStyle = "light-content"    hidden = {false}     />

                    <Image source={require('./image/loadingLogo.png')} style={{width:100 , height:100 }}/>

                    <Text style={styles.logoText}> 윈드피커 </Text>
                    <Modal
                        open          = {this.state.updateInfoModal}
                        modalDidOpen  = {() => console.log('update modal did open')}
                        modalDidClose = {() => {  this.setState({updateInfoModal: false,loadingYn:false});} }
                        style         = {{alignItems: 'center'}}>
                        <View>
                            <Text style = {{fontSize: 20, marginBottom: 10, color:'#94000F'}}>업데이트 알림</Text>
                            <View style = {{flexDirection:'row',justifyContent:'center',alignItems:'center',}}>
                                <TouchableOpacity
                                    style   = {{margin: 15,flex:1,justifyContent:'center',alignItems:'center' }}
                                    onPress = {() => {  this.goToMarket();   }}>
                                    <Text>업데이트 시작</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </Modal>

                    <Toast
                        ref      = "toast"
                        style    = {{backgroundColor:'#222222'}}
                        position = 'bottom'/>

                    <Modal
                        open          = {this.state.chooseModeModal}
                        modalDidOpen  = {() => console.log('nowMode choice modal did open')}
                        modalDidClose = {() => this.setState({chooseModeModal: false,loadingYn:false})}
                        style         = {{borderRadius: 2}}>

                        <Text style={{fontSize: 20, marginBottom: 10, color:'#94000F'}}>모드선택</Text>

                        <View style={{margin:0}}>
                            <View style={{height:40}}>
                                <TouchableOpacity
                                    style={{margin: 5,justifyContent:'center',alignItems:'flex-start' }}
                                    onPress={() => {
                                        nowMode="surf";
                                        this.refs.toast.show('서핑 모드로 시작합니다',DURATION.LENGTH_LONG);
                                        this.setState({chooseModeModal: false}) ;
                                        setTimeout(this.startCountDown, 2000); // Jump to FirstViewIos
                                    }}>
                                    <Text style={{color:'#727272', fontSize: 16}}>서                   핑    </Text>
                                </TouchableOpacity>
                            </View>
                            <View style={{height:40}}>
                                <TouchableOpacity
                                    style   = {{margin: 5,justifyContent:'center',alignItems:'flex-start' }}
                                    onPress = {() => {
                                        nowMode="gliding";
                                        this.refs.toast.show('패러글라이딩 모드로 시작합니다',DURATION.LENGTH_LONG);
                                        this.setState({chooseModeModal: false}) ;
                                        setTimeout(this.startCountDown, 2000); // Jump to FirstViewIos
                                    }}>
                                    <Text style={{color:'#727272',fontSize: 16}}>패 러 글 라 이 딩  </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </Modal>

                </View>);
        }

        else  mainView = (<FirstView mode = {nowMode}/>);

        return (    mainView    );
    }
}

const styles = StyleSheet.create({

    logoText:{
        fontSize    : 20,
        marginBottom: 10,
        color       :'#FFFF',
        fontFamily  :'BMJUA',
        fontWeight  :'bold'
    },

    loadingView:{
        flex:1
        ,backgroundColor: '#94000F'
        ,justifyContent:'center'
        ,alignItems:'center'
    }


});

module.exports = Loading;