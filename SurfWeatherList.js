'use strict';

import  React, {Component} from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    ListView,
    TouchableHighlight,
    TouchableOpacity,
    ToastAndroid,
    Modal,
    Image,
    Dimensions,
    Animated,
    Platform,
} from 'react-native';

import Spinner                           from 'react-native-spinkit';
import Ionicons                          from 'react-native-vector-icons/Ionicons';
import ActionButton                      from 'react-native-action-button';
import LinearGradient                    from 'react-native-linear-gradient';
import Toast, {DURATION}                 from 'react-native-easy-toast';
import {realmInstance}                   from "./RealmHndler.js";
import WindSpeedChartModal               from './WindSpeedChartModal';
import { LazyloadListView, LazyloadView} from 'react-native-lazyload';

var pickerStyle    = require('./pickerStyle');
var WeatherImage   = require('./WeatherImage');
var SurfMenu       = require('./SurfMenu');
var DirectionImage = require('./DirectionImage');

const fetch = require('react-native-cancelable-fetch');

var rowKey = 0;           // Listview`s row keys
var API_URL;

var district;
var weatherBackImg = (require('./image/wlLoadingBg.jpg'));

var gTideDownImg, gTideUpImg, gTideHighImg, gTideLowImg;

var tideDirection = (<Text></Text>);
var gTideFlag = false;
var bestDirection;

const SCREEN_WIDTH = Dimensions.get('window').width;


const HEADER_MAX_HEIGHT = 200;
const HEADER_MIN_HEIGHT = 110;
const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;

const color = ['#240d7f', '#230d89', '#230f94', '#1c0e99', '#200ca3', '#1d0ea7', '#1b0ab2', '#140dbd', '#170cc2'
    , '#130ccb', '#0e0cd2', '#100edd', '#0c0de4', '#0f18e3', '#0d20de', '#0c32d5', '#0e40d5', '#104bcd', '#1257cc'
    , '#0d65c6', '#0f74bc', '#1b7abe', '#308ac6', '#4a97cf', '#5ba1d2', '#70afd8', '#84bae0', '#95c2df', '#add4e5'
    , '#c3daec', '#d4e9ee', '#fdfdc9', '#fdfab7', '#fdf99e', '#fbf48a', '#fdf579', '#fef363', '#fff150', '#feee36'
    , '#feee25', '#feeb12', '#ffe60f', '#fede11', '#fed70e', '#ffce10', '#ffc710', '#fec110', '#ffb812', '#fdb10d'
    , '#fea90e', '#fa9e0f', '#fd8d0d', '#f9800b', '#f96b09', '#f35805', '#f34a05', '#f33a04', '#f12a01', '#ee1b00'
    , '#ed0b00', '#eb0300'];

class SurfWeatherList extends Component {

    constructor(props) {
        super(props);

        API_URL       = this.props.rowData.weatherURL; // 날씨URL 가져오기
        bestDirection = this.props.rowData.direction.split(' ');

        this.renderRow         = this.renderRow.bind(this);
        this.fetchData         = this.fetchData.bind(this);
        this.startCountDown    = this.startCountDown.bind(this);
        this.setSpinnerVisible = this.setSpinnerVisible.bind(this);
        this.controlFavorite   = this.controlFavorite.bind(this);
        this.setHeartOnOff     = this.setHeartOnOff.bind(this);
        this.setWindModalVib   = this.setWindModalVib.bind(this);

        var getSectionData     = (dataBlob, sectionID)        => {  return dataBlob[sectionID];                 };
        var getRowData         = (dataBlob, sectionID, rowID) => {   return dataBlob[sectionID + ':' + rowID];  };

        district = this.props.rowData.district;

        this.state = {
            dataSource: new ListView.DataSource(
                {
                    getSectionData          : getSectionData,
                    getRowData              : getRowData,
                    rowHasChanged           : (row1, row2) => row1 !== row2,
                    sectionHeaderHasChanged : (s1, s2) => s1 !== s2
                })
            , topAlpha      : 0
            , borderAlpha   : 0
            , menuOpacity   : 0
            , sunrise       : "00:00"
            , sunset        : "00:00"
            , updateTime    : "00:00"
            , spinnerVisible: true
            , loadOK        : false
            , networkState  : true
            , tideYN        : "N"
            , heartOnOff    : false
            , windModalVib  : false
            , windSpeedData : 0
            , scrollY       : new Animated.Value(0)
        };
    }

    componentWillMount()  {   this.readRealm();    }
    componentDidMount()   {   this.fetchData();    }


    startCountDown() {
        this.setState({  spinnerVisible: false,  networkState: false  });
        fetch.abort(this);
    }

    readRealm() {

        realmInstance.write(() => {

            let theme            = "FavoriteSurfing", var_index = this.props.rowData.index;
            let specificFavorite = realmInstance.objects(theme).filtered('index = ' + '"' + var_index + '"');

            if (Object.keys(specificFavorite) == "") {  }
            else {    this.setHeartOnOff();       }
        });
    }

    fetchData() {

        weatherBackImg    = WeatherImage.getBackgroundImage();
        var setTimeoudtID = setTimeout(this.startCountDown, 7000);

        fetch('https://windpicker-maestrolsj.c9users.io?url=' + API_URL
            ,{
                method: 'GET',
                headers: { 'Accept': 'application/json', 'Content-Type': 'application/json'   }
             }
            , this).then((responseData) => {

            var jsonData   = JSON.parse(responseData._bodyInit);
            var dataBlob   = jsonData.dataBlob;  //data parsing
            var sectionIDs = jsonData.sectionIDs;
            var rowIDs     = jsonData.rowIDs;
            var sunInfo    = jsonData.sunInfo;
            var tideYN     = jsonData.tideYN;

            tideDirection = (<Text></Text>);

            if (tideYN == "Y") {
                var {tideDownImg, tideUpImg, tideHighImg, tideLowImg} = WeatherImage.getTideImage();
                gTideFlag    = true;
                gTideDownImg = tideDownImg;
                gTideUpImg   = tideUpImg;
                gTideHighImg = tideHighImg;
                gTideLowImg  = tideLowImg;
            } else gTideFlag = false;

            this.setState({
                dataSource   : this.state.dataSource.cloneWithRowsAndSections(dataBlob, sectionIDs, rowIDs),
                sunrise      : sunInfo[0],
                sunset       : sunInfo[1],
                updateTime   : sunInfo[2],
                networkState : true,
                tideYN       : tideYN,
                loadOK       : true
            });

            this.setSpinnerVisible(false);
            clearTimeout(setTimeoudtID);

        })
            .catch((error) => { // if network state is unstable
                console.warn(error);
                clearTimeout(setTimeoudtID);
                this.setState({  spinnerVisible: false,   networkState: false    });
            });
    }

    // set the Floating Circle-Button Color
    setRgba() {
        var myAlpha = this.state.topAlpha;
        return `"rgba(156,0,16,` + `${myAlpha})"`;
    }

    setHeartOnOff() {
        if (this.state.heartOnOff == true) this.setState({heartOnOff: false});
        else                               this.setState({heartOnOff: true});
    }

    controlFavorite() {

        realmInstance.write(() => {

            /* --------before display  Favorite Lists---------- */
            let theme = "FavoriteSurfing", var_index = this.props.rowData.index;

            let specificFavorite = realmInstance.objects(theme).filtered('index = ' + '"' + var_index + '"');

            if (Object.keys(specificFavorite) == "") {

                realmInstance.create('FavoriteSurfing', {
                    index  : var_index,
                    name   : this.props.rowData.district,
                    webcam : this.props.rowData.webcam,
                    shop   : this.props.rowData.shop
                });

            } else   realmInstance.delete(specificFavorite); // Deletes all books

        });
    }

    // Draw List's Headers
    sectionHeader(rowData, sectionID) {

        var sectionHeader;

        if (sectionID == '9y9m9d') sectionHeader = (
            <LazyloadView host="listExample">
                <View style={{backgroundColor: 'transparent', height: HEADER_SCROLL_DISTANCE}}>
                </View>
            </LazyloadView>
        );
        else sectionHeader = (<View style={pickerStyle.headerViewStyle}>
            <LazyloadView host="listExample">
                <View style={pickerStyle.sectionHeader}>
                    <Text style={pickerStyle.sectionHeaderText}>{sectionID}</Text>
                </View>
            </LazyloadView>
        </View>);

        return sectionHeader;

    }

    // Draw List's Rows
    renderRow(rowData, sectionID) {

        if (sectionID == '9y9m9d')    return null;

        rowKey++;
        var precipitation = rowData.rainPrecipitation, time = rowData.time;

        if (!gTideFlag) ;
        else {
            switch (rowData.tidedirections) {
                case 'down' :   tideDirection = gTideDownImg;     break;
                case 'up'   :   tideDirection = gTideUpImg;       break;
                case 'high' :   tideDirection = gTideHighImg;     break;
                case 'low'  :   tideDirection = gTideLowImg;      break;
            }
        }

        var {weatherImg, precipitationImg} = WeatherImage.getWatherImage(time, rowData.cloud, precipitation, rowData.snowrain);

        if (precipitation == "" || precipitation == null) precipitation = '0';

        var windArrowSrc  = DirectionImage.getWindDirectionImage(parseInt(rowData.winddirection));
        var swellArrowSrc = DirectionImage.getSwellDirectionImage(parseInt(rowData.wavedirection));

        var windSpeedWidth    = (SCREEN_WIDTH * rowData.wind) / 60;
        var windMaxSpeedWidth = ((SCREEN_WIDTH * rowData.gust) / 60 ) - windSpeedWidth;


        return (
            <View style={pickerStyle.rowViewStyle}>
                <LazyloadView host="listExample">

                    <View key={rowKey} style={pickerStyle.row}>

                        {/* 시간 */}
                        <View style={pickerStyle.menusView}><Text style={pickerStyle.rowListText}>{rowData.time}시</Text></View>

                        {/* 날씨 */}
                        <View style={[pickerStyle.menusView, {flexDirection: 'column'}]}>
                            {weatherImg}
                            {precipitationImg}
                        </View>
                        {/* 기온 */}
                        <View style={pickerStyle.menusView}>
                            <View  style={[pickerStyle.rowTemperatureView, {backgroundColor: color[parseInt(rowData.temperature) + 20]}]}>
                                <Text style={[pickerStyle.rowListText, {color: (Math.round(rowData.temperature) >= 10 && Math.round(rowData.temperature) <= 20 ) ? 'black' : 'white'}]}>{rowData.temperature}℃</Text>
                            </View>
                        </View>

                        {/* 강수량 */}
                        <View style={pickerStyle.menusView}>
                            <Text style={pickerStyle.rowListText}>{precipitation}</Text>
                            <Text style={[pickerStyle.rowListText, {fontSize: 10}]}> mm</Text>
                        </View>

                        {/* 바람 */}
                        <TouchableOpacity onPress={() => { this.setState({windModalVib: true, windSpeedData: rowData.wind}) }}  >
                            <View style={[pickerStyle.menusView, rowData.tidedirections == "" ? {flex: 1.5} : {}]}>
                                {windArrowSrc}
                                <View style={{flexDirection: 'column'}}>
                                    <Text style={pickerStyle.rowListText}>{rowData.wind} m/s</Text>
                                    <Text style={[pickerStyle.rowListText, {fontSize: 10}]}>돌풍 {rowData.gust}</Text>
                                </View>
                            </View>
                        </TouchableOpacity>

                        {/* 파도 */}
                        <View style={[pickerStyle.menusView, {flex: 1.5}]}>
                            {swellArrowSrc}
                            <View style={{flexDirection: 'column', marginLeft: 1}}>
                                <Text style={pickerStyle.rowListText}>{rowData.waveheight} m</Text>
                                <Text style={[pickerStyle.rowListText, {fontSize: 11}]}>{rowData.wavefrequency}초간격</Text>
                            </View>
                        </View>

                        {/* 조수 */}
                        <View style={rowData.tidedirections == "" ? {width: 0, height: 0} : [{ flexDirection: 'column', height: 50 }, pickerStyle.menusView]}>
                            <View style={{flex: 1, flexDirection: 'column'}}>
                                <View style={{flexDirection: 'row', justifyContent: 'center'}}>{tideDirection}</View>
                                <Text style={[pickerStyle.rowListText, {fontSize: 11}]}>{rowData.tideheight}m {rowData.tidefreq}</Text>
                            </View>
                        </View>

                    </View>
                </LazyloadView>

                <LazyloadView host="listExample">
                    <View style={{width: SCREEN_WIDTH, height: 4, flexDirection: 'row'}}>
                        <LinearGradient
                            start={{x: 0.0, y: 1.0}} end={{x: 1.0, y: 1.0}}
                            locations={[0, 0.5, 1.0]}
                            colors={['#90E4FF', '#B4FFFF', '#FFFFFF']}
                            style={{width: windSpeedWidth}}/>

                        <LinearGradient
                            start={{x: 0.0, y: 1.0}} end={{x: 1.0, y: 1.0}}
                            locations={[0, 0.5, 1.0]}
                            colors={['#FF9090', '#FFB4B4', '#FFFFFF']}
                            style={{width: windMaxSpeedWidth}}/>
                    </View>
                </LazyloadView>
            </View>
        );
    }


    refreshListView() {

        this.setState({  spinnerVisible: true,   networkState: true   });
        this.fetchData();
    }

    setWindModalVib(visible)   {  return this.setState({windModalVib: visible});   }
    setSpinnerVisible(visible) {  this.setState({spinnerVisible: visible});  }

    render() {

        var headerHeight = this.state.scrollY.interpolate({
            inputRange: [0, HEADER_SCROLL_DISTANCE],
            outputRange: [HEADER_MAX_HEIGHT, HEADER_MIN_HEIGHT],
            extrapolate: 'clamp',
        });

        var imageOpacity = this.state.scrollY.interpolate({
            inputRange: [0, HEADER_SCROLL_DISTANCE / 2, HEADER_SCROLL_DISTANCE],
            outputRange: [1, 1, 0],
            extrapolate: 'clamp',
        });

        var menuImageOpacity = this.state.scrollY.interpolate({
            inputRange: [0, HEADER_SCROLL_DISTANCE / 2, HEADER_SCROLL_DISTANCE],
            outputRange: [0, 0, 1],
            extrapolate: 'clamp',
        });

        var menuOpacity = this.state.scrollY.interpolate({
            inputRange: [0, HEADER_SCROLL_DISTANCE / 1.2, HEADER_SCROLL_DISTANCE],
            outputRange: [0, 0, 1],
            extrapolate: 'clamp',
        });

        var imageTranslate = this.state.scrollY.interpolate({
            inputRange: [0, HEADER_SCROLL_DISTANCE],
            outputRange: [0, -50],
            extrapolate: 'clamp',
        });

        var myView;

        if (this.state.networkState == true) {
            myView = (
                <LazyloadListView
                    style                     = {{top: HEADER_MIN_HEIGHT, flex: 1}}
                    scrollEventThrottle       = {10}
                    onScroll                  = {Animated.event([{nativeEvent: {contentOffset: {y: this.state.scrollY}}}]  )}
                    name                      = "listExample"
                    ref                       = "ScrollView"
                    dataSource                = {this.state.dataSource}
                    renderSectionHeader       = {this.sectionHeader.bind(this)}
                    renderRow                 = {this.renderRow}
                    scrollRenderAheadDistance = {200}
                    renderDistance            = {200}
                    pageSize                  = {1}
                    initialListSize           = {8}
                    scrollsToTop              = {true}
                    // dont need to declare, only for warning fixing (below)
                    stickyHeaderIndices       = {[0]}
                    onEndReachedThreshold     = {1000}
                    renderScrollComponent     = { _ => {}}
                    scrollEnabled             = {this.state.loadOK}
                />
            );
        }
        else { // OFFLINE VIEW
            myView = ( <View style={pickerStyle.offlineView}>
                <TouchableOpacity onPress={() => this.refreshListView()}>
                    <Ionicons name="md-refresh-circle"  style={styles.refreshView}    />
                </TouchableOpacity>
                <Text>네트워크 상태를 확인하세요</Text>
            </View>);
        }

        return (

            <View style={{flex: 1, backgroundColor: 'white'}}>
                <Animated.View style={[styles.header, {height: headerHeight}]}>
                    <Animated.Image
                        source={weatherBackImg}
                        style={[ styles.backgroundImage, {opacity: imageOpacity, transform: [{translateY: imageTranslate}]}  ]}>

                        <View style={{flex: 1, flexDirection: 'column'}}>
                            {/*----------------------------------- Main Board-----------------------------------*/}
                            <View style={styles.mainboardView}>
                                {/*-------------------------- 1.update ------------------------------*/}
                                <Text style={{ backgroundColor: 'transparent',  color: '#FFF'  }}>업데이트 {this.state.updateTime}</Text>
                                <Text style={ pickerStyle.headerDistrictText }>{district}</Text>
                                {/*-------------------------- 2.ideal direction ------------------------------*/}
                                <View style={pickerStyle.directionMarginTop}>
                                    <Text style={{color: '#FFF'}}>최적방향 </Text>
                                    <View style={pickerStyle.bestDirection}>
                                        {DirectionImage.getWindDirectionImage(parseInt(bestDirection[0]))}
                                        {DirectionImage.getSwellDirectionImage(parseInt(bestDirection[1]))}
                                    </View>
                                </View>

                                {/*-------------------------- 3.sun info ------------------------------*/}
                                <View style={{flexDirection: 'row', marginTop: 2}}>
                                    <View style={pickerStyle.sunInfo }>
                                        <Text style={{color: '#FFF', textAlign: 'center'}}>일출 {this.state.sunrise}</Text>
                                    </View>
                                    <View style={pickerStyle.sunInfo }>
                                        <Text style={{color: '#FFF', textAlign: 'center'}}>일몰 {this.state.sunset}</Text>
                                    </View>
                                </View>

                            </View>
                            {/*-------------------------- 4.menu -------------------------------------*/}
                            <View style={{backgroundColor: 'transparent', width: SCREEN_WIDTH}}>
                                <SurfMenu tideYN={this.state.tideYN}/>
                            </View>
                        </View>
                    </Animated.Image>
                    {/*-------------------------- NAVIGATOR -------------------------------------*/}
                    <Animated.Image
                        source={weatherBackImg}
                        style={[ styles.backgroundImage, {opacity: menuImageOpacity, transform: [{translateY: imageTranslate}]}   ]}>
                        <Animated.View style={{
                            backgroundColor:'transparent',
                            height:160,
                            opacity: menuOpacity,
                            width: SCREEN_WIDTH
                        }}>
                            {/*-------------------------- 1.district -------------------------------------*/}
                            <View style={{top: 80}}><Text style={pickerStyle.districtText}>{this.props.rowData.district}</Text></View>

                            {/*-------------------------- 2.ideal direction ------------------------------*/}
                            <View style={[pickerStyle.directionMarginBottom, {top: 88, backgroundColor: 'transparent'}]}>

                                <Text style={{color: '#FFF'}}>최적방향 </Text>
                                <View style={pickerStyle.bestDirection}>
                                    {DirectionImage.getWindDirectionImage(parseInt(bestDirection[0]))}
                                    {DirectionImage.getSwellDirectionImage(parseInt(bestDirection[1]))}
                                </View>
                            </View>

                            {/*-------------------------- 3.menu -------------------------------------*/}
                            <View style={{top: Platform.OS == 'ios'? 80:73,backgroundColor: 'transparent',}}>
                                <SurfMenu tideYN={this.state.tideYN}/>
                            </View>
                        </Animated.View>
                    </Animated.Image>
                </Animated.View>
                {myView}

                {/* ------------------------------- Chart Modal ----------------------------------*/}
                <WindSpeedChartModal windModalVib    = {this.state.windModalVib}
                                     setWindModalVib = {this.setWindModalVib}
                                     windSpeedData   = {this.state.windSpeedData}/>
                {/* ------------------------- Scroll up to top button -----------------------------*/}
                <ActionButton
                    buttonColor = {this.setRgba()}
                    type        = {'tab'}
                    position    = {'right'}
                    offsetY     = {35}
                    onPress     = {() => this.refs.ScrollView.scrollTo({x: 0, y: 0})}
                    icon        = {<Ionicons name="md-arrow-round-up" style={{ fontSize: 20, height: 22,  color: 'white', opacity: this.state.topAlpha   }}/>}
                />
                {/* ------------------------------- Toast ----------------------------------*/}
                <Toast ref="toast"   style={{backgroundColor: '#222222'}}   position='bottom'/>
                {/* ------------------------------- favorite heart configure ---------------------*/}
                <View style={pickerStyle.navigator}>
                    <View style={{marginLeft: 10, backgroundColor: 'transparent'}}>
                        <TouchableOpacity onPress={() => this.props.modalVisible(false)}>
                            <Ionicons name="ios-arrow-back" size={40} color="white"/>
                        </TouchableOpacity>
                    </View>

                    <View style={pickerStyle.heartView}>
                        <TouchableOpacity onPress={() => {
                            this.controlFavorite();
                            this.setHeartOnOff();
                            this.refs.toast.show(this.state.heartOnOff == true ? '즐겨찾기를 지웁니다' : '즐겨찾기에 추가합니다', DURATION.LENGTH_LONG);
                        }}>
                            <Ionicons name="md-heart" size={30}   color={this.state.heartOnOff == true ? "#94000F" : "#C0C0C0"}/>
                        </TouchableOpacity>
                    </View>
                </View>
                {/* ------------------------------- Spinner ------------------------------------*/}
                <Spinner style={pickerStyle.spinner} isVisible={this.state.spinnerVisible} size={80}   type={"Bounce"}   color={"#94000F"}  />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    backgroundImage: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        width: null,
        height: HEADER_MAX_HEIGHT,
        resizeMode: 'cover',
    },


    header: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        backgroundColor: 'transparent',
        overflow: 'hidden',
    },

    mainboardView:{
        flex: 1,
        marginTop: 50,
        width: SCREEN_WIDTH,
        justifyContent: 'center',
        alignItems: 'center'
    },


    refreshView:{
        fontSize: 50,
        color: '#9c0010',
        marginBottom: 10,
        transform: [{rotate: '136 deg'}],
    }
});


module.exports = SurfWeatherList;