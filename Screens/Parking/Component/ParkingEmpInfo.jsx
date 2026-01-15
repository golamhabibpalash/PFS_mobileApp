import {
  Alert,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import SubmitButton from '../../../Components/SubmitButton';
import {ActivityIndicator} from 'react-native-paper';
import {Picker} from '@react-native-picker/picker';
import {
  ParkingTransactionProcess,
  resetEmployeeInfo,
  modifyEmployeeInfo,
  fetchParkingInventoryId,
} from '../../../Services/ParkingServices/SecurityParkingAccessSlice';
import {FetchParkingData} from '../../../Services/ParkingServices/SecurityParkingAccessSlice';
import Toast from 'react-native-toast-message';
import {useNavigation} from '@react-navigation/native';

const ParkingEmpInfo = ({callToReloadParkingTable}) => {
  const {isLoading, isError, error, employeeInfo} = useSelector(
    state => state.securityParkingAccessEmployeeInfo,
  );
  const {
    isLoading: processLoading,
    isError: processIsError,
    error: processError,
    pTransactionInfo,
  } = useSelector(state => state.parkingTransactionProcess);
  const dispatch = useDispatch();
  const [vehicleNumber, setVehicleNumber] = useState(
    employeeInfo.VehicleNumber,
  );
  const [vehicleTypeId, setVehicleTypeId] = useState(
    employeeInfo.VehicleTypeId,
  );
  const isSearchById = employeeInfo.VehicleTypeId == 0 ? true : false;
  const navigation = useNavigation();
  const handleVehicleTypeChange = value => {
    setVehicleTypeId(value);
    //setVehicleType(value)
  };

  const empDataItem = (detailItem, detailInfo) => {
    return (
      <View style={styles.item}>
        <View style={{width: '30%'}}>
          <Text style={{color: '#000'}}>{detailItem}</Text>
        </View>
        <View style={{width: '10%'}}>
          <Text style={{color: '#000'}}>:</Text>
        </View>
        <View style={{width: '60%'}}>
          <Text style={{color: '#000'}}>{detailInfo}</Text>
        </View>
      </View>
    );
  };

  const empDataItemRenderVehicleNumberInput = (detailItem, detailInfo) => {
    return (
      <View style={styles.item}>
        <View style={{width: '30%'}}>
          <Text style={{color: '#000'}}>{detailItem}</Text>
        </View>
        <View style={{width: '10%'}}>
          <Text style={{color: '#000'}}>:</Text>
        </View>
        <View style={{width: '60%'}}>
          <TextInput
            placeholder="Input Vehicle Number"
            style={{color: '#000'}}
            value={detailInfo}
            onChangeText={text => setVehicleNumber(text)}
          />
        </View>
      </View>
    );
  };

  const empDataItemRenderVehicleTypeSelectList = (detailItem, detailInfo) => {
    return (
      <View style={styles.item}>
        <View style={{width: '30%'}}>
          <Text style={{color: '#000'}}>{detailItem}</Text>
        </View>
        <View style={{width: '10%'}}>
          <Text style={{color: '#000'}}>:</Text>
        </View>
        <View style={{width: '60%'}}>
          <Picker
            selectedValue={vehicleTypeId.toString()}
            enabled={isSearchById}
            onValueChange={handleVehicleTypeChange}>
            {detailInfo.map(type => (
              <Picker.Item
                key={type.Value}
                label={type.Text}
                value={type.Value}
              />
            ))}
          </Picker>
        </View>
      </View>
    );
  };

  const handleSubmitBtn = async e => {
    try {
      let newEmpInfo = {
        ...employeeInfo,
        VehicleNumber: vehicleNumber,
        VehicleTypeId: vehicleTypeId,
        LocationId: 1,
      };
      dispatch(ParkingTransactionProcess(newEmpInfo));
      dispatch(resetEmployeeInfo());
      // dispatch(FetchParkingData());
      const alertText =
        String(e) === 'false'
          ? 'Your vehicle has been successfully parked. Thank you for using our parking service.'
          : 'Your vehicle has exited the parking area. Have a safe journey!';
      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: alertText,
      });
      this.callToReloadParkingTable();
    } catch (error) {}
  };
  // useEffect(() => {
  //   dispatch(resetEmployeeInfo());
  // }, []);
  return (
    <View>
      {isLoading && <ActivityIndicator style={{padding: 10}} />}
      {employeeInfo && employeeInfo.EmployeeId && (
        <View style={styles.card}>
          <View style={styles.detailsContainer}>
            <Text style={styles.titleText}>Employee Parking Information</Text>
            {empDataItem('Employee Id', employeeInfo.EmployeeId)}
            {empDataItem('Employee Name', employeeInfo.EmployeeName)}
            {empDataItem('Designation', employeeInfo.Designation)}

            {isSearchById &&
              empDataItemRenderVehicleNumberInput(
                'Vehicle Number',
                employeeInfo.VehicleNumber,
              )}
            {!isSearchById &&
              empDataItem('Vehicle Number', employeeInfo.VehicleNumber)}

            {isSearchById &&
              empDataItemRenderVehicleTypeSelectList(
                'Vehicle Type',
                employeeInfo.VehicleTypeSelectList,
              )}
            {!isSearchById &&
              empDataItemRenderVehicleTypeSelectList(
                'Vehicle Type',
                employeeInfo.VehicleTypeSelectList,
              )}
            {employeeInfo.DriverName &&
              empDataItem('Driver Name', employeeInfo.DriverName)}
            {employeeInfo.DriverMobile &&
              empDataItem('Driver Mobile', employeeInfo.DriverMobile)}
            {/* {employeeInfo.DriverImage &&
              empDataItem('Driver Image', employeeInfo.DriverImage)} */}
            <View style={{margin: 10}}>
              <TouchableOpacity>
                {employeeInfo.IsExit && (
                  <SubmitButton
                    title={
                      processLoading == true ? (
                        <ActivityIndicator size="small" />
                      ) : (
                        'Exit'
                      )
                    }
                    disabled={false}
                    onPress={() => handleSubmitBtn(employeeInfo.IsExit)}
                  />
                )}
                {!employeeInfo.IsExit && (
                  <SubmitButton
                    title={
                      processLoading == true ? (
                        <ActivityIndicator size="small" />
                      ) : (
                        'Park'
                      )
                    }
                    disabled={false}
                    onPress={() => handleSubmitBtn(employeeInfo.IsExit)}
                  />
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
      {!isLoading &&
        !employeeInfo.EmployeeId &&
        Toast.show({
          type: 'error',
          text1: 'Not Found',
          text2: 'User Data Not Found',
        })}
    </View>
  );
};

export default ParkingEmpInfo;

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  detailsContainer: {
    //flex: 1,
  },
  titleText: {
    color: '#000',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  item: {
    flexDirection: 'row',
    margin: 1,
    backgroundColor: '#E8EBFA',
    padding: 5,
  },
  imageContainer: {
    marginRight: 16,
  },
  profileImage: {
    width: 64,
    height: 64,
    borderRadius: 32,
  },
});
