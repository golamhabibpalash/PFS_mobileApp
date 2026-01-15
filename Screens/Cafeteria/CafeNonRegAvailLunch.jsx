/* eslint-disable prettier/prettier */
import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Linking,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import axios from 'axios';
import appConfig from '../../app.json';
import SubmitButton from '../../Components/SubmitButton';
import {blBgColors, blFontColor, blFontSize} from '../../App/Accessibilities';
import LinearGradient from 'react-native-linear-gradient';

const baseUrl = appConfig.apiBaseURL;
const getAvailableOptionsUrl = 'pfs/api/cafeteria/RegistrationIndex';
const consumptionUrl = 'pfs/api/cafeteria/NonRegistrationConsumption';

const CafeNonRegAvailLunch = () => {
  const [formData, setFormData] = useState({
    LocationId: '',
    VendorId: '',
  });
  const navigation = useNavigation();
  const handleInputChange = (fieldName, value) => {
    setFormData({...formData, [fieldName]: value});
    isSubmitEnabled();
  };

  const [selectedSections, setSelectedSections] = useState({});
  const [locations, setLocations] = useState([]);
  const [vendors, setVendors] = useState([]);

  const handleSelect = (section, option, value) => {
    setSelectedSections(prevSelectedSections => ({
      ...prevSelectedSections,
      [section]: option,
    }));

    handleInputChange(section, value);
  };

  const autoSelectOption = (loc, ven) => {
    if (loc.length === 1) {
      handleSelect('LocationId', loc[0].Text, loc[0].Value);
    }
    if (ven.length === 1) {
      handleSelect('VendorId', ven[0].Text, ven[0].Value);
    }
  };

  const fetchData = async () => {
    try {
      const response = await axios.get(`${baseUrl}${getAvailableOptionsUrl}`);
      const availableLocation =
        response.data.AvailMealPopup.LocationSelectListItems;
      const availableNonRegVendors =
        response.data.AvailMealPopup.MenuNonRegisteredSelectListItems;

      setLocations(availableLocation);
      setVendors(availableNonRegVendors);
      autoSelectOption(availableLocation, availableNonRegVendors);
    } catch (error) {
      console.error(error);
    }
  };
  const locationFilteredData = locations.filter(
    item => item.Value !== '' && item.Value !== null,
  );
  const vendorFilteredData = vendors.filter(
    item => item.Value !== '' && item.Value !== null,
  );
  useEffect(() => {
    fetchData();
  }, []);

  const isSubmitEnabled = () => {
    let isEnable = false;
    if (formData.LocationId !== '' && formData.VendorId !== '') {
      isEnable = true;
    }
    return isEnable;
  };

  const handleConsumptionToday = async () => {
    try {
      const response = await axios.get(
        `${baseUrl}${consumptionUrl}?vendorId=${formData.VendorId}&locationId=${formData.LocationId}`,
      );
      if (response.data.IsSuccess) {
        var barcodeUrl = response.data.BarcodeUrl;
        Linking.openURL(barcodeUrl);
      } else {
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: response.data.Message,
        });
      }
    } catch (error) {
      console.log(error);
    }

    navigation.goBack();
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        <Text style={styles.heading}>
          *You don't have any pre-registration today. So choose location and
          vendor for lunch consumption.
        </Text>
        {/* Location Section */}
        <View style={styles.sectionWrapper}>
          <Text style={styles.sectionTitle}>Select Location</Text>
          <View style={styles.section}>
            {locationFilteredData.map(item => (
              <TouchableOpacity
                key={item.Value}
                style={[
                  styles.option,
                  selectedSections.LocationId === item.Text && styles.selected,
                ]}
                onPress={() =>
                  handleSelect('LocationId', item.Text, item.Value)
                }>
                <Text
                  style={
                    selectedSections.LocationId === item.Text
                      ? styles.selectedText
                      : styles.optionText
                  }>
                  {item.Text}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Vendor Section */}
        <View style={styles.sectionWrapper}>
          <Text style={styles.sectionTitle}>Select Vendor</Text>
          <View style={styles.section}>
            {vendorFilteredData.map(item => (
              <TouchableOpacity
                style={[
                  styles.option,
                  selectedSections.VendorId == item.Text && styles.selected,
                ]}
                key={item.Value}
                onPress={() => handleSelect('VendorId', item.Text, item.Value)}>
                <Text
                  style={[
                    styles.optionText,
                    selectedSections.VendorId == item.Text &&
                      styles.selectedText,
                  ]}>
                  {item.Text}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Submit Button */}
        <View style={{width: '100%', alignItems: 'center'}}>
          <LinearGradient
            style={{width: '80%', borderRadius: 8}}
            colors={[blBgColors.primaryGradient, blBgColors.secondaryGradient]}
            start={{x: 0, y: 1}}
            end={{x: 1, y: 1}}>
            <SubmitButton
              bgColor="transparent"
              title="Consume"
              disabled={!isSubmitEnabled()}
              onPress={handleConsumptionToday}
            />
          </LinearGradient>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingLeft: 10,
    paddingRight: 10,
    backgroundColor: blBgColors.defaultBackground,
  },
  heading: {
    fontSize: 20,
    color: '#000',
    backgroundColor: blBgColors.banglalink50,
    padding: 20,
    width: '100%',
    verticalAlign: 'middle',
    textAlign: 'center',
    marginVertical: 20,
    borderRadius: 8,
  },
  sectionWrapper: {
    backgroundColor: '#fff',
    padding: 5,
    borderRadius: 8,
    marginBottom: 20,
  },
  section: {
    marginBottom: 20,
    padding: 10,
    borderWidth: 0.25,
    flexWrap: 'wrap',
    flexDirection: 'row',
  },
  sectionTitle: {
    fontSize: blFontSize.bodyRegular,
    marginBottom: 5,
    color: '#000',
    textAlign: 'center',
  },
  option: {
    padding: 10,
    backgroundColor: '#ddd',
    borderRadius: 5,
    marginBottom: 5,
    minWidth: 150,
    margin: 5,
    width: '45%',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  selected: {
    backgroundColor: blFontColor.BLDefaultColour,
  },
  selectedText: {
    fontSize: blFontSize.bodyLarge,
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  optionText: {
    fontSize: blFontSize.bodyLarge,
    color: '#000',
    textAlign: 'center',
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

export default CafeNonRegAvailLunch;
