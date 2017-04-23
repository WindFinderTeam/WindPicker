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

var getSurfLocalListItem = function () {

    return new Promise(
        function (resolve, reject) {

            var itemsRef = firebaseApp.database().ref().child('SurfLocalData');

            // get children as an array
            var localListMap = {};

            var district, province;

            itemsRef.on('value', (snap) => {

                snap.forEach((child) => {

                    district = child.val().district;
                    province = child.val().province;

                    if (!localListMap[province]) localListMap[province] = [];
                    localListMap[province].push(child.val());
                });
                resolve(localListMap);

            });
        }
    )
}

var getGlidLocalListItem = function () {

    return new Promise(
        function (resolve, reject) {

            var itemsRef = firebaseApp.database().ref().child('GlidingLocalData');
            // get children as an array
            var localListMap = {};

            var district, province;

            itemsRef.on('value', (snap) => {

                snap.forEach((child) => {

                    district = child.val().district;
                    province = child.val().province;

                    if (!localListMap[province]) localListMap[province] = [];
                    localListMap[province].push(child.val());
                });
                resolve(localListMap);
            });
        }
    )
}

exports.getSurfLocalListItem = getSurfLocalListItem;
exports.getGlidLocalListItem = getGlidLocalListItem;
