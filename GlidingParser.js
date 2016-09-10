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
    var year = '20'+localeDate.substr(6,4);
    var month = localeDate.substr(0,2);
    var date = localeDate.substr(3,2);
    var day = week[new Date(year+'-'+month+'-'+date).getDay()];
    console.log(" year  >>> " + year);
    console.log(" month  >>> " + month);
    console.log(" date  >>> " + date);
    console.log(" day  >>> " + day);

}