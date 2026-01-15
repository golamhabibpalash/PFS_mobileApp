import React, {useState, useEffect} from 'react';
import {View, Text, Switch, StyleSheet, ScrollView, Alert, Platform} from 'react-native';
import DriverInfo from './Component/DriverInfo';
import LicenseInfo from './Component/LicenseInfo';
import VehicleInfo from './Component/VehicleInfo';
import EmployeeInfo from './Component/EmployeeInfo';
import {Picker} from '@react-native-picker/picker';
import appConfig from '../../app.json';
import axios from 'axios';
import SubmitButton from '../../Components/SubmitButton';
import Toast from 'react-native-toast-message';
import {useNavigation} from '@react-navigation/native';
import {blBgColors, blFontSize} from '../../App/Accessibilities';
import CustomPicker from '../../Components/CustomPicker';
import CustomPickerItem from '../../Components/CustomPickerItem';

const ParkingRegistration = ({route}) => {
  const [registrationType, setRegistrationType] = useState('');
  const [isAdvancedSettings, setIsAdvancedSettings] = useState(false);
  const [registrationModel, setRegistrationModel] = useState(null);
  const [loadType, setloadType] = useState(null);
  const [formData, setFormData] = useState([]);
  const [RegId, setregId] = useState('');
  const [driverLicenseIdForUpdate, setDriverLicenseIdForUpdate] = useState('');
  const [driverIdForUpdate, setdriverIdForUpdate] = useState('');
  const [vehicleIdForUpdate, setvehicleIdForUpdate] = useState('');
  const [isSelf, setisSelf] = useState('');
  const [isUpdate, setisUpdate] = useState(true);

  useEffect(() => {
    if (route.params !== undefined && route.params.item != undefined) {
      setisUpdate(true);
    } else {
      setisUpdate(false);
    }
  }, []);

  const baseUrl = appConfig.apiBaseURL;
  const navigation = useNavigation();

  useEffect(() => {
    if (route.params == undefined || route.params.mode !== 'edit') {
      fetchRegistrationModel();
    } else {
      fetchRegistrationeditModel(route);
    }
  }, [route.params]);

  const fetchRegistrationModel = async () => {
    const createRegistrationData = 'pfs/api/ParkingApi/Registration';
    try {
      const response = await axios.get(`${baseUrl}${createRegistrationData}`);
      const {data} = response;
      setRegistrationModel(data);
      setRegistrationType(data.RegistrationTypeId.toString());
    } catch (error) {
      console.error('Error fetching registration data:', error);
    }
  };
  const fetchRegistrationeditModel = async route => {
    const editRegistrationData = 'pfs/api/ParkingApi/UpdateRegistration';

    try {
      const response = await axios.get(
        `${baseUrl}${editRegistrationData}?flag=${route.params.item.RegistrationCode}`,
      );
      const data = response.data;

      setRegistrationModel(data.Data);
      setRegistrationType(data.Data.RegistrationTypeId.toString());
      setregId(data.Data.Id);
      setDriverLicenseIdForUpdate(data.Data.DriverLicenseIdForUpdate);
      setdriverIdForUpdate(data.Data.DriverIdForUpdate);
      setvehicleIdForUpdate(data.Data.VehicleIdForUpdate);
      setisSelf(data.Data.RegistrationGlobalTypeName);
      handleRegistrationTypeChange(data.Data.RegistrationTypeId.toString());
    } catch (error) {
      console.error('Error fetching registration edit data:', error);
    }
  };

  const handleRegistrationTypeChange = async value => {
    const getRegistrationType = 'pfs/api/ParkingApi/GetRegistrationType';
    setRegistrationType(value);
    try {
      const response = await axios.get(
        `${baseUrl}${getRegistrationType}?id=${value}`,
      );
      const regType = response.data;
      setloadType(regType);
      // Logic to show/hide panels based on registration type
    } catch (error) {
      console.error('Error fetching registration type:', error);
    }
  };

  if (!registrationModel) {
    return <Text>Loading...</Text>;
  }

  const extractFormData = data => {
    setFormData(data);
  };

  const handleSubmit = async () => {
    const errors = validateForm(formData, loadType);

    if (Object.keys(errors).length > 0) {
      Toast.show({
        type: 'warning',
        text1: 'Validation errors',
        text2: Object.values(errors).join(', '),
      });
      return;
    }

    const saveApi = `${baseUrl}pfs/api/ParkingApi/RegistrationInsert`;
    if (formData && typeof formData === 'object') {
      const model = new FormData();

      model.append('VehicleFile', formData.VehicleFile || null);
      model.append('DriverFile', formData.DriverFile || null);

      model.append('LicenseNumber', formData.LicenseNumber);
      model.append(
        'ValidityLicenseStartDate',
        formData.ValidityLicenseStartDate
          ? formData.ValidityLicenseStartDate.toISOString()
          : '',
      );
      model.append(
        'ValidityLicenseEndDate',
        formData.ValidityLicenseEndDate
          ? formData.ValidityLicenseEndDate.toISOString()
          : '',
      );
      model.append('VehicleType', formData.VehicleType);
      model.append('VehicleNumber', formData.VehicleNumber);
      model.append('VehicleIdForUpdate', vehicleIdForUpdate || 0);

      model.append('DriverName', formData.DriverName || '');
      model.append('DriverMobile', formData.DriverMobile || '');
      model.append('DriverLicenseNumber', formData.DriverLicenseNumber || '');
      model.append(
        'ValidityStartDateDriver',
        formData.ValidityStartDateDriver
          ? formData.ValidityStartDateDriver.toISOString()
          : '',
      );
      model.append(
        'ValidityEndDateDriver',
        formData.ValidityEndDateDriver
          ? formData.ValidityEndDateDriver.toISOString()
          : '',
      );
      model.append('DriverLicenseIdForUpdate', driverLicenseIdForUpdate || 0);

      model.append('RegistrationTypeId', registrationType);

      model.append('EmployeeId', formData.EmployeeId);
      model.append('EmployeeName', null);
      model.append('Mobile', null);
      model.append('Designation', null);

      model.append('MasterId', RegId || 0);
      model.append('VehicleImage', '');
      model.append('DriverImage', 0);
      model.append('IsParkingManager', false);
      model.append('DriverIdForUpdate', driverIdForUpdate || 0);
      model.append('LicenseIdForUpdate', 0);

      try {
        const response = await axios.post(saveApi, model, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        if (response.status === 200) {
          Toast.show({
            type: 'success',
            text1: 'Success',
            text2: response.data.message.Message,
          });
          navigation.navigate('ParkingDataTable', {route: true});
        }
      } catch (error) {
        let errorMessage = '';
        if (
          error.response &&
          error.response.data &&
          error.response.data.message
        ) {
          errorMessage = error.response.data.message.Message;
        }
        Toast.show({
          type: 'warning',
          text1: 'warning',
          text2: errorMessage,
        });
      }
    } else {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Form data is missing',
      });
    }
  };

  const validateForm = (formData, loadType) => {
    let errors = {};

    // Common validation
    if (!formData.LicenseNumber) {
      errors.LicenseNumber = 'Driving License number is required';
    }
    if (!formData.VehicleType) {
      errors.VehicleType = 'Vehicle type is required';
    }
    if (formData.VehicleFile && formData.VehicleFile.size > 10240 * 1000) {
      errors.VehicleFile = 'Vehicle file size exceeds';
    }

    // LoadType specific validation
    if (loadType === 'Self Driven') {
      if (!formData.EmployeeId) {
        errors.EmployeeId = 'Employee ID is required';
      }
      if (!formData.VehicleNumber) {
        errors.VehicleNumber = 'Vehicle number is required';
      }
    } else if (loadType === 'Driver Driven Or Both') {
      if (!formData.DriverName) {
        errors.DriverName = 'Driver name is required';
      }
      if (!formData.DriverMobile) {
        errors.DriverMobile = 'Driver mobile is required';
      }
      if (!formData.DriverLicenseNumber) {
        errors.DriverLicenseNumber = 'Driver license number is required';
      }
      if (!formData.VehicleNumber) {
        errors.VehicleNumber = 'Vehicle number is required';
      }
      if (!route.params && !formData.DriverFile) {
        errors.DriverFile = 'Driver file is required';
      }
      if (formData.DriverFile && formData.DriverFile.size > 10240 * 1000) {
        errors.DriverFile = 'Driver file size exceeds';
      }
    }

    return errors;
  };

  return (
    <View style={styles.container}>
      {/* Registration Type Dropdown */}
      <Text style={styles.heading}>
        Please select a registration type first
      </Text>

      {/* <Picker
        selectedValue={registrationType}
        onValueChange={handleRegistrationTypeChange}
        enabled={!isUpdate}>
        {registrationModel?.RegistrationTypes?.map(type => (
          <Picker.Item key={type.Value} label={type.Text} value={type.Value} />
        ))}
      </Picker> */}

      <CustomPicker 
        selectedValue={registrationModel?.RegistrationTypes?.find(ele => ele.Value == registrationType)?.Text}
        enabled={!isUpdate}
        // enabled={false}
      >
          {registrationModel?.RegistrationTypes?.map(type => (
            <CustomPickerItem 
              key={type.Value} 
              label={type.Text} 
              value={type.Value} 
              onPress={handleRegistrationTypeChange}
            />
          ))}
      </CustomPicker>

      {/* Advanced Settings Switch */}
      {/* {registrationModel.IsParkingManager && (
                <View style={styles.switchContainer}>
                    <Text>Advanced Settings</Text>
                    <Switch
                        value={isAdvancedSettings}
                        onValueChange={value => setIsAdvancedSettings(value)}
                    />
                </View>
            )} */}
      <View style={styles.verticalSpace} />
      {/* Render panels based on registration type */}
      {loadType === 'Self Driven' && (
        <>
          <ScrollView>
            <EmployeeInfo
              employeeInfo={registrationModel}
              formData={formData}
              setFormData={extractFormData}
            />
            <LicenseInfo
              licenseInfo={registrationModel}
              formData={formData}
              setFormData={extractFormData}
            />
            <VehicleInfo
              vehicleInfo={registrationModel}
              formData={formData}
              setFormData={extractFormData}
            />
          </ScrollView>
        </>
      )}

      {loadType === 'Driver Driven Or Both' && (
        <>
          <ScrollView>
            <EmployeeInfo
              employeeInfo={registrationModel}
              formData={formData}
              setFormData={extractFormData}
            />
            <LicenseInfo
              licenseInfo={registrationModel}
              formData={formData}
              setFormData={extractFormData}
            />
            <VehicleInfo
              vehicleInfo={registrationModel}
              formData={formData}
              setFormData={extractFormData}
            />
            <DriverInfo
              driverInfo={registrationModel}
              formData={formData}
              setFormData={extractFormData}
            />
          </ScrollView>
        </>
      )}
      {registrationType !== '0' && isSelf != 'Self Driven' ? (
        <View
          style={{
            marginBottom:Platform.OS == 'ios' ? 20 : 0
          }}
        >
          <SubmitButton title="Submit" onPress={handleSubmit} disabled={false} />
        </View>
      ) : (
        <Text></Text>
      )}

      {/* {loadType === 'BL Fleet' && (
                <>
                    <ScrollView>
                        <EmployeeInfo employeeInfo={registrationModel} />
                        <VehicleInfo vehicleInfo={registrationModel} />
                        <DriverInfo driverInfo={registrationModel} />
                        <SubmitButton title="Submit" onPress={handleSubmit} />
                    </ScrollView>
                </>
            )} */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  verticalSpace: {
    height: 20,
  },
  heading: {
    fontSize: blFontSize.bodyLarge,
    fontStyle: 'italic',
    color: '#FFFFFF',
    backgroundColor: blBgColors.secondaryGradient,
    textAlign: 'center',
  },
});

export default ParkingRegistration;
