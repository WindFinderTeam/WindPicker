import  React, {Component} from 'react';
import {
    AppRegistry,
    StyleSheet,
    ScrollView,
    Text,
    Image,
    TouchableOpacity,
    View,
    Linking,
    StatusBar,
    Modal,
} from 'react-native';
import MapView           from 'react-native-maps';
import SurfWeatherList   from './SurfWeatherList';

var localListVar = [];
var FirebaseHndler = require('./FirebaseHndler');
var selectedRowData ;

class CustomCallout extends Component {

    constructor(prop) {
        super(prop);

        this.state = {
            localList: []
            , modalVisible: false
        };
    }

    componentDidMount() {
        console.log('custom call props');
        var that = this;

        FirebaseHndler.getSurfLocalListForMap().then(function (items) {

            that.setState({localList: items});

            for (var i in that.state.localList) {
                console.log("localList:", that.state.localList[i].district)
            }
            // that.props.setSpinnerVisible(false);
        }, function (err) {
            console.log(err)
        });
    }

    render() {
        console.log("localListVar[0]:", this.state.localList[0] == undefined ? "" : this.state.localList[0].region);

        return (
            <MapView.Marker
                coordinate={this.state.localList[0] == undefined ? {} : this.state.localList[0].region}
                pinColor={'#ff3399'}
                zoomEnabled={true}
            >
                <MapView.Callout width={100} height={20}>
                    <TouchableOpacity onPress={() =>{
                        this.props._onPress(this.state.localList[0])}}>
                        <Text>{this.state.localList[0] == undefined ? '' : this.state.localList[0].district}</Text>
                    </TouchableOpacity>
                </MapView.Callout>
            </MapView.Marker>
        )
    }
}

class SurfLocalListMap extends Component {

    constructor(prop) {
        super(prop);

        this.state = {
            region: {
                latitude: 37.515917,
                longitude: 126.995917,
                latitudeDelta: 0.0,
                longitudeDelta: 0.0,
            },
            modalVisible : false,
            selectedRowData : '',
        };
        //---------------- Binding to Custom Func ----------------
        this.setModalVisible = this.setModalVisible.bind(this);
        this._onPress        = this._onPress.bind(this);
        //---------------------------------------------------------
    }

    setRealmReload() {
    }

    setModalVisible(visible) {
        console.log("setModalVisible visible", visible);
        this.setState({modalVisible: visible});
    }

    _onPress(selectedData){
        console.log("_onPress:", selectedData);
        selectedRowData = selectedData;
        this.setState({selectedRowData:selectedData});
        this.setModalVisible(true);

    }

    weatherListModal(selectedRowData) {
        console.log("selectedRowData", selectedRowData);
        return (
            <Modal
                animationType={"fade"}
                transparent={false}
                visible={this.state.modalVisible}
                onRequestClose={() => {this.setModalVisible(false)}}>

                <SurfWeatherList
                    modalVisible={this.setModalVisible}
                    rowData={this.state.selectedRowData}
                    realmReload={this.setRealmReload}
                />
            </Modal>
        )
    }

    render() {

        return (
            <View style={styles.container}>
                {this.weatherListModal()}
                <MapView
                    style={styles.map}
                    initialRegion={this.state.region}
                    followsUserLocation={true}
                    onMarkerSelect={()=>{console.log("onMarkerSelect")}}
                >
                    <CustomCallout _onPress = {this._onPress}/>
                </MapView>
            </View >
        );
    }
}

module.exports = SurfLocalListMap;

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'flex-end',
        alignItems: 'center',
    },

    map: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
});
