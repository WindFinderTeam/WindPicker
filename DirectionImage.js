/**
 * Created by seonae on 16. 10. 3.
 */
exports.getWindDirectionImage  = getWindDirectionImage ;
exports.getSwellDirectionImage = getSwellDirectionImage;

import  React, {Component} from 'react';
import {
    Text,
    View,
    Image,
} from 'react-native';

function  getWindDirectionImage(degree) {

    var windDirImg;

    //42,78,98,83,80
    switch (degree) {
        case 0  :  windDirImg = (<Image source={require('./image/weatherIcon/windArrow0.png')} style={{width:23, height:23}}/>); break;
        case 1  :  windDirImg = (<Image source={require('./image/weatherIcon/windArrow0.png')} style={{width:23, height:23}}/>); break;
        case 3  :  windDirImg = (<Image source={require('./image/weatherIcon/windArrow0.png')} style={{width:23, height:23}}/>); break;
        case 4  :  windDirImg = (<Image source={require('./image/weatherIcon/windArrow0.png')} style={{width:23, height:23}}/>); break;
        case 5  :  windDirImg = (<Image source={require('./image/weatherIcon/windArrow0.png')} style={{width:23, height:23}}/>); break;
        case 6  :  windDirImg = (<Image source={require('./image/weatherIcon/windArrow0.png')} style={{width:23, height:23}}/>); break;
        case 7  :  windDirImg = (<Image source={require('./image/weatherIcon/windArrow0.png')} style={{width:23, height:23}}/>); break;
        case 8  :  windDirImg = (<Image source={require('./image/weatherIcon/windArrow0.png')} style={{width:23, height:23}}/>); break;
        case 9  :  windDirImg = (<Image source={require('./image/weatherIcon/windArrow0.png')} style={{width:23, height:23}}/>); break;
        case 42  :  windDirImg = (<Image source={require('./image/weatherIcon/windArrow10.png')} style={{width:23, height:23}}/>); break;
        case 78  :  windDirImg = (<Image source={require('./image/weatherIcon/windArrow20.png')} style={{width:23, height:23}}/>); break;
        case 98  :  windDirImg = (<Image source={require('./image/weatherIcon/windArrow5.png')} style={{width:23, height:23}}/>); break;
        case 83  :  windDirImg = (<Image source={require('./image/weatherIcon/windArrow30.png')} style={{width:23, height:23}}/>); break;
        case 80  :  windDirImg = (<Image source={require('./image/weatherIcon/windArrow25.png')} style={{width:23, height:23}}/>); break;
        case 15  :  windDirImg = (<Image source={require('./image/weatherIcon/windArrow0.png')} style={{width:23, height:23}}/>); break;
        case 16  :  windDirImg = (<Image source={require('./image/weatherIcon/windArrow0.png')} style={{width:23, height:23}}/>); break;
        default    :
            windDirImg = (<Image source={require('./image/weatherIcon/windArrow0.png')} style={{width:23, height:23}}/>);

            break;
    };


    return windDirImg;

}

function  getSwellDirectionImage(degree) {

    var swellDirImg;

    //42,78,98,83,80
    switch (degree) {
        case 0  :  swellDirImg = (<Image source={require('./image/weatherIcon/windArrow0.png')} style={{width:23, height:23}}/>); break;
        case 1  :  swellDirImg = (<Image source={require('./image/weatherIcon/windArrow0.png')} style={{width:23, height:23}}/>); break;
        case 3  :  swellDirImg = (<Image source={require('./image/weatherIcon/windArrow0.png')} style={{width:23, height:23}}/>); break;
        case 4  :  swellDirImg = (<Image source={require('./image/weatherIcon/windArrow0.png')} style={{width:23, height:23}}/>); break;
        case 5  :  swellDirImg = (<Image source={require('./image/weatherIcon/windArrow0.png')} style={{width:23, height:23}}/>); break;
        case 6  :  swellDirImg = (<Image source={require('./image/weatherIcon/windArrow0.png')} style={{width:23, height:23}}/>); break;
        case 7  :  swellDirImg = (<Image source={require('./image/weatherIcon/windArrow0.png')} style={{width:23, height:23}}/>); break;
        case 8  :  swellDirImg = (<Image source={require('./image/weatherIcon/windArrow0.png')} style={{width:23, height:23}}/>); break;
        case 9  :  swellDirImg = (<Image source={require('./image/weatherIcon/windArrow0.png')} style={{width:23, height:23}}/>); break;
        case 42  :  swellDirImg = (<Image source={require('./image/weatherIcon/windArrow10.png')} style={{width:23, height:23}}/>); break;
        case 78  :  swellDirImg = (<Image source={require('./image/weatherIcon/windArrow20.png')} style={{width:23, height:23}}/>); break;
        case 98  :  swellDirImg = (<Image source={require('./image/weatherIcon/windArrow5.png')} style={{width:23, height:23}}/>); break;
        case 83  :  swellDirImg = (<Image source={require('./image/weatherIcon/windArrow30.png')} style={{width:23, height:23}}/>); break;
        case 80  :  swellDirImg = (<Image source={require('./image/weatherIcon/windArrow25.png')} style={{width:23, height:23}}/>); break;
        case 15  :  swellDirImg = (<Image source={require('./image/weatherIcon/windArrow0.png')} style={{width:23, height:23}}/>); break;
        case 16  :  swellDirImg = (<Image source={require('./image/weatherIcon/windArrow0.png')} style={{width:23, height:23}}/>); break;
        default    :
            swellDirImg = (<Image source={require('./image/weatherIcon/windArrow0.png')} style={{width:23, height:23}}/>);

            break;
    };


    return swellDirImg;

}
