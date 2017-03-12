/**
 * Created by maestrolsj on 16. 8. 28.
 */
exports.getSurfWeather = getSurfWeather;

var HTMLParser = require('fast-html-parser');
var testTime, testTime2;

function getSurfWeather (responseData){

    var htmlTest = responseData._bodyInit;
    var root = HTMLParser.parse(htmlTest);

    testTime = new Date();
    // call header section
    var dataBlob = {},
        sectionIDs = [],
        rowIDs = [],
        sunInfo = [],
        i, j, count =0,

        /* ------------------------------
         last update, sunrise, sunset
         -------------------------------*/
        parsing_lastUpdate = root.querySelector('.tabmeta__update'),
        parsing_localstats = root.querySelector('.spotmeta__locals'),

        /* ------------------------------
         daily weather
         -------------------------------*/

        parsing_sectionData = root.querySelectorAll('.weathertable__header'),

        parsing_rowData_time = root.querySelectorAll('.cell-timespan.weathertable__cellgroup.weathertable__cellgroup--stacked'), //time 83

        parsing_rowData_tides = root.querySelectorAll('.cell-tides.weathertable__cellgroup.weathertable__cellgroup--stacked'), //tide
        parsing_rowData_tideHeight = root.querySelectorAll('.data-tideheight.weathertable__cell'), //height
        parsing_rowData_tideFreq = root.querySelectorAll('.data-tidefreq.data--minor.weathertable__cell.data-time'), //time
        parsing_rowData_tidedirections = root.querySelectorAll('.data-tidedirection.weathertable__cell'), //image.defection.must get div class

        parsing_rawData_cover = root.querySelectorAll('.data-cover.weathertable__cell'), //cloud 83
        parsing_rawData_precipitation = root.querySelectorAll('.data-rain.data--minor.weathertable__cell'), //precipation 83


        parsing_rawData_temp_pressure = root.querySelectorAll('.cell-weather-2.weathertable__cellgroup'), //temp+pressure 83

        parsing_rawData_direction_speed_gust = root.querySelectorAll('.cell-wind-3.weathertable__cellgroup'), //total 83
        parsing_rawData_directionarrow_wind = root.querySelectorAll('.data-direction-unit.units-wd.units-wd-deg.data--minor.weathertable__cell'),

        parsing_rawData_directionarrow_wave = root.querySelectorAll('.data-direction-unit.units-wad.units-wad-deg.data--minor.weathertable__cell'),
        parsing_rawData_waveheight = root.querySelectorAll('.data-waveheight.data--major.weathertable__cell'), //height 83
        parsing_rawData_wavefreq = root.querySelectorAll('.data-wavefreq.data--minor.weathertable__cell'), //frequency 83
        parsing_snowrain = root.querySelectorAll('.data-preciptype.weathertable__cell');

    /* -------------------------------------------
     declare variable using in daily data.
     --------------------------------------------*/

    var speed_gust;
    var temp_pressure;
    var temperature, pressure;
    var tWind, tGust;
    var wind, gust;
    var winddirectionarrow;
    var time;
    var tideFreq, tideHeight, tidedirections;
    var waveheight, wavefreq, wavedirection;
    var snowrain;
    var tideYN;
    var directionName;

    /* -------------------------------------------
     sectionIDs(date) translate to Korean.
     --------------------------------------------*/
    var dayoftheweek_kor, month_kor, today,
        currentTime = new Date();
    // var year = String(currentTime).split(' ');

    var d; // 날짜와 시간을 ',', 빈칸기준으로 나눠서 배열화함
    var dayoftheweek; // yo il
    var month; // month란 이름의 변수에 'd' 배열의 두 번째 숫자(월)를 지정
    var day; // day란 이름의 변수에 'd' 배열의 세 번째 숫자(일)를 지정

    /* -------------------------------------------
     return Object
     --------------------------------------------*/
    var rowJson;

    //i : 1day, j : 3h/1day
    for(i =0; i<parsing_sectionData.length; i++){

        d = (parsing_sectionData[i].removeWhitespace().rawText).split(' '); // 날짜와 시간을 ',', 빈칸기준으로 나눠서 배열화함
        dayoftheweek = d[0]; // yo il
        month = d[1]; // month란 이름의 변수에 'd' 배열의 두 번째 숫자(월)를 지정
        day = d[2].substr(0,2); // day란 이름의 변수에 'd' 배열의 세 번째 숫자(일)를 지정.

        switch (dayoftheweek) {
            case 'Sunday,'    :  dayoftheweek_kor = "일요일"; break;
            case 'Monday,'    :  dayoftheweek_kor = "월요일"; break;
            case 'Tuesday,'   :  dayoftheweek_kor = "화요일"; break;
            case 'Wednesday,' :  dayoftheweek_kor = "수요일"; break;
            case 'Thursday,'  :  dayoftheweek_kor = "목요일"; break;
            case 'Friday,'    :  dayoftheweek_kor = "금요일"; break;
            case 'Saturday,'  :  dayoftheweek_kor = "토요일"; break;
            default          :  dayoftheweek_kor = dayoftheweek; break;
        };

        switch (month) {
            case 'Jan'  :  month_kor = "1월"; break;
            case 'Feb'  :  month_kor = "2월"; break;
            case 'Mar'  :  month_kor = "3월"; break;
            case 'Apr'  :  month_kor = "4월"; break;
            case 'May'  :  month_kor = "5월"; break;
            case 'Jun'  :  month_kor = "6월"; break;
            case 'Jul'  :  month_kor = "7월"; break;
            case 'Aug'  :  month_kor = "8월"; break;
            case 'Sep'  :  month_kor = "9월"; break;
            case 'Oct'  :  month_kor = "10월"; break;
            case 'Nov'  :  month_kor = "11월"; break;
            case 'Dec'  :  month_kor = "12월"; break;
            default     :  month_kor = month; break;
        };

        today = month_kor + " " + day + "일, " + dayoftheweek_kor;

        sectionIDs.push(today);
        dataBlob[sectionIDs[i]] = sectionIDs[i];
        rowIDs[i] = [];

        /* -------------------------------------------
         configure lastupdate, local stats
         --------------------------------------------*/
        var lastUpdateArr, localStatsArr, lastUpdate, sunRise, sunSet;

        if(parsing_localstats){
            localStatsArr = parsing_localstats.removeWhitespace().rawText;

            sunRise = localStatsArr.substr(7,4);
            sunSet = localStatsArr.substr(17,5);

            sunInfo.push(sunRise);
            sunInfo.push(sunSet);
        }

        if(parsing_lastUpdate){
            lastUpdateArr = parsing_lastUpdate.removeWhitespace().rawText ;
            // lastUpdate = year[3] + "년 " + month_kor + " " + day + "일 " + lastUpdateArr.substr(12,5);
            lastUpdate = month_kor + " " + day + "일 " + lastUpdateArr.substr(12,5);
            sunInfo.push(lastUpdate);
        }

        /* ------------------------------------
         configure daily data
         ---------------------------------------*/

        for(j=count;j<((parsing_rowData_time.length-count)>8?(count+8):(count+3));j++){

            speed_gust = parsing_rawData_direction_speed_gust[j].removeWhitespace().structuredText.split('\n');
            temp_pressure = parsing_rawData_temp_pressure[j].removeWhitespace().structuredText.split('\n');
            temperature = /\d+/.exec(temp_pressure[0]), pressure = /\d+/.exec(temp_pressure[1]);
            tWind = /\d+/.exec(speed_gust[0]), tGust = /\d+/.exec(speed_gust[1]);
            winddirectionarrow = /\d+/.exec(parsing_rawData_directionarrow_wind[j].removeWhitespace().rawText);
            time = '';
            tideFreq = '', tideHeight = '', tidedirections = '';
            waveheight = '', wavefreq = '', wavedirection = '';
            snowrain = '';
            tideYN = "N";

            //knotes -> m/s
            if(tWind[0] % 2 == 0)       wind = Number(tWind[0])/2;
            else                        wind = (Number(tWind[0])+1)/2;

            if(tGust[0] % 2 == 0)       gust = Number(tGust[0])/2;
            else                        gust = (Number(tGust[0])+1)/2;

            if(typeof parsing_snowrain[j].childNodes[1] == "undefined"){
                snowrain = "";
            } else  {
                if(parsing_snowrain[j].childNodes[1].classNames[0].substr(5,5) == 'rain-')          snowrain = '0';
                else if (parsing_snowrain[j].childNodes[1].classNames[0].substr(5,8) == 'rainsnow') snowrain = '2';
                else                                                                                snowrain = '1';
                    //눈만 오는 정보가 아직 확실하지 않기 때문에 그 외 정보를 1 로 받아보기로 한다.
            }

            if(typeof parsing_rowData_tides[j] == "undefined"){
                tidedirections = "", tideFreq = "", tideHeight = "";
            } else  {

                if(typeof parsing_rowData_tideHeight[j] == "undefined") tideHeight = "";
                else                                                    tideHeight = parsing_rowData_tideHeight[j].removeWhitespace().rawText.replace(/m/,"");;


                if(typeof parsing_rowData_tideFreq[j] == "undefined") tideFreq = "";
                else                                                  tideFreq = parsing_rowData_tideFreq[j].removeWhitespace().rawText;

                if(typeof parsing_rowData_tidedirections[j]== "undefined"){
                } else  {
                    directionName = parsing_rowData_tidedirections[j].childNodes[1].classNames[1];
                    if(directionName == 'icon-wf-i-down')       tidedirections = 'down';
                    else if (directionName == 'icon-wf-i-low')  tidedirections = 'low';
                    else if (directionName == 'icon-wf-i-up')   tidedirections = 'up';
                    else if (directionName == 'icon-wf-i-high') tidedirections = 'high';
                    else                                           tidedirections = '';

                    tideYN = "Y" ;
                }
            }


            if(typeof parsing_rawData_wavefreq[j] == "undefined") wavefreq = "";
            else                                                  wavefreq = parsing_rawData_wavefreq[j].removeWhitespace().rawText.replace(/s/,"");

            if(typeof parsing_rawData_waveheight[j] == "undefined") waveheight = "";
            else                                                    waveheight = parsing_rawData_waveheight[j].removeWhitespace().rawText.replace(/m/, "");


            if(typeof parsing_rawData_directionarrow_wave[j] == "undefined") wavedirection = "";
            else                                                             wavedirection = /\d+/.exec(parsing_rawData_directionarrow_wave[j].removeWhitespace().rawText);


            time = parsing_rowData_time[j].removeWhitespace().rawText.replace(/h/, "");

            rowJson = {
                "key"               : "rowID" + j,
                "time"              : time,
                "cloud"             : parsing_rawData_cover[j].removeWhitespace().rawText.replace(/%/, ""),
                "snowrain"          : snowrain,
                "temperature"       : temperature[0],
                "pressure"          : pressure[0],
                "winddirection"     : winddirectionarrow[0],
                "rainPrecipitation" : parsing_rawData_precipitation[j].removeWhitespace().rawText.replace(/mm/, ""),
                "waveheight"        : waveheight,
                "wavefrequency"     : wavefreq,
                "wavedirection"     : wavedirection[0],
                "tideheight"        : tideHeight,
                "tidefreq"          : tideFreq,
                "tidedirections"    : tidedirections,
                "wind" : wind,
                "gust" : gust,
            };

            rowIDs[i].push(rowJson.key);
            dataBlob[today + ':' + rowJson.key] = rowJson;
        }
        count = count + 8;
    }

    return {dataBlob,sectionIDs, rowIDs,sunInfo,tideYN};
}
