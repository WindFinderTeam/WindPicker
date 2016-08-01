import  React, {Component} from 'react';
import {
    ScrollView,
    Text,
    Image
} from 'react-native';

import WeatherList from './WeatherList';

class WeatherPage extends Component {

    render() {

        return (
      <WeatherList/>
        )
    }
}

module.exports = WeatherPage;