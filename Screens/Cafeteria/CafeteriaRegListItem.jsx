import {Text, View, StyleSheet, TouchableOpacity, Alert} from 'react-native';
import React, {useEffect, useState} from 'react';
import appConfig from '../../app.json';
import axios from 'axios';
import Icon from 'react-native-vector-icons/FontAwesome';
import Toast from 'react-native-toast-message';
import {useNavigation} from '@react-navigation/native';

const baseUrl = appConfig.apiBaseURL;
const cancelRegEndpoint = 'pfs/api/cafeteria/CancelRegistration';

const CafeteriaRegListItem = ({item}) => {
  const [isDisabled, setIsDisabled] = useState(false);
  const navigation = useNavigation();
  const cancelRegistration = regId => {
    const doCancel = async () => {
      try {
        const url = `${baseUrl}${cancelRegEndpoint}?id=${regId}`;
        const response = await axios.post(url);

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
        'Are you sure you want to cancel registration?',
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Confirm',
            onPress: doCancel,
          },
        ],
        {cancelable: false},
      );
    };

    handleConfirmation();
  };
  useEffect(() => {
    setIsDisabled(item.Status === 'Cancelled' || item.Status === 'Transferred');
  }, [item.Status]);

  return (
    <View style={styles.row}>
      <Text style={styles.cell}>{item.LocationName}</Text>
      <Text style={styles.cell}>{item.VendorName}</Text>
      <Text style={styles.cell}>{item.RegisterDate}</Text>
      <Text style={styles.cell}>{item.Status}</Text>
      <Text style={[styles.cell]}>
        <View style={[styles.buttonContainer]}>
          <TouchableOpacity
            disabled={isDisabled}
            style={[styles.button, isDisabled && styles.itemDisable]}
            onPress={() => cancelRegistration(item.DetailsId)}>
            <Icon name="times" size={20} color="#FF0000" />
          </TouchableOpacity>
          <TouchableOpacity
            disabled={isDisabled}
            style={[styles.button, isDisabled && styles.itemDisable]}
            onPress={() =>
              navigation.navigate('CafeTransfer', {itemId: item.DetailsId})
            }>
            <Icon name="arrow-right" size={20} color="#5E1D00" />
          </TouchableOpacity>
        </View>
      </Text>
    </View>
  );
};

export default CafeteriaRegListItem;

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

  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 5,
    elevation: 1,
    marginHorizontal: 2,
    elevation: 1,
    borderBottomWidth: 0.25,
    paddingVertical: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 2,
    marginHorizontal: 2,
    elevation: 1,
    borderRadius: 3,
    borderColor: '#fff',
    padding: 10,
    backgroundColor: '#fff',
  },
  cell: {
    fontSize: 12,
    color: '#000',
    flexWrap: 'wrap',
    width: '20%',
    marginHorizontal: 2,
  },
  buttonContainer: {
    flexDirection: 'row',
  },
  button: {
    paddingHorizontal: 5,
  },
  itemDisable: {
    opacity: 0.5,
  },
});
