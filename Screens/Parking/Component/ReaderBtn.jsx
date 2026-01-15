import {StyleSheet, Text, View, Modal, TouchableOpacity, TextInput, TouchableWithoutFeedback} from 'react-native';
import React, {useState} from 'react';
// import {TouchableOpacity} from 'react-native-gesture-handler';
import {useNavigation} from '@react-navigation/native';
import DynamicIcon from '../../../Components/DynamicIcon';
import SubmitButton from '../../../Components/SubmitButton';
import {BLDefaultColour, blBgColors} from '../../../App/Accessibilities';
import {useDispatch, useSelector} from 'react-redux';
import {
  FetchEmployeeInfo,
  setParkingTransactionInitialData,
} from '../../../Services/ParkingServices/SecurityParkingAccessSlice';

const ReaderBtn = ({bName, title, bgColor, titleColor, pIcon, iconSource}) => {
  const dispatch = useDispatch();
  const {employeeInfo} = useSelector(
    state => state.securityParkingAccessEmployeeInfo,
  );
  const [modalVisible, setModalVisible] = useState(false);
  const navigation = useNavigation();
  const [qrCode, setQrCode] = useState('');
  const [empId, setEmpId] = useState('');

  const onSuccess = () => {
    const employeeInfoParams = {
      LocationId: 1,
      EmployeeId: empId,
      QRCode: qrCode,
    };

    dispatch(setParkingTransactionInitialData(employeeInfo));
    dispatch(FetchEmployeeInfo(employeeInfoParams));
    setQrCode('');
    setEmpId('');
    navigation.navigate('SecurityParkingAccess');
  };

  const handleSearchByQRPressed = () => {
    setModalVisible(true);
  };
  const handleSearchByIDPressed = () => {
    setModalVisible(true);
  };
  const handleBtnPressed = name => {
    if (name === 'scan') {
      navigation.navigate('Scanner', {title: 'PFS QR Scanner'});
    } else if (name === 'searchQR') {
      handleSearchByQRPressed(name);
    } else if (name === 'searchId') {
      handleSearchByIDPressed(name);
    }
  };

  const handleUserIdSubmitButton = () => {
    setModalVisible(!modalVisible);
    setQrCode('');
    onSuccess();
  };

  const handleQRCodeSubmitButton = () => {
    setModalVisible(!modalVisible);
    setEmpId('');
    onSuccess();
  };

  return (
    <TouchableOpacity
      style={[styles.container, {backgroundColor: bgColor}]}
      onPress={() => handleBtnPressed(bName)}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}>
        <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
          <View style={styles.centeredView}>
            <TouchableWithoutFeedback>
              <View style={styles.modalView}>
                {bName === 'searchQR' && (
                  <>
                    <Text>QR Code</Text>
                    <TextInput
                      placeholder="Input QR Code"
                      style={styles.modalInput}
                      value={qrCode}
                      onChangeText={text => setQrCode(text)}
                    />
                    <View style={styles.buttonWrapper}>
                      <View style={{margin: 10}}>
                        <SubmitButton
                          title="Search"
                          disabled={false}
                          onPress={handleQRCodeSubmitButton}
                        />
                      </View>
                      <View style={{margin: 10}}>
                        <SubmitButton
                          title="Close"
                          disabled={false}
                          bgColor={blBgColors.primaryGradient}
                          textColor="#fff"
                          onPress={() => setModalVisible(!modalVisible)}
                        />
                      </View>
                    </View>
                  </>
                )}
                {bName === 'searchId' && (
                  <>
                    <Text>User ID</Text>
                    <TextInput
                      placeholder="Input User ID"
                      style={styles.modalInput}
                      value={empId}
                      onChangeText={text => setEmpId(text)}
                    />
                    <View style={styles.buttonWrapper}>
                      <View style={{margin: 10}}>
                        <SubmitButton
                          title="Search"
                          disabled={false}
                          onPress={() => handleUserIdSubmitButton()}
                        />
                      </View>
                      <View style={{margin: 10}}>
                        <SubmitButton
                          title="Close"
                          disabled={false}
                          bgColor={blBgColors.primaryGradient}
                          textColor="#fff"
                          onPress={() => setModalVisible(!modalVisible)}
                        />
                      </View>
                    </View>
                  </>
                )}
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      <View style={styles.buttonWrapper}>
        <DynamicIcon
          iconName={pIcon}
          iconColor={titleColor}
          iconType={iconSource}
          iconSize={24}
        />
        <Text
          style={[
            styles.titleText,
            titleColor !== null && {color: titleColor},
          ]}>
          {' ' + title}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    minWidth: 150,
    minHeight: 80,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 10,
    elevation: 5,
  },
  buttonWrapper: {
    padding: 10,
    alignItems: 'center',
    flexDirection: 'row',
  },
  titleText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 16,
  },
  //modal styles
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    margin: 20,
    backgroundColor: '#fff',
    borderWidth: 0.5,
    borderColor: BLDefaultColour,
    borderRadius: 8,
    padding: 30,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 10,
    width: '80%',
    minHeight: 200,
  },
  modalInput: {
    margin: 5,
    borderColor: 'gray',
    borderWidth: 0.25,
    borderRadius: 8,
    width: '100%',
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default ReaderBtn;
