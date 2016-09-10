/**
 * Created by maestrolsj on 16. 8. 28.
 */
exports.getGlidingWeather = getGlidingWeather;


function getGlidingWeather (responseJSON){

    var week = new Array('(일)', '(월)', '(화)', '(수)', '(목)', '(금)', '(토)');

    var d = new Date();
    var localeDate  =  d.toLocaleDateString();
    var year = '20'+localeDate.substr(6,4);
    var month = localeDate.substr(0,2);
    var date = localeDate.substr(3,2);
    var day = week[new Date(year+'-'+month+'-'+date).getDay()];

    var dataBlob   = {};
    var sectionIDs = [];

    //responseJSON.hr_d

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