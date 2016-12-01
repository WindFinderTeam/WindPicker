/**
 * Created by seonae on 16. 10. 3.
 */
exports.getWatherImage = getWatherImage;
exports.getBackgroundImage = getBackgroundImage;

import  React, {Component} from 'react';
import {
    Text,
    View,
    Image,
} from 'react-native';

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
                weatherImg = (<Image source={require('./image/weatherIcon/clearMoon.png')} style={{width:23, height:23}}/>);
            } else if(cloudQuantity >= 11 && cloudQuantity <= 25){
                weatherImg = (<Image source={require('./image/weatherIcon/moonCloud1.png')} style={{width:23, height:23}}/>);
            } else if(cloudQuantity >= 26 && cloudQuantity <= 50) {
                weatherImg = (<Image source={require('./image/weatherIcon/moonCloud2.png')} style={{width:23, height:23}}/>);
            } else if(cloudQuantity >= 51 && cloudQuantity <= 87){
                weatherImg = (<Image source={require('./image/weatherIcon/cloud2.png')} style={{width:22, height:22}}/>);
            } else if((cloudQuantity >= 88 && cloudQuantity <= 100)){
                weatherImg = (<Image source={require('./image/weatherIcon/cloud1.png')} style={{width:23, height:23}}/>);
            } else {
                weatherImg = (<Text></Text>);
            }

            break;

        case '09'  :
        case '12'  :
        case '15'  :
        case '18'  :
            if(cloudQuantity >= 0 && cloudQuantity <= 10){
                weatherImg = (<Image source={require('./image/weatherIcon/clearSun.png')} style={{width:23, height:23}}/>);
            } else if(cloudQuantity >= 11 && cloudQuantity <= 25){
                weatherImg = (<Image source={require('./image/weatherIcon/sunCloud1.png')} style={{width:23, height:23}}/>);
            } else if(cloudQuantity >= 26 && cloudQuantity <= 50) {
                weatherImg = (<Image source={require('./image/weatherIcon/sunCloud2.png')} style={{width:23, height:23}}/>);
            } else if(cloudQuantity >= 51 && cloudQuantity <= 87){
                weatherImg = (<Image source={require('./image/weatherIcon/cloud2.png')} style={{width:22, height:22}}/>);
            } else if((cloudQuantity >= 88 && cloudQuantity <= 100)){
                weatherImg = (<Image source={require('./image/weatherIcon/cloud1.png')} style={{width:23, height:23}}/>);
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
        case '0' : snowrainImage = (require('./image/weatherIcon/raindrop.png')); break;
        //1 : snow
        case '1' : snowrainImage = (require('./image/weatherIcon/snow.png')) ; break;
        //2 : snow+rain
        case '2' : snowrainImage = (require('./image/weatherIcon/rainSnow.png')); break;
        default  : snowrainImage = ""; break;
    }

    if(precipation == "" || precipation == null){
        precipitationImg = (<Text></Text>);
    } else if(precipation >= 0 && precipation <= 1){
        precipitationImg = (<Image source={snowrainImage} style={{width:9, height:9}}/>);
    } else if(precipation >= 2 && precipation <= 3){
        precipitationImg = (<View style={{flexDirection:'row'}}><Image source={snowrainImage} style={{width:8, height:8}}/><Image source={snowrainImage} style={{width:8, height:8}}/></View>);
    } else if(precipation >= 4){
        precipitationImg = (<View style={{flexDirection:'row'}}><Image source={snowrainImage} style={{width:7, height:7}}/><Image source={snowrainImage} style={{width:7, height:7}}/><Image source={snowrainImage} style={{width:7, height:7}}/></View>);
    }


    return {weatherImg,  precipitationImg};

}


function getBackgroundImage(){

    var from = 0;
    var to   = 6;

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

    }

    return backgroundImg;
}