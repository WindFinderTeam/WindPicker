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
    Dimensions,
} from 'react-native';


//import MyGoogleMap  from 'react-native-maps-google';
import Spinner            from 'react-native-spinkit';
import Ionicons           from 'react-native-vector-icons/Ionicons';
import ActionButton       from 'react-native-action-button';
import { realmInstance }  from "./RealmHndler.js";
import LinearGradient     from 'react-native-linear-gradient';
import Toast, { DURATION } from 'react-native-easy-toast';

import {
    LazyloadListView,
    LazyloadView
} from 'react-native-lazyload';


var pickerStyle    = require('./pickerStyle');
var GlidingParser  = require('./GlidingParser');
var WeatherImage   = require('./WeatherImage');
var DirectionImage = require('./DirectionImage');
var GlidingMenu    = require('./GlidingMenu');
const fetch        = require('react-native-cancelable-fetch');


var offset = 0;           // before scroll position for Action Button
var rowKey = 0;           // Listview`s row keys
var bfcurrentOffset = 0;  // before scroll position for MenuBar

var mainBoard = true;
var API_URL;
var headerView;
var mainBoardView;
var weatherBackImg=(require('./image/wlLoadingBg.jpg'));
var district ;
var bestDirection ;

const color = ['#240d7f','#230d89','#230f94','#1c0e99','#200ca3','#1d0ea7','#1b0ab2','#140dbd','#170cc2'
    ,'#130ccb','#0e0cd2','#100edd','#0c0de4','#0f18e3','#0d20de','#0c32d5','#0e40d5','#104bcd','#1257cc'
    ,'#0d65c6','#0f74bc','#1b7abe','#308ac6','#4a97cf','#5ba1d2','#70afd8','#84bae0','#95c2df','#add4e5'
    ,'#c3daec','#d4e9ee','#fdfdc9','#fdfab7','#fdf99e','#fbf48a','#fdf579','#fef363','#fff150','#feee36'
    ,'#feee25','#feeb12','#ffe60f','#fede11','#fed70e','#ffce10','#ffc710','#fec110','#ffb812','#fdb10d'
    ,'#fea90e','#fa9e0f','#fd8d0d','#f9800b','#f96b09','#f35805','#f34a05','#f33a04','#f12a01','#ee1b00'
    ,'#ed0b00','#eb0300'];

class GlidingWeatherList extends Component {

    constructor(props) {
        super(props);

        API_URL                = this.props.rowData.weatherURL; // 날씨URL 가져오기
        bestDirection=  this.props.rowData.direction.split(' ');

        this.onScrollEnd       = this.onScrollEnd.bind(this);
        this.onScrolling       = this.onScrolling.bind(this);
        this.fetchData         = this.fetchData.bind(this);
        this.startCountDown    = this.startCountDown.bind(this);
        this.setSpinnerVisible = this.setSpinnerVisible.bind(this);
        this.setHeaderView     = this.setHeaderView.bind(this)    ;
        this.controlFavorite   = this.controlFavorite.bind(this)       ;
        this.setHeartOnOff     = this.setHeartOnOff.bind(this)         ;

        var getSectionData     = (dataBlob, sectionID)        => {return dataBlob[sectionID];              };
        var getRowData         = (dataBlob, sectionID, rowID) => {return dataBlob[sectionID + ':' + rowID];};

        district =  this.props.rowData.district;
        this.state = {

            dataSource: new ListView.DataSource(
                {
                    getSectionData          : getSectionData,
                    getRowData              : getRowData,
                    rowHasChanged           : (row1, row2) => row1 !== row2,
                    sectionHeaderHasChanged : (s1, s2)     => s1   !== s2
                })
            ,topAlpha      :0
            ,borderAlpha   :0
            ,menuOpacity   :0
            ,sunrise       :"00:00"
            ,sunset        :"00:00"
            ,updateTime    :"00:00"
            ,loadOK        :false
            ,spinnerVisible:true
            ,networkState  :true
            ,heartOnOff    :false
        };
    }


    componentWillMount() // before rendering
    {
        this.setHeaderView();
        this.readRealm()    ;
        mainBoard = true    ;
        fetch.abort(this)   ;
    }

    componentDidMount()
    {
        this.fetchData();
    }

    setHeaderView(){

        headerView =
            (
                <Image
                    source={weatherBackImg}
                    style={{width: SCREEN_WIDTH, height: PARALLAX_HEADER_HEIGHT}}>

                    <View style={{flex:1,flexDirection:'column'}}>
                        {/*----------------------------------- Main Board-----------------------------------*/}
                        <View style={{
                                flex:1,
                                marginTop: 50,
                                width:SCREEN_WIDTH,
                                justifyContent:'center',
                                alignItems:'center'}
                    }>

                            {/* ------------------------------- Navigator ------------------------------------*/}
                            <Text style={{color:'#FFF'}}>업데이트 {this.state.updateTime}</Text>
                            <Text style={ pickerStyle.headerDistrictText }>
                                {district}
                            </Text>
                            <View style={pickerStyle.directionMarginTop}>
                                <Text style={{color:'#FFF'}}>활공방향 </Text>
                                <View style={pickerStyle.bestDirection}>
                                {DirectionImage.getWindDirectionImage(parseInt(bestDirection[0]))}
                                {DirectionImage.getWindDirectionImage(parseInt(bestDirection[1]))}
                                {DirectionImage.getWindDirectionImage(parseInt(bestDirection[2]))}
                                {DirectionImage.getWindDirectionImage(parseInt(bestDirection[3]))}
                                </View>
                            </View>
                            <View style={{flexDirection:'row',marginTop:2}}>
                                <View style={pickerStyle.sunInfo }>
                                    <Text style={{color:'#FFF',textAlign:'center'}}>일출 {this.state.sunrise}</Text>
                                </View>
                                <View style={pickerStyle.sunInfo }>
                                    <Text style={{color:'#FFF',textAlign:'center'}}>일몰 {this.state.sunset}</Text>
                                </View>
                            </View>

                        </View>

                        {/*-------------------------- BOTTOM MENU ---------------------------------*/}
                        <View style={{width:SCREEN_WIDTH}}><GlidingMenu/></View>
                    </View>
                </Image>
            );
    }

    startCountDown(){

        console.log("#### TIMER OVER ####");
        this.setState({
            spinnerVisible:false,
            networkState  :false
        });
        fetch.abort(this);
    }

    controlFavorite(){

        realmInstance.write(() => {

            /* --------before display  Favorite Lists----------
            let AllFavorite_gliding = realmInstance.objects('FavoriteGliding');
            console.log(AllFavorite_gliding);
             --------before display  Favorite Lists---------- */

            let theme = "FavoriteGliding", var_index = this.props.rowData.index;

            let specificFavorite = realmInstance.objects(theme).filtered('index = ' + '"' + var_index + '"');

            //console.log(specificFavorite);

            if(Object.keys(specificFavorite) == ""){

                //not exists. need to insert
                //console.log("need to insert");
                realmInstance.create('FavoriteGliding', {
                    index  : var_index,
                    name   : this.props.rowData.district,
                    webcam : this.props.rowData.webcam,
                    shop   : this.props.rowData.shop
                });

            } else {

                //exists. need to delete
                //console.log("need to delete");
                realmInstance.delete(specificFavorite); // Deletes all books

            }

            /* --------after display  Favorite Lists----------
             let AllFavorite_gliding_after = realmInstance.objects('FavoriteGliding');
             console.log(AllFavorite_gliding_after);
             console.log("======================");
             console.log(Object.keys(AllFavorite_gliding_after).length);
             --------after display  Favorite Lists---------- */

        });
        // this.setState({heartOnOff: !this.state.heartOnOff});
    }

    setHeartOnOff(){

        if(this.state.heartOnOff == true)   this.setState({heartOnOff : false});
        else                                this.setState({heartOnOff : true});

    }

    readRealm() {
       // console.log("read result before ");

        realmInstance.write(() => {

            let mode = "FavoriteGliding", var_index = this.props.rowData.index;

            let specificFavorite = realmInstance.objects(mode).filtered('index = ' + '"' + var_index + '"');

           // console.log(specificFavorite);

            if(Object.keys(specificFavorite) == ""){
                //not exists.
            } else {
                //exists.
               // console.log("read. exists. index " + var_index);
                this.setHeartOnOff();
            }
        });
       // console.log("read result after ");
    }

    fetchData() {
        weatherBackImg    = WeatherImage.getBackgroundImage()    ;
        var setTimeoudtID = setTimeout(this.startCountDown, 7000);

        fetch(API_URL)
            .then((response)     => response.json())
            .then((responseJSON) => {
                var {dataBlob,sectionIDs, rowIDs,sunInfo} = GlidingParser.getGlidingWeather(responseJSON);  // Data Parsing

                this.setState({
                    dataSource  :this.state.dataSource.cloneWithRowsAndSections(dataBlob, sectionIDs, rowIDs),
                    sunrise     :sunInfo[0],
                    sunset      :sunInfo[1],
                    updateTime  :sunInfo[2],
                    loadOK      :true,
                    networkState:true
                });
                this.setSpinnerVisible(false);
                clearTimeout(setTimeoudtID);
            })
            .catch((error) => {
               // console.warn(error);
                clearTimeout(setTimeoudtID);
                this.setState({
                    spinnerVisible:false,
                    networkState  :false
                });
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

        if(mainBoard === true) {
            this.setHeaderView();
            mainBoard = false;
        }
        else headerView = (<View style={{width:0,height:0}}></View>);

        return(
            <View>
                {headerView}
                <View style={pickerStyle.headerViewStyle}>
                    <LazyloadView host="listExample">
                        <View style={pickerStyle.sectionHeader}>
                            <Text style={pickerStyle.sectionHeaderText}>{sectionID}</Text>
                        </View>
                    </LazyloadView>
                </View>
            </View>
        );
    }

    // Draw List's Rows
    renderRow(rowData, sectionID, rowID) {

        rowKey++;

        var windSpeedWidth    = (SCREEN_WIDTH * rowData.windSpeed) / 60 ;
        var windMaxSpeedWidth = ((SCREEN_WIDTH * rowData.windGust) / 60 ) - windSpeedWidth;

        var {weatherImg, precipitationImg} = WeatherImage.getWatherImage(rowData.time, rowData.cloud, rowData.rain, rowData.snowYn+"" );

        var windArrowSrc =  DirectionImage.getWindDirectionImage(rowData.windDir); //
        return (
            <View style={pickerStyle.rowViewStyle}>
                <LazyloadView host="listExample">
                    <View key={rowKey} style={pickerStyle.row}>
                        <View style={pickerStyle.menusView}>
                            <Text style={pickerStyle.rowListText}>{rowData.time}H</Text>
                        </View>

                        <View style={[pickerStyle.menusView, {flexDirection:'column'}]}>
                            {weatherImg}
                            {precipitationImg}
                        </View>
                        <View style={pickerStyle.menusView}>
                            <View style={[pickerStyle.rowTemperatureView,{ backgroundColor:color[parseInt(rowData.temperature)+20] }]}>
                                <Text style={[pickerStyle.rowListText,{color:(Math.round(rowData.temperature) >= 10 && Math.round(rowData.temperature) <= 20 ) ? 'black' : 'white'}]}>{rowData.temperature}℃</Text>
                            </View>
                        </View>
                        <View style={pickerStyle.menusView}>
                            <Text style={pickerStyle.rowListText}>{rowData.rain}</Text><Text style={[pickerStyle.rowListText, {fontSize:10}]}> mm</Text>
                        </View>
                        <View style={pickerStyle.menusView}>
                            <Text style={pickerStyle.rowListText}>{rowData.cloud}%</Text>
                        </View>
                        <View style={pickerStyle.menusView}>
                            {windArrowSrc}
                        </View>
                        <View style={{flex:1,justifyContent:'center',alignItems: 'center',flexDirection: 'column',}}>
                            <Text style={{color: 'black',textAlign: 'center',fontSize: 13,}}>{rowData.windSpeed+' kts'}</Text>
                            <Text style={{color: 'black',textAlign: 'center',fontSize: 10,}}>{'max '+rowData.windGust}</Text>
                        </View>
                    </View>

                    <View style={{width: SCREEN_WIDTH, height:4, flexDirection: 'row'}}>
                        <LinearGradient
                            start={[0.0, 1.0]} end={[1.0, 1.0]}
                            locations={[0,0.5,1.0]}
                            colors={['#90E4FF', '#B4FFFF', '#FFFFFF']}
                            style={{width: windSpeedWidth }}/>

                        <LinearGradient
                            start={[0.0, 1.0]} end={[1.0, 1.0]}
                            locations={[0,0.5,1.0]}
                            colors={['#FF9090', '#FFB4B4', '#FFFFFF']}
                            style={{width: windMaxSpeedWidth }}/>
                    </View>

                </LazyloadView>
            </View>
        );
    }

    onScrollEnd(event) {

        var currentOffset = event.nativeEvent.contentOffset.y;
        var direction = currentOffset > offset ? 'down' : 'up';
        offset = currentOffset;

        switch (direction) {
            case 'down'  : this.setState({topAlpha: 0,}); break;
            case 'up'    : this.setState({topAlpha: 0.8,}); break;
        };
    }

    onScrolling(event) {

        var currentOffset = event.nativeEvent.contentOffset.y;
        var direction     = currentOffset > bfcurrentOffset ? 'down' : 'up';

        bfcurrentOffset = currentOffset;

        if (currentOffset <= 0) this.setState({menuOpacity : 0, borderAlpha:0});
        else if (currentOffset >= 125)
        {
            if(this.state.menuOpacity > 1) this.setState({menuOpacity: 1, borderAlpha: 0.3});
            else if(this.state.menuOpacity == 1) ;
            else    this.setState({menuOpacity: this.state.menuOpacity + 0.2, borderAlpha: 0.3});
        }
        else{
            if (direction == 'down') this.setState({menuOpacity: this.state.menuOpacity + 0.025});
            else                     this.setState({menuOpacity: this.state.menuOpacity - 0.025, borderAlpha:0});
        }
    }

    refreshListView(){

        this.setState({
            spinnerVisible:true,
            networkState  :true
        });
        this.fetchData();
    }

    setSpinnerVisible(visible){    this.setState({spinnerVisible : visible});    }

    render() {
        var myView;

        if(this.state.networkState == true)
        {
            if(this.state.spinnerVisible==true)  mainBoardView = headerView;
            else                                 mainBoardView = (<View></View>);

            myView =(
                <LazyloadListView
                    style={pickerStyle.container}
                    // contentContainerStyle={styles.content}
                    name="listExample"
                    dataSource={this.state.dataSource}
                    renderSectionHeader={this.sectionHeader.bind(this)}
                    renderRow={this.renderRow}
                    scrollRenderAheadDistance={200}
                    renderDistance={100}
                    pageSize={1}
                    initialListSize={5}
                    stickyHeaderIndices={[0]}
                    onEndReachedThreshold={1000}
                    renderScrollComponent={ _=>{}}

                    ref="ScrollView"
                    onScroll={this.onScrolling}
                    scrollEnabled={this.state.loadOK}
                    onScrollEndDrag={this.onScrollEnd}
                    onMomentumScrollEnd={this.onScrollEnd}
                />
            );
        }
        else{ // OFFLINE VIEW
            mainBoardView = headerView;
            myView =( <View style={pickerStyle.offlineView}>
                <TouchableOpacity onPress={()=>this.refreshListView()}>
                    <Ionicons name="md-refresh-circle"
                              style={{
                                            fontSize:50,
                                            color: '#9c0010',
                                            marginBottom:10,
                                            transform:[{rotate: '136 deg'}],
                                          }}
                    />
                </TouchableOpacity>
                <Text>네트워크 상태를 확인하세요</Text>
            </View>);
        }

        return (
            <View  style={{flex:1}}>
                <View style={{flex: 1}}>
                    {mainBoardView}

                    {myView}
                </View>

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
                <Toast
                    ref      = "toast"
                    style    = {{backgroundColor:'#222222'}}
                    position = 'bottom'/>
                <Spinner
                    style={pickerStyle.spinner} isVisible={this.state.spinnerVisible} size={SPINNER_SIZE} type={"Bounce"}
                    color={"#94000F"}
                />
                {/* ------------------------------- Navigator Background ------------------------------------*/}
                <View style={{ position:'absolute', top:0,left:0,zIndex:1000, borderBottomWidth:2, borderColor:this.setBorderRgba()}}>
                    <Image
                        source={weatherBackImg}
                        style={{width: SCREEN_WIDTH, height: NAVI_HEIGHT+MENU_HEIGHT,
                            opacity:this.state.menuOpacity
                        }}/>

                </View>
                {/* ------------------------------- Navigator ------------------------------------*/}
                <View style={pickerStyle.navigator}>
                    <View style={{ marginLeft:10}}>
                        <TouchableOpacity onPress={()=>this.props.modalVisible(false)}>
                            <View style={{width:40}}>
                                <Ionicons name="ios-arrow-back" size={40} color="#94000F"/>
                            </View>
                        </TouchableOpacity>
                    </View>
                    <View style={{flex:2}}>
                        <Text style={{color: "white", fontSize: 20, textAlign:'center', opacity:this.state.menuOpacity}}>{this.props.rowData.district}</Text>
                    </View>
                    <View style={pickerStyle.heartView}>
                        <TouchableOpacity onPress={()=> {
                                this.controlFavorite();
                                this.setHeartOnOff();
                                this.refs.toast.show(this.state.heartOnOff==true?'즐겨찾기를 지웁니다':'즐겨찾기에 추가합니다',DURATION.LENGTH_LONG);
                        }}>
                            <Ionicons name="md-heart" size={30}  color={this.state.heartOnOff==true?"#94000F":"#C0C0C0"}/>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* ------------------------------- Navigator MENU ------------------------------------*/}
                <View style={[pickerStyle.navigatorMenu,{opacity:this.state.menuOpacity}]}>
                    <View style={pickerStyle.directionMarginBottom}>
                        <Text style={{color:'#FFF'}}>활공방향 </Text>
                        <View style={pickerStyle.bestDirection}>
                        {DirectionImage.getWindDirectionImage(parseInt(bestDirection[0]))}
                        {DirectionImage.getWindDirectionImage(parseInt(bestDirection[1]))}
                        {DirectionImage.getWindDirectionImage(parseInt(bestDirection[2]))}
                        {DirectionImage.getWindDirectionImage(parseInt(bestDirection[3]))}
                        </View>
                    </View>
                    <GlidingMenu/>
                </View>
            </View>
        );
    }
}

const PARALLAX_HEADER_HEIGHT = 200;
const SPINNER_SIZE = 80;

const SCREEN_WIDTH = Dimensions.get('window').width;
const NAVI_HEIGHT = 65;
const MENU_HEIGHT = 60;

module.exports = GlidingWeatherList;