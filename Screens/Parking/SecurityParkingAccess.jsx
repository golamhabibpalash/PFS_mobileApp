import {StyleSheet, Text, View, ScrollView, TouchableOpacity} from 'react-native';
import React, {useEffect} from 'react';
import ReaderBtn from './Component/ReaderBtn';
import ParkingTable from './Component/ParkingTable';
import {useDispatch, useSelector} from 'react-redux';
import {FetchParkingData} from '../../Services/ParkingServices/SecurityParkingAccessSlice';
import ParkingEmpInfo from './Component/ParkingEmpInfo';
import {setProfileHeaderShow} from '../../Services/UserProfileServices/UserProfileSlice';
import {blBgColors} from '../../App/Accessibilities';
// import {TouchableOpacity} from 'react-native-gesture-handler';
import {ActivityIndicator} from 'react-native-paper';
import DynamicIcon from '../../Components/DynamicIcon';

const SecurityParkingAccess = () => {
  const dispatch = useDispatch();
  const {employeeInfo} = useSelector(
    state => state.securityParkingAccessEmployeeInfo,
  );
  const {isLoading, isError, parkingData, error} = useSelector(
    state => state.securityParkingAccess,
  );

  useEffect(() => {
    dispatch(setProfileHeaderShow(true));
  }, [dispatch]);

  useEffect(() => {
    dispatch(FetchParkingData());
  }, [dispatch]);

  const actionButtons = [
    {
      bName: 'scan',
      title: 'Scan QR',
      bgColor: blBgColors.toffee,
      titleColor: '#fff',
      pIcon: 'qrcode',
    },
    {
      bName: 'searchQR',
      title: 'Search By QR',
      bgColor: blBgColors.banglalink,
      titleColor: '#fff',
      pIcon: 'nfc-search-variant',
      iconSource: 'MaterialCommunityIcons',
    },
    {
      bName: 'searchId',
      title: 'Search By ID',
      bgColor: blBgColors.bgTitle1,
      titleColor: '#000',
      pIcon: 'account-search',
      iconSource: 'MaterialCommunityIcons',
    },
  ];
  const handleReloadButton = () => {
    dispatch(FetchParkingData());
  };
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.container}>
        <View style={styles.subTitleWrapper}>
          <Text style={styles.subTitle}>Current Parking Status</Text>
        </View>
        <View style={styles.tableContainer}>
          {isLoading && <ActivityIndicator />}
          {!isLoading && <ParkingTable />}
        </View>
        <View>
          <TouchableOpacity
            style={styles.reloadButtonWrapper}
            onPress={handleReloadButton}>
            <Text style={styles.reloadButton}>Reload</Text>
            <DynamicIcon iconName={'refresh'} />
          </TouchableOpacity>
        </View>
        <View style={styles.buttonContainer}>
          {actionButtons.map((item, index) => (
            <ReaderBtn
              key={index}
              bName={item.bName}
              title={item.title}
              bgColor={item.bgColor}
              titleColor={item.titleColor}
              pIcon={item.pIcon}
              iconSource={item.iconSource}
            />
          ))}
        </View>
        {employeeInfo && Object.keys(employeeInfo).length > 0 && (
          <View style={styles.empInfoContainer}>
            <ParkingEmpInfo
              callToReloadParkingTable={this.handleReloadButton}
            />
          </View>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 5,
  },
  subTitleWrapper: {
    alignSelf: 'center',
    padding: 10,
  },
  subTitle: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 16,
  },
  tableContainer: {
    padding: 5,
    color: '#000',
    marginBottom: 20,
  },
  reloadButtonWrapper: {
    flexDirection: 'row',
    justifyContent: 'center',
    margin: 5,
    padding: 5,
    paddingVertical: 10,
    backgroundColor: blBgColors.banglalink,
    width: '30%',
    marginLeft: '35%',
    borderRadius: 5,
    alignContent: 'center',
    textAlignVertical: 'center',
  },
  reloadButton: {
    paddingRight: 5,
  },
  buttonContainer: {
    margin: 5,
    marginBottom: 20,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-evenly',
    borderWidth: 0.25,
    borderRadius: 8,
    backgroundColor: '#fff',
    padding: 10,
    elevation: 7,
  },
  empInfoContainer: {
    margin: 5,
    borderWidth: 0.25,
    borderRadius: 8,
    elevation: 7,
  },
});

export default SecurityParkingAccess;
