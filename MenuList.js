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
} from 'react-native';


class MenuList extends Component {

    constructor(prop) {
        super(prop);
    }

    render() {
        console.log("this.props.modeTitle: ", this.props.modeTitle);
        return (
            <View style={{flex: 1}}>
                <View style={{flex: 1, backgroundColor: 'gold'}}/>
                <View style={{flex: 2}}>
                    <TouchableOpacity
                        onPress={()=>this.props.setModeChange('surf')}>
                        <View style={{
                            height: 50,
                            justifyContent: 'center',
                            backgroundColor: this.props.modeTitle == '서핑' ? 'gray' : null
                        }}>
                            <Text style={{marginLeft: 20, fontSize: 20}}> 서핑</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={()=>this.props.setModeChange('gliding')}>
                        <View style={{
                            height: 50,
                            justifyContent: 'center',
                            backgroundColor: this.props.modeTitle == '패러글라이딩' ? 'gray' : null
                        }}>
                            <Text style={{marginLeft: 20, fontSize: 20,}}> 패러글라이딩 </Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}
;


module.exports = MenuList;