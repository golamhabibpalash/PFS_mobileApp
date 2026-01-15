import {
  Text,
  View,
  SafeAreaView,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import {useEffect, useState} from 'react';
import CollapsibleCard from '../../Components/CollapsibleCard';
import SubmitButton from '../../Components/SubmitButton';
import CafeteriaRegListItem from './CafeteriaRegListItem';
import appConfig from '../../app.json';
import axios from 'axios';
import Icon from 'react-native-vector-icons/FontAwesome';
import {Alert} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Toast from 'react-native-toast-message';

const baseUrl = appConfig.apiBaseURL;
const cancelAllUrl = 'pfs/api/cafeteria/CancelAllRegistration';

const CafeteriaRegistrationIndex = () => {
  const navigation = useNavigation();

  const [data, setData] = useState([]);
  const [locations, setLocations] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [dateOpen, setDateOpen] = useState(false);
  const [selectedSections, setSelectedSections] = useState({});
  const [filterVendorId, setFilterVendorId] = useState('');
  const [filterLocationId, setfilterLocationId] = useState('');
  const [sortByLocation, setSortByLocation] = useState(false);
  const [sortByVendor, setSortByVendor] = useState(false);
  const [sortByRegDate, setSortByRegDate] = useState(false);
  const [sortByStatus, setSortByStatus] = useState(false);
  const [totalData, setTotalData] = useState(0);
  const [startPage, setStartPage] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async start => {
    try {
      const apiUrl = 'pfs/api/cafeteria/RegistrationIndex';
      const response = await axios.get(`${baseUrl}${apiUrl}`);
      setLocations(response.data.LocationSelectListItems);
      setVendors(response.data.MenuSelectListItems);
      const postResponse = await axios.post(`${baseUrl}${apiUrl}`, {
        Start: start,
      });
      setTotalData(postResponse.data.RecordsTotal);
      setData(prevData => [...prevData, ...postResponse.data.Data]);
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    setIsLoading(true);
    fetchData(0).then(() => {
      setIsLoading(false);
    });
    setStartPage(prevCount => prevCount + 10);
  }, []);
  const locationFilteredData = locations.filter(
    item => item.Value !== '' && item.Value !== null,
  );
  const vendorFilteredData = vendors.filter(
    item => item.Value !== '' && item.Value !== null,
  );
  const handleSelect = (option, value) => {
    setSelectedSections(prevSelectedSections => {
      const existingSelection = prevSelectedSections[option];

      if (existingSelection !== undefined && existingSelection === value) {
        if (option === 'LocationId') {
          setfilterLocationId('');
        }
        if (option === 'VendorId') {
          setFilterVendorId('');
        }
        return {
          ...prevSelectedSections,
          [option]: undefined,
        };
      } else {
        if (option === 'LocationId') {
          setfilterLocationId(value);
        }
        if (option === 'VendorId') {
          setFilterVendorId(value);
        }
        return {
          ...prevSelectedSections,
          [option]: value,
        };
      }
    });
  };
  const filterByVendorAndLocation = data => {
    if (filterLocationId === '') {
      console.log('If Condition: Vendor Id:' + filterVendorId);
      return data.filter(item => item.VendorId == filterVendorId);
    } else if (filterVendorId === '') {
      console.log('else If Condition : Location Id:' + filterLocationId);
      return data.filter(item => item.LocationId == filterLocationId);
    } else {
      console.log(
        'else Condition; VendorId:' +
          filterVendorId +
          '; LocationId: ' +
          filterLocationId,
      );
      return data.filter(
        item =>
          item.VendorId == filterVendorId &&
          item.LocationId == filterLocationId,
      );
    }
  };
  const handleSubmitButton = async () => {
    const apiUrl = 'pfs/api/cafeteria/RegistrationIndex';
    const postResponse = await axios.post(`${baseUrl}${apiUrl}`, {});

    const filteredData = filterByVendorAndLocation(postResponse.data.Data);
    if (filterLocationId != '' || filterVendorId != '') {
      setData(filteredData);
    }
  };

  //Sorting Code
  const locationSortHandle = () => {
    setSortByLocation(!sortByLocation);
    setData(sortingData('LocationName'));
  };
  const vendorSortHandle = () => {
    setSortByVendor(!sortByVendor);
    setData(sortingData('VendorName'));
  };
  const registerDateSortHandle = () => {
    setSortByRegDate(!sortByRegDate);
    setData(sortingData('RegisterDate'));
  };

  const statusSortHandle = () => {
    setSortByStatus(!sortByStatus);
    setData(sortingData('Status'));
  };
  const sortingData = sortBy => {
    return data.sort((a, b) => {
      let dataA = '';
      let dataB = '';
      if (sortBy === 'LocationName') {
        dataA = a.LocationName.toLowerCase();
        dataB = b.LocationName.toLowerCase();
      }
      if (sortBy === 'VendorName') {
        dataA = a.VendorName.toLowerCase();
        dataB = b.VendorName.toLowerCase();
      }
      if (sortBy === 'Status') {
        dataA = a.Status.toLowerCase();
        dataB = b.Status.toLowerCase();
      }
      if (sortBy === 'RegisterDate') {
        dataA = a.RegisterDate;
        dataB = b.RegisterDate;
      }

      if (dataA < dataB) {
        return -1;
      }
      if (dataA > dataB) {
        return 1;
      }
      return 0;
    });
  };
  //Pagination related code
  const getMoreData = () => {
    setIsLoading(true);
    fetchData(startPage).then(() => {
      setIsLoading(false);
    });
    setStartPage(prevCount => prevCount + 10);
  };
  //Cancel related code
  const cancelAllRegistration = () => {
    const doCancelAll = async () => {
      try {
        const url = `${baseUrl}${cancelAllUrl}`;
        const response = await axios.get(url);

        navigation.navigate('CafeRegistrationIndex');

        Toast.show({
          type: response.data.IsSuccess ? 'success' : 'error',
          text1: response.data.IsSuccess ? 'Success' : 'Error',
          text2: response.data.Message,
        });
      } catch (error) {
        console.error('Error:', error);
      }
    };

    const handleConfirmation = () => {
      Alert.alert(
        'Confirmation',
        'Are you sure you want to cancel all registration?',
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Confirm',
            onPress: doCancelAll,
          },
        ],
        {cancelable: false},
      );
    };

    handleConfirmation();
  };
  return (
    <SafeAreaView>
      <View>
        <View style={styles.container}>
          {
            //===============Filter part Start here=======================
          }
          <View style={styles.filterArea}>
            <CollapsibleCard
              width="100%"
              title="Filter"
              style={[styles.filter]}>
              <View style={styles.container}>
                {/* Location Section */}
                <Text style={styles.sectionTitle}>Locations</Text>
                <View style={styles.section}>
                  {locationFilteredData.map((item, index) => (
                    <TouchableOpacity
                      key={item.Value}
                      style={[
                        styles.option,
                        selectedSections.LocationId === item.Value &&
                          styles.selected,
                      ]}
                      onPress={() => handleSelect('LocationId', item.Value)}>
                      <Text
                        style={
                          selectedSections.Location === item.Text
                            ? styles.selected
                            : styles.optionText
                        }>
                        {item.Text}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                {/* Vendor Section */}
                <Text style={styles.sectionTitle}>Vendors</Text>
                <View style={styles.section}>
                  {vendorFilteredData.map((item, index) => (
                    <TouchableOpacity
                      style={[
                        styles.option,
                        selectedSections.VendorId == item.Value &&
                          styles.selected,
                      ]}
                      key={item.Value}
                      onPress={() => handleSelect('VendorId', item.Value)}>
                      <Text
                        style={[
                          styles.optionText,
                          selectedSections.Vendor == item.Value &&
                            styles.selectedText,
                        ]}>
                        {item.Text}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                <View>
                  {dateOpen && (
                    <DateTimePicker
                      testID="dateTimePicker"
                      value={date}
                      mode={mode}
                      onChange={onChangeDate}
                    />
                  )}
                </View>

                {/* Submit Button */}

                <SubmitButton
                  title="Search"
                  disabled={false}
                  onPress={handleSubmitButton}
                />
              </View>

              {
                //===============Filter part Finished here=======================
              }
            </CollapsibleCard>
          </View>

          <View style={styles.header}>
            <TouchableOpacity
              style={styles.heading}
              onPress={locationSortHandle}>
              <Text style={styles.headingText}>
                Location {!sortByLocation && <Icon name="sort-amount-asc" />}
                {sortByLocation && <Icon name="sort-amount-desc" />}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.heading} onPress={vendorSortHandle}>
              <Text style={styles.headingText}>
                Vendor {!sortByVendor && <Icon name="sort-amount-asc" />}
                {sortByVendor && <Icon name="sort-amount-desc" />}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.heading}
              onPress={registerDateSortHandle}>
              <Text style={styles.headingText}>
                Reg Date {!sortByRegDate && <Icon name="sort-amount-asc" />}
                {sortByRegDate && <Icon name="sort-amount-desc" />}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.heading} onPress={statusSortHandle}>
              <Text style={styles.headingText}>
                Status {!sortByStatus && <Icon name="sort-amount-asc" />}
                {sortByStatus && <Icon name="sort-amount-desc" />}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.heading]}
              onPress={cancelAllRegistration}>
              <Text style={styles.headingText}>
                <Icon name="times" size={20} color="#FF0000" />
                (all)
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        <FlatList
          style={{height: '85%'}}
          data={data}
          renderItem={({item}) => <CafeteriaRegListItem item={item} />}
          keyExtractor={item => item.DetailsId}
          ListEmptyComponent={
            <View style={{alignItems: 'center'}}>
              <Text style={{color: '#000', padding: 20}}>data not found</Text>
            </View>
          }
          ListFooterComponent={
            <View
              style={{
                height: 50,
                backgroundColor: '#54875D',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              {isLoading && <ActivityIndicator color="#F2641C" />}
              <Text style={styles.footerText}>
                Showing {data.length} item from {totalData}
              </Text>
            </View>
          }
          ListFooterComponentStyle={{flex: 1, justifyContent: 'flex-end'}}
          onEndReached={() => getMoreData()}
          onEndReachedThreshold={0.5}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    // paddingVertical: 30,
    // paddingHorizontal: 30,
  },
  headerToBar: {
    backgroundColor: 'lightgray',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 5,
    elevation: 2,
    alignItems: 'center',
  },
  headerToBarText: {
    color: 'black',
    fontSize: 16,
    fontWeight: 'bold',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 5,
    elevation: 1,
    marginHorizontal: 2,
  },
  heading: {
    color: 'black',
    fontSize: 13,
    fontWeight: 'bold',
    width: '20%',
    textAlign: 'center',
  },
  headingText: {
    color: 'black',
    fontSize: 13,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  cell: {
    fontSize: 12,
    textAlign: 'left',
    width: '18%',
    color: '#000',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 5,
    marginHorizontal: 2,
    elevation: 1,
    borderRadius: 3,
    borderColor: '#fff',
    padding: 10,
    backgroundColor: '#fff',
  },
  buttonContainer: {
    flexDirection: 'row',
  },
  button: {
    paddingHorizontal: 10,
    padding: 10,
  },
  filterArea: {
    flexDirection: 'row',
  },
  filter: {
    minWidth: 200,
  },
  sorting: {
    alignItems: 'center',
    verticalAlign: 'middle',
  },
  sortingIcon: {
    padding: 5,
  },
  section: {
    marginBottom: 10,
    padding: 10,
    borderTopWidth: 0.25,
    flexWrap: 'wrap',
    flexDirection: 'row',
  },
  sectionTitle: {
    fontSize: 14,
    marginBottom: 5,
    color: '#000',
  },
  option: {
    padding: 10,
    backgroundColor: '#ddd',
    borderRadius: 5,
    marginBottom: 5,
    minWidth: 100,
    margin: 5,
  },
  selected: {
    backgroundColor: 'orange',
  },
  selectedText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
  },
  optionText: {
    fontSize: 16,
    color: '#000',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 10,
    backgroundColor: 'orange',
    borderRadius: 10,
    padding: 30,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 2,
      height: 5,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 10,
    padding: 10,
    elevation: 2,
    minWidth: 100,
  },
  buttonClose: {
    backgroundColor: 'red',
    marginTop: 50,
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  buttonSort: {
    backgroundColor: '#fff',
    color: '#000',
    padding: 10,
    borderRadius: 10,
    shadowOffset: {
      width: 2,
      height: 5,
    },
    shadowColor: '#000',
    margin: 5,
    textAlign: 'center',
  },
  sortButtonContainer: {
    flexWrap: 'wrap',
    flexDirection: 'row',
  },
  footerText: {
    color: '#fff',
  },
});

export default CafeteriaRegistrationIndex;
