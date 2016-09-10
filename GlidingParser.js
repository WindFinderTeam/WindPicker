/**
 * Created by maestrolsj on 16. 8. 28.
 */
exports.getGlidingWeather = getGlidingWeather;


function getGlidingWeather (responseJSON){


    var week = new Array('(일)', '(월)', '(화)', '(수)', '(목)', '(금)', '(토)');

    //var today = new Date('2014-12-25').getDay();
    //var todayLabel = week[today];

    var d = new Date();
    var localeDate  =  d.toLocaleDateString();
    var year = localeDate.substr(6,4);
    var month = localeDate.substr(0,2);
    var day = localeDate.substr(3,2);
    console.log(" year  >>> " + year);
    console.log(" month  >>> " + month);
    console.log(" day  >>> " + day);

}