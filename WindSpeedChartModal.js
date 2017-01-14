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

class WindSpeedChartModal extends Component {

    constructor(prop) {
        super(prop);

        this.windDs = new ListView.DataSource({
            rowHasChanged: (r1, r2) => r1 !== r2
        });

        windDataSource= this.windDs.cloneWithRows(WsChart);

    }

    windRenderRow(rowData) {

        return (
            <View style={{flex: 1, flexDirection: 'row', height: 45, borderBottomWidth: 1, borderBottomColor: '#e9e9e9'}}>
                <View style={{flex: 1}}>
                    <Text style={{fontSize: 13}}>{rowData['speed']}</Text>
                </View>
                <View style={{flex: 4}}>
                    <Text style={{marginLeft: 5}}>{rowData['content']}</Text>
                </View>
            </View>
        );
    }

    render() {

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
