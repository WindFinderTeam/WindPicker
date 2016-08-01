import  React, {Component} from 'react';
import {
    ScrollView,
    Image,
    View
} from 'react-native';

import FavoriteList from './FavoriteList';

class FavoritePage extends Component {
    render() {
        return (
            <FavoriteList/>
        )
    }
}

module.exports = FavoritePage;
