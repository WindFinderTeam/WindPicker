/**/
'use strict';

import  React, {Component} from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    ListView,
    TextInput,
    TouchableHighlight,
    TouchableOpacity,
    DeviceEventEmitter,
    ScrollView,
    ToastAndroid,
    Modal,
    Image,
    Dimensions
} from 'react-native';

//import Spinner from 'react-native-loading-spinner-overlay';
import Spinner from 'react-native-spinkit';

import Ionicons     from 'react-native-vector-icons/Ionicons';

import ParallaxScrollView from 'react-native-parallax-scroll-view';

import MyGoogleMap  from 'react-native-maps-google';

import ActionButton from 'react-native-action-button';

var offset = 0;

class WeatherList extends Component{


    constructor(props) {
        super(props);

        console.log("the value from Parent, pressed rowData is",this.props.rowData);
        console.log("the value from Parent, pressed headerData is",this.props.headerData);

        this.setModalVisible = this.setModalVisible.bind(this);
        this.setRgba = this.setRgba.bind(this);
        this.onScroll = this.onScroll.bind(this);


        var ds = new ListView.DataSource({
            sectionHeaderHasChanged: (r1, r2) => r1 !== r2,
            rowHasChanged: (r1, r2) => r1 !== r2
        });

        var {data} = this.renderListViewData();
        this.state = {
            dataSource: ds.cloneWithRows(data)
            ,isVisible: true
            ,topAlpha: 1
        };

    }

    renderListViewData(users) {

        var data = [];  // Array

        data.push('10:30   windy   42c   cloudy   40   0.5m');
        data.push('10:30   windy   42c   cloudy   40   0.5m');
        data.push('10:30   windy   42c   cloudy   40   0.5m');
        data.push('10:30   windy   42c   cloudy   40   0.5m');
        data.push('10:30   windy   42c   cloudy   40   0.5m');
        data.push('10:30   windy   42c   cloudy   40   0.5m');
        data.push('10:30   windy   42c   cloudy   40   0.5m');
        data.push('10:30   windy   42c   cloudy   40   0.5m');
        data.push('10:30   windy   42c   cloudy   40   0.5m');
        data.push('10:30   windy   42c   cloudy   40   0.5m');
        data.push('10:30   windy   42c   cloudy   40   0.5m');
        data.push('10:30   windy   42c   cloudy   40   0.5m');
        data.push('10:30   windy   42c   cloudy   40   0.5m');
        data.push('10:30   windy   42c   cloudy   40   0.5m');
        data.push('10:30   windy   42c   cloudy   40   0.5m');
        data.push('10:30   windy   42c   cloudy   40   0.5m');
        data.push('10:30   windy   42c   cloudy   40   0.5m');
        data.push('10:30   windy   42c   cloudy   40   0.5m');
        data.push('10:30   windy   42c   cloudy   40   0.5m');
        data.push('10:30   windy   42c   cloudy   40   0.5m');
        data.push('10:30   windy   42c   cloudy   40   0.5m');
        data.push('10:30   windy   42c   cloudy   40   0.5m');
        data.push('10:30   windy   42c   cloudy   40   0.5m');
        data.push('10:30   windy   42c   cloudy   40   0.5m');
        data.push('10:30   windy   42c   cloudy   40   0.5m');
        data.push('10:30   windy   42c   cloudy   40   0.5m');
        data.push('10:30   windy   42c   cloudy   40   0.5m');
        data.push('10:30   windy   42c   cloudy   40   0.5m');
        data.push('10:30   windy   42c   cloudy   40   0.5m');
        data.push('10:30   windy   42c   cloudy   40   0.5m');
        data.push('10:30   windy   42c   cloudy   40   0.5m');
        data.push('10:30   windy   42c   cloudy   40   0.5m');
        data.push('10:30   windy   42c   cloudy   40   0.5m');
        data.push('10:30   windy   42c   cloudy   40   0.5m');
        data.push('10:30   windy   42c   cloudy   40   0.5m');
        data.push('10:30   windy   42c   cloudy   40   0.5m');
        data.push('10:30   windy   42c   cloudy   40   0.5m');
        data.push('10:30   windy   42c   cloudy   40   0.5m');
        data.push('10:30   windy   42c   cloudy   40   0.5m');
        data.push('10:30   windy   42c   cloudy   40   0.5m');
        data.push('10:30   windy   42c   cloudy   40   0.5m');
        data.push('10:30   windy   42c   cloudy   40   0.5m');
        data.push('10:30   windy   42c   cloudy   40   0.5m');
        data.push('10:30   windy   42c   cloudy   40   0.5m');
        data.push('10:30   windy   42c   cloudy   40   0.5m');
        data.push('10:30   windy   42c   cloudy   40   0.5m');
        data.push('10:30   windy   42c   cloudy   40   0.5m');
        data.push('10:30   windy   42c   cloudy   40   0.5m');


        return {data};
    }

    // componentDidMount(){
    //     this.setState({
    //
    //          isVisible :!this.state.isVisible
    //     });
    // }

    setModalVisible(visible) {
        alert('dfdf');
        console.log('zzz');
        this.setState({

            isVisible :!this.state.isVisible
        });
    }

    setRgba(){
        var myAlpha = this.state.topAlpha;

        return `"rgba(231,76,60,`+`${myAlpha})"`;

    }

    onScroll(event){
        var currentOffset = event.nativeEvent.contentOffset.y;
        var direction = currentOffset > offset ? 'down' : 'up';
        offset = currentOffset;

        switch (direction) {
            case 'down'  :

                    this.setState({
                        topAlpha : 0
                    });


                break;
            case 'up' :
                console.log("in up");

                    this.setState({
                        topAlpha : 1
                    });

                console.log("offset is topAlpha up" + this.state.topAlpha);
                break;
        };

    }


    render() {

        return (

            <View style={{flex:1}}>

                <ListView
                    ref="ListView"
                    style={styles.container}
                    automaticallyAdjustContentInsets={false}
                    dataSource={this.state.dataSource}
                    onEndReached={()=>this.setState({isVisible:false})}
                    renderRow={(rowData) => (
                        <View key={rowData} style={styles.row}>

                            <Text style={styles.rowText}>
                                {rowData}
                            </Text>

                        </View>
                    )}

                    renderScrollComponent={  props => (
                        <ParallaxScrollView
                            onScroll={this.onScroll}
                            headerBackgroundColor="#333"
                            stickyHeaderHeight={ STICKY_HEADER_HEIGHT }
                            parallaxHeaderHeight={ PARALLAX_HEADER_HEIGHT }
                            backgroundSpeed={10}

                            renderBackground={() => (
                                <View key="background">

                                    <View  style={{width: window.width,height: PARALLAX_HEADER_HEIGHT,backgroundColor:'gold'}}/>
                                    <View style={{position: 'absolute',
                                        top: 0,
                                        width: window.width,
                                        backgroundColor: 'rgba(0,0,0,.4)',
                                        height: PARALLAX_HEADER_HEIGHT}}/>
                                </View>
                            )}

                            renderForeground={() => (
                                <View key="parallax-header" style={ styles.parallaxHeader }>

                                    <Text style={ styles.sectionSpeakerText }>
                                        {this.props.headerData}
                                    </Text>
                                    <Text style={ styles.sectionTitleText }>
                                        {this.props.rowData.district}
                                    </Text>
                                    <View style={ styles.sectionInfoListTextContainer }>
                                        <Text style={ styles.sectionInfoListText }>
                                            Time      Wind      Weather      Air      Waves
                                        </Text>
                                    </View>
                                </View>
                            )}

                            renderStickyHeader={() => (
                                <View key="sticky-header" style={styles.stickySection}>

                                    <View style={styles.navbar}>
                                        <Text style={{ color:"#FFF",fontSize:20 }}>
                                            {this.props.headerData}
                                        </Text>
                                        <Text style={{ color:"#FFF",fontSize:15 }}>
                                            {this.props.rowData.district}
                                        </Text>
                                    </View>
                                    <Text style={styles.stickySectionText}>
                                        Time      Wind      Weather      Air      Waves
                                    </Text>
                                </View>
                            )}

                            renderFixedHeader={() => (
                                <View key="fixed-header" style={styles.fixedSection}>
                                    <Text style={styles.fixedSectionText}
                                          onPress={() => this.refs.ListView.scrollTo({ x: 0, y: 0 })}>
                                        Top
                                    </Text>
                                </View>
                            )}
                        />
                    )}
                />
                <View style={{position:'absolute',left:10,top:10}}>
                    <TouchableOpacity  onPress={()=>this.props.modalVisible(false)}>
                        <Ionicons name="ios-arrow-back" size={30} color="#FFF" />
                    </TouchableOpacity>
                </View>
                <Spinner
                    style={styles.spinner} isVisible={this.state.isVisible} size={SPINNER_SIZE} type={"Bounce"} color={"#94000F"}
                />

                <ActionButton
                    //   buttonColor="rgba(231,76,60,1)"
                    buttonColor={this.setRgba()}
                    onPress={() => this.refs.ListView.scrollTo({ x: 0, y: 0 })}
                    //  icon={<Ionicons name="md-arrow-round-up" style={styles.actionButtonIcon} />}
                    icon={<Ionicons name="md-arrow-round-up" style={{fontSize:20, height:22, color:'white', opacity:this.state.topAlpha}} />}
                />

            </View>
        );
    }
}
//this.state.isVisible
const ROW_HEIGHT = 40;
const PARALLAX_HEADER_HEIGHT = 200;
const STICKY_HEADER_HEIGHT = 90;
const SPINNER_SIZE  = 100;

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'black'
    },

    navbar:{
        alignItems: 'center',
        flex: 1,
        flexDirection: 'column',
        width:SCREEN_WIDTH,
        height:50,
        backgroundColor:"#94000F"
    },
    background: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: window.width,
        height: PARALLAX_HEADER_HEIGHT
    },
    stickySection: {
        height: STICKY_HEADER_HEIGHT,
        width: SCREEN_WIDTH,
        backgroundColor:'#9c0010'

    },
    stickySectionText: {
        color: 'white',
        fontSize: 14,
        margin: 10,
        fontWeight:'bold',
        justifyContent: 'center',

    },
    fixedSection: {
        position: 'absolute',
        bottom: 10,
        right: 10
    },
    fixedSectionText: {
        color: '#999',
        fontSize: 15,
        textAlignVertical:'center'
    },
    parallaxHeader: {
        alignItems: 'center',
        flex: 1,
        flexDirection: 'column',
        paddingTop: 60
    },
    sectionSpeakerText: {
        color: 'white',
        fontSize: 30,
        paddingVertical: 5
    },
    sectionTitleText: {
        color: 'white',
        fontSize: 18,
        paddingVertical: 5
    },

    sectionInfoListTextContainer:{
        flex: 1,
        flexDirection: 'row',
        alignItems:'flex-end',
    },
    sectionInfoListText: {
        color: 'white',
        fontSize: 18,
        fontWeight:'bold',
        justifyContent: 'center',


    },
    row: {
        overflow: 'hidden',
        paddingHorizontal: 10,
        height: ROW_HEIGHT,
        backgroundColor: 'white',
        borderColor: '#ccc',
        borderBottomWidth: 1,

    },
    rowText: {
        fontSize: 20
    },
    sectionHeader: {
        backgroundColor: '#48D1CC'
    },
    sectionHeaderText: {
        fontFamily: 'AvenirNext-Medium',
        fontSize: 16,
        color: 'white',
        paddingLeft: 10
    },

    spinnerView:{
        position:'absolute',
        bottom:SCREEN_HEIGHT/2,
        left:SCREEN_WIDTH/2,
    },

    spinner: {
        position:'absolute',
        left: (SCREEN_WIDTH-SPINNER_SIZE)/2,
        top: (SCREEN_HEIGHT-SPINNER_SIZE)/2,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    }
});

module.exports = WeatherList;