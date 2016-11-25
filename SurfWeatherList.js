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
import LinearGradient     from 'react-native-linear-gradient';

import {
    LazyloadListView,
    LazyloadView
} from 'react-native-lazyload';

import Toast, { DURATION } from 'react-native-easy-toast';



var SurfParser    = require('./SurfParser')  ;
var pickerStyle   = require('./pickerStyle') ;
var WeatherImage  = require('./WeatherImage');
var SurfMenu      = require('./SurfMenu')    ;
var DirectionImage= require('./DirectionImage');

import { realmInstance } from "./RealmHndler.js";

var rowKey = 0;           // Listview`s row keys
var offset = 0;           // before scroll position for Action Button
var API_URL;
var bfcurrentOffset = 0;  // before scroll position for MenuBar

var mainBoard=true;
var headerView;
var mainBoardView;
var district ;
var weatherBackImg;
var color = ['#240d7f','#230d89','#230f94','#1c0e99','#200ca3','#1d0ea7','#1b0ab2','#140dbd','#170cc2'
    ,'#130ccb','#0e0cd2','#100edd','#0c0de4','#0f18e3','#0d20de','#0c32d5','#0e40d5','#104bcd','#1257cc'
    ,'#0d65c6','#0f74bc','#1b7abe','#308ac6','#4a97cf','#5ba1d2','#70afd8','#84bae0','#95c2df','#add4e5'
    ,'#c3daec','#d4e9ee','#fdfdc9','#fdfab7','#fdf99e','#fbf48a','#fdf579','#fef363','#fff150','#feee36'
    ,'#feee25','#feeb12','#ffe60f','#fede11','#fed70e','#ffce10','#ffc710','#fec110','#ffb812','#fdb10d'
    ,'#fea90e','#fa9e0f','#fd8d0d','#f9800b','#f96b09','#f35805','#f34a05','#f33a04','#f12a01','#ee1b00'
    ,'#ed0b00','#eb0300'];

const fetch = require('react-native-cancelable-fetch');


class SurfWeatherList extends Component {

    constructor(props) {
        super(props);

        API_URL = this.props.rowData.weatherURL; // 날씨URL 가져오기

        this.onScrollEnd       = this.onScrollEnd.bind(this)      ;
        this.onScrolling       = this.onScrolling.bind(this)      ;
        this.fetchData         = this.fetchData.bind(this)        ;
        this.startCountDown    = this.startCountDown.bind(this)   ;
        this.setSpinnerVisible = this.setSpinnerVisible.bind(this);
        this.setHeaderView     = this.setHeaderView.bind(this)    ;
        this.controlFavorite   = this.controlFavorite.bind(this)       ;
        this.setHeartOnOff     = this.setHeartOnOff.bind(this)         ;

        var getSectionData = (dataBlob, sectionID)        => {return dataBlob[sectionID];};
        var getRowData     = (dataBlob, sectionID, rowID) => {return dataBlob[sectionID + ':' + rowID];};


        district =  this.props.rowData.district;
        this.state = {
            dataSource: new ListView.DataSource(
                {
                    getSectionData          : getSectionData,
                    getRowData              : getRowData,
                    rowHasChanged: (row1, row2) => row1 !== row2,
                    sectionHeaderHasChanged: (s1, s2) => s1 !== s2
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
            ,tideYN        :"N"
            ,heartOnOff    :false
        };
        this.fetchData();
    }


    setHeaderView(){

        var direction =  this.props.rowData.direction.split(' ');

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
                            <View style={{flexDirection:'row', justifyContent:'center', alignItems:'center',marginTop:1}}>
                                <Text style={{color:'#FFF'}}>최적방향 </Text>
                                {DirectionImage.getWindDirectionImage(parseInt(direction[0]))}
                                {DirectionImage.getSwellDirectionImage(parseInt(direction[1]))}
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
                        <View style={{width:SCREEN_WIDTH}}><SurfMenu tideYN={this.state.tideYN}/></View>
                    </View>
                </Image>
            );
    }

    componentWillMount() // before rendering
    {
        this.setHeaderView();
        this.readRealm();
        mainBoard = true;
    }

   startCountDown(){

       console.log("#### TIMER OVER ####");

       this.setState({
           spinnerVisible:false,
           networkState  :false
       });
       fetch.abort(this);
   }

   readRealm() {
       console.log("read result before ");

       realmInstance.write(() => {

           let theme = "FavoriteSurfing", var_index = this.props.rowData.index;

           let specificFavorite = realmInstance.objects(theme).filtered('index = ' + '"' + var_index + '"');

           console.log(specificFavorite);

           if(Object.keys(specificFavorite) == ""){
               //not exists.
           } else {
               //exists.
               console.log("read. exists. index " + var_index);
               this.setHeartOnOff();
           }
       });
       console.log("read result after ");
   }

   fetchData() {

       weatherBackImg    = WeatherImage.getBackgroundImage();
       var setTimeoudtID = setTimeout(this.startCountDown, 7000);

        fetch(API_URL,null,this).then((responseData) => {
            var {dataBlob,sectionIDs, rowIDs,sunInfo,tideYN} = SurfParser.getSurfWeather(responseData);  //data parsing
            this.setState({
                dataSource: this.state.dataSource.cloneWithRowsAndSections(dataBlob, sectionIDs, rowIDs),
                sunrise     :sunInfo[0],
                sunset      :sunInfo[1],
                updateTime  :sunInfo[2],
                loadOK      :true,
                networkState:true,
                tideYN      :tideYN
            });
            this.setSpinnerVisible(false);

            clearTimeout(setTimeoudtID);

        })
            .catch((error) => { // if network state is unstable
                console.warn(error);
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


    setHeartOnOff(){
        console.log("setHeartOnOff in");
        console.log(this.state.heartOnOff);

        if(this.state.heartOnOff == true){
            this.setState({
                heartOnOff : false
            });
        } else {
            this.setState({
                heartOnOff : true
            });
        }

        console.log("setHeartOnOff out");
        console.log(this.state.heartOnOff);
    }

    controlFavorite(){
        console.log("xxx control Favorite in");

        realmInstance.write(() => {

            /* --------before display  Favorite Lists---------- */
            let AllFavorite_surfing = realmInstance.objects('FavoriteSurfing');
            console.log(AllFavorite_surfing);

            /* --------before display  Favorite Lists---------- */

            let theme = "FavoriteSurfing", var_index = this.props.rowData.index;

            let specificFavorite = realmInstance.objects(theme).filtered('index = ' + '"' + var_index + '"');

            console.log(specificFavorite);

            if(Object.keys(specificFavorite) == ""){

                //not exists. need to insert
                console.log("need to insert");
                realmInstance.create('FavoriteSurfing', {
                    index:var_index,
                    name :this.props.rowData.district
                });

            } else {

                //exists. need to delete
                console.log("need to delete");
                realmInstance.delete(specificFavorite); // Deletes all books

            }

            /* --------after display  Favorite Lists---------- */

            let AllFavorite_surfing_after = realmInstance.objects('FavoriteSurfing');
            console.log(AllFavorite_surfing_after);
            console.log("======================");
            console.log(Object.keys(AllFavorite_surfing_after).length);
            /* --------after display  Favorite Lists---------- */

        });
        // this.setState({heartOnOff: !this.state.heartOnOff});
    }

    // Draw List's Headers
    sectionHeader(rowData, sectionID) {

        if(mainBoard === true) {
            this.setHeaderView();
            mainBoard = false;
        }
        else headerView = (<View style={{width:0,height:0}}></View>);
        return (
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
        )
    }

    // Draw List's Rows
    renderRow(rowData, sectionID, rowID) {

        rowKey++;

        var temperature   =  Math.round(rowData.temperature);
        var tempColor     = color[temperature+20];
        var tempFontColor = '#FFFFFF';

        if(temperature >= 10 && temperature <= 20 ) tempFontColor = 'black';

        var cloud = rowData.cloud, precipation = rowData.rainprecipation, time = rowData.time, snowrain = rowData.snowrain;
        var tidedirections;

        if(rowData.tidedirections != ""){
            switch(rowData.tidedirections) {
                case 'down' :tidedirections = (<Image source={require('./image/weatherIcon/cloud1.png')} style={{width:15, height:17}}/>);
                    break;
                case 'up' :tidedirections = (<Image source={require('./image/arrow.png')} style={{width:15, height:17}}/>);
                    break;
                case 'high' :tidedirections = (<Image source={require('./image/weatherIcon/snow.png')} style={{width:15, height:17}}/>);
                    break;
                case 'low' :tidedirections = (<Image source={require('./image/weatherIcon/cloud2.png')} style={{width:15, height:17}}/>);
                    break;
            }
        } else  {
            tidedirections = (<Text></Text>);
        }



        var {weatherImg, precipitationImg} = WeatherImage.getWatherImage(time, cloud, precipation, snowrain);

        if(precipation == "" || precipation == null) precipation='0';


        var windArrowSrc  =  DirectionImage.getWindDirectionImage(parseInt(rowData.winddirection));
        var swellArrowSrc =  DirectionImage.getSwellDirectionImage(parseInt(rowData.wavedirection));

        var windSpeedWidth    = (SCREEN_WIDTH * rowData.wind) / 60 ;
        var windMaxSpeedWidth = ((SCREEN_WIDTH * rowData.gust) / 60 ) - windSpeedWidth;

        return (
        <View style={pickerStyle.rowViewStyle}>
          <LazyloadView host="listExample">

              <View key={rowKey} style={pickerStyle.row}>

                {/* 시간 */}
                <View style={pickerStyle.menusView}><Text style={pickerStyle.rowListText}>{rowData.time}H</Text></View>

                {/* 날씨 */}
                <View style={[pickerStyle.menusView,{flexDirection:'column'}]}>
                    {weatherImg}
                    {precipitationImg}
                </View>
                {/* 기온 */}
                <View style={pickerStyle.menusView}>
                    <View style={{justifyContent:'center',alignItems: 'center',flexDirection: 'row',borderRadius:5,backgroundColor:tempColor, width:30}}>
                        <Text style={[pickerStyle.rowListText,{color:tempFontColor}]}>{temperature} ℃</Text>
                    </View>
                </View>

                {/* 강수량 */}
                <View style={pickerStyle.menusView}>
                    <Text style={pickerStyle.rowListText}>{precipation}</Text><Text style={[pickerStyle.rowListText, {fontSize:10}]}> mm</Text>
                </View>

                  {/* 바람 */}
                  <View style={pickerStyle.menusView}>
                      {windArrowSrc}
                      <View style={{flexDirection:'column'}}>
                          <Text style={pickerStyle.rowListText}>{rowData.wind} kts</Text>
                          <Text style={[pickerStyle.rowListText, {fontSize:10}]}>max {rowData.gust}</Text>
                      </View>
                  </View>

                  {/* 파도 */}
                  <View style={pickerStyle.menusView}>
                      {swellArrowSrc}
                      <View style={{flexDirection:'column',marginLeft:1}}>
                          <Text style={pickerStyle.rowListText}>{rowData.waveheight} m</Text>
                          <Text style={[pickerStyle.rowListText, {fontSize:11}]}>{rowData.wavefrequency}s</Text>
                      </View>
                  </View>

                  {/* 조수 */}
                  <View style={rowData.tidedirections=="" ? {width:0, height:0} : [{flexDirection:'column'},pickerStyle.menusView]}>
                      <View style={{flex:1,flexDirection:'column'}}>
                          <View style={{flexDirection:'row',justifyContent:'center' }}>{tidedirections}</View>
                          <Text style={[pickerStyle.rowListText, {fontSize:11}]}>{rowData.tideheight}m {rowData.tidefreq}</Text>
                      </View>
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

        var currentOffset = event.nativeEvent.contentOffset.y     ;
        var direction     = currentOffset > offset ? 'down' : 'up';
        offset            = currentOffset;

        switch (direction) {
            case 'down' :this.setState({topAlpha: 0,});  break;
            case 'up'   :this.setState({topAlpha: 0.8,});break;
        };
    }


    onScrolling(event) {
        var currentOffset = event.nativeEvent.contentOffset.y;
        var direction     = currentOffset > bfcurrentOffset ? 'down' : 'up';

        bfcurrentOffset = currentOffset;

        if (currentOffset <= 0)this.setState({menuOpacity : 0, borderAlpha:0});
        else if (currentOffset >= 125) {
            if(this.state.menuOpacity > 1)this.setState({menuOpacity: 1, borderAlpha: 0.3});
            else if(this.state.menuOpacity == 1) ;
            else this.setState({menuOpacity: this.state.menuOpacity + 0.2, borderAlpha: 0.3});
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

    setSpinnerVisible(visible){this.setState({spinnerVisible : visible});}

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
                                <Ionicons name="ios-arrow-back" size={30} color="#94000F"/>
                            </View>
                        </TouchableOpacity>
                    </View>
                    <View style={{flex:2}}>
                        <Text style={{color: "white", fontSize: 20, textAlign:'center', opacity:this.state.menuOpacity}}>{this.props.rowData.district}</Text>
                    </View>
                    <View style={pickerStyle.heartView}>
                        <TouchableOpacity onPress={()=>{
                            this.controlFavorite();
                            this.setHeartOnOff();
                        }}>
                            <Ionicons name="md-heart" size={30} color={this.state.heartOnOff==true?"#94000F":"#C0C0C0"}/>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* ------------------------------- Navigator MENU ------------------------------------*/}
                <View style={{
                    position:'absolute', top:NAVI_HEIGHT,
                    width:SCREEN_WIDTH,
                    height:MENU_HEIGHT,
                    zIndex:1000,   opacity:this.state.menuOpacity}} >
                    <SurfMenu tideYN={this.state.tideYN}/>
                </View>
            </View>
        );
    }

}
const PARALLAX_HEADER_HEIGHT = 200;
const SPINNER_SIZE = 80;

const SCREEN_WIDTH = Dimensions.get('window').width;
const NAVI_HEIGHT = 60;
const MENU_HEIGHT = 30;


module.exports = SurfWeatherList;