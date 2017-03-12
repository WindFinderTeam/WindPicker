/*
 HISTORY
 2016. 8. 1 trying to add function of the stickyheader
 */

'use strict';

import  React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    ListView,
    TextInput,
    TouchableOpacity,
    DeviceEventEmitter,
    ToastAndroid,
    Image,
    Animated,
    Linking
} from 'react-native';


class MenuList extends Component {

    constructor(prop) {
        super(prop);

        this.handleViewLayout = this.handleViewLayout.bind(this);

        this.state = {
            viewHeight: 0,
        }

    };

    handleViewLayout(evt) {
        this.setState({viewHeight: evt.nativeEvent.layout.height});
    }

    sendEmail(){

        Linking.openURL('mailto:reedtale@gmail.com?subject=윈드피커 입점문의').catch(err => console.error('An error occurred', err));

    }

    render() {
        console.log("this.props.modeTitle: ", this.props.modeTitle)

        return (
            <View style={{flex: 1}}>
                <View style={{flex: 1,}}>
                    <View onLayout={this.handleViewLayout} style={{flex: 1}}>
                        <Image source={require('./image/bg.jpg')} style={{height: this.state.viewHeight}}
                               resizeMode={Image.resizeMode.cover}/>
                    </View>
                    <View style={{
                        height: 10,
                    }}/>
                </View>
                <View style={{flex: 2}}>
                    <TouchableOpacity
                        onPress={() => this.props.setModeChange('surf')}>
                        <View style={{
                            height: 50,
                            flexDirection: 'row',
                            alignItems: 'center',
                            backgroundColor: this.props.modeTitle == '서핑' ? '#E0E0E0' : null
                        }}>
                            <Text style={{color:'rgb(226,0,85)', fontSize:13}}>      ●</Text>
                            <Text style={{marginLeft: 20, fontSize: 18, color: 'black'}}> 서핑</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => this.props.setModeChange('gliding')}>
                        <View style={{
                            height: 50,
                            flexDirection: 'row',
                            alignItems: 'center',
                            backgroundColor: this.props.modeTitle == '패러글라이딩' ? '#E0E0E0' : null
                        }}>
                            <Text style={{color:'rgb(255,226,28)', fontSize:13}}>     ●</Text>
                            <Text style={{marginLeft: 20, fontSize: 18, color: 'black'}}> 패러글라이딩 </Text>
                        </View>
                    </TouchableOpacity>

                    <View style={{flex: 1, marginLeft: 10, marginBottom: 10, justifyContent: 'flex-end'}}>
                        <TouchableOpacity onPress={() => this.sendEmail()}>
                            <Text>윈드피커 입점문의</Text>
                            <Text style={{}}>reedtale@gmail.com</Text>
                        </TouchableOpacity>
                    </View>

                </View>
            </View>
        );
    }
}
;


module.exports = MenuList;