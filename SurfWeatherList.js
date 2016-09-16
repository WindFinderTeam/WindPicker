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



//import MyGoogleMap  from 'react-native-maps-google';
import Spinner            from 'react-native-spinkit';
import Ionicons           from 'react-native-vector-icons/Ionicons';
import ParallaxScrollView from 'react-native-parallax-scroll-view';
import ActionButton       from 'react-native-action-button';

var SurfParser = require('./SurfParser');
var offset     = 0;
var rowKey     = 0;
var API_URL ;

class SurfWeatherList extends Component {

    constructor(props) {
        super(props);

        API_URL = this.props.rowData.weatherURL; // 날씨URL 가져오기

        this.onScrollEnd = this.onScrollEnd.bind(this);
        this.fetchData = this.fetchData.bind(this);

        var getSectionData = (dataBlob, sectionID) => {
            return dataBlob[sectionID];
        };

        var getRowData = (dataBlob, sectionID, rowID) => {
            return dataBlob[sectionID + ':' + rowID];
        };


        this.state = {
            dataSource : new ListView.DataSource(
                {
                    getSectionData          : getSectionData,
                    getRowData              : getRowData,
                    rowHasChanged: (row1, row2) => row1 !== row2,
                    sectionHeaderHasChanged: (s1, s2) => s1 !== s2
                }),
            isVisible: false
            , topAlpha: 0
            , loaded:false
            , sunRise: "00:00"
            , sunSet: "00:00"
        };

        this.fetchData();

    }

    fetchData(){

        fetch(API_URL).then((responseData) => {

            //     var {dataBlob, sectionIDs, rowIDs} = SurfParser.getSurfWeather(responseData);
            var {dataBlob,sectionIDs, rowIDs,sunInfo} = SurfParser.getSurfWeather(responseData);
            // for(var i=0; i<sectionIDs.length; i++){
            //     for(var j=0; j<dataBlob[sectionIDs[i]].length; j++){
            //         console.log( "*******>>:" + sectionIDs[i] + ":" + dataBlob[sectionIDs[i]][j].time);
            //     }
            // }
            this.setState({
                dataSource:  this.state.dataSource.cloneWithRowsAndSections(dataBlob,sectionIDs,rowIDs),
                loaded: true,
                sunRise: sunInfo[0],
                sunSet: sunInfo[1],
                lastUpdate: sunInfo[2]
            });

            console.log("setState ok");
        }).done();
    }


    setRgba() {
        var myAlpha = this.state.topAlpha;
        return `"rgba(156,0,16,` + `${myAlpha})"`;
    }

    sectionHeader(rowData, sectionID){

        return (
            <View style={styles.sectionHeader}>
                <Text style={styles.sectionHeaderText}>{sectionID}</Text>
            </View>
        )
    }


    renderRow(rowData, sectionID, rowID){

        // console.log("sectionID"+sectionID);
        // console.log("rowID:"+rowID);

        // for(var a in rowData){
        //     console.log(">>>>rowData  -> idx "  + rowData[a]);
        // }
        //rowContain
        rowKey++;
        return (
            <View key={rowKey}  style={styles.rowContain}>


                <Text style={styles.rowText}>{rowData.time}</Text>
                <Text style={styles.rowText}>{rowData.cloud}</Text>
                <Text style={styles.rowText}>{rowData.temperature}</Text>
                <Text style={styles.rowText}>{rowData.wind}</Text>
                <Text style={styles.rowText}>{rowData.gust}</Text>
                <Text style={styles.rowText}>{rowData.pressure}</Text>
                <Text style={styles.rowText}>{rowData.howGoodTosurf}</Text>


            </View>
        );
    }

    onScrollEnd(event) {
        var currentOffset = event.nativeEvent.contentOffset.y;
        var direction = currentOffset > offset ? 'down' : 'up';
        offset = currentOffset;

        switch (direction) {
            case 'down'  :
                this.setState({
                    topAlpha: 0
                });
                console.log("+++++++++++++++> down down down");
                break;
            case 'up' :
                this.setState({
                    topAlpha: 0.8
                });
                console.log("+++++++++++++++> up up up");
                break;
        };
    }

    onMomentumScrollEnd(event){
        var currentOffset = event.nativeEvent.contentOffset.y;
        console.log("onMomentumScrollEnd / height : " + Dimensions.get('window').height + ", " + currentOffset);
    }

    render() {
        return (

            <View style={{flex: 1}}>

                <ListView
                    ref="ListView"
                    initialListSize={1}
                    pageSize={100}
                    style={styles.container}

                    dataSource={this.state.dataSource}
                    renderSectionHeader={this.sectionHeader}
                    renderRow={this.renderRow}

                    renderScrollComponent={  props => (
                        <ParallaxScrollView
                            onScrollEndDrag={this.onScrollEnd}
                            stickyHeaderHeight={ STICKY_HEADER_HEIGHT }
                            parallaxHeaderHeight={ PARALLAX_HEADER_HEIGHT }
                            backgroundSpeed={10}
                            onMomentumScrollEnd={this.onScrollEnd}
                            scrollEnabled={this.state.loaded}
                            renderBackground={() => (
                                <View key="background" style={{opacity:1}}>

                                    <Image
                                        source={{uri: 'http://img.wallpaperfolder.com/f/464DBCFCD944/1920x1200px-blur-light-effect-300575.jpg'}}
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

                                    <Text style={{color:'#FFF'}}>마지막 업데이트 {this.state.lastUpdate}</Text>
                                    <Text style={ styles.headerDistrictText }>
                                        {this.props.rowData.district}
                                    </Text>
                                    <View style={{flexDirection:'row',flex:1,marginTop:10}}>
                                        <View style={styles.sunInfo}>
                                            <Text style={{color:'#FFF',textAlign:'center'}}>일출 {this.state.sunRise}</Text>
                                        </View>
                                        <View style={styles.sunInfo}>
                                            <Text style={{color:'#FFF',textAlign:'center'}}>일몰 {this.state.sunSet}</Text>
                                        </View>
                                    </View>



                                    <View style={ styles.foreGroundMenuContainer }>
                                        <View style={{ flex:1, padding:0,margin:0,justifyContent:'center', alignItems:'center'}}>
                                            <Text style={styles.sectionInfoListText}>시간</Text>
                                        </View>
                                        <View style={{  flex:1, padding:0,margin:0,justifyContent:'center', alignItems:'center'}}>
                                            <Text style={styles.sectionInfoListText}>날씨</Text>
                                        </View>
                                        <View style={{  flex:1, padding:0,margin:0,justifyContent:'center', alignItems:'center'}}>
                                            <Text style={styles.sectionInfoListText}>기온</Text>
                                        </View>
                                        <View style={{  flex:1, padding:0,margin:0,justifyContent:'center', alignItems:'center'}}>
                                            <Text style={styles.sectionInfoListText}>바람</Text>
                                        </View>
                                        <View style={{  flex:1, padding:0,margin:0,justifyContent:'center', alignItems:'center'}}>
                                            <Text style={styles.sectionInfoListText}>파도</Text>
                                        </View>
                                        <View style={{  flex:1, padding:0,margin:0,justifyContent:'center', alignItems:'center'}}>
                                            <Text style={styles.sectionInfoListText}>조수</Text>
                                        </View>
                                        <View style={{  flex:1, padding:0,margin:0,justifyContent:'center', alignItems:'center'}}>
                                            <Text style={styles.sectionInfoListText}>판정</Text>
                                        </View>
                                    </View>
                                </View>
                            )}

                            renderStickyHeader={() => (
                                <View key="sticky-header" style={styles.stickySection}>


                                    <View style={styles.navbar}>
                                        <Text style={{color: "#94000F", fontSize: 20}}>
                                            {this.props.rowData.province}
                                        </Text>
                                        <Text style={{color: "#94000F", fontSize: 15}}>
                                            {this.props.rowData.district}
                                        </Text>
                                    </View>
                                    <View style={ styles.stickyMenuContainer }>
                                        <View style={{ flex:1, padding:0,margin:0,justifyContent:'center', alignItems:'center'}}>
                                            <Text style={styles.sectionInfoListText}>시간</Text>
                                        </View>
                                        <View style={{  flex:1, padding:0,margin:0,justifyContent:'center', alignItems:'center'}}>
                                            <Text style={styles.sectionInfoListText}>날씨</Text>
                                        </View>
                                        <View style={{  flex:1, padding:0,margin:0,justifyContent:'center', alignItems:'center'}}>
                                            <Text style={styles.sectionInfoListText}>기온</Text>
                                        </View>
                                        <View style={{  flex:1, padding:0,margin:0,justifyContent:'center', alignItems:'center'}}>
                                            <Text style={styles.sectionInfoListText}>바람</Text>
                                        </View>
                                        <View style={{  flex:1, padding:0,margin:0,justifyContent:'center', alignItems:'center'}}>
                                            <Text style={styles.sectionInfoListText}>파도</Text>
                                        </View>
                                        <View style={{  flex:1, padding:0,margin:0,justifyContent:'center', alignItems:'center'}}>
                                            <Text style={styles.sectionInfoListText}>조수</Text>
                                        </View>
                                        <View style={{  flex:1, padding:0,margin:0,justifyContent:'center', alignItems:'center'}}>
                                            <Text style={styles.sectionInfoListText}>판정</Text>
                                        </View>
                                    </View>

                                </View>
                            )}

                        />
                    )}
                />
                <View style={{position: 'absolute', left: 10, top: 10}}>
                    <TouchableOpacity onPress={()=>this.props.modalVisible(false)}>
                        <View style={{width:40}}>
                            <Ionicons name="ios-arrow-back" size={30} color="#94000F"/>
                        </View>
                    </TouchableOpacity>
                </View>
                <View style={styles.heartView}>
                    <TouchableOpacity>
                        <Ionicons name="md-heart" size={30} color="#94000F"/>
                    </TouchableOpacity>
                </View>


                <Spinner
                    style={styles.spinner} isVisible={!this.state.loaded} size={SPINNER_SIZE} type={"Bounce"}
                    color={"#94000F"}
                />

                <ActionButton
                    buttonColor={this.setRgba()}
                    type={'tab'}
                    position={'right'}
                    onPress={() => this.refs.ListView.scrollTo({x: 0, y: 0})}
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
const PARALLAX_HEADER_HEIGHT = 200;
const STICKY_HEADER_HEIGHT = 95;
const SPINNER_SIZE  = 80;

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
        backgroundColor:"#FFF"
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
        backgroundColor:'#94000F'

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
    heartView:{
        position: 'absolute',
        right: 10,
        top: 10,
        borderRadius:100,
        width:40,
        height:40,
        borderWidth: 1,
        borderColor: '#FFF',
        alignItems: 'center',
        justifyContent:'center'
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
        paddingTop: 40
    },

    stickyMenuContainer:{
        flex: 1,
        flexDirection: 'row',
        height:30,
        alignItems:'center',
    },
    foreGroundMenuContainer:{
        flex: 1,
        flexDirection: 'row',
        height:0,
        alignItems:'center',
        marginTop: 10,
    },

    sectionInfoListText:{
        color:'white',
        textAlign:'center',
        fontSize:15,

    },

    rowContain: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: '#F6F6F6',
        borderBottomWidth: 1,
        borderBottomColor: '#e9e9e9',
        height:40,
        alignItems: 'center',
        flex: 1,

    },
    rowText: {
        flex: 1,
        padding:0,
        margin:0,
        textAlign : 'center'
    },

    sectionHeader: {

        backgroundColor: '#d4d4d4',
        height:20,

    },
    sectionHeaderText: {
        fontSize: 15,
        color: '#424242',
        marginLeft: 10
    },
    spinner: {
        position:'absolute',
        left: (SCREEN_WIDTH-SPINNER_SIZE)/2,
        top: (SCREEN_HEIGHT-SPINNER_SIZE)/2,
        flexDirection: 'row',
        alignItems: 'center',
    },
    sunInfo: {
        borderRadius: 20,
        width: 90,
        height: 30,
        borderWidth: 1,
        borderColor: '#FFF',
        alignItems: 'center',
        justifyContent: 'center',
        margin: 5
    },
    headerDistrictText: {
        color: 'white',
        fontSize: 30,
        paddingTop: 0
    },

});

module.exports = SurfWeatherList;