exports.getGlidingWeather = getGlidingWeather;


function getGlidingWeather (responseJSON,myOs){

    var today = new Date();
    var localeDate  =  today.toLocaleDateString()    ;

    var year, month, date;

    if(myOs == 'ios'){
        year      = localeDate.substr(0,4);
        month     = localeDate.substr(5,2)     ;
        date      = localeDate.substr(9,2)     ;
    }else{
        year        = '20'+localeDate.substr(6,4);
        month       = localeDate.substr(0,2)     ;
        date        = localeDate.substr(3,2)     ;
    }

    var dataBlob   = {};
    var sectionIDs = [];
    var rowIDs     = [];
    var sunInfo    = [];  // sunRise, sunSet Time, updateTime

    sectionIDs.push('9y9m9d');
    dataBlob[sectionIDs[0]] = sectionIDs[0];

    rowIDs[0] = [];
    rowIDs[0].push('tempRowIds');
    dataBlob['9y9m9d' + ':' + 'tempRowIds'] = {};

    // set the sun Info
    sunInfo.push(responseJSON.sunrise);
    sunInfo.push(responseJSON.sunset) ;

    // Wind info
    var responseJSON = responseJSON.fcst['3'];
    var update_last = responseJSON.update_last.split(' ');
    var upYyyymmdd  = update_last[0].split('-');
    var upHms       = update_last[1].split(':');

    var upMonth = upYyyymmdd[1] ;
    var upDate  = upYyyymmdd[2] ;
    var upTime  = upHms[0] + ":" + upHms[1];

    update_last = upMonth + "월" + upDate + "일" + " " + upTime;
    sunInfo.push(update_last) ;
    var totalRow = responseJSON.hr_h.length;

    var dayArr=responseJSON.hr_d.filter(function(itm,i,a){ // 가져온 일자 배열 ex) [10,11,12,13,14,15,16,17,18,19,20]
        return i == responseJSON.hr_d.indexOf(itm);
    });

    var dayArrIdx = 0;
    var week      = new Array(', 일요일', ', 월요일', ', 화요일', ', 수요일', ', 목요일', ', 금요일', ', 토요일');
    var day        = week[today.getDay()];
    var sectionKey = month+'월 '+date+'일 '+day;

    sectionIDs.push(sectionKey);         //  첫번 째 섹션헤더(오늘 년월일) push

    dataBlob[sectionIDs[1]] = sectionKey;
    rowIDs[1] = [];

    for(var i=0,j=1; i < totalRow; i++){

        if(responseJSON.hr_h[i] === '00') {

            today.setDate(today.getDate() + 1);
            localeDate = today.toLocaleDateString()    ;

            if(myOs == 'ios'){
                year      = localeDate.substr(0,4);
                month     = localeDate.substr(5,2)     ;
                date      = localeDate.substr(9,2)     ;
            }else{
                year      = '20'+localeDate.substr(6,4);
                month     = localeDate.substr(0,2)     ;
                date      = localeDate.substr(3,2)     ;
            }

            day = week[today.getDay()];

            if(i==0){
                sectionIDs=[];
                rowIDs=[];
                j= -1;
            }

            j++;
            sectionKey = month+'월 '+date+'일 '+day;
            sectionIDs.push(sectionKey);
            rowIDs[j] = [];
            dataBlob[sectionIDs[j]] = sectionKey;

        }
        var rowJson={
            "key" : "rowID" + i,
            "time"        : responseJSON.hr_h[i],    // 시간
            "temperature" : responseJSON.TMPE[i],    // 온도
            "rain"        : responseJSON.APCP[i],    // 강수량
            "cloud"       : responseJSON.TCDC[i],    // 구름
            "snowYn"      : responseJSON.PCPT[i],    // 0:비, 1:눈
            "windSpeed"   : (responseJSON.WINDSPD[i]*0.514).toFixed(1), // 바람스피드
            "windDir"     : responseJSON.WINDDIR[i], // 바람방향
            "windGust"    : (responseJSON.GUST[i]*0.514).toFixed(1),    // 돌풍
        };
        rowIDs[j].push(rowJson.key);
        dataBlob[sectionKey + ':' + rowJson.key] = rowJson;
    }

    return {dataBlob,sectionIDs, rowIDs,sunInfo};

}
