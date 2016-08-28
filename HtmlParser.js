/**
 * Created by maestrolsj on 16. 8. 28.
 */
exports.getSufingWeather = getSufingWeather;

var HTMLParser = require('fast-html-parser');

function getSufingWeather (responseData){

    var htmlTest = responseData._bodyInit;
    var root = HTMLParser.parse(htmlTest);

    console.log("--------------------------------");

    console.log(root.querySelectorAll('.weathertable__header').rawText);

}