
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



import MyGoogleMap  from 'react-native-maps-google';

import Spinner from 'react-native-spinkit';

import Ionicons     from 'react-native-vector-icons/Ionicons';

import ParallaxScrollView from 'react-native-parallax-scroll-view';

import ActionButton from 'react-native-action-button';


var offset = 0;

var API_URL = 'http://demo9383702.mockable.io/users';

class WeatherList extends Component {


    constructor(props) {
        super(props);


        this.onScroll = this.onScroll.bind(this);

        var getSectionData = (dataBlob, sectionID) => {
            return dataBlob[sectionID];
        }

        var getRowData = (dataBlob, sectionID, rowID) => {
            return dataBlob[sectionID + ':' + rowID];
        }

        this.fetchData();

        this.state = {
            dataSource: new ListView.DataSource({
                getSectionData: getSectionData,
                getRowData: getRowData,
                rowHasChanged: (row1, row2) => row1 !== row2,
                sectionHeaderHasChanged: (s1, s2) => s1 !== s2
            })
            , isVisible: false
            , topAlpha: 1
        };

    }

    fetchData() {
        console.log("start fetchData");
        fetch(API_URL).then((response) => response.json()).then((responseData) => {
            var organizations = responseData.results,
                length = organizations.length,
                dataBlob = {},
                sectionIDs = [],
                rowIDs = [],
                organization,
                users,
                userLength,
                user,
                i,
                j;

            for (i = 0; i < length; i++) {
                organization = organizations[i];

                sectionIDs.push(organization.id);
                dataBlob[organization.id] = organization.organization;

                users = organization.users;
                userLength = users.length;

                rowIDs[i] = [];

                for (j = 0; j < userLength; j++) {
                    user = users[j].user;
                    rowIDs[i].push(user.md5);

                    dataBlob[organization.id + ':' + user.md5] = user;
                }
            }

            this.setState({
                dataSource: this.state.dataSource.cloneWithRowsAndSections(dataBlob, sectionIDs, rowIDs),
                loaded: true
            });

        }).done();
    }

    componentDidMount() {
        this.fetchData();
    }


    setRgba() {
        var myAlpha = this.state.topAlpha;
        return `"rgba(231,76,60,` + `${myAlpha})"`;
    }

    onScroll(event) {
        var currentOffset = event.nativeEvent.contentOffset.y;
        var direction = currentOffset > offset ? 'down' : 'up';
        offset = currentOffset;

        switch (direction) {
            case 'down'  :
                this.setState({
                    topAlpha: 0
                });
                break;
            case 'up' :
                this.setState({
                    topAlpha: 1
                });
                break;
        };
    }



    render() {

            return (

                <View style={{flex: 1}}>

                    <ListView
                        ref="ListView"
                        style={styles.container}
                        automaticallyAdjustContentInsets={false}
                        dataSource={this.state.dataSource}
                        renderSectionHeader={(sectionData) =>(
                            <View style={styles.sectionHeader}>
                                <Text style={styles.sectionHeaderText}>{sectionData}</Text>
                            </View>
                        )}
                        renderRow={(rowData) => (
                            <View key={rowData} style={styles.row}>
                                <View style={styles.row_flex1}>
                                    <Text style={styles.rowText}>{rowData.name.title}</Text></View>
                                <View style={styles.row_flex2}>
                                    <Text style={styles.rowText}>{rowData.name.first}</Text></View>
                                <View style={styles.row_flex3}>
                                    <Text style={styles.rowText}>{rowData.name.last}</Text></View>

                            </View>
                        )}

                        renderScrollComponent={  props => (
                            <ParallaxScrollView
                                onScroll={this.onScroll}
                                stickyHeaderHeight={ STICKY_HEADER_HEIGHT }
                                parallaxHeaderHeight={ PARALLAX_HEADER_HEIGHT }
                                backgroundSpeed={10}

                                renderBackground={() => (
                                    <View key="background">

                                        <Image
                                          source={{uri: 'http://www.kimjakgatour.com/m_upload/%EB%B6%80%EB%AA%A8%EB%8B%98%EA%B3%BC%EC%A0%9C%EC%A3%BC%EB%8F%843%EB%B0%954%EC%9D%BC%EC%97%AC%ED%96%89%EC%BD%94%EC%8A%A4113.jpg'}}
                                          style={{width: window.width,height: PARALLAX_HEADER_HEIGHT}}
                                        />
                                        <View style={{
                                            position: 'absolute',
                                            top: 0,
                                            width: window.width,
                                            backgroundColor: 'rgba(0,0,0,.4)',
                                            height: PARALLAX_HEADER_HEIGHT
                                        }}/>
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
                                                Time Wind Weather Air Waves
                                            </Text>
                                        </View>
                                    </View>
                                )}

                                renderStickyHeader={() => (
                                    <View key="sticky-header" style={styles.stickySection}>

                                        <View style={styles.navbar}>
                                            <Text style={{color: "#FFF", fontSize: 20}}>
                                                {this.props.headerData}
                                            </Text>
                                            <Text style={{color: "#FFF", fontSize: 15}}>
                                                {this.props.rowData.district}
                                            </Text>
                                        </View>
                                        <Text style={styles.stickySectionText}>
                                            Time Wind Weather Air Waves
                                        </Text>
                                    </View>
                                )}

                            />
                        )}
                    />
                    <View style={{position: 'absolute', left: 10, top: 10}}>
                        <TouchableOpacity onPress={()=>this.props.modalVisible(false)}>
                            <Ionicons name="ios-arrow-back" size={30} color="#FFF"/>
                        </TouchableOpacity>
                    </View>

                    <Spinner
                        style={styles.spinner} isVisible={!this.state.loaded} size={SPINNER_SIZE} type={"9CubeGrid"}
                        color={"#94000F"}
                    />

                    <ActionButton
                        buttonColor={this.setRgba()}
                        onPress={() => this.refs.ListView.scrollTo({x: 0, y: 0})}
                        //  icon={<Ionicons name="md-arrow-round-up" style={styles.actionButtonIcon} />}
                        icon={<Ionicons name="md-arrow-round-up" style={{
                            fontSize: 20,
                            height: 22,
                            color: 'white',
                            opacity: this.state.topAlpha
                        }}/>}
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
        backgroundColor: 'white'
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
        flex:1,
        borderWidth: 1,
        height: 30,
        flexDirection: 'row',
        justifyContent: 'center',
    },
    rowText: {
        fontSize: 20
    },
    row_flex1: {
        flex: 1
    },
    row_flex2: {
        flex: 1
    },
    row_flex3: {
        flex: 1
    },
    sectionHeader: {
        backgroundColor: '#0080FF'
    },
    sectionHeaderText: {
        fontFamily: 'AvenirNext-Medium',
        fontSize: 16,
        color: 'white',
        paddingLeft: 20
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