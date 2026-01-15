/* eslint-disable prettier/prettier */
import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Pressable,
  ScrollView,
  TextInput,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import {format} from 'date-fns';
import SubmitButton from '../../Components/SubmitButton';
import appConfig from '../../app.json';
import Toast from 'react-native-toast-message';
import {useNavigation} from '@react-navigation/native';
import {blBgColors, blFontSize} from '../../App/Accessibilities';
import Loader from '../../Components/Loader';
import {useDispatch, useSelector} from 'react-redux';
import {
  clearRegistrationData,
  getRegistrationInfo,
  registerFood,
} from '../../Services/CafeteriaServices/CafeteriaRegistrationSlice';
import DynamicIcon from '../../Components/DynamicIcon';
import {tryStatement} from '@babel/types';

const CafeRegistration = () => {
  const {
    isLoading,
    isError,
    error,
    locations: cafeteriaLocation,
    vendors: vendorNames,
    quickOptions,
    NextWorkingDate,
  } = useSelector(stor => stor.CafeteriaRegistrationLoad);

  const {
    data,
    status,
    error: regError,
    message: regMessage,
    isSuccess,
  } = useSelector(stor => stor.FoodRegistration);

  const dispatch = useDispatch();
  const handleInputChange = (fieldName, value) => {
    setFormData(prevFormData => {
      const updatedFormData = {...prevFormData, [fieldName]: value};
      isSubmitEnabled(updatedFormData);
      return updatedFormData;
    });
  };

  const [pageLoading, setPageLoading] = useState(isLoading);
  const [selectedSections, setSelectedSections] = useState({});
  const [dateOpen, setDateOpen] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [datetype, setDatetype] = useState('0'); //1=Start Date, 2=End Date
  const [submitButtonStatus, setSubmitButtonStatus] = useState(false);
  const [dateRangeVisible, setDateRangeVisible] = useState(false);
  const [maxDate, setMaxDate] = useState(new Date(new Date().setMonth(new Date().getMonth() + 6)));
  const [formData, setFormData] = useState({
    LocationId: '',
    VendorId: '',
    DaysCount: '',
    StartDate: '0001-01-01',
    EndDate: '0001-01-01',
    NextWorkingDate: '0001-01-01',
    EndDateAfter5Days: '0001-01-01',
    EndDateAfter30Days: '0001-01-01',
  });

  const navigation = useNavigation();

  const handleSelect = (section, option, value) => {
    setSelectedSections(prevSelectedSections => ({
      ...prevSelectedSections,
      [section]: option,
    }));

    if (value === 0 && section === 'DaysCount') {
      setDateRangeVisible(true);
    } else if (value > 0 && section === 'DaysCount') {
      setDateRangeVisible(false);
    }
    handleInputChange(section, value);
  };

  const onChangeDate = (event, selectedDate) => {
    setDateOpen(false);
    const date = format(new Date(selectedDate), 'dd MMM yyyy');
    const formatDate = format(new Date(selectedDate), 'yyyy-MM-dd');
    if (datetype === '1') {
      handleInputChange('StartDate', formatDate);
      setStartDate(date);
    }
    if (datetype === '2') {
      handleInputChange('EndDate', formatDate);
      setEndDate(date);
    }
    setDatetype('0');
  };

  useEffect(() => {
    dispatch(clearRegistrationData());
    dispatch(getRegistrationInfo()).then(() => {
      autoSelectOption(cafeteriaLocation, vendorNames, NextWorkingDate);
    });
  }, [dispatch]);

  const autoSelectOption = (loc, ven) => {
    if (loc.length === 1) {
      handleSelect('LocationId', loc[0].Text, loc[0].Value);
    }
    if (ven.length === 1) {
      handleSelect('VendorId', ven[0].Text, ven[0].Value);
    }
  };

  const handleStartDateTap = () => {
    setDatetype('1');
    setDateOpen(true);
  };

  const handleEndDateTap = () => {
    setDatetype('2');
    setDateOpen(true);
  };
  const handleStartDateChange = text => {
    setStartDate(text);
    const fDate = formatDate(text);
    handleInputChange('StartDate', fDate);
  };
  const handleEndDateChange = text => {
    setEndDate(text);
    const fDate = formatDate(text);
    handleInputChange('EndDate', fDate);
  };
  const formatDate = dateString => {
    const months = {
      Jan: '01',
      Feb: '02',
      Mar: '03',
      Apr: '04',
      May: '05',
      Jun: '06',
      Jul: '07',
      Aug: '08',
      Sep: '09',
      Oct: '10',
      Nov: '11',
      Dec: '12',
    };

    const parts = dateString.split(' ');
    if (parts.length !== 3) {
      return '';
    }

    const day = parts[0].padStart(2, '0');
    const month = months[parts[1]];
    const year = parts[2];
    return `${year}-${month}-${day}`;
  };

  const isSubmitEnabled = updatedForm => {
    if (
      updatedForm.VendorId !== '' &&
      updatedForm.LocationId !== '' &&
      updatedForm.DaysCount !== ''
    ) {
      setSubmitButtonStatus(true);
    } else {
      setSubmitButtonStatus(false);
    }
  };

  const validateForm = () => {
    let isValidate = false;
    const {LocationId, VendorId, DaysCount} = formData;

    if (LocationId !== '' && VendorId !== '' && DaysCount !== '') {
      isValidate = true;
    } else {
      isValidate = false;
    }
    return isValidate;
  };

  const handleSubmitForm = async () => {
    if (validateForm()) {
      setPageLoading(true);
      try {
        dispatch(registerFood(formData));
        if (isSuccess) {
          setPageLoading(false);
          Toast.show({
            type: 'success',
            text1: 'Registration Success!',
            text2: regMessage,
          });
          navigation.navigate('CafeRegistrationIndex', {
            title: 'Lunch Registrations',
          });
        }
      } catch (error) {
        setPageLoading(false);
      } finally {
        setPageLoading(false);
        navigation.navigate('CafeRegistrationIndex', {
          title: 'Lunch Registrations',
        });
      }
    } else {
      Toast.show({
        type: 'warning',
        text1: 'Caution!',
        text2: 'please select all options before submit',
      });
      setPageLoading(false);
    }
  };
  return (
    <ScrollView>
      <View style={styles.container}>
        <Loader loading={pageLoading} />

        {/* Location Section */}
        <View style={styles.sectionWrapper}>
          <Text style={styles.sectionTitle}>Select Location</Text>
          <View style={styles.section}>
            {cafeteriaLocation.map((item, index) => (
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
            {vendorNames.map((item, index) => (
              <TouchableOpacity
                style={[
                  styles.option,
                  selectedSections.VendorId == item.Text && styles.selected,
                ]}
                key={item.Value}
                onPress={() => handleSelect('VendorId', item.Text, item.Value)}>
                <Text
                  style={[
                    selectedSections.VendorId === item.Text
                      ? styles.selectedText
                      : styles.optionText,
                  ]}>
                  {item.Text}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Quick Option Section */}
        <View style={styles.sectionWrapper}>
          <Text style={styles.sectionTitle}>Quick Options</Text>

          <View style={styles.section}>
            {!isLoading &&
              quickOptions.map((item, index) => (
                <TouchableOpacity
                  key={item.Value}
                  style={[
                    styles.option,
                    selectedSections.DaysCount === item.Text && styles.selected,
                  ]}
                  onPress={() =>
                    handleSelect('DaysCount', item.Text, item.Value)
                  }>
                  <Text
                    style={[
                      selectedSections.DaysCount === item.Text
                        ? styles.selectedText
                        : styles.optionText,
                    ]}>
                    {item.Text}
                  </Text>
                </TouchableOpacity>
              ))}
          </View>
        </View>

        {/* Date Range Section */}
        {dateRangeVisible && (
          <View style={styles.sectionWrapper}>
            <Text style={styles.sectionTitle}>Date Range</Text>

            <View
              style={{
                borderTopWidth: 0.25,
                paddingTop: 10,
              }}>
              <View style={styles.dateRangecontainer}>
                <Text>Start date:</Text>
                <View style={styles.dateRangeOption}>
                  <View style={styles.inputWrapper}>
                    <TextInput
                      style={styles.dateRangeInput}
                      value={startDate}
                      onChangeText={handleStartDateChange}
                      editable={false}
                    />
                  </View>
                  <Pressable
                    style={styles.iconWrapper}
                    onPress={handleStartDateTap}>
                    <DynamicIcon
                      iconName={'calendar'}
                      iconSize={40}
                      iconColor={'#ddd'}
                    />
                  </Pressable>
                </View>
              </View>

              <View style={styles.dateRangecontainer}>
                <Text>End date:</Text>
                <View style={styles.dateRangeOption}>
                  <View style={styles.inputWrapper}>
                    <TextInput
                      style={styles.dateRangeInput}
                      value={endDate}
                      onChangeText={handleEndDateChange}
                      editable={false}
                    />
                  </View>
                  <Pressable
                    style={styles.iconWrapper}
                    onPress={handleEndDateTap}>
                    <DynamicIcon
                      iconName={'calendar'}
                      iconSize={40}
                      iconColor={'#ddd'}
                    />
                  </Pressable>
                </View>
              </View>
            </View>
          </View>
        )}
        <View>
          {dateOpen && (
            <DateTimePicker
              testID="dateTimePicker"
              minimumDate={new Date(NextWorkingDate)}
              maximumDate={maxDate}
              value={new Date(NextWorkingDate)}
              mode={'date'}
              onChange={onChangeDate}
            />
          )}
        </View>
        {/* <TouchableOpacity
          onPress={handleSubmitForm}
          style={{backgroundColor: 'red', padding: 10}}>
          <Text>Submit</Text>
        </TouchableOpacity> */}
        <SubmitButton
          disabled={!submitButtonStatus}
          onPress={handleSubmitForm}></SubmitButton>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingLeft: 10,
    paddingRight: 10,
    flex: 1,
    backgroundColor: blBgColors.defaultBackground,
  },
  heading: {
    fontSize: 20,
    marginBottom: 10,
    alignSelf: 'center',
    color: '#000',
    backgroundColor: '#ddd',
    padding: 20,
    width: '100%',
    verticalAlign: 'middle',
    textAlign: 'center',
  },
  sectionWrapper: {
    backgroundColor: '#fff',
    marginVertical: 10,
    padding: 10,
    borderRadius: 10,
    elevation: 3,
  },
  section: {
    marginBottom: 20,
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
    backgroundColor: '#fff',
    borderRadius: 5,
    minWidth: 150,
    margin: 5,
    alignItems: 'center',
    width: '45%',
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: {
        width: 0,
        height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

        // elevation: 5
  },
  dateRangecontainer: {
    flexDirection: 'column', // Vertical direction
    alignItems: 'flex-start', // Align items to the start of the cross axis (vertically)
    marginBottom: 20,
  },
  dateRangeOption: {
    flexDirection: 'row', // Horizontal direction
    alignItems: 'center', // Align items in the center vertically
  },
  inputWrapper: {
    flex: 1, // Take up remaining space
    marginRight: 10, // Margin between input and icon
  },
  dateRangeInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 8,
    color: 'black',
    width: '100%', // Take up all available width
  },
  iconWrapper: {
    justifyContent: 'center', // Center items horizontally
  },
  selected: {
    backgroundColor: blBgColors.secondaryGradient,
  },
  selectedText: {
    fontSize: 15,
    color: '#fff',
    fontWeight: 'bold',
  },
  optionText: {
    fontSize: 15,
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
    backgroundColor: '#FFA500',
  },
  buttonClose: {
    backgroundColor: '#666',
    marginTop: 50,
  },
  textStyle: {
    color: '#000',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
    color: '#000',
  },
});

export default CafeRegistration;
