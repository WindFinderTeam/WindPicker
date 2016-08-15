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
    Image
} from 'react-native';

//import Spinner from 'react-native-loading-spinner-overlay';
import Spinner from 'react-native-spinkit';

import Ionicons     from 'react-native-vector-icons/Ionicons';

import ParallaxScrollView from 'react-native-parallax-scroll-view';




class WeatherList extends Component{


    constructor(props) {
        super(props);


        this.setModalVisible = this.setModalVisible.bind(this);

        var ds = new ListView.DataSource({
            sectionHeaderHasChanged: (r1, r2) => r1 !== r2,
            rowHasChanged: (r1, r2) => r1 !== r2
        });

        var {data} = this.renderListViewData();
        this.state = {
            dataSource: ds.cloneWithRows(data)
            ,isVisible: true
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
        this.setState({

            isVisible :!this.state.isVisible
        });
    }



    render() {
        const { onScroll = () => {} } = this.props;
        return (

            <ListView
                ref="ListView"
                style={styles.container}
                automaticallyAdjustContentInsets={false}
                dataSource={this.state.dataSource}
                onEndReached={()=>this.setModalVisible(!this.state.isVisible)}
                renderRow={(rowData) => (
                    <View key={rowData} style={styles.row}>

                        <Text style={styles.rowText}>
                            {rowData}
                        </Text>

                    </View>
                )}

                renderScrollComponent={  props => (
                    <ParallaxScrollView
                        onScroll={onScroll}
                        headerBackgroundColor="#333"
                        stickyHeaderHeight={ STICKY_HEADER_HEIGHT }
                        parallaxHeaderHeight={ PARALLAX_HEADER_HEIGHT }
                        backgroundSpeed={10}

                        renderBackground={() => (
                            <View key="background">
                                <Image source={{uri: 'https://i.ytimg.com/vi/P-NZei5ANaQ/maxresdefault.jpg',
                                    width: window.width,
                                    height: PARALLAX_HEADER_HEIGHT}}/>
                                <View style={{position: 'absolute',
                                    top: 0,
                                    width: window.width,
                                    backgroundColor: 'rgba(0,0,0,.4)',
                                    height: PARALLAX_HEADER_HEIGHT}}/>
                            </View>
                        )}

                        renderForeground={() => (
                            <View key="parallax-header" style={ styles.parallaxHeader }>
                                <View style={styles.spinnerView}>
                                    <Spinner style={styles.spinner} isVisible={this.state.isVisible} size={80} type={"Wave"} color={"red"}/>
                                </View>


                                <Text style={ styles.sectionSpeakerText }>
                                    SEOUL
                                </Text>
                                <Text style={ styles.sectionTitleText }>
                                    SONPG-GU
                                </Text>
                                <Text style={ styles.sectionInfoListText }>
                                    Time      Wind      Weather      Air      Waves
                                </Text>
                            </View>
                        )}

                        renderStickyHeader={() => (
                            <View key="sticky-header" style={styles.stickySection}>
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

        );
    }
}

const ROW_HEIGHT = 40;
const PARALLAX_HEADER_HEIGHT = 200;
const STICKY_HEADER_HEIGHT = 70;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'black'
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
        width: 350,
        justifyContent: 'flex-end'
    },
    stickySectionText: {
        color: 'white',
        fontSize: 18,
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
        paddingTop: 100
    },
    sectionSpeakerText: {
        color: 'white',
        fontSize: 24,
        paddingVertical: 5
    },
    sectionTitleText: {
        color: 'white',
        fontSize: 18,
        paddingVertical: 5
    },
    sectionInfoListText: {
        color: 'white',
        fontSize: 18,
        paddingVertical: 45,
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
        justifyContent: 'center',
        alignItems: 'center'
    },

    spinner: {

        alignSelf: 'center',
        marginTop: 50,
        marginLeft:150,
        position:'absolute',
    },
});

module.exports = WeatherList;