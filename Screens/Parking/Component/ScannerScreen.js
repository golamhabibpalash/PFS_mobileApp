import React, { useState } from 'react';
import { View, Text, Button } from 'react-native';
import QRCodeScanner from 'react-native-qrcode-scanner';
import { useDispatch, useSelector } from 'react-redux';
import { setQRData } from '../../../Services/UtilityServices/QRCodeScannerSlice';
import { FetchEmployeeInfo } from '../../../Services/ParkingServices/SecurityParkingAccessSlice';
import { useNavigation } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import { setParkingTransactionInitialData } from '../../../Services/ParkingServices/SecurityParkingAccessSlice';
import { RNCamera } from 'react-native-camera';

const ScannerScreen = () => {
  const { employeeInfo } = useSelector(
    state => state.securityParkingAccessEmployeeInfo,
  );
  const navigation = useNavigation();
  const [scanned, setScanned] = useState(false);
  const dispatch = useDispatch();

  const onSuccess = e => {
    setScanned(true);
    const employeeInfoParams = {
      LocationId: 1,
      EmployeeId: null,
      QRCode: e.data,
    };

    dispatch(setParkingTransactionInitialData(employeeInfo));
    dispatch(FetchEmployeeInfo(employeeInfoParams));
    dispatch(setQRData(e.data));
    Toast.show({
      type: 'success',
      text1: 'Successful',
      text2: 'QR Code Scanned successfyl',
    }),
      navigation.navigate('SecurityParkingAccess');
  };

  const handleScanAgain = () => {
    setScanned(false);
  };

  return (
    <View style={{ flex: 1 }}>
      {!scanned ? (
        <QRCodeScanner
          onRead={onSuccess}
          reactivate={true}
          reactivateTimeout={2000}
          containerStyle={{ flex: 1 }}
          cameraStyle={{ flex: 1 }}
          showMarker={true}
          flashMode={RNCamera.Constants.FlashMode.auto}
        />
      ) : (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text>Scanned successfully!</Text>
          <Button title="Scan Again" onPress={handleScanAgain} />
        </View>
      )}
    </View>
  );
};

export default ScannerScreen;
