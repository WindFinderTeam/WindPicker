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
import ActionButton       from 'react-native-action-button';

var SurfParser = require('./SurfParser');

var offset = 0;           // before scroll position for Action Button
var rowKey = 0;           // Listview`s row keys
var bfcurrentOffset = 0;  // before scroll position for MenuBar
var API_URL;

var color = ['#240d7f','#230d89','#230f94','#1c0e99','#200ca3','#1d0ea7','#1b0ab2','#140dbd','#170cc2'
    ,'#130ccb','#0e0cd2','#100edd','#0c0de4','#0f18e3','#0d20de','#0c32d5','#0e40d5','#104bcd','#1257cc'
    ,'#0d65c6','#0f74bc','#1b7abe','#308ac6','#4a97cf','#5ba1d2','#70afd8','#84bae0','#95c2df','#add4e5'
    ,'#c3daec','#d4e9ee','#fdfdc9','#fdfab7','#fdf99e','#fbf48a','#fdf579','#fef363','#fff150','#feee36'
    ,'#feee25','#feeb12','#ffe60f','#fede11','#fed70e','#ffce10','#ffc710','#fec110','#ffb812','#fdb10d'
    ,'#fea90e','#fa9e0f','#fd8d0d','#f9800b','#f96b09','#f35805','#f34a05','#f33a04','#f12a01','#ee1b00'
    ,'#ed0b00','#eb0300'];

class SurfWeatherList extends Component {

    constructor(props) {
        super(props);

        API_URL = this.props.rowData.weatherURL; // 날씨URL 가져오기
        this.onScrollEnd = this.onScrollEnd.bind(this);
        this.onScrolling = this.onScrolling.bind(this);
        this.fetchData   = this.fetchData.bind(this);
        this.setSpinnerVisible   = this.setSpinnerVisible.bind(this);

        var getSectionData = (dataBlob, sectionID) => {
            return dataBlob[sectionID];
        };

        var getRowData = (dataBlob, sectionID, rowID) => {
            return dataBlob[sectionID + ':' + rowID];
        };

        this.state = {

            dataSource: new ListView.DataSource(
                {
                    getSectionData          : getSectionData,
                    getRowData              : getRowData,
                    rowHasChanged: (row1, row2) => row1 !== row2,
                    sectionHeaderHasChanged: (s1, s2) => s1 !== s2
                })
            ,topAlpha: 0
            ,borderAlpha:0
            ,sunrise:"00:00"
            ,sunset:"00:00"
            ,updateTime:"00:00"
            ,loadOK: false
            ,spinnerVisible: true
            ,menuOpacity: 0
        };
        this.fetchData();
    }

    fetchData() {
        fetch(API_URL).then((responseData) => {
                var {dataBlob,sectionIDs, rowIDs,sunInfo} = SurfParser.getSurfWeather(responseData);  //data parsing
                this.setState({
                    dataSource: this.state.dataSource.cloneWithRowsAndSections(dataBlob, sectionIDs, rowIDs),
                    sunrise:sunInfo[0],
                    sunset:sunInfo[1],
                    updateTime:sunInfo[2],
                    loadOK:true
                });
                this.setSpinnerVisible(false);
            })
            .catch((error) => {
                console.warn(error);
            });
    }

    // set the Floating Circle-Button Color
    setRgba() {
        var myAlpha = this.state.topAlpha;
        return `"rgba(156,0,16,` + `${myAlpha})"`;
    }

    setBorderRgba(){
        var myAlpha = this.state.borderAlpha;
        return `"rgba(255,255,255,` + `${myAlpha})"`;
    }


    // Draw List's Headers
    sectionHeader(rowData, sectionID) {

        return (
            <View style={styles.sectionHeader}>
                <Text style={styles.sectionHeaderText}>{sectionID}</Text>
            </View>
        )
    }

    // Draw List's Rows
    renderRow(rowData, sectionID, rowID) {

        rowKey++;
        var windDir = rowData.winddirection + 136;
        windDir = windDir + " deg";

        var waveDir = rowData.wavedirection + 136;
        waveDir = waveDir + " deg";

        var temperature =  Math.round(rowData.temperature);
        var tempColor = color[temperature+20];

        var cloud = rowData.cloud, rainprecipation = rowData.rainprecipation, time = rowData.time;
        var weatherIcon, precipitationIcon;

        switch (time) {
            case '00'  :
            case '03'  :
            case '06'  :
            case '21'  :
                if(cloud >= 0 && cloud <= 10){
                    weatherIcon = (<Image source={require('./image/weatherIcon/clear_night.png')} style={{width:22, height:22}}/>);
                } else if(cloud >= 11 && cloud <= 25){
                    weatherIcon = (<Image source={require('./image/weatherIcon/overcast.png')} style={{width:22, height:22}}/>);
                } else if(cloud >= 26 && cloud <= 50) {
                    weatherIcon = (<Image source={require('./image/weatherIcon/overcast.png')} style={{width:22, height:22}}/>);
                } else if(cloud >= 51 && cloud <= 87){
                    weatherIcon = (<Image source={require('./image/weatherIcon/overcast.png')} style={{width:22, height:22}}/>);
                } else if((cloud >= 88 && cloud <= 100)){
                    weatherIcon = (<Image source={require('./image/weatherIcon/overcast.png')} style={{width:22, height:22}}/>);
                } else {
                    weatherIcon = (<Text></Text>);
                }

                if(rainprecipation == ""){
                    precipitationIcon = (<Text></Text>);
                } else if(rainprecipation >= 0 && rainprecipation <= 1){
                    precipitationIcon = (<Image source={require('./image/weatherIcon/rain.png')} style={{width:22, height:22}}/>);
                } else if(rainprecipation >= 2 && rainprecipation <= 3){
                    precipitationIcon = (<Image source={require('./image/weatherIcon/rain.png')} style={{width:22, height:22}}/>);
                } else if(rainprecipation >= 4){
                    precipitationIcon = (<Image source={require('./image/weatherIcon/rain.png')} style={{width:22, height:22}}/>);
                }

                break;

            case '09'  :
            case '12'  :
            case '15'  :
            case '18'  :
                if(cloud >= 0 && cloud <= 10){
                    weatherIcon = (<Image source={require('./image/weatherIcon/sunny.png')} style={{width:22, height:22}}/>);
                } else if(cloud >= 11 && cloud <= 25){
                    weatherIcon = (<Image source={require('./image/weatherIcon/sunny.png')} style={{width:22, height:22}}/>);
                } else if(cloud >= 26 && cloud <= 50) {
                    weatherIcon = (<Image source={require('./image/weatherIcon/sunny.png')} style={{width:22, height:22}}/>);
                } else if(cloud >= 51 && cloud <= 87){
                    weatherIcon = (<Image source={require('./image/weatherIcon/sunny.png')} style={{width:22, height:22}}/>);
                } else if((cloud >= 88 && cloud <= 100)){
                    weatherIcon = (<Image source={require('./image/weatherIcon/sunny.png')} style={{width:22, height:22}}/>);
                } else {
                    weatherIcon = (<Text></Text>);
                }

                if(rainprecipation == ""){
                    precipitationIcon = (<Text></Text>);
                } else if(rainprecipation >= 0 && rainprecipation <= 1){
                    precipitationIcon = (<Image source={require('./image/weatherIcon/rain.png')} style={{width:22, height:22}}/>);
                } else if(rainprecipation >= 2 && rainprecipation <= 3){
                    precipitationIcon = (<Image source={require('./image/weatherIcon/rain.png')} style={{width:22, height:22}}/>);
                } else if(rainprecipation >= 4){
                    precipitationIcon = (<Image source={require('./image/weatherIcon/rain.png')} style={{width:22, height:22}}/>);
                }

                break;

            default    :
                weatherIcon = (<Text></Text>);
                precipitationIcon = (<Text></Text>);

                break;
        };

        return (
            <View key={rowKey}  style={[styles.row, {backgroundColor:rowData.time=='00'||rowData.time=='03'||rowData.time=='06'||rowData.time=='21'?'#F9F9F9':'#FFFFFF'}]}>
                {/* 시간 */}
                <View style={[styles.normalMenus, {flexDirection:'column'}]}>
                    <View>
                        <Text style={styles.rowListText}>{rowData.time}</Text>
                    </View>
                    <View>
                        <Text style={[styles.rowListText, {fontSize:10}]}>{rowData.ampm}</Text>
                    </View>
                </View>
                {/* 날씨 */}
                <View style={[styles.normalMenus, {flexDirection:'column'}]}>
                    <View>
                        {weatherIcon}

                    </View>
                    <View>
                        {precipitationIcon}
                    </View>
                </View>
                {/* 기온 */}
                <View style={[styles.normalMenus, {flexDirection:'column'}]}>
                    <View style={{justifyContent:'center',alignItems: 'center',flexDirection: 'row',borderRadius:5,backgroundColor:tempColor}}>
                        <Text style={styles.rowListText}>{rowData.temperature} ℃</Text>
                    </View>
                    <View>
                        <Text style={[styles.rowListText, {fontSize:10}]}>{rowData.pressure} hPa</Text>
                    </View>
                </View>
                {/* 바람 */}
                <View>
                    <Ionicons name="ios-send" style={{
                        fontSize:20,
                        color: '#9c0010',
                        marginLeft:3,
                        paddingTop:0,
                        transform:[{rotate: windDir}],
                    }}/>
                </View>
                <View style={[styles.normalMenus, {flexDirection:'column'}]}>
                    <View>
                        <Text style={styles.rowListText}>{rowData.wind} kts</Text>
                    </View>
                    <View>
                        <Text style={[styles.rowListText, {fontSize:10}]}>max {rowData.gust}</Text>
                    </View>
                </View>
                {/* 파도 */}
                <View>
                    <Ionicons name="ios-send-outline" style={{
                        fontSize:20,
                        color: '#9c0010',
                        marginLeft:3,
                        paddingTop:0,
                        transform:[{rotate: waveDir}],
                    }}/>
                </View>

                <View style={[styles.normalMenus, {flexDirection:'column'}]}>
                    <View>
                        <Text style={styles.rowListText}>{rowData.waveheight}m</Text>
                    </View>
                    <View>
                        <Text style={[styles.rowListText, {fontSize:11}]}>{rowData.wavefrequency}s</Text>
                    </View>
                </View>
                {/* 조수 */}
                <View style={[styles.normalMenus, {flexDirection:'column'}]}>

                    <View>
                        <Text style={{fontSize:11}}>그림</Text>
                    </View>
                    <View>
                        <Text style={[styles.rowListText, {fontSize:11}]}>{rowData.tideheight}m {rowData.tidefreq}</Text>
                    </View>
                </View>
                {/* 높이판정 */}
                <View style={styles.normalMenus}>
                    <Text style={styles.rowListText}>{rowData.rainprecipation}</Text>
                </View>
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
                    topAlpha: 0,
                });
                break;
            case 'up' :
                this.setState({
                    topAlpha: 0.8,
                });
                break;
        };
    }

    onScrolling(event) {

        var currentOffset = event.nativeEvent.contentOffset.y;
        var direction = currentOffset > bfcurrentOffset ? 'down' : 'up';
        var addOpacityNum ;

        bfcurrentOffset = currentOffset;

        if (currentOffset <= 0) this.setState({menuOpacity : 0, borderAlpha:0});
        else if (currentOffset >= 125) {

            if(this.state.menuOpacity > 1) addOpacityNum =0 ;
            else addOpacityNum=0.2;

            this.setState({
                menuOpacity: this.state.menuOpacity + addOpacityNum
                , borderAlpha: 0.3
            });

        }
        else{
            if (direction == 'down') this.setState({menuOpacity: this.state.menuOpacity + 0.025});
            else this.setState({menuOpacity: this.state.menuOpacity - 0.025
                , borderAlpha:0
            });
        }
    }

    setSpinnerVisible(visible){
        this.setState({
            spinnerVisible : visible
        });
    }

    render() {
        return (
            <View  style={{width: SCREEN_WIDTH, height: SCREEN_HEIGHT}}>

                {/* ------------------------------- Navigator Background ------------------------------------*/}
                <View style={{ position:'absolute', top:0,left:0,zIndex:1000, borderBottomWidth:1.5, borderColor:this.setBorderRgba()}}>
                    <Image
                        source={{uri: 'http://kingofwallpapers.com/blur-image/blur-image-011.jpg'}}
                        style={{width: SCREEN_WIDTH, height: NAVI_HEIGHT+MENU_HEIGHT,
                            opacity:this.state.menuOpacity
                        }}/>
                </View>
                {/* ------------------------------- Navigator ------------------------------------*/}
                <View style={styles.navigator}>
                    <View style={{ marginLeft:10}}>
                        <TouchableOpacity onPress={()=>this.props.modalVisible(false)}>
                            <View style={{width:40}}>
                                <Ionicons name="ios-arrow-back" size={30} color="#94000F"/>
                            </View>
                        </TouchableOpacity>
                    </View>
                    <View style={{flex:2}}>
                        <Text style={{color: "white", fontSize: 20, textAlign:'center', opacity:this.state.menuOpacity}}>{this.props.rowData.district}</Text>

                    </View>
                    <View style={styles.heartView}>
                        <TouchableOpacity>
                            <Ionicons name="md-heart" size={30} color="#94000F"/>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* ------------------------------- Navigator MENU ------------------------------------*/}
                <View style={{
                    position:'absolute',
                    top:NAVI_HEIGHT,
                    flexDirection:'row',
                    zIndex:1000,
                    width:SCREEN_WIDTH,
                    height:MENU_HEIGHT,
                    //backgroundColor:'#9c0010',
                    opacity:this.state.menuOpacity}}
                >
                    <View style={styles.normalMenus}>
                        <Text style={styles.sectionInfoListText}>시간</Text>
                    </View>
                    <View style={styles.normalMenus}>
                        <Text style={styles.sectionInfoListText}>날씨</Text>
                    </View>
                    <View style={styles.normalMenus}>
                        <Text style={styles.sectionInfoListText}>기온</Text>
                    </View>
                    <View style={styles.normalMenus}>
                        <Text style={styles.sectionInfoListText}>바람</Text>
                    </View>
                    <View style={styles.normalMenus}>
                        <Text style={styles.sectionInfoListText}>파도</Text>
                    </View>
                    <View style={styles.normalMenus}>
                        <Text style={styles.sectionInfoListText}>조수</Text>
                    </View>
                    <View style={styles.normalMenus}>
                        <Text style={styles.sectionInfoListText}>높이판정</Text>
                    </View>
                </View>


                <ScrollView
                    ref="ScrollView"
                    onScroll={this.onScrolling}
                    scrollEnabled={this.state.loadOK}
                    onScrollEndDrag={this.onScrollEnd}
                    onMomentumScrollEnd={this.onScrollEnd}
                    style={{flex: 1}}>

                    <Image
                        source={{uri: 'http://kingofwallpapers.com/blur-image/blur-image-011.jpg'}}
                        style={{width: SCREEN_WIDTH, height: PARALLAX_HEADER_HEIGHT}}>

                        <View style={{flex:1,flexDirection:'column'}}>


                            {/*----------------------------------- Main Board-----------------------------------*/}
                            <View style={{
                                flex:1,
                                marginTop: 50,
                                width:SCREEN_WIDTH,
                                justifyContent:'center',
                                alignItems:'center',

                            }

                            }>

                                {/* ------------------------------- Navigator ------------------------------------*/}



                                <Text style={{color:'#FFF'}}>업데이트 {this.state.updateTime}</Text>
                                <Text style={ styles.headerDistrictText }>
                                    {this.props.rowData.district}
                                </Text>
                                <View style={{flexDirection:'row',flex:1,marginTop:5}}>
                                    <View style={styles.sunInfo}>
                                        <Text style={{color:'#FFF',textAlign:'center'}}>일출 {this.state.sunrise}</Text>
                                    </View>
                                    <View style={styles.sunInfo}>
                                        <Text style={{color:'#FFF',textAlign:'center'}}>일몰 {this.state.sunset}</Text>
                                    </View>
                                </View>

                            </View>

                            {/*-------------------------- BOTTOM MENU ---------------------------------*/}
                            <View style={{
                                flexDirection:'row',
                                width:SCREEN_WIDTH,
                                height:MENU_HEIGHT,
                            }}
                            >
                                <View style={styles.normalMenus}>
                                    <Text style={styles.sectionInfoListText}>시간</Text>
                                </View>
                                <View style={styles.normalMenus}>
                                    <Text style={styles.sectionInfoListText}>날씨</Text>
                                </View>
                                <View style={styles.normalMenus}>
                                    <Text style={styles.sectionInfoListText}>기온</Text>
                                </View>
                                <View style={styles.normalMenus}>
                                    <Text style={styles.sectionInfoListText}>바람</Text>
                                </View>
                                <View style={styles.normalMenus}>
                                    <Text style={styles.sectionInfoListText}>파도</Text>
                                </View>
                                <View style={styles.normalMenus}>
                                    <Text style={styles.sectionInfoListText}>조수</Text>
                                </View>
                                <View style={styles.normalMenus}>
                                    <Text style={styles.sectionInfoListText}>높이판정</Text>
                                </View>
                            </View>
                        </View>

                    </Image>


                    <ListView
                        style={styles.container}
                        initialListSize={10}
                        pageSize={10}
                        automaticallyAdjustContentInsets={false}
                        dataSource={this.state.dataSource}
                        renderSectionHeader={this.sectionHeader}
                        renderRow={this.renderRow}
                    />

                </ScrollView>


                <ActionButton
                    buttonColor={this.setRgba()}
                    type={'tab'}
                    position={'right'}
                    offsetY={35}
                    onPress={() => this.refs.ScrollView.scrollTo({x: 0, y: 0})}
                    icon={<Ionicons name="md-arrow-round-up" style={{
                        fontSize: 20,
                        height: 22,
                        color: 'white',
                        opacity: this.state.topAlpha
                    }}/>}
                />
                <Spinner
                    style={styles.spinner} isVisible={this.state.spinnerVisible} size={SPINNER_SIZE} type={"Bounce"}
                    color={"#94000F"}
                />

            </View>
        );
    }

}
const PARALLAX_HEADER_HEIGHT = 200;
const SPINNER_SIZE = 80;

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;
const NAVI_HEIGHT = 60;
const MENU_HEIGHT = 30;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white'
    },

    foreGroundMenuContainer: {

        position:'absolute',
        top:NAVI_HEIGHT,
        flexDirection:'row',
        zIndex:1000,
        width:SCREEN_WIDTH,
        height:MENU_HEIGHT,
        backgroundColor:'#9c0010'

    },

    normalMenus:{
        flex:1,
        justifyContent:'center',
        alignItems: 'center',
        flexDirection: 'row',
    },

    sectionInfoListText: {
        color: 'white',
        textAlign: 'center',
        fontSize: 15,
    },

    rowListText:{
        color: 'black',
        textAlign: 'center',
        fontSize: 13,
    },
    heartView:{
        borderRadius:100,
        width:40,height:40,
        borderWidth: 1,
        marginRight:10,
        borderColor: '#FFF',
        alignItems: 'center',
        justifyContent:'center'},
    headerBackground: {
        width: window.width,
        height: PARALLAX_HEADER_HEIGHT,
        backgroundColor: 'rgb(244, 201, 107)'
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

    background: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: window.width,
        height: PARALLAX_HEADER_HEIGHT
    },
    headerProvinceText: {
        color: 'white',
        fontSize: 18,
    },
    headerDistrictText: {
        color: 'white',
        fontSize: 30,
        paddingTop: 0
    },


    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingLeft: 0,
        backgroundColor: '#F6F6F6',
        borderBottomWidth: 1,
        borderBottomColor: '#e9e9e9',
        height: 40,
        alignItems: 'center',
    },

    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',

        height: 20,

    },
    sectionHeaderText: {
        fontSize: 13,
        color: '#424242',
        marginLeft: 5
    },
    spinner: {
        position: 'absolute',
        left: (SCREEN_WIDTH - SPINNER_SIZE) / 2,
        top: (SCREEN_HEIGHT - SPINNER_SIZE) / 2 + 60,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex:1000
    },
    navigator:{
        flex:1,
        flexDirection: 'row',
        justifyContent:'center',
        alignItems:'center',
        position: 'absolute',
        left: 0,
        top: 0,
        width:SCREEN_WIDTH,
        height:NAVI_HEIGHT ,
        zIndex:1000,
    },
});

module.exports = SurfWeatherList;