import  React, {Component} from 'react';
import {
    StyleSheet,
    Platform,
    Text,
    View,
    TouchableOpacity,
    DrawerLayoutAndroid,
    Image
} from 'react-native';
import Ionicons     from 'react-native-vector-icons/Ionicons';

class MyToolbar extends Component {
    constructor(props) {
        super(props);

        this.changeShowmap = this.changeShowmap.bind(this);

        this.state = {
            showmap : false
        };
    }

    changeShowmap(){
        this.setState({showmap: !this.state.showmap});
    }

    render() {

        var myToolbar;
        if (Platform.OS === 'ios') {
            myToolbar = (
                <View style={styles.iosToolbar}>
                    <TouchableOpacity  onPress={() => this.props.openDrawerLayout()}>
                        <View style={styles.iosHamburger}><Ionicons name="md-menu" size={30} color={'#94000F'}/></View>
                    </TouchableOpacity>
                    <View style={styles.iosTitleView}>
                        <Text style={[styles.modeText,{marginTop:5}]}>{this.props.modeTitle}</Text>
                    </View>
                    <TouchableOpacity  onPress={() => {this.changeShowmap(); this.props.setShowmap();}

                    } style={{flex:1,alignItems:'flex-end',paddingRight:15,justifyContent:'center'}}>
                        {this.state.showmap &&<Ionicons name="ios-map-outline" size={28} color={'#94000F'}/>}
                        {!this.state.showmap &&<Ionicons name="ios-list" size={33} color={'#94000F'} />}
                    </TouchableOpacity>
                </View>
            );
        }
        else {
            myToolbar = (
                <View>
                    <Ionicons.ToolbarAndroid  onIconClicked = {() => this.props.openDrawerLayout()}
                                              style={styles.androidToolbar}
                                              iconColor     = "#94000F"
                                              titleColor    = "#94000F"
                                              navIconName   = "md-menu"
                    />
                    <View style={styles.anroidTitleView}>
                        <Text style={styles.modeText}>{this.props.modeTitle}</Text>
                    </View>
                    <Ionicons name="ios-map-outline" size={5} color={'#94000F'}/>

                </View>
            );
        }
        return (myToolbar);
    }
}

const styles = StyleSheet.create({

    iosTitleView    :{ left: 8,  alignItems: 'center'  },
    anroidTitleView :{
        position: 'absolute',
        left: 8, top: 16,  marginLeft: 40,
        alignItems: 'center',
        flexDirection: 'row'
    },
    modeText: {
        fontSize: 20,
        color: '#94000F',
        marginTop:2,
    },
    androidToolbar: { height: 56, backgroundColor: '#FFFFFF', marginTop:5},
    iosToolbar    : { height: 56, flexDirection: 'row', paddingTop: 25 },
    iosHamburger  : { width : 35, marginLeft: 15}

});

export default MyToolbar;