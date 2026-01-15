import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Table, Row } from 'react-native-table-component';

const ParkingSpaceInfo = ({ parkingSpaceInfos }) => {
    return (
        <View style={styles.container}>        
            {parkingSpaceInfos.map(parkingSpace => (
                <View key={parkingSpace.ParkingLocation} style={styles.locationContainer}>
                     <Text style={styles.title}>Parking Space ({parkingSpace.ParkingLocation})</Text>
                    <View style={styles.tableContainer}>
                        <Table borderStyle={{ borderColor: '#d0d0d0', borderWidth:1 }}>
                            <Row data={['Vehicle Type', 'Total Space', 'Occupied Space', 'Free Space']} style={styles.header} textStyle={styles.headerText} />
                            {parkingSpace.ParkingSpaceInfoLists.map((spaceInfo, index) => (
                                <Row
                                    key={index}
                                    data={[spaceInfo.VehicleType, spaceInfo.TotalParkingSpace, spaceInfo.OcupiedParkingSpace, spaceInfo.FreeParkingSpace]}
                                    textStyle={styles.rowText}
                                />
                            ))}
                        </Table>
                    </View>
                </View>
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginTop: 30,
    },
    locationContainer: {
        backgroundColor: '#fff',
        borderRadius: 16,
        marginBottom: 20,
        padding: 5,
        width:360
    },
    tableContainer: {
        margin: 10,
    },
    header: {
        backgroundColor: '#f1f8ff',
        minHeight:50
        // paddingBottom: 10,
    },
    headerText: {
        fontWeight: 'bold',
        textAlign: 'center',
    },
    rowText: {
        textAlign: 'center',
        marginBottom: 10,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',
    },
});

export default ParkingSpaceInfo;
