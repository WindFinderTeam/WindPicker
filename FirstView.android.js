import  React, {
    Component
} from 'react';

import {
    AppRegistry,
    StyleSheet,
    ScrollView,
    Text,
    View,
    DrawerLayoutAndroid,
} from 'react-native';

import Toast, {DURATION} from 'react-native-easy-toast';
import MenuList          from './MenuList';
import MyToolbar         from './MyToolbar';
import TabView           from './TabView';

var pickerStyle = require('./pickerStyle');

class FirstViewAndroid extends Component {

    constructor(prop) {
        super(prop);

        this.openDrawerLayout = this.openDrawerLayout.bind(this);
        this.state = { viewMode: this.props.mode  };
    }

    openDrawerLayout() {  this.refs._drawer.openDrawer();  }

    setModeChange(mode) {

        if (mode == 'surf') {
            this.setState({viewMode: 'surf', tabViewSelectedPage: 0});
            this.refs.toast.show('서핑모드 모드로 전환합니다',DURATION.LENGTH_LONG);
        }
        else {
            this.setState({viewMode: 'gliding', tabViewSelectedPage: 0});
            this.refs.toast.show('페러글라이딩 모드로 전환합니다',DURATION.LENGTH_SHORT);
        }
        this.refs._drawer.closeDrawer();
    }


    render() {

        var modeTitle;

        switch (this.state.viewMode) {
            case 'surf'   :  modeTitle = '서핑';            break;
            case 'gliding':  modeTitle = '패러글라이딩';      break;
            default       :  modeTitle = '패러글라이딩';      break;
        }  ;

        return (
            <DrawerLayoutAndroid
                drawerWidth={250}
                drawerPosition={DrawerLayoutAndroid.positions.Left}
                ref={'_drawer'}
                renderNavigationView={() => <MenuList viewMode={this.state.viewMode} setModeChange={(mode) => this.setModeChange(mode)}/>}>

                <MyToolbar modeTitle={modeTitle} openDrawerLayout={() => this.openDrawerLayout()}/>
                <TabView viewMode={this.state.viewMode} tabViewSelectedPage={this.state.tabViewSelectedPage} />

                <Toast   ref="toast"   style={{backgroundColor: '#222222'}}    position='bottom'/>
            </DrawerLayoutAndroid>
        );
    }
}




module.exports = FirstViewAndroid;
