import {SafeAreaView, StyleSheet, Text, View} from 'react-native';
import React, {useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {ActivityIndicator} from 'react-native-paper';
import {
  BLDefaultColour,
  BLTitleBackground,
  BLSubTitleBackground,
  blFontColor,
} from '../../../App/Accessibilities';
import {FetchParkingData} from '../../../Services/ParkingServices/SecurityParkingAccessSlice';

const ParkingTableVertical = () => {
  const dispatch = useDispatch();
  const {isLoading, isError, parkingData, error} = useSelector(
    state => state.securityParkingAccess,
  );
  const tDataModel = {
    tableHeaderData: [' ', 'Sedan/ Mini SUV/ Micro', 'Hatchback', 'bike'],
    tableBodyData: parkingData,
    tableFooterData: [],
  };

  const tableBody = {
    row1: ['TD', '12/20', '1/2', '23/58'],
    row2: ['TDex', '1/10', '0/0', '3/18'],
  };
  useEffect(() => {
    dispatch(FetchParkingData());
  }, []);
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.table}>
        <View style={[styles.tableHeader, styles.tableRow]}>
          {tDataModel.tableHeaderData.map((item, index) => {
            return (
              <View style={[styles.tableColumn]}>
                <View style={[styles.tableCell, index === 0 && {width: 50}]}>
                  <Text style={[styles.tableHeaderCellText]}>{item}</Text>
                </View>
              </View>
            );
          })}
        </View>
        <View style={[styles.tableRow]}>
          {tableBody.row1.map((item, index) => {
            return (
              <View style={[styles.tableColumn]}>
                <View style={[styles.tableCell, index === 0 && {width: 50}]}>
                  <Text>{item}</Text>
                </View>
              </View>
            );
          })}
        </View>
        <View style={[styles.tableRow]}>
          {tableBody.row2.map((item, index) => {
            return (
              <View style={[styles.tableColumn]}>
                <View style={[styles.tableCell, index === 0 && {width: 50}]}>
                  <Text style={[styles.tableCellText]}>{item}</Text>
                </View>
              </View>
            );
          })}
        </View>
      </View>
    </SafeAreaView>
  );
};

export default ParkingTableVertical;

const styles = StyleSheet.create({
  container: {
    elevation: 20,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#54875D',
    borderBottomEndRadius: 8,
    borderBottomStartRadius: 8,
  },
  tableRow: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  tableColumn: {
    borderEndWidth: 0.25,
    borderBottomWidth: 0.25,
  },
  tableCell: {
    margin: 5,
    width: 110,
    minHeight: 30,
    alignItems: 'center',
  },
  tableHeaderCellText: {
    fontWeight: 'bold',
  },
});
