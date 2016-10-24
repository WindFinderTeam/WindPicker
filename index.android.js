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

        this.startCountDown = this.startCountDown.bind(this);

        this.state = {
            loadingYn : true,
            open      : false
        };

        this.checkVersion();
    }

    startCountDown(){

        this.setState({loadingYn: false});

    }

    checkVersion(){


         console.log(VersionCheck.getPackageName());// com.reactnative.app
         console.log(VersionCheck.getCurrentBuildNumber());// 10
         console.log(VersionCheck.getCurrentVersion());// 0.1.1


        VersionCheck.getLatestVersion()
            .then((latestVersion) => {
                console.log(latestVersion);    // 0.1.2
            })
            .catch((error) => {
            console.warn(error);
            setTimeout(this.startCountDown, 3000);
            return ;

        });

        VersionCheck.needUpdate()
            .then((res) => {
                console.log(res.isNeeded);    // true
                if(res.isNeeded == true) this.setState({open: true});
                else setTimeout(this.startCountDown, 3000);
            });

        VersionCheck.needUpdate(2)
            .then((res) => {
                console.log(res.isNeeded);    // false; because first two fields of current and the lastest versions are the same as "0.1".
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
                                style   = {{margin: 15}}
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