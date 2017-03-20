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
    TouchableOpacity,
    Image,
    Linking
} from 'react-native';


class MenuList extends Component {

    constructor(prop) {
        super(prop);

        this.handleViewLayout = this.handleViewLayout.bind(this);
        this.state = {  viewHeight: 0    }
    };

    handleViewLayout(evt) {  this.setState({viewHeight: evt.nativeEvent.layout.height});   }

    sendEmail(){  Linking.openURL('mailto:reedtale@gmail.com?subject=윈드피커 입점문의').catch(err => console.error('An error occurred', err));   }

    render() {

        return (
            <View style={styles.container}>
                <Image source={require('./image/bg.jpg')} style={{width:250, height:250}} />

                <View style={{ height: 10 }}/>

                <TouchableOpacity
                    onPress={() => this.props.setModeChange('surf')}>
                    <View style={[styles.menuView, {backgroundColor: this.props.viewMode == 'surf' ? '#E0E0E0' : null  }]}>
                        <Text style={styles.redDot}>●</Text>
                        <Text style={styles.menuText}>서핑</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => this.props.setModeChange('gliding')}>
                    <View style={[styles.menuView, { backgroundColor: this.props.viewMode == 'gliding' ? '#E0E0E0' : null  }]}>
                        <Text style={styles.yellowDot}>●</Text>
                        <Text style={styles.menuText}>패러글라이딩</Text>
                    </View>
                </TouchableOpacity>

                <View style={styles.emailView}>
                    <TouchableOpacity onPress={() => this.sendEmail()}>
                        <Text>윈드피커 입점문의</Text>
                        <Text style={{fontStyle:'italic'}}>reedtale@gmail.com</Text>
                    </TouchableOpacity>
                </View>

            </View>
        );
    }
};

const styles = StyleSheet.create({

    emailView   : {flex: 1, marginLeft: 10, marginBottom: 10, justifyContent: 'flex-end'},
    yellowDot   : {color:'rgb(255,226,28)', fontSize:13, marginLeft:15},
    redDot      : {color:'rgb(226,0,85)'  , fontSize:13, marginLeft:15},
    menuText    : {marginLeft: 20, fontSize: 18, color: 'black'},
    menuView    : {height: 50,   flexDirection: 'row',    alignItems: 'center'},
    container   : {flex: 1, backgroundColor:'white'}

});

module.exports = MenuList;