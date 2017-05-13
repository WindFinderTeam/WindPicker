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
import Ionicons          from 'react-native-vector-icons/Ionicons';

var FirebaseHndler = require('./FirebaseHndler');

class CustomCallout extends Component {

    constructor(prop) {
        super(prop);

        this.state = {
              modalVisible: false
            , localData: prop
            , modalVisible: false
            , pinMarker: {
                'latitude': prop.region.latitude,
                'longitude': prop.region.longitude,
                'latitudeDelta': 0.0,
                'longitudeDelta': 0.0
            }

        };

        //---------------- Binding to Custom Func ----------------
        this.setModalVisible = this.setModalVisible.bind(this);
        this._onPress = this._onPress.bind(this);
        //---------------------------------------------------------
    }

    setRealmReload() {
    }

    setModalVisible(visible) {
        console.log("setModalVisible visible", visible);
        this.setState({modalVisible: visible});
    }

    _onPress(selectedData) {
        this.setState({localData: selectedData});
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
                    rowData={this.state.localData}
                    realmReload={this.setRealmReload}
                />
            </Modal>
        )
    }

    render() {

        console.log("prop:::", this.state.localData.district.length);

        var district = this.state.localData.district
        var widthVar = (district.length) * 10 + 20

        return (<MapView.Marker
            coordinate={
                this.state.pinMarker
            }
            zoomEnabled={true}
        >
            <MapView.Callout width={widthVar} height={20}>
                <TouchableOpacity onPress={() =>{
                        this._onPress(this.state.localData)}}>
                    {this.weatherListModal()}
                    <View style={{flexDirection:'row',alignItems:'center'}}>
                        <Text>{district}  </Text>
                        <Ionicons name="ios-arrow-forward" size={15} color={'#C0C0C0'}/>
                    </View>
                </TouchableOpacity>
            </MapView.Callout>
        </MapView.Marker>)
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
            selectedRowData: '',
            localList: []
        };

    }

    componentDidMount() {
        console.log('main map call props');
        var that = this;

        FirebaseHndler.getSurfLocalListForMap().then(function (items) {

            // that.setState({localList: items});


            for (var i in items) {

                that.setState({
                    localList: [
                        ...that.state.localList,
                        items[i]]
                });


            }
            // that.props.setSpinnerVisible(false);
        }, function (err) {
            console.log(err)
        });
    }


    render() {
        var keyValue=0;
        return (
            <View style={styles.container}>
                <MapView
                    style={styles.map}
                    initialRegion={this.state.region}
                    followsUserLocation={true}

                >
                    {this.state.localList.map((marker) => {
                        keyValue = keyValue+1;
                        return <CustomCallout key={keyValue} {...marker}/>

                    })}
                </MapView>
            </View >
        );
    }
}

module.exports = SurfLocalListMap;

const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,
        flex:1

    },

    map: {
        ...StyleSheet.absoluteFillObject,

    },
});
