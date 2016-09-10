/**
 * Created by maestrolsj on 16. 8. 28.
 */
exports.getGlidingWeather = getGlidingWeather;


function getGlidingWeather (responseJSON){



    var d = new Date();
    var localeDate  =  d.toLocaleDateString();
    var year = '20'+localeDate.substr(6,4);
    var month = localeDate.substr(0,2);
    var date = localeDate.substr(3,2);


    var dataBlob   = {};
    var sectionIDs = [];

    var responseJSON = responseJSON.fcst['3'];
    var totalRow = responseJSON.hr_h.length;

    var dayArr=responseJSON.hr_d.filter(function(itm,i,a){ // 가져온 일자 배열 ex) [10,11,12,13,14,15,16,17,18,19,20]
        return i == responseJSON.hr_d.indexOf(itm);
    });
    var dayArrIdx = 0;
    var week = new Array('(일)', '(월)', '(화)', '(수)', '(목)', '(금)', '(토)');

    var day = week[new Date(year+'-'+month+'-'+dayArr[dayArrIdx]).getDay()];
    sectionIDs.push(month+'월 '+dayArr[dayArrIdx]+'일 '+day); //  첫번 째 섹션헤더 push

    console.log(" Total Rows >>>>>>  " + totalRow);


    for(var i=0,j=0; i < totalRow; i++){

        if(responseJSON.hr_h[i] === '00') {
            dayArrIdx++;
            day = week[new Date(year+'-'+month+'-'+dayArr[dayArrIdx]).getDay()];
            if(i==0) var sectionIDs = [];
            sectionIDs.push(month+'월 '+dayArr[dayArrIdx]+'일 '+day);
            j++;
        }
        var rowJson={

        };
        dataBlob[sectionIDs[j]].push(rowJson);
    }



    sectionIDs.push('Marketing');
    dataBlob['Marketing']=[];
    dataBlob['Marketing'].push(testData[0]);


    sectionIDs.push('Sales');
    dataBlob['Sales']=[];
    dataBlob['Sales'].push(testData[3]);
    dataBlob['Sales'].push(testData[4]);
    dataBlob['Sales'].push(testData[3]);

    sectionIDs.push('Account');
    dataBlob['Account']=[];
    dataBlob['Account'].push(testData[5]);
    dataBlob['Account'].push(testData[6]);



    return {dataBlob, sectionIDs};


}