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

var windDataSource;
var pickerStyle = require('./pickerStyle');
var WsChart = require('./jsData/WindSpeedChartData.json');

var windLevel = 0;
var rowNum = 0;

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

        var descTxtColor="#000000";
        if(windLevel == rowNum++)  descTxtColor ="#94000F";

        return (
            <View style={{flex: 1, flexDirection: 'row', height:50  ,borderBottomWidth: 1,    borderBottomColor: '#e9e9e9'  }}>
                <View style={{flex: 1}}>
                    <Text style={{color :descTxtColor, fontSize: 13}}>{rowData['speed']}</Text>
                </View>
                <View style={{flex: 3.5}}>
                    <Text style={{color:descTxtColor, marginLeft: 5}}>{rowData['content']}</Text>
                </View>
            </View>
        );
    }

    render() {

        rowNum=0;
        let windSpeed = this.props.windSpeedData;

        if      (windSpeed >= 0 && windSpeed <= 1  )     windLevel = 0;
        else if (windSpeed >= 2 && windSpeed <= 3  )     windLevel = 1;
        else if (windSpeed >= 4 && windSpeed <= 6  )     windLevel = 2;
        else if (windSpeed >= 7 && windSpeed <= 8  )     windLevel = 3;
        else if (windSpeed >= 9 && windSpeed <= 11  )    windLevel = 4;
        else if (windSpeed >= 12 && windSpeed <= 14  )   windLevel = 5;
        else if (windSpeed >= 15 && windSpeed <= 20  )   windLevel = 6;
        else if (windSpeed >= 21 && windSpeed <= 30  )   windLevel = 7;
        else if (windSpeed >= 31 && windSpeed <= 40  )   windLevel = 8;
        else                                             windLevel = 9;

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
