/**
 * Created by maestrolsj on 16. 8. 28.
 */
exports.getSurfWeather = getSurfWeather;
exports.getTest = getTest;


var HTMLParser = require('fast-html-parser');

function getTest (responseData){

    console.log("---------- test test parser OK !---------------------");

    var dataBlob = {},
        sectionIDs = [],
        rowIDs = {};

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
    dataBlob['Marketing'].push(testData[0]);
    dataBlob['Marketing'].push(testData[1]);
    dataBlob['Marketing'].push(testData[0]);
    dataBlob['Marketing'].push(testData[1]);
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
    dataBlob['Sales'].push(testData[3]);
    dataBlob['Sales'].push(testData[4]);
    dataBlob['Sales'].push(testData[3]);
    dataBlob['Sales'].push(testData[4]);
    dataBlob['Sales'].push(testData[3]);
    dataBlob['Sales'].push(testData[4]);
    dataBlob['Sales'].push(testData[3]);
    dataBlob['Sales'].push(testData[4]);
    dataBlob['Sales'].push(testData[3]);
    dataBlob['Sales'].push(testData[4]);
    dataBlob['Sales'].push(testData[3]);
    dataBlob['Sales'].push(testData[4]);
    dataBlob['Sales'].push(testData[3]);
    dataBlob['Sales'].push(testData[4]);
    dataBlob['Sales'].push(testData[3]);
    dataBlob['Sales'].push(testData[4]);
    dataBlob['Sales'].push(testData[3]);
    dataBlob['Sales'].push(testData[4]);
    dataBlob['Sales'].push(testData[3]);
    dataBlob['Sales'].push(testData[4]);
    dataBlob['Sales'].push(testData[3]);
    dataBlob['Sales'].push(testData[4]);
    dataBlob['Sales'].push(testData[3]);
    dataBlob['Sales'].push(testData[4]);
    dataBlob['Sales'].push(testData[3]);
    dataBlob['Sales'].push(testData[4]);

    sectionIDs.push('Account');
    dataBlob['Account']=[];
    dataBlob['Account'].push(testData[5]);
    dataBlob['Account'].push(testData[6]);
    dataBlob['Account'].push(testData[5]);
    dataBlob['Account'].push(testData[6]);
    dataBlob['Account'].push(testData[5]);
    dataBlob['Account'].push(testData[6]);
    dataBlob['Account'].push(testData[6]);
    dataBlob['Account'].push(testData[5]);
    dataBlob['Account'].push(testData[6]);
    dataBlob['Account'].push(testData[5]);
    dataBlob['Account'].push(testData[6]);
    dataBlob['Account'].push(testData[5]);
    dataBlob['Account'].push(testData[6]);
    dataBlob['Account'].push(testData[5]);
    dataBlob['Account'].push(testData[6]);
    dataBlob['Account'].push(testData[5]);
    dataBlob['Account'].push(testData[6]);
    dataBlob['Account'].push(testData[5]);
    dataBlob['Account'].push(testData[6]);
    dataBlob['Account'].push(testData[5]);
    dataBlob['Account'].push(testData[6]);
    dataBlob['Account'].push(testData[5]);
    dataBlob['Account'].push(testData[6]);
    dataBlob['Account'].push(testData[5]);
    dataBlob['Account'].push(testData[6]);
    dataBlob['Account'].push(testData[5]);
    dataBlob['Account'].push(testData[6]);
    dataBlob['Account'].push(testData[5]);
    dataBlob['Account'].push(testData[6]);
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
        rowIDs = [],
        i, j, count =0,

        parsing_sectionData = root.querySelectorAll('.weathertable__header'),
        //    parsing_rawData = root.querySelectorAll('.weathertable__body');


        parsing_rowData_time = root.querySelectorAll('.data-time.weathertable__cell'), //time 83

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

    for(i=0;i<1;i++){
        console.log("---------- parsing data display ---------------------");
        console.log("parsing_rowData_time :" + parsing_rowData_time[i].removeWhitespace().rawText);

        console.log("parsing_rawData_cover :" + parsing_rawData_cover[i].removeWhitespace().rawText);
        console.log("parsing_rawData_preciptype :" + parsing_rawData_preciptype[i].removeWhitespace().rawText);

        console.log("parsing_rawData_temp_pressure :" + parsing_rawData_temp_pressure.length);
        console.log("parsing_rawData_temp :" + parsing_rawData_temp[i].removeWhitespace().rawText);
        console.log("parsing_rawData_pressure :" + parsing_rawData_pressure[i].removeWhitespace().rawText);

        console.log("parsing_rawData_direction_speed_gust :" + parsing_rawData_direction_speed_gust[i].removeWhitespace().structuredText);
        console.log("parsing_rawData_directionarrow_wind :" + parsing_rawData_directionarrow_wind[i].removeWhitespace().rawText);
        //    console.log("parsing_rawData_speed :" + parsing_rawData_speed[i].removeWhitespace().rawText);
        //   console.log("parsing_rawData_gust :" + parsing_rawData_gust[i].removeWhitespace().rawText);

        //     console.log("parsing_rawData_directionarrow_wave :" + parsing_rawData_directionarrow_wave[i].removeWhitespace().rawText);
        console.log("parsing_rawData_waveheight :" + parsing_rawData_waveheight[i].removeWhitespace().rawText);
        console.log("parsing_rawData_wavefreq :" + parsing_rawData_wavefreq[i].removeWhitespace().rawText);
    }

    //i : 1day, j : 3h/1day
    for(i =0; i<parsing_sectionData.length; i++){
        sectionIDs.push(parsing_sectionData[i].removeWhitespace().rawText);
        dataBlob[sectionIDs[i]] = [];
        rowIDs[i] = [];

        for(j=count;j<((parsing_rowData_time.length-count)>8?(count+8):(count+3));j++){
            var speed_gust = parsing_rawData_direction_speed_gust[j].removeWhitespace().structuredText.split('\n');
            var temp_pressure = parsing_rawData_temp_pressure[j].removeWhitespace().structuredText.split('\n');

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
                "waveheight" : parsing_rawData_waveheight[j].removeWhitespace().rawText,
                "wavefrequency" : parsing_rawData_wavefreq[j].removeWhitespace().rawText,

                "howGoodTosurf" : ""
            };

            //      rowIDs[i].push(parsing_rawData_cover[j].removeWhitespace().rawText);

            //  dataBlob[sectionIDs[i]][parsing_rowData_time[j].removeWhitespace().rawText] = [];

            //       dataBlob[sectionIDs[i]][k] = [];
            //       dataBlob[sectionIDs[i]+':'+ rowJson.key] = rowJson;
            //   rowIDs[i].push(rowJson.key);
            //     dataBlob[sectionIDs[i] + ':' + rowJson.key] = rowJson;
            dataBlob[sectionIDs[i]].push(rowJson);


            // dataBlob[sectionIDs[i]].push(rowJson);
        }

        count = count + 8;
    }
    console.log("========================>" + dataBlob[sectionIDs[9]][2].key);
    console.log('end ok');
    //
    // for(var a in sectionIDs){
    //     console.log(">>>>sectionIDs  -> idx " + a + ' = ' + sectionIDs[a]);
    // }


    return {dataBlob, sectionIDs};

}

