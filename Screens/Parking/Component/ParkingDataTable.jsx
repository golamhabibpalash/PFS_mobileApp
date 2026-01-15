import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
  Dimensions,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import axios from 'axios';
import appConfig from '../../../app.json';
import { useFocusEffect, useNavigation, useIsFocused } from '@react-navigation/native';
import Toast from 'react-native-toast-message';

export default function ParkingDataTable({ route }) {
  const [columns, setColumns] = useState([
    'R.Code',
    'Type',
    'Status',
    'Action',
  ]);
  const [direction, setDirection] = useState(null);
  const [selectedColumn, setSelectedColumn] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [parkingData, setParkingData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMoreData, setHasMoreData] = useState(true);
  const { width: screenWidth } = Dimensions.get('window');
  const columnWidth = screenWidth / columns.length;

  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const baseUrl = appConfig.apiBaseURL;
  const DataTablePairapiUrl = 'pfs/api/ParkingApi/MyRegistration';

  useFocusEffect(
    React.useCallback(() => {
      fetchData(1);
    }, []),
  );

  useEffect(() => {
    fetchData(1);
  }, [page]);

  const fetchData = async pageNumber => {
    if (loading || !hasMoreData) return;
    setLoading(true);
    try {
      const response = await axios.post(`${baseUrl}${DataTablePairapiUrl}`, {
        Page: pageNumber,

        SortDirection: direction,
      });
      const newData = response.data;
      if (newData.length === 0) {
        setHasMoreData(false);
      } else {
        if (pageNumber === 1) {
          setParkingData(newData);
        } else {
          setParkingData(prevData => [...prevData, ...newData]);
        }
        setPage(pageNumber + 1);
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'error',
        text2: 'Data can not loded from server',
      });
      setLoading(false);
      setLoadingMore(false);
      setHasMoreData(false);
    } finally {
      setLoading(false);
    }
  };

  const sortTable = column => {
    const newDirection = direction === 'desc' ? 'asc' : 'desc';
    const sortedData = _.orderBy(parkingData, [column], [newDirection]);
    setSelectedColumn(column);
    setDirection(newDirection);
    setParkingData(sortedData);
  };

  const handleButtonPress = () => {
    navigation.navigate('ParkingRegistration');
  };

  const tableHeader = () => (
    <View style={styles.tableHeader}>
      {columns.map((column, index) => (
        <TouchableOpacity
          key={index}
          style={[styles.columnHeader, { flex: columnWidth }]}
          onPress={() => sortTable(column)}>
          <Text style={styles.columnHeaderTxt}>
            {column + ' '}
            {selectedColumn === column && (
              <MaterialCommunityIcons
                name={
                  direction === 'desc'
                    ? 'arrow-down-drop-circle'
                    : 'arrow-up-drop-circle'
                }
                size={18}
              />
            )}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderItem = ({ item, index }) => {
    return (
      <View
        style={{
          ...styles.tableRow,
          backgroundColor: index % 2 === 1 ? '#F0FBFC' : 'white',
        }}>
        <Text style={{ ...styles.columnRowTxt, flex: 1.2 }}>
          {item.RegistrationCode}
        </Text>
        <Text style={{ ...styles.columnRowTxt, flex: 0.9 }}>
          {item.VehicleTypeName}
        </Text>
        <Text style={{ ...styles.columnRowTxt, flex: 0.9 }}>{item.Status}</Text>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('ParkingRegistration', {
                item: item,
                mode: 'edit',
              })
            }>
            <MaterialCommunityIcons
              name="pencil"
              color="#231f20"
              size={30}
              style={{ ...styles.editColumn, flex: 1 }}
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  };
  const handleRefresh = () => {
    setPage(1);
    setHasMoreData(true);
    fetchData(1);
  };
  return (
    <View style={styles.container}>
      <View style={styles.topContainer}>
        <TouchableOpacity onPress={handleButtonPress}>
          <MaterialCommunityIcons name="plus" size={50} color="#54875d" />
        </TouchableOpacity>
        <View style={styles.gap}></View>
        <TouchableOpacity onPress={handleRefresh}>
          <MaterialCommunityIcons name="refresh" size={50} color="#0000FF" />
        </TouchableOpacity>
      </View>
      {tableHeader()}
      <FlatList
        data={parkingData}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderItem}
        ListEmptyComponent={() =>
          loading ? (
            // <ActivityIndicator size="large" color="#0000ff" />
            <Text></Text>
          ) : (
            <Text>No data found.</Text>
          )
        }
        ListFooterComponent={() =>
          loading ? (
            <ActivityIndicator size={60} color="#F2641C" />
          ) : null
        }
        onEndReachedThreshold={0.5}
        onEndReached={() => fetchData(page)}
      />
    </View >
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 5,
  },
  tableHeader: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    backgroundColor: '#ffa500',
    borderTopEndRadius: 10,
    borderTopStartRadius: 10,
    height: 30,
  },
  tableRow: {
    flexDirection: 'row',
    height: 50,
    textAlign: 'left',
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
    paddingHorizontal: 5,
  },
  columnHeader: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  columnHeaderTxt: {
    color: 'black',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  columnRowTxt: {
    flex: 1,
    textAlign: 'center',
    color: 'black',
    fontSize: 15,
    flexWrap: 'wrap',
    textAlign: 'left',
    flexDirection: 'row',
  },
  editColumn: {
    flex: 1,
    flexDirection: 'row',
    textAlign: 'left',
  },
  buttonContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 0.5,
  },
  topContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    paddingHorizontal: 10,
    width: '100%',
  },
  gap: {
    marginLeft: '70%'
  }
});
