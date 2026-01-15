import { StyleSheet, Text, View, SafeAreaView, FlatList, Alert } from 'react-native'
import { useState, useEffect } from 'react'
import appConfig from '../../app.json'
import axios from 'axios'
import CafeTransferUsers from './CafeTransferUsers'
import {useNavigation} from '@react-navigation/native'
import Toast from 'react-native-toast-message'
import { SearchBar } from 'react-native-elements';


const baseUrl = appConfig.apiBaseURL
const userListEndpoint = "pfs/api/cafeteria/GetUserList"
const transferRegEndpoint = "pfs/api/cafeteria/TransferToUser"


const CafeteriaTransfer = ({ route }) => {
  const navigation = useNavigation();
  const { itemId } = route.params;
  
  const [data, setData] = useState([]);
  const [search, setSearch] = useState('');

  const fetchUserListForTransfer = async (searchText) => {
    try {
      const res = await axios.get(`${baseUrl}${userListEndpoint}`, {
        params: {
          search: searchText,
        },
      });
      
      return res.data;
    } catch (error) {
      return error;
    }
  };

  useEffect(() => {
    const getUserList = async () => {
      if (search.length >= 3) {
        const allUser = await fetchUserListForTransfer(search);
        setData(allUser.data);
      } else {
        setData([]); // clear the list when search text is less than 2
      }
    };
    
    getUserList();
  }, [search]);

  const updateSearch = (searchText) => {
    setSearch(searchText);
  };

  const transferRegistration = (userId) => {
    const doTransfer = async () => {
      try {
        const url = `${baseUrl}${transferRegEndpoint}?userId=${userId}&detailsId=${itemId}`;
        const response = await axios.post(url);
        
        navigation.navigate('CafeRegistrationIndex');
  
        Toast.show({
          type: response.data.IsSuccess ? 'success' : 'error',
          text1: response.data.IsSuccess ? 'Success' : 'Error',
          text2: response.data.Message
        });
      } catch (error) {
        console.error('Error:', error);
      }
    };
  
    const handleConfirmation = () => {
      Alert.alert(
        'Confirmation',
        'Are you sure you want to transfer registration?',
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Yes',
            onPress: doTransfer,
          },
        ],
        { cancelable: false }
      );
    };
  
    handleConfirmation();
  };
  

  return (
    <SafeAreaView>
      <View style={styles.container}>
        
        <SearchBar
          placeholder="Search user by name, email, mobile ..."
          onChangeText={updateSearch}
          value={search}
          lightTheme={true}
          round={true}
        />
      console.log(data);
        {data.length > 0 ?
        <View style={styles.header}>
        <Text style={styles.heading}>Name</Text>
        <Text style={styles.heading}>Email</Text>
        <Text style={styles.heading}>Mobile Number</Text>
        <Text style={styles.heading}>Action</Text>
      </View> : <></> }
        
      </View>
      <FlatList
        data={data}
        renderItem={({ item }) => 
          <CafeTransferUsers user={item} transferRegistration={transferRegistration} />
        }
        keyExtractor={item => item.Id}
      />
      
    </SafeAreaView>
  );
};

export default CafeteriaTransfer;

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
    fontSize: 14,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    elevation: 1,
    marginHorizontal: 2,
  },
  heading: {
    color: 'black',
    fontSize: 13,
    width: '22%',
    fontWeight: 'bold',
  },
  cell: {
    fontSize: 12,
    textAlign: 'left',
    width: '22%',
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
});
