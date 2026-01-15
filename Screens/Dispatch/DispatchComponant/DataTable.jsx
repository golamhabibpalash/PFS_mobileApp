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
  Platform,
  PermissionsAndroid,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {
  useNavigation,
  useIsFocused,
  useFocusEffect,
} from '@react-navigation/native';
import axios from 'axios';
import _ from 'lodash';
import appConfig from '../../../app.json';
import RNFS from 'react-native-fs';
import OutBoundInsertUpdate from '../OutBoundInsertUpdate';

import Toast from 'react-native-toast-message';

export default function DataTable({ route }) {
  const [columns, setColumns] = useState([
    'Code',
    'Reciever',
    'Status',
    'Action',
  ]);
  const [direction, setDirection] = useState(null);
  const [selectedColumn, setSelectedColumn] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [outbound, setOutbound] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMoreData, setHasMoreData] = useState(true);
  const [reloadFlag, setReloadFlag] = useState(false);

  const navigation = useNavigation();
  const isFocused = useIsFocused();

  const baseUrl = appConfig.apiBaseURL;
  const DataTablePairapiUrl = 'pfs/api/OutboundApi/List';
  const pdfApi = 'pfs/api/OutboundApi/DownloadOutboundWithContentPDF';
  const { width: screenWidth } = Dimensions.get('window');
  const columnWidth = screenWidth / columns.length;
  const rowWidth = screenWidth / columns.length;

  useFocusEffect(
    React.useCallback(() => {
      fetchData(page);
    }, []),
  );

  useEffect(() => {
    fetchData(page);
  }, [page]);

  const fetchData = async pageNumber => {
    if (loading || !hasMoreData) return;
    setLoading(true);
    try {
      const response = await axios.post(`${baseUrl}${DataTablePairapiUrl}`, {
        Page: pageNumber,
        SearchQuery: searchQuery,
        SortDirection: direction,
      });
      const newData = response.data;
      if (newData.length === 0) {
        setHasMoreData(false);
      } else {
        if (pageNumber === 1) {
          setOutbound(newData);
        } else {
          setOutbound(prevData => [...prevData, ...newData]);
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
    const sortedData = _.orderBy(outbound, [column], [newDirection]);
    setSelectedColumn(column);
    setDirection(newDirection);
    setOutbound(sortedData);
  };

  const handleSearch = query => {
    setSearchQuery(query);
    if (query === '') {
      fetchData(1);
    } else {
      const filteredData = outbound.filter(
        item =>
          item.Code.toLowerCase().includes(query.toLowerCase()) ||
          item.RecieverName.toLowerCase().includes(query.toLowerCase()),
      );
      setOutbound(filteredData);
    }
  };

  const handleButtonPress = () => {
    navigation.navigate('OutBoundInsertUpdate');
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
  const renderFooter = () => {
    return loading ? <ActivityIndicator size={60} color="#F2641C" /> : null;
  };

  const renderItem = ({ item, index }) => {
    const shouldHideIdColumn = true;

    return (
      <View
        style={{
          ...styles.tableRow,
          backgroundColor: index % 2 === 1 ? '#F0FBFC' : 'white',
        }}>
        {!shouldHideIdColumn && <Text>{item.Id}</Text>}
        <Text style={{ ...styles.columnRowTxt, flex: 1 }}>{item.Code}</Text>
        <Text style={{ ...styles.columnRowTxt, flex: 1 }}>
          {item.RecieverName}
        </Text>
        <Text style={{ ...styles.columnRowTxt, flex: 1 }}>{item.Status}</Text>
        <View
          style={{ ...styles.buttonContainer, flex: 0.6, marginHorizontal: 10 }}>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('OutBoundInsertUpdate', {
                item: item,
                mode: 'edit',
              })
            }>
            <MaterialCommunityIcons
              name="pencil"
              color="#231f20"
              size={30}
              style={styles.editColumn}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => getPermission(item)}>
            <AntDesign
              name="pdffile1"
              color="#231f20"
              size={30}
              style={styles.editColumn}
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const handlePdf = async (item) => {
    const baseUrl = appConfig.apiBaseURL;
    const pdfApi = 'pfs/api/OutboundApi/DownloadOutboundWithContentPDF';
    const downloadDest = `${Platform.OS == "ios" ? RNFS.DocumentDirectoryPath : RNFS.DownloadDirectoryPath}/${item.Code}.pdf`;

    console.log("downloadDest", downloadDest);

    const options = {
      fromUrl: `${baseUrl}${pdfApi}?id=${item.Id}`,
      toFile: downloadDest,
      background: true,
      begin: (res) => {
        // console.log('Download started:', res);
      },
      progress: (res) => {
        const progressPercent = (res.bytesWritten / res.contentLength) * 100;
        // console.log(`Download progress: ${progressPercent.toFixed(2)}%`);
      },
      addAndroidDownloads: {
        useDownloadManager: true,
        notification: true,
        title: item.Code, // Set a title for the notification
        description: 'Downloading PDF...', // Set a description
      },
    };

    try {
      const res = await RNFS.downloadFile(options).promise;

      console.log('res', res)
      if (res.statusCode === 200) {
        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: `The file was saved to ${Platform.OS == 'ios' ? "document" :  "download"} folder`,
        });

      } else {
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: 'Failed to download file',
        });
      }
    } catch (error) {
      console.error('Error saving file:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Error saving file',
      });
    }
  };


  const getPermission = async (item) => {
    if (Platform.OS === 'android' && Platform.Version < 29) {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            title: 'Storage Permission Required',
            message: 'This app needs storage access to save downloaded PDFs.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );

        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          handlePdf(item);
        } else {
          Toast.show({
            type: 'error',
            text1: 'Error',
            text2: 'File permission denied',
          });
        }
      } catch (err) {
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: 'Error requesting permission',
        });
      }
    } else {
      handlePdf(item); // No need to request permission for Android 10 and above
    }
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
          <MaterialCommunityIcons name="plus" size={50} color="#666" />
        </TouchableOpacity>
        <TextInput
          style={styles.searchInput}
          placeholder="Search code or reciver names..."
          value={searchQuery}
          onChangeText={handleSearch}
        />
        <TouchableOpacity onPress={handleRefresh}>
          <MaterialCommunityIcons name="refresh" size={50} color="#666" />
        </TouchableOpacity>
      </View>
      {tableHeader()}
      <FlatList
        data={outbound}
        style={styles.flatList}
        keyExtractor={(item, index) => index.toString()}
        ListEmptyComponent={() =>
          loading ? (
            // <ActivityIndicator size="large" color="##ff0000" />
            <Text></Text>
          ) : (
            <Text>No data found.</Text>
          )
        }
        renderItem={renderItem}
        ListFooterComponent={renderFooter}
        onEndReachedThreshold={0.5} // Load more data when reaching 50% of the end
        onEndReached={() => !loading && !loadingMore && fetchData(page)} // Trigger fetchData only when not loading and reach end
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
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
    width: '100%',
  },
  tableRow: {
    flexDirection: 'row',
    height: 80,
    textAlign: 'left',
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
    paddingHorizontal: 10,
  },
  topContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    paddingHorizontal: 10,
    width: '100%',
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
    fontSize: 14,
    flexWrap: 'wrap',
    textAlign: 'left',
    flexDirection: 'row',
  },
  editColumn: {
    flex: 1,
    textAlign: 'center',
  },
  searchInput: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingHorizontal: 10,
    marginLeft: 10,
  },
  flatList: {
    flex: 1,
    width: '100%',
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
});
