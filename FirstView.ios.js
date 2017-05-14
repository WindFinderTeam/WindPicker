import  React, {
    Component
} from 'react';

import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
} from 'react-native';


import Toast, {DURATION} from 'react-native-easy-toast';
import MenuList          from './MenuList';
import MyToolbar         from './MyToolbar';
import TabView           from './TabView';
import SlideMenu         from 'react-native-navi-drawer';

var pickerStyle = require('./pickerStyle');

class FirstView extends Component {

    constructor(prop) {
        super(prop);

        this.openDrawerLayout      = this.openDrawerLayout.bind(this);
        this.setShowmap            = this.setShowmap.bind(this)      ;
        this.setListIconShow       = this.setListIconShow.bind(this)      ;

        this.state = {
            viewMode : this.props.mode,
            showmap  : false,
            listIconShow : true
        };
    }

    openDrawerLayout() {    this.refs._drawer.toggleSlideMenu();    }


    setModeChange(mode) {

        if (mode == 'surf') {
            this.setState({viewMode: 'surf'});
            this.refs.toast.show('서핑모드 모드로 전환합니다',DURATION.LENGTH_LONG);
        }
        if (mode == 'gliding') {
            this.setState({viewMode: 'gliding'});
            this.refs.toast.show('페러글라이딩 모드로 전환합니다',DURATION.LENGTH_SHORT);
        }
        this.refs._drawer.toggleSlideMenu();
    }

    setShowmap(){   this.setState({showmap: !this.state.showmap});   }

    setListIconShow(tf){   this.setState({listIconShow: tf});   }

    render() {

        var modeTitle;

        switch (this.state.viewMode) {
            case 'surf'   :  modeTitle = '서핑';           break;
            case 'gliding':  modeTitle = '패러글라이딩';     break;
        };

        return (
            <View style={{flex:1, backgroundColor:'white'}}>
                <SlideMenu
                    ref          = {'_drawer'}
                    menu         = {<MenuList viewMode={this.state.viewMode}
                       setModeChange= {(mode) => this.setModeChange(mode)}/>} slideWay='left' moveFrontView={false} width={250}
                    frontView    = {
                                <View style={{flex:1}}>
                                     <MyToolbar modeTitle={modeTitle} setShowmap={() => this.setShowmap()} listIconShow={this.state.listIconShow} openDrawerLayout={() => this.openDrawerLayout()}/>
                                     <TabView  viewMode={this.state.viewMode} showmap={this.state.showmap} setListIconShow={(tf)=>this.setListIconShow(tf)}/>
                                </View>
                       }
                />
                <Toast    ref="toast"   style={{backgroundColor: '#222222'}}     position='bottom'/>
            </View>

        );
    }
}




module.exports = FirstView;