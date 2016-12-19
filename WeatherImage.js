/**
 * Created by seonae on 16. 10. 3.
 * Modified by LSJ
 */
exports.getWatherImage     = getWatherImage;
exports.getBackgroundImage = getBackgroundImage;
exports.getTideImage       = getTideImage;

import  React, {Component} from 'react';
import {
    Text,
    View,
    Image,
} from 'react-native';

console.log("WeatherImg Load");


const clearMoon   =(<Image source={require('./image/weatherIcon/clearMoon.png')} style={{width:23, height:23}}/>);
const moonCloud1  =(<Image source={require('./image/weatherIcon/moonCloud1.png')} style={{width:23, height:23}}/>);
const moonCloud2  =(<Image source={require('./image/weatherIcon/moonCloud2.png')} style={{width:23, height:23}}/>);
const cloud2      =(<Image source={require('./image/weatherIcon/cloud2.png')} style={{width:22, height:22}}/>);
const cloud1      =(<Image source={require('./image/weatherIcon/cloud1.png')} style={{width:23, height:23}}/>);
const clearSun    =(<Image source={require('./image/weatherIcon/clearSun.png')} style={{width:23, height:23}}/>);
const sunCloud1   =(<Image source={require('./image/weatherIcon/sunCloud1.png')} style={{width:23, height:23}}/>);
const sunCloud2   =(<Image source={require('./image/weatherIcon/sunCloud2.png')} style={{width:23, height:23}}/>);
const tideDownImg =(<Image source={require('./image/weatherIcon/down.png')} style={{width:15, height:17}}/>);
const tideUpImg   =(<Image source={require('./image/weatherIcon/up.png')} style={{width:15, height:17}}/>);
const tideHighImg =(<Image source={require('./image/weatherIcon/high.png')} style={{width:15, height:17}}/>);
const tideLowImg  =(<Image source={require('./image/weatherIcon/low.png')} style={{width:15, height:17}}/>);
const raindrop    =(<Image source={require('./image/weatherIcon/raindrop.png')} style={{width:8, height:8}}/>)
const snow        =(<Image source={require('./image/weatherIcon/snow.png')} style={{width:8, height:8}}/>)
const rainSnow    =(<Image source={require('./image/weatherIcon/rainSnow.png')} style={{width:8, height:8}}/>)

function  getWatherImage(p_time, p_cloudQuantity, p_precipation, p_snowrain) {
                                                                                    //1 : snow 2 : rain 3 :rainsnow
    var time = p_time, cloudQuantity = p_cloudQuantity, precipation = p_precipation, snowrain = p_snowrain;
    var  precipitationImg, weatherImg;

     //console.log("WeatherImage in ok : time :" +  time + " ,cloudQuantity : " + cloudQuantity + ", precipation : " + precipation + ", snowrain:"+snowrain);

    // 구름이미지생성
    switch (time) {
        case '00'  :
        case '03'  :
        case '06'  :
        case '21'  :
            if(cloudQuantity >= 0 && cloudQuantity <= 10){
                weatherImg = clearMoon;
            } else if(cloudQuantity >= 11 && cloudQuantity <= 25){
                weatherImg = moonCloud1;
            } else if(cloudQuantity >= 26 && cloudQuantity <= 50) {
                weatherImg = moonCloud2;
            } else if(cloudQuantity >= 51 && cloudQuantity <= 87){
                weatherImg = cloud2;
            } else if((cloudQuantity >= 88 && cloudQuantity <= 100)){
                weatherImg = cloud1;
            } else {
                weatherImg = (<Text></Text>);
            }

            break;

        case '09'  :
        case '12'  :
        case '15'  :
        case '18'  :
            if(cloudQuantity >= 0 && cloudQuantity <= 10){
                weatherImg = clearSun;
            } else if(cloudQuantity >= 11 && cloudQuantity <= 25){
                weatherImg = sunCloud1;
            } else if(cloudQuantity >= 26 && cloudQuantity <= 50) {
                weatherImg = sunCloud2;
            } else if(cloudQuantity >= 51 && cloudQuantity <= 87){
                weatherImg = cloud2;
            } else if((cloudQuantity >= 88 && cloudQuantity <= 100)){
                weatherImg = cloud1;
            } else {
                weatherImg = (<Text></Text>);
            }

            break;

        default    :
            weatherImg = (<Text></Text>);

            break;
    };

    var snowrainImage;
    // 눈비이미지생성
    switch(snowrain){
        //0 : rain
        case '0' : snowrainImage = raindrop; break;
        //1 : snow
        case '1' : snowrainImage = snow; break;
        //2 : snow+rain
        case '2' : snowrainImage = rainSnow; break;
        default  : snowrainImage = ""; break;
    }

    if(precipation == "" || precipation == null){
        precipitationImg = (<Text></Text>);
    } else if(precipation >= 0 && precipation <= 1){
        precipitationImg = snowrainImage;
    } else if(precipation >= 2 && precipation <= 3){
        precipitationImg = (<View style={{flexDirection:'row'}}>{snowrainImage}{snowrainImage}</View>);
    } else if(precipation >= 4){
        precipitationImg = (<View style={{flexDirection:'row'}}>{snowrainImage}{snowrainImage}{snowrainImage}</View>);
    }

    return {weatherImg,  precipitationImg};
}


function getTideImage(){


    return {tideDownImg,tideUpImg,tideHighImg,tideLowImg};
}

function getBackgroundImage(){

    var from = 0;
    var to   = 22;

    var num = Math.floor( (Math.random() * (to - from + 1)) + from );

    var backgroundImg;
    switch(num){

        case 0 : backgroundImg = ({uri: 'http://mercicandle.cafe24.com/web/windPicker/back1.jpg'}); break;
        case 1 : backgroundImg = ({uri: 'http://mercicandle.cafe24.com/web/windPicker/back2.jpg'}); break;
        case 2 : backgroundImg = ({uri: 'http://mercicandle.cafe24.com/web/windPicker/back3.jpg'}); break;
        case 3 : backgroundImg = ({uri: 'http://mercicandle.cafe24.com/web/windPicker/back4.jpg'}); break;
        case 4 : backgroundImg = ({uri: 'http://mercicandle.cafe24.com/web/windPicker/back5.jpg'}); break;
        case 5 : backgroundImg = ({uri: 'http://mercicandle.cafe24.com/web/windPicker/back6.jpg'}); break;
        case 6 : backgroundImg = ({uri: 'http://mercicandle.cafe24.com/web/windPicker/back7.jpg'}); break;
        case 7 : backgroundImg = ({uri: 'http://mercicandle.cafe24.com/web/windPicker/back8.jpg'}); break;
        case 8 : backgroundImg = ({uri: 'http://mercicandle.cafe24.com/web/windPicker/back9.jpg'}); break;
        case 9 : backgroundImg = ({uri: 'http://mercicandle.cafe24.com/web/windPicker/back9.jpg'}); break;
        case 10 : backgroundImg = ({uri: 'http://mercicandle.cafe24.com/web/windPicker/back10.jpg'}); break;
        case 11 : backgroundImg = ({uri: 'http://mercicandle.cafe24.com/web/windPicker/back11.jpg'}); break;
        case 12 : backgroundImg = ({uri: 'http://mercicandle.cafe24.com/web/windPicker/back12.jpg'}); break;
        case 13 : backgroundImg = ({uri: 'http://mercicandle.cafe24.com/web/windPicker/back13.jpg'}); break;
        case 14 : backgroundImg = ({uri: 'http://mercicandle.cafe24.com/web/windPicker/back14.jpg'}); break;
        case 15 : backgroundImg = ({uri: 'http://mercicandle.cafe24.com/web/windPicker/back15.jpg'}); break;
        case 16 : backgroundImg = ({uri: 'http://mercicandle.cafe24.com/web/windPicker/back16.jpg'}); break;
        case 17 : backgroundImg = ({uri: 'http://mercicandle.cafe24.com/web/windPicker/back17.jpg'}); break;
        case 18 : backgroundImg = ({uri: 'http://mercicandle.cafe24.com/web/windPicker/back18.jpg'}); break;
        case 19 : backgroundImg = ({uri: 'http://mercicandle.cafe24.com/web/windPicker/back19.jpg'}); break;
        case 20 : backgroundImg = ({uri: 'http://mercicandle.cafe24.com/web/windPicker/back20.jpg'}); break;
        case 21 : backgroundImg = ({uri: 'http://mercicandle.cafe24.com/web/windPicker/back21.jpg'}); break;
        case 22 : backgroundImg = ({uri: 'http://mercicandle.cafe24.com/web/windPicker/back22.jpg'}); break;



    }

    return backgroundImg;
}