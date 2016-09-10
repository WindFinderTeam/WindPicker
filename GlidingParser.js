/**
 * Created by maestrolsj on 16. 8. 28.
 */
exports.getGlidingWeather = getGlidingWeather;


function getGlidingWeather (responseJSON){

    var d = new Date();
    var localeDate  =  d.toLocaleDateString();
    console.log(" ==>>>>>>>>>>>>>> "+ localeDate.substr(0,2) );
    console.log(responseJSON);

}