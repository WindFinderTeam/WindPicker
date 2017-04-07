/**
 * Created by seonae on 16. 10. 3.
 */

import  React, {Component} from 'react';
import {
    Text,
    View,
    Image,
} from 'react-native';
import Realm               from 'realm';

    const WebcamSchema = {
        name: 'Webcam',
        properties: {
            camUrl: {type: 'string'},
            provider : {type: 'string'},
        }
    };

    const ShopSchema = {
        name: 'Shop',
        properties: {
            name: {type: 'string'},
        }
    };

    //surfing schema
    const FavoriteSurfingSchema = {
        name: 'FavoriteSurfing',
        primaryKey: 'index',
        properties: {
            index: {type: 'string'},
            name : {type: 'string'},
            webcam : {type: 'list', objectType: 'Webcam'},
            shop : {type: 'list', objectType: 'Shop'},
        }
    };

    //gliding schema
    const FavoriteGlidingSchema = {
        name: 'FavoriteGliding',
        primaryKey: 'index',
        properties: {
            index: {type: 'string'},
            name : {type: 'string'},
            webcam : {type: 'list', objectType: 'Webcam'},
            shop : {type: 'list', objectType: 'Shop'},
        }
    };

    //whichModeLastStay schema
    const ModeLastStaySchema = {
        name: 'ModeLastStay',
        primaryKey: 'index',
        properties: {
            index : {type: 'string'},
            mode  : {type: 'string'},
        }
    };

    export let realmInstance = new Realm({schema: [WebcamSchema, ShopSchema, FavoriteSurfingSchema, FavoriteGlidingSchema, ModeLastStaySchema]});

