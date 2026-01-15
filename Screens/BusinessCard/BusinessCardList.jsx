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
import AntDesign from 'react-native-vector-icons/AntDesign';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { FetchRequestData } from '../../Services/BusinessCard/BusinessCardSlice';
import { format } from 'date-fns';
import Toast from 'react-native-toast-message';

export default function BusinessCardList({ route }) {
    const [columns, setColumns] = useState(['Code', 'Date', 'Status', 'Remarks']);
    const [direction, setDirection] = useState(null);
    const [selectedColumn, setSelectedColumn] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [loadingPage, setLoadingPage] = useState(false);
    const [page, setPage] = useState(1);
    const [requestData, setRequestData] = useState([]);
    const { width: screenWidth } = Dimensions.get('window');
    const columnWidth = screenWidth / columns.length;
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const [hasMoreData, setHasMoreData] = useState(true);

    useFocusEffect(
        React.useCallback(() => {
            setPage(1);
            dispatch(FetchRequestData(1))
            loadInitialData();
        }, []),
    );

    useEffect(() => {
        loadInitialData();
    }, []);

    const loadInitialData = () => {
        setLoadingPage(true);
        dispatch(FetchRequestData(page))
            .then(data => {
                if (Array.isArray(data.payload)) {
                    setRequestData(data.payload);
                } else {
                    console.error('Invalid data format:', data);
                    Toast.show({
                        type: 'error',
                        text1: 'Error',
                        text2: 'Invalid data format',
                    });
                }
            })
            .catch(error => {
                console.error('Error fetching data:', error);
                Toast.show({
                    type: 'error',
                    text1: 'Error',
                    text2: 'Failed to load data',
                });
            })
            .finally(() => setLoadingPage(false));
    };

    const handleLoadMore = () => {
        if (!loadingPage && hasMoreData) {
            const nextPage = page + 1;
            setLoadingPage(true);
            dispatch(FetchRequestData(nextPage))
                .then(data => {
                    if (Array.isArray(data.payload) && data.payload.length > 0) {
                        setRequestData(prevData => [...prevData, ...data.payload]);
                    } else {
                        setHasMoreData(false);
                    }
                })
                .catch(error => {
                    console.error('Error fetching more data:', error);
                    Toast.show({
                        type: 'error',
                        text1: 'Error',
                        text2: 'Failed to load more data',
                    });
                })
                .finally(() => setLoadingPage(false));
            setPage(nextPage); // Update page state with the incremented value
        }
    };
    const handleSearch = query => {
        setSearchQuery(query);
        if (query === '') {
            setPage(1);
            loadInitialData();
        } else {
            // Filter the data based on the query
            const filteredData = requestData.filter(
                item =>
                    item.RequestId.toLowerCase().includes(query.toLowerCase()) ||
                    item.CurrentStatus.toLowerCase().includes(query.toLowerCase())
            );
            setRequestData(filteredData); // Update the state with filtered data
        }
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
        return loadingPage ? (
            <ActivityIndicator size={60} color="#F2641C" />
        ) : null;
    };

    const renderItem = ({ item, index }) => {
        const shouldHideIdColumn = true;
        return (
            <View
                style={{
                    ...styles.tableRow,
                    backgroundColor: index % 2 === 1 ? '#F0FBFC' : 'white',
                }}>
                {!shouldHideIdColumn && <Text>{item.RequesterId}</Text> && <Text>{item.Id}</Text>}
                <Text style={{ ...styles.columnRowTxt, flex: 1.5 }}>{item.RequestId}</Text>
                <Text style={{ ...styles.columnRowTxt, flex: 1 }}>
                    {format(new Date(item.RequestDate), 'yyyy-MM-dd')}
                </Text>
                <Text style={{ ...styles.columnRowTxt, flex: 1 }}>{item.CurrentStatus}</Text>
                <Text style={{ ...styles.columnRowTxt, flex: 1 }}>{item.Remarks}</Text>
            </View>
        );
    };
    const handleRefresh = () => {
        setLoadingPage(true);
        setHasMoreData(true);
        setPage(1); // Reset page to 1
        // Fetch data for the first page
        dispatch(FetchRequestData(1))
            .then(data => {
                if (Array.isArray(data.payload)) {
                    setRequestData(data.payload);
                } else {

                    Toast.show({
                        type: 'error',
                        text1: 'Error',
                        text2: 'Invalid data format',
                    });
                }
            })
            .catch(error => {

                Toast.show({
                    type: 'error',
                    text1: 'Error',
                    text2: 'Failed to load data',
                });
            })
            .finally(() => setLoadingPage(false));
    };
    const handleButtonPress = () => {
        navigation.navigate('BusinessCardInsertUpdate');
    };
    const sortTable = column => {
        const newDirection = direction === 'desc' ? 'asc' : 'desc';
        const sortedData = [...requestData].sort((a, b) => {
            if (a[column] < b[column]) return newDirection === 'asc' ? -1 : 1;
            if (a[column] > b[column]) return newDirection === 'asc' ? 1 : -1;
            return 0;
        });
        setSelectedColumn(column);
        setDirection(newDirection);
        setRequestData(sortedData);
    };
    return (
        <View style={styles.container}>
            <View style={styles.topContainer}>
                <TouchableOpacity onPress={handleButtonPress}>
                    <MaterialCommunityIcons name="plus" size={50} color="#54875d" />
                </TouchableOpacity>
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search code or status names..."
                    value={searchQuery}
                    onChangeText={handleSearch}
                />
                <TouchableOpacity onPress={handleRefresh}>
                    <MaterialCommunityIcons name="refresh" size={50} color="#0000FF" />
                </TouchableOpacity>
            </View>
            {tableHeader()}
            <FlatList
                data={requestData}
                style={styles.flatList}
                keyExtractor={(item, index) => index.toString()}
                ListEmptyComponent={() => (loadingPage ? <Text /> : <Text>No data found.</Text>)}
                renderItem={renderItem}
                ListFooterComponent={renderFooter}
                onEndReachedThreshold={0.5}
                onEndReached={handleLoadMore}
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
