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
//https://github.com/oblador/react-native-vector-icons
import Ionicons     from 'react-native-vector-icons/Ionicons';

class MyToolbar extends Component {
    constructor(props) {
        super(props);
    }

    render() {

        var myToolbar;
        if (Platform.OS === 'ios') {
            myToolbar = (
                <View style={{height: 56,flexDirection:'row', paddingTop:25}}>
                    <View style={{left: 18}}>
                        <TouchableOpacity
                            onPress={() => this.props.openDrawerLayout()}>
                            <Ionicons name="md-menu" size={20} color={'#94000F'} />
                        </TouchableOpacity>
                    </View>
                    <View style={{left: 8,  alignItems: 'center'}}>
                        <Text style={{marginLeft: 30, top:2, fontSize: 18,   color: '#94000F'}}>{this.props.modeTitle}</Text>
                    </View>


                </View>

            );
        } else {
            myToolbar = (
                <View>
                    <Ionicons.ToolbarAndroid
                        // navIconName={require('./image/app_logo.png')}
                        // logo={require('./image/app_logo.png')}
                        style={styles.toolbar}
                        iconColor     = "#94000F"
                        titleColor    = "#94000F"
                        navIconName   = "md-menu"
                        onIconClicked = {() => this.props.openDrawerLayout()}
                    />
                    <View style={styles.logoImage}>
                        <Text style={styles.modeText}>{this.props.modeTitle}</Text>
                    </View>
                </View>
            );
        }
        return (myToolbar);
    }
}

const styles = StyleSheet.create({

    logoImage: {
        position: 'absolute',
        left: 8,
        top: 14,
        alignItems: 'center',
        flexDirection: 'row'
    },

    drawer: {
        backgroundColor: '#FFFFFF',
        flex: 1,
    },
    modeText: {
        marginLeft: 40,
        top: 2,
        fontSize: 18,
        color: '#94000F'
    },

    toolbar: {
        height: 56,
        backgroundColor: '#FFFFFF'
    },


});

export default MyToolbar;