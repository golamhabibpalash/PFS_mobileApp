import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet, ScrollView, TouchableOpacity, Linking } from 'react-native'
import appConfig from '../../app.json'
import axios from 'axios'
import { useNavigation } from '@react-navigation/native'
import Toast from 'react-native-toast-message'
import SubmitButton from '../../Components/SubmitButton'
import CafeNonRegAvailLunch from './CafeNonRegAvailLunch';

const baseCafeUrl = `${appConfig.apiBaseURL}PFS/api/Cafeteria`;

const CafeRegAvailLunch = ({ onOk, vendorName }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>You have registration today for {vendorName}. Do you want to consume it now?</Text>
      <SubmitButton
          title='Confirm'
          disabled={false}
          onPress={onOk}></SubmitButton>
    </View>
  );
};

const CafeteriaAvailLunch = () => {
  const [showConsumptionToday, setShowConsumptionToday] = useState(false);
  const [showNonRegisteredConsumptionToday, setShowNonRegisteredConsumptionToday] = useState(false);
  const [vendorName, setVendorName] = useState('');
  const navigation = useNavigation()

  useEffect(() => {
    registrationCheckToday()
  }, []);

  const registrationCheckToday = async () => {
    try {
      const response = await axios.get(`${baseCafeUrl}/HaveRegistrationToday`);
    
      if (response.data.IsSuccess) {
        setVendorName(response.data.VendorName);
        setShowConsumptionToday(true);
      } else {

        setShowNonRegisteredConsumptionToday(true);
      }
    } catch (error) {
      console.log(error)
    }
  };

  const handleConsumptionTodayOk = async () => {
    try {
      const response = await axios.get(`${baseCafeUrl}/RegistrationConsumption`);
      if (response.data.IsSuccess) {
        setVendorName(response.data.VendorName);
        var barcodeUrl = response.data.BarcodeUrl;
        Linking.openURL(barcodeUrl);
      } else {
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: response.data.Message
        });
      }
    } catch (error) {
      console.log(error)
    }


    setShowConsumptionToday(false);
    navigation.goBack();
  };

  return (
    <>
    { showConsumptionToday == false && showNonRegisteredConsumptionToday == true ? 
    <CafeNonRegAvailLunch /> :
      showConsumptionToday == true && showNonRegisteredConsumptionToday == false ?  
      <CafeRegAvailLunch vendorName={vendorName} onOk={handleConsumptionTodayOk} /> : 
    <Text style={styles.heading}>Loading .......</Text>
    }
    </>
    
  );
};

const styles = StyleSheet.create({
  container: {
    paddingLeft: 10,
    paddingRight: 10,
  },
  heading: {
    fontSize: 20,
    marginBottom: 30,
    alignSelf: 'center',
    color: '#000',
    backgroundColor: '#ddd',
    padding: 20,
    width: '100%',
    verticalAlign: 'middle',
    textAlign: 'center',
    marginTop: 30
  },
  section: {
    marginBottom: 20,
    padding: 10,
    borderTopWidth: 0.25,
    flexWrap: 'wrap',
    flexDirection: 'row',
  },
  sectionTitle: {
    fontSize: 12,
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
  submitButton: {
    padding: 15,
    backgroundColor: 'lightgreen',
    borderRadius: 5,
  },
  enabledButton: {
    opacity: 1,
  },
  disabledButton: {
    opacity: 0.5,
  },
  submitText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 18,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 10,
    backgroundColor: 'white',
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
  buttonOpen: {
    backgroundColor: '#0073B7',
  },
  buttonClose: {
    backgroundColor: '#666',
    marginTop: 50,
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
    color: '#000',
  },
});

export default CafeteriaAvailLunch;
