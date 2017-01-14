import  React, {
    Component
} from 'react';

import {
    AppRegistry,
    StyleSheet,
    Text,
    ListView,
    TouchableOpacity,
    View,
    Modal,
    Dimensions,
    TouchableWithoutFeedback
} from 'react-native';

var chartFontColorChk = new Array(9);
var rowI = 0;
var windDataSource;
var pickerStyle = require('./pickerStyle');
var WsChart = require('./jsData/WindSpeedChartData.json');

class WindSpeedChartModal extends Component {

    constructor(prop) {
        super(prop);

        this.windDs = new ListView.DataSource({
            rowHasChanged: (r1, r2) => r1 !== r2
        });

        windDataSource= this.windDs.cloneWithRows(WsChart);

    }

    static defaultProps = {
        windSpeedData: 0,
    };

    windRenderRow(rowData) {

        console.log("   chartFontColorChk[rowI]",rowI,chartFontColorChk[rowI]);

        rowI = rowI+1;

        return (
            <View style={{flex: 1, flexDirection: 'row', marginBottom:15, borderBottomWidth: 1, borderTopWidth: 1,  borderBottomColor: '#e9e9e9', borderTopColor: '#e9e9e9'}}>
                <View style={{flex: 1}}>
                    <Text style={{color:(chartFontColorChk[rowI]) == true? '#94000F':'black', fontSize: 13}}>{rowData['speed']}</Text>
                </View>
                <View style={{flex: 3.5}}>
                    <Text style={{color:(chartFontColorChk[rowI]) == true? '#94000F':'black', marginLeft: 5}}>{rowData['content']}</Text>
                </View>
            </View>
        );


    }

    render() {

        console.log("chartFontColorChk.length:",chartFontColorChk.length);


        for(var i=0; i<chartFontColorChk.length; i++){
            chartFontColorChk[i] = false;

        }

        let windSpeed = this.props.windSpeedData.toFixed();
        console.log("windSpeed:",windSpeed);

        if      (windSpeed >= 2 && windSpeed <= 3  )     chartFontColorChk[1] = true;
        else if (windSpeed >= 4 && windSpeed <= 6  )     chartFontColorChk[2] = true;
        else if (windSpeed >= 7 && windSpeed <= 8  )     chartFontColorChk[3] = true;
        else if (windSpeed >= 9 && windSpeed <= 14 ){
            if(windSpeed == 9 ){
                chartFontColorChk[4] = true;
            } else if (windSpeed == 10){
                chartFontColorChk[4] = true;
                chartFontColorChk[5] = true;
            } else if (windSpeed == 11){
                chartFontColorChk[4] = true;
                chartFontColorChk[5] = true;
                chartFontColorChk[6] = true;
            } else if (windSpeed == 12 || windSpeed == 13 || windSpeed == 14){
                chartFontColorChk[5] = true;
                chartFontColorChk[6] = true;
            }
        }
        else if(windSpeed >= 15 && windSpeed <= 20 )     chartFontColorChk[7] = true;
        else if(windSpeed >  20 && windSpeed <= 30 )     chartFontColorChk[8] = true;
        else if(windSpeed >  30 && windSpeed <= 40 )     chartFontColorChk[9] = true;

        for(var j=0; j<chartFontColorChk.length; j++){
            console.log("chartFontColorChk[j]:", chartFontColorChk[j]);
        }

        rowI = 0;

        return (

            <Modal
                animationType={"none"}
                transparent={true}
                visible={this.props.windModalVib}
                onRequestClose={() => {
                    this.props.setWindModalVib(false)
                }}>
                <TouchableWithoutFeedback onPress={()=> {
                    this.props.setWindModalVib(false)
                }}>
                    <View style={pickerStyle.outerInfoContainer}>
                        <View style={pickerStyle.innerInfoModal}>
                            <Text style={{fontSize: 20, marginBottom: 13, marginTop: 7, color: '#94000F'}}>바람세기</Text>
                            <ListView
                                dataSource={windDataSource}
                                renderRow={this.windRenderRow}
                            />
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>


        );
    }
}


module.exports = WindSpeedChartModal;
