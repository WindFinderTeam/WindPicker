import  React, {Component} from 'react';
import {
    Text,
    View,
    Image,
} from 'react-native';

import firebase  from 'firebase';

// Initialize Firebase
const firebaseConfig = {
    apiKey: "AIzaSyABQY6SQ841oY1H2tqOgAxPJm-OHm6g28w",
    authDomain: "bluebird-52433.firebaseapp.com",
    databaseURL: "https://bluebird-52433.firebaseio.com/",
    storageBucket: "",
};
const firebaseApp = firebase.initializeApp(firebaseConfig);

module.exports = firebaseApp.database(); //this doesnt have to be database only