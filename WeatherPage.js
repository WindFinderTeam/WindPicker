import  React, {Component} from 'react';
import {
    Text
} from 'react-native';

import LocalList from './LocalList';

class WeatherPage extends Component {

    render() {

        return (
      <LocalList/>
        )
    }
}

module.exports = WeatherPage;