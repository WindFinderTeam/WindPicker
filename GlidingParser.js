exports.getGlidingWeather = getGlidingWeather;


function getGlidingWeather (responseJSON){


    var d = new Date();
    var localeDate  =  d.toLocaleDateString()    ;
    var year        = '20'+localeDate.substr(6,4);
    var month       = localeDate.substr(0,2)     ;
    var date        = localeDate.substr(3,2)     ;

    var dataBlob   = {};
    var sectionIDs = [];
    var rowIDs     = [];
    var sunInfo    = [];  // sunRise, sunSet Time, updateTime


    // set the sun Info
    sunInfo.push(responseJSON.sunrise);
    sunInfo.push(responseJSON.sunset) ;



    // Wind info
    var responseJSON = responseJSON.fcst['3'];

    var update_last = new Date(responseJSON.update_last);
    var update_last = update_last.toString().split(' ');

    var upDay   = update_last[0] ;
    var upMonth = update_last[1] ;
    var upDate  = update_last[2] ;
    var upTime  = update_last[4].substring(0,5);

    switch (upDay) {
        case 'Sun':  upDay = ", 일"; break;
        case 'Mon':  upDay = ", 월"; break;
        case 'Tue':  upDay = ", 화"; break;
        case 'Wed':  upDay = ", 수"; break;
        case 'Thu':  upDay = ", 목"; break;
        case 'Fri':  upDay = ", 금"; break;
        case 'Sat':  upDay = ", 토"; break;
    };

    switch (upMonth) {
        case 'Jan':  upMonth = "01."; break;
        case 'Feb':  upMonth = "02."; break;
        case 'Mar':  upMonth = "03."; break;
        case 'Apr':  upMonth = "04."; break;
        case 'May':  upMonth = "05."; break;
        case 'Jun':  upMonth = "06."; break;
        case 'Jul':  upMonth = "07."; break;
        case 'Aug':  upMonth = "08."; break;
        case 'Sep':  upMonth = "09."; break;
        case 'Oct':  upMonth = "10."; break;
        case 'Nov':  upMonth = "11."; break;
        case 'Dec':  upMonth = "12."; break;
    };

    update_last = upMonth + upDate +  upDay + " "+upTime;
    sunInfo.push(update_last) ;
    var totalRow = responseJSON.hr_h.length;

    var dayArr=responseJSON.hr_d.filter(function(itm,i,a){ // 가져온 일자 배열 ex) [10,11,12,13,14,15,16,17,18,19,20]
        return i == responseJSON.hr_d.indexOf(itm);
    });

    var dayArrIdx = 0;
    var week      = new Array('(일)', '(월)', '(화)', '(수)', '(목)', '(금)', '(토)');

    var day        = week[new Date(year+'-'+month+'-'+dayArr[dayArrIdx]).getDay()];
    var sectionKey = month+'월 '+dayArr[dayArrIdx]+'일 '+day;

    sectionIDs.push(sectionKey);         //  첫번 째 섹션헤더(오늘 년월일) push

    dataBlob[sectionIDs[0]] = sectionKey;
    rowIDs[0] = [];

    for(var i=0,j=0; i < totalRow; i++){



        if(responseJSON.hr_h[i] === '00') {
            dayArrIdx++;
            day = week[new Date(year+'-'+month+'-'+dayArr[dayArrIdx]).getDay()];
            if(i==0){
                sectionIDs=[];
                rowIDs=[];
                j= -1;
            }
            j++;
            sectionKey = month+'월 '+dayArr[dayArrIdx]+'일 '+day;
            sectionIDs.push(sectionKey);
            rowIDs[j] = [];
            dataBlob[sectionIDs[j]] = sectionKey;

        }
        var rowJson={
            "key" : "rowID" + i,
            "time"        : responseJSON.hr_h[i],    // 시간
            "temperature" : responseJSON.TMPE[i],    // 온도
            "rain"        : responseJSON.APCP[i],    // 강수량
            "cloud"       : responseJSON.HCDC[i],    // 구름
            "windSpeed"   : responseJSON.WINDSPD[i], // 바람스피드
            "windDir"     : responseJSON.WINDDIR[i], // 바람방향
            "windGust"    : responseJSON.GUST[i],    // 돌풍
        };
        rowIDs[j].push(rowJson.key);
        // dataBlob[sectionIDs[j]].push(rowJson);
        dataBlob[sectionKey + ':' + rowJson.key] = rowJson;
    }

    return {dataBlob,sectionIDs, rowIDs,sunInfo};


}