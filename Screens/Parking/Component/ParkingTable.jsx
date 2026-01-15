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

const ParkingTable = () => {
  const dispatch = useDispatch();
  const {isLoading, isError, parkingData, error} = useSelector(
    state => state.securityParkingAccess,
  );
  const tDataModel = {
    tableHeaderData: ['Vehicle Type', 'Total', 'Occupied', 'Available'],
    tableBodyData: parkingData,
    tableFooterData: [],
  };

  const TableHeader = ({headerData}) => {
    return (
      <View style={styles.headerContainer}>
        {headerData &&
          headerData.map((header, index) => (
            <View
              key={index}
              style={[
                styles.headerItem,
                {backgroundColor: BLTitleBackground},
                index === 0 && {minWidth: 150},
              ]}>
              <Text numberOfLines={1} style={styles.headerText}>
                {header}
              </Text>
            </View>
          ))}
      </View>
    );
  };

  const TableBody = ({bodyData}) => {
    return (
      <View>
        {bodyData &&
          bodyData.map((bData, index) => (
            <View key={index}>
              <View
                style={[
                  styles.bodyTitle,
                  {backgroundColor: BLSubTitleBackground},
                ]}>
                <Text style={styles.bodyTitleText}>
                  {bData.ParkingLocation}
                </Text>
              </View>
              {<TableBodyRow rowCells={bData.ParkingSpaceInfoLists} />}
            </View>
          ))}
      </View>
    );
  };

  const TableBodyRow = ({rowCells}) => {
    // if (isLoading) {
    //   return <ActivityIndicator style={{padding: 10}} />;
    // }
    return (
      <View>
        {rowCells &&
          rowCells.map((cData, index) => (
            <View style={styles.tableRow} key={index}>
              <Text
                style={[
                  styles.tableCell,
                  cData.FreeParkingSpace === 0 && {color: 'red'},
                  {minWidth: 150, textAlign: 'left'},
                ]}>
                {cData.VehicleType}
              </Text>
              <Text
                style={[
                  styles.tableCell,
                  cData.FreeParkingSpace === 0 && {color: 'red'},
                ]}>
                {cData.TotalParkingSpace}
              </Text>
              <Text
                style={[
                  styles.tableCell,
                  cData.FreeParkingSpace === 0 && {color: 'red'},
                ]}>
                {cData.OcupiedParkingSpace}
              </Text>
              <Text
                style={[
                  styles.tableCell,
                  cData.FreeParkingSpace === 0 && {color: 'red'},
                ]}>
                {cData.FreeParkingSpace}
              </Text>
            </View>
          ))}
      </View>
    );
  };

  // useEffect(() => {
  //   dispatch(FetchParkingData());
  // }, [dispatch]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.tableHeader}>
        <TableHeader headerData={tDataModel.tableHeaderData} />
      </View>
      {isLoading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color={BLDefaultColour} />
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      )}
      {!isLoading && (
        <View style={styles.tableBody}>
          <TableBody bodyData={tDataModel.tableBodyData} />
        </View>
      )}
    </SafeAreaView>
  );
};

export default ParkingTable;

const styles = StyleSheet.create({
  container: {
    elevation: 20,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#54875D',
    borderBottomEndRadius: 8,
    borderBottomStartRadius: 8,
  },
  tableHeader: {
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 0.25,
    borderColor: '#54875D',
  },
  headerContainer: {
    flexDirection: 'row',
    borderWidth: 0.25,
  },
  headerItem: {
    flex: 1,
    padding: 5,
    borderWidth: 0.25,
    borderColor: '#fff',
    borderLeftColor: '#000',
    borderRightColor: '#000',
    alignItems: 'center',
    paddingVertical: 10,
  },
  headerText: {
    fontWeight: 'bold',
    color: blFontColor.TitleColor,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  loadingText: {
    marginTop: 10,
  },
  tableBodyHeader: {
    alignItems: 'center',
    borderWidth: 0.25,
    verticalAlign: 'middle',
  },
  bodyTitle: {
    borderLeftWidth: 0.25,
    borderRightWidth: 0.25,
    padding: 5,
    alignItems: 'center',
  },
  bodyTitleText: {
    fontWeight: 'bold',
    fontSize: 15,
    color: '#54875D',
  },
  tableRow: {
    flexDirection: 'row',
  },
  tableCell: {
    flex: 1,
    padding: 6,
    borderWidth: 0.25,
    textAlign: 'center',
    textAlignVertical: 'center',
    borderColor: '#54875D',
    color: '#000',
  },
});
