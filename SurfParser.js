/**
 * Created by maestrolsj on 16. 8. 28.
 */
exports.getSurfWeather = getSurfWeather;

var HTMLParser = require('fast-html-parser');

function getSurfWeather (responseData){

    var htmlTest = responseData._bodyInit;
    var root = HTMLParser.parse(htmlTest);

    console.log("----------- sejin ---------------------");

    var arr=root.querySelectorAll('.weathertable__header');

    console.log(arr[0].removeWhitespace().rawText);
    console.log(arr[1].removeWhitespace().rawText);
    console.log(arr[2].removeWhitespace().rawText);

}