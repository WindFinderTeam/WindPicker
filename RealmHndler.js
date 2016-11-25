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


    const FavoriteSurfingSchema = {
        name: 'FavoriteSurfing',
        primaryKey: 'index',
        properties: {
            index: {type: 'string'},
            name : {type: 'string'}
        }
    };

//gliding schema
    const FavoriteGlidingSchema = {
        name: 'FavoriteGliding',
        primaryKey: 'index',
        properties: {
            index: {type: 'string'},
            name : {type: 'string'}
        }
    };

    export let realmInstance = new Realm({schema: [FavoriteSurfingSchema, FavoriteGlidingSchema]});

