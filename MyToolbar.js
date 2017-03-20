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
    }

    render() {

        var myToolbar;
        if (Platform.OS === 'ios') {
            myToolbar = (
                <View style={styles.iosToolbar}>
                    <TouchableOpacity  onPress={() => this.props.openDrawerLayout()}>
                        <View style={styles.iosHamburger}><Ionicons name="md-menu" size={20} color={'#94000F'}/></View>
                    </TouchableOpacity>
                    <View style={styles.iosTitleView}>
                        <Text style={styles.modeText}>{this.props.modeTitle}</Text>
                    </View>
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
        fontSize: 18,
        color: '#94000F'
    },
    androidToolbar: { height: 56, backgroundColor: '#FFFFFF'},
    iosToolbar    : { height: 56, flexDirection: 'row', paddingTop: 25  },
    iosHamburger  : { width : 35, marginLeft: 15}

});

export default MyToolbar;