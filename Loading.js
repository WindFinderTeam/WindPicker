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
    StatusBar
} from 'react-native';


import Modal               from 'react-native-simple-modal' ;
import FirstView           from './FirstView'               ;
import Toast, { DURATION } from 'react-native-easy-toast'   ;
import { realmInstance }   from "./RealmHndler.js"          ;
import codePush from "react-native-code-push";

var nowMode = "surf";
var lastMode ;

class  Loading extends Component {

    constructor(prop){
        super(prop);

        this.startCountDown         = this.startCountDown.bind(this)    ;

        this.state = {
            loadingYn       : true ,
            chooseModeModal : false
        };
        //setTimeout(this.loadProcess, 500);
    }

    startCountDown(){   this.setState({loadingYn: false});   }

    componentDidMount()   {
        this.getLastModeFromRealm();

        if (lastMode == '')     this.setState({chooseModeModal: true});
        else                    setTimeout(this.startCountDown, 1000); // Jump to FirstView

    }

    getLastModeFromRealm(){

        realmInstance.write(() => {
            let lastModeRealm = realmInstance.objects('ModeLastStay').filtered('index = "lastmode"');

            // when it visits for the first time
            if(Object.keys(lastModeRealm) == "" ){

                realmInstance.create('ModeLastStay', {  index: 'lastmode',  mode : ''   });
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

                    <Toast  ref = "toast"   style = {{backgroundColor:'#222222'}}  position = 'bottom'/>

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

Loading = codePush(Loading);

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