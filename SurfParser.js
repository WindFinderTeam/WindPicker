/**
 * Created by maestrolsj on 16. 8. 28.
 */
exports.getSurfWeather = getSurfWeather;
exports.getTest = getTest;


var HTMLParser = require('fast-html-parser');

function getTest (responseData){

    console.log("---------- test test parser OK !---------------------");

    var dataBlob = {},
        sectionIDs = [];

    var testData = [
        {"firstName":"Black","lastName":"Garrett"},
        {"firstName":"Morales","lastName":"Duncan"},
        {"firstName":"Ramos","lastName":"King"},
        {"firstName":"Dunn","lastName":"Collins"},
        {"firstName":"Fernandez","lastName":"Montgomery"},
        {"firstName":"Burns","lastName":"Fox"},
        {"firstName":"Richardson","lastName":"Kim"}];

    sectionIDs.push('Marketing');
    dataBlob['Marketing']=[];
    dataBlob['Marketing'].push(testData[0]);
    dataBlob['Marketing'].push(testData[1]);
    dataBlob['Marketing'].push(testData[0]);
    dataBlob['Marketing'].push(testData[1]);

    sectionIDs.push('Sales');
    dataBlob['Sales']=[];
    dataBlob['Sales'].push(testData[3]);
    dataBlob['Sales'].push(testData[4]);
    dataBlob['Sales'].push(testData[3]);
    dataBlob['Sales'].push(testData[4]);
    dataBlob['Sales'].push(testData[4]);

    sectionIDs.push('Account');
    dataBlob['Account']=[];
    dataBlob['Account'].push(testData[5]);
    dataBlob['Account'].push(testData[6]);
    dataBlob['Account'].push(testData[5]);
    dataBlob['Account'].push(testData[6]);

    return {dataBlob, sectionIDs};

}


function getSurfWeather (responseData){

    var htmlTest = responseData._bodyInit;
    var root = HTMLParser.parse(htmlTest);

    console.log("---------- parser call ok ---------------------");
    // call header section
    var dataBlob = {},
        sectionIDs = [],
        i, j, count =0,

        /* ------------------------------
        last update, sunrise, sunset
         -------------------------------*/
        parsing_lastUpdate = root.querySelector('.tabmeta__update'),
        parsing_localstats = root.querySelector('.spotmeta__localstats'),

        /* ------------------------------
         daily weather
         -------------------------------*/

        parsing_sectionData = root.querySelectorAll('.weathertable__header'),
        //parsing_rawData = root.querySelectorAll('.weathertable__body');

        parsing_rowData_time = root.querySelectorAll('.cell-timespan.weathertable__cellgroup.weathertable__cellgroup--stacked'), //time 83

        parsing_rowData_tides = root.querySelectorAll('.cell-tides.weathertable__cellgroup.weathertable__cellgroup--stacked'), //tide
        parsing_rowData_tideHeight = root.querySelectorAll('.data-tideheight.weathertable__cell'), //height
        parsing_rowData_tideFreq = root.querySelectorAll('.data-tidefreq.data--minor.weathertable__cell.data-time'), //time
        parsing_rowData_tideDerections = root.querySelectorAll('.data-tidedirection.weathertable__cell'), //image.defection.must get div class

        parsing_rawData_cover = root.querySelectorAll('.data-cover.weathertable__cell'), //cloud 83
        parsing_rawData_preciptype = root.querySelectorAll('.data-preciptype.weathertable__cell'), //precipation 83


        parsing_rawData_temp_pressure = root.querySelectorAll('.cell-weather-2.weathertable__cellgroup'), //temp+pressure 83
        parsing_rawData_temp = root.querySelectorAll('.data-temp.data--major.ws18.weathertable__cell'), //temperature 28
        parsing_rawData_pressure = root.querySelectorAll('.data-pressure.data--minor.weathertable__cell'), //pressure 83

        parsing_rawData_direction_speed_gust = root.querySelectorAll('.cell-wind-3.weathertable__cellgroup'), //total 83
        parsing_rawData_directionarrow_wind = root.querySelectorAll('.data-direction-unit.units-wd.units-wd-deg.data--minor.weathertable__cell');
        //wind direction arrow(icon) //now text 83
        //parsing_rawData_speed = root.querySelectorAll('.data-bar.data--major.weathertable__cell.wsmax-level-3'), //wind 48
        //parsing_rawData_gust = root.querySelectorAll('.data-gusts.data--minor.ws1.weathertable__cell'), //gust(max) 18

        parsing_rawData_directionarrow_wave = root.querySelectorAll('data-direction-unit.units-wad.units-wad-deg.data--minor.weathertable__cell');
        //wave direction arrow(icon) //now text 0
        parsing_rawData_waveheight = root.querySelectorAll('.data-waveheight.data--major.weathertable__cell'), //height 83
        parsing_rawData_wavefreq = root.querySelectorAll('.data-wavefreq.data--minor.weathertable__cell'); //frequency 83

    for(i=0;i<10;i++){
        console.log("----------------- parsing data display ---------------------");

        if(typeof parsing_rowData_tides[i] == "undefined"){
            console.log("parsing_rowData_tides : NOTHING!!! " );
        } else  {
            console.log("tides ok ok ok ::: " + parsing_rowData_tides[i].removeWhitespace().rawText);
            if(typeof parsing_rowData_tideHeight[i] == "undefined"){
                console.log("parsing_rowData_tideHeight : NOTHING!!! " );
            } else  {
                console.log("parsing_rowData_tideHeight :" + parsing_rowData_tideHeight[i].removeWhitespace().rawText);
            }

            if(typeof parsing_rowData_tideFreq[i] == "undefined"){
                console.log("parsing_rowData_tideFreq : NOTHING!!! " );
            } else  {
                console.log("parsing_rowData_tideFreq :" + parsing_rowData_tideFreq[i].removeWhitespace().rawText);
            }

            if(typeof parsing_rowData_tideDerections[i] == "undefined"){
                console.log("parsing_rowData_tideDerections : NOTHING!!! " );
            } else  {
                console.log("parsing_rowData_tideDerections :" + parsing_rowData_tideDerections[i].removeWhitespace().rawText);
            }



        }

        console.log("parsing_rowData_time :" + parsing_rowData_time[i].removeWhitespace().rawText);

        console.log("parsing_rawData_cover :" + parsing_rawData_cover[i].removeWhitespace().rawText);
        console.log("parsing_rawData_preciptype :" + parsing_rawData_preciptype[i].removeWhitespace().rawText);

        console.log("parsing_rawData_temp_pressure :" + parsing_rawData_temp_pressure.length);
        console.log("parsing_rawData_temp :" + parsing_rawData_temp[i].removeWhitespace().rawText);
        console.log("parsing_rawData_pressure :" + parsing_rawData_pressure[i].removeWhitespace().rawText);

        console.log("parsing_rawData_direction_speed_gust :" + parsing_rawData_direction_speed_gust[i].removeWhitespace().structuredText);
        console.log("parsing_rawData_directionarrow_wind :" + parsing_rawData_directionarrow_wind[i].removeWhitespace().rawText);
        //console.log("parsing_rawData_speed :" + parsing_rawData_speed[i].removeWhitespace().rawText);
        //console.log("parsing_rawData_gust :" + parsing_rawData_gust[i].removeWhitespace().rawText);

        //console.log("parsing_rawData_directionarrow_wave :" + parsing_rawData_directionarrow_wave[i].removeWhitespace().rawText);
        console.log("parsing_rawData_waveheight :" + parsing_rawData_waveheight[i].removeWhitespace().rawText);
        console.log("parsing_rawData_wavefreq :" + parsing_rawData_wavefreq[i].removeWhitespace().rawText);
    }
    /* -------------------------------------------
     configure lastupdate, local stats
     --------------------------------------------*/
    var lastUpdateArr, localStatsArr, lastUpdate, sunRise, sunSet;

    lastUpdateArr = parsing_lastUpdate.removeWhitespace().rawText ;
    localStatsArr = parsing_localstats.removeWhitespace().rawText;
    lastUpdate = lastUpdateArr.substr(12,5);
    sunRise = localStatsArr.substr(0,4);
    sunSet = localStatsArr.substr(4,5);

    console.log("lastUpdate, sunRise, sunSet ::::::::::::" + lastUpdate, sunRise, sunSet);

    /* -------------------------------------------
    sectionIDs(date) translate to Korean.
     --------------------------------------------*/
    var dayoftheweek_kor, month_kor, today,
        currentTime = new Date();
    var year = String(currentTime).split(' ');

    //i : 1day, j : 3h/1day
    for(i =0; i<parsing_sectionData.length; i++){

        var d = (parsing_sectionData[i].removeWhitespace().rawText).split(' '); // 날짜와 시간을 ',', 빈칸기준으로 나눠서 배열화함
        var dayoftheweek = d[0]; // yo il
        var month = d[1]; // month란 이름의 변수에 'd' 배열의 두 번째 숫자(월)를 지정
        var day = Number(d[2]); // day란 이름의 변수에 'd' 배열의 세 번째 숫자(일)를 지정

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

        console.log("today: " + today); // 괄호()안에 지정한 형식으로 날짜 표시
        today = year[3] + "년 " + month_kor + " " + day + "일, " + dayoftheweek_kor;

        //sectionIDs.push(parsing_sectionData[i].removeWhitespace().rawText);
        sectionIDs.push(today);

        /* -------------------------------------------
         configure tideTime, tideHeight, tide
         --------------------------------------------*/


        /* ------------------------------------
         configure daily data
        ---------------------------------------*/

        dataBlob[sectionIDs[i]] = [];

        for(j=count;j<((parsing_rowData_time.length-count)>8?(count+8):(count+3));j++){

            var speed_gust = parsing_rawData_direction_speed_gust[j].removeWhitespace().structuredText.split('\n');
            var temp_pressure = parsing_rawData_temp_pressure[j].removeWhitespace().structuredText.split('\n');
            var waveheight, wavefreq;
            var tideFreq, tideHeight, tideDerections;

            if(typeof parsing_rawData_waveheight[j] == "undefined"){
                tideType = "", tideTime = "", tideHeight = "" ;
            } else  {
                tideTime = "", tideHeight = "", tideType = "";
            }

            if(typeof parsing_rawData_wavefreq[j] == "undefined"){
                wavefreq = "";
            } else  {
                wavefreq = parsing_rawData_wavefreq[j].removeWhitespace().rawText;
            }

            if(typeof parsing_rowData_tideHeight[j] == "undefined"){
                tideHeight = "";
            } else  {
                tideHeight = parsing_rowData_tideHeight[j].removeWhitespace().rawText;
            }

            if(typeof parsing_rowData_tideFreq[j] == "undefined"){
                tideFreq = "";
            } else  {
                tideFreq = parsing_rowData_tideFreq[j].removeWhitespace().rawText;
            }

            if(typeof parsing_rowData_tideDerections[j] == "undefined"){
                tideDerections = "";
            } else  {
                tideDerections = parsing_rowData_tideDerections[j].removeWhitespace().rawText;
            }

            var rowJson = {
                "key" : "rowID" + j,
                "time" : parsing_rowData_time[j].removeWhitespace().rawText,
                "cloud" : parsing_rawData_cover[j].removeWhitespace().rawText,
                "rainprecipation" : parsing_rawData_preciptype[j].removeWhitespace().rawText,
                "temperature" : temp_pressure[0],
                "pressure" : temp_pressure[1],

                "winddirectionarrow" : "",
                "wind" : speed_gust[0],
                "gust" : speed_gust[1],
                "wavedirectionarrow" : "",
                "waveheight" : waveheight,
                "wavefrequency" : wavefreq,

                "tideHeight" : tideHeight,
                "tideFreq" : tideFreq,
                "tideDerections" : tideDerections,

                "howGoodTosurf" : ""
            };

            //rowIDs[i].push(parsing_rawData_cover[j].removeWhitespace().rawText);
            //dataBlob[sectionIDs[i]][parsing_rowData_time[j].removeWhitespace().rawText] = [];
            //dataBlob[sectionIDs[i]][k] = [];
            //dataBlob[sectionIDs[i]+':'+ rowJson.key] = rowJson;
            //rowIDs[i].push(rowJson.key);
            dataBlob[sectionIDs[i]].push(rowJson);

        }

        count = count + 8;
    }
    console.log("========================>" + dataBlob[sectionIDs[9]][2].key);
    console.log('end ok');

    return {dataBlob, sectionIDs};
}

