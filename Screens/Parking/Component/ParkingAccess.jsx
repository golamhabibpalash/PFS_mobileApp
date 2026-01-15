import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  PermissionsAndroid,
  Platform,
  Linking,
} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import axios from 'axios';
import Geolocation from 'react-native-geolocation-service'; // Import Geolocation for getting current location
import appConfig from '../../../app.json';
import Loader from '../../../Components/Loader';
import ExitTokenModal from './ExitTokenModal';
import GetLocation from 'react-native-get-location'
import CustomPicker from '../../../Components/CustomPicker';
import CustomPickerItem from '../../../Components/CustomPickerItem';

const baseUrl = appConfig.apiBaseURL;

const ParkingAccessDashboard = ({userId}) => {
  const [loading, setLoading] = useState(false);
  const [parkingLocations, setParkingLocations] = useState([]);
  const [selectedVehicles, setSelectedVehicles] = useState({});
  const [responseData, setResponseData] = useState({});
  const [isParkButtonEnabled, setIsParkButtonEnabled] = useState(false);
  const [isExit, setIsExit] = useState(false);
  const [exitTokenData, setExitTokenData] = useState(null);

  useEffect(() => {
    const fetchParkingLocations = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${baseUrl}pfs/api/ParkingApi/LocationWiseParkingByUser?userId=${userId}`,
        );
        console.log("parking locations response", response?.data);
        if (
          response.data &&
          response.data.SelfParkingAccess &&
          response.data.SelfParkingAccess.UserWiseParkingLocations
        ) {
          const locations =
            response.data.SelfParkingAccess.UserWiseParkingLocations;
          const initialSelectedVehicles = {};
          locations.forEach(location => {
            initialSelectedVehicles[location.LocationId] = null;
          });
          // Set selected vehicles if IsExit is true
          if (response.data.ParkingAccessGrant.IsExit) {
            locations.forEach(location => {
              const {UserWiseRegisteredVehicles} = location;
              if (
                UserWiseRegisteredVehicles &&
                UserWiseRegisteredVehicles.length > 0
              ) {
                const firstVehicle = UserWiseRegisteredVehicles[0];
                initialSelectedVehicles[location.LocationId] =
                  firstVehicle.VehicleId;
              }
            });
          }
          setSelectedVehicles(initialSelectedVehicles);
          setParkingLocations(locations);
          setResponseData(response.data);

          const {IsExit} = response.data.ParkingAccessGrant;
          setIsExit(IsExit);

          const isAnyPickerUnselected = Object.values(
            initialSelectedVehicles,
          ).some(vehicleId => vehicleId === null);
          setIsParkButtonEnabled(!isAnyPickerUnselected);
        }
      } catch (error) {
        console.error('Error fetching parking locations:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchParkingLocations();
  }, [userId]);

  const handleVehicleChange = async (locationId, vehicleId) => {
    setSelectedVehicles(prevState => ({
      ...prevState,
      [locationId]: vehicleId,
    }));

    if (vehicleId !== null) {
      setLoading(true);
      const selectedLocation = parkingLocations.find(
        location => location.LocationId === locationId,
      );

      const hasPermission = await requestLocationPermission()

      if(!hasPermission){
                 Alert.alert(
                'Error',
                'Location permission denied.',
                [{text: 'Give Permission', onPress: () => Linking.openSettings()}],

              );

              setLoading(false);
              return false
      }

      GetLocation.getCurrentPosition({
        enableHighAccuracy: true,
        timeout: 15000,
    })
    .then(location => {
        console.log(location);
              const {latitude, longitude} = location;

              console.log(`${baseUrl}pfs/api/ParkingApi/CoordinateWiseAccess?locationid=${selectedLocation.LocationId}&latitude=${23.7763977}&longitude=${90.4022075}`)
              axios
                .get(
                  `${baseUrl}pfs/api/ParkingApi/CoordinateWiseAccess?locationid=${selectedLocation.LocationId}&latitude=${latitude}&longitude=${longitude}`,
                  // `${baseUrl}pfs/api/ParkingApi/CoordinateWiseAccess?locationid=${selectedLocation.LocationId}&latitude=${23.7749234}&longitude=${90.4134112}`,
                )
                .then(response => {

                  console.log("response", response?.data)
                  if (response.data) {
                    setLoading(false);
                    setIsParkButtonEnabled(true);
                  } else {
                    setIsParkButtonEnabled(false);
                    setLoading(false);
                    Alert.alert(
                      'Warning',
                      'Sorry! you are not in range for this location.',
                    );
                  }
                })
                .catch(error => {
                  setLoading(false);
                  Alert.alert(
                    'Error',
                    'An error occurred while checking coordinate wise access.',
                  );
                });
    })
    .catch(error => {
        const { code, message } = error;
        console.warn(code, message);

        setLoading(false);


        if(code == "UNAUTHORIZED"){
          Alert.alert(
            'Error',
            'Location permission denied.',
            [{text: 'Give Permission', onPress: () => Linking.openSettings()}],
  
          );
        }else{
          Alert.alert(
            'Error',
            message,
  
          );
        }

        
    })

      // requestLocationPermission().then(granted => {
      //   if (granted) {
      //     Geolocation.getCurrentPosition(
      //       position => {
      //         const {latitude, longitude} = position.coords;
      //         axios
      //           .get(
      //             `${baseUrl}pfs/api/ParkingApi/CoordinateWiseAccess?locationid=${selectedLocation.LocationId}&latitude=${latitude}&longitude=${longitude}`,
      //           )
      //           .then(response => {
      //             if (response.data) {
      //               setLoading(false);
      //               setIsParkButtonEnabled(true);
      //             } else {
      //               setIsParkButtonEnabled(false);
      //               setLoading(false);
      //               Alert.alert(
      //                 'Warning',
      //                 'Sorry! you are not in range for this location.',
      //               );
      //             }
      //           })
      //           .catch(error => {
      //             setLoading(false);
      //             Alert.alert(
      //               'Error',
      //               'An error occurred while checking coordinate wise access.',
      //             );
      //           });
      //       },
      //       error => {
      //         console.error('Error getting current location:', error);
      //         Alert.alert(
      //           'Error',
      //           'An error occurred while getting current location.',
      //           [{text: 'Give Permission', onPress: () => Linking.openSettings()}],

      //         );
      //         setLoading(false);
      //       },
      //       {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
      //     );
      //   } else {
      //     Alert.alert(
      //       'Permission Denied',
      //       'Location permission was not granted.',
      //     );
      //   }
      // });
    }
  };

  const requestLocationPermission = async () => {


    if(Platform.OS == 'ios'){
      return true
    }

    console.log("parking location permission")
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Location Permission',
          message: 'This app requires access to your location.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (err) {
      console.warn(err);
      return false;
    }
  };

  const handleParkButtonPress = async () => {
    try {
      setLoading(true);
      setIsExit(false);
      const formData = prepareFormData();
      const response = await axios.post(
        `${baseUrl}pfs/api/ParkingApi/SaveParkingTransaction`,
        formData,
      );
      if (response.data) {
        setIsParkButtonEnabled(false);
        setIsExit(true);
        const updatedSelectedVehicles = {};
        Object.keys(selectedVehicles).forEach(locationId => {
          updatedSelectedVehicles[locationId] = selectedVehicles[locationId];
        });
        setSelectedVehicles(updatedSelectedVehicles);
      } else {
        setIsParkButtonEnabled(false);
        Alert.alert('Error', 'Failed to save parking transaction.');
      }
    } catch (error) {
      console.error('Error saving parking transaction:', error);
      Alert.alert(
        'Error',
        // 'An error occurred while saving parking transaction.',
        'An error occurred while saving parking transaction. Parking Full',
      );
    } finally {
      setLoading(false);
    }
  };
  const prepareFormData = () => {
    const {ParkingAccessGrant, SelfParkingAccess} = responseData;
    const {
      EmployeeId,
      ParkingTypeId,
      IsParkingExitFromSameLocation,
      IsRegistered,
      LocationId,
      InventoryId,
      VehicleId,
    } = ParkingAccessGrant;

    const {UserWiseParkingLocations} = SelfParkingAccess;
    const {LocationId: userLocationId} = UserWiseParkingLocations[0];
    const {UserWiseRegisteredVehicles} = UserWiseParkingLocations[0];
    const {VehicleId: selectedVehicleId} = UserWiseRegisteredVehicles[0];

    const formData = {
      Id: 0,
      EmployeeId: EmployeeId || '',
      ParkingTypeId: ParkingTypeId || 0,
      LocationId: userLocationId || 0,
      InventoryId: InventoryId || 0,
      VehicleId: selectedVehicleId || 0,
      IsExit: isExit || false,
      IsParkingExitFromSameLocation: IsParkingExitFromSameLocation || false,
      IsRegistered: IsRegistered || false,
    };
    return formData;
  };

  const handleExitButtonPress = async () => {
    try {
      setLoading(true);
      setIsExit(true);
      const formData = prepareFormData();
      const response = await axios.post(
        `${baseUrl}pfs/api/ParkingApi/SaveParkingTransaction`,
        formData,
      );
      if (response.data) {
        setIsParkButtonEnabled(true);
        setIsExit(false);
        const updatedSelectedVehicles = {};
        Object.keys(selectedVehicles).forEach(locationId => {
          updatedSelectedVehicles[locationId] = null;
        });
        setSelectedVehicles(updatedSelectedVehicles);
        setExitTokenData(response.data); // Set exit token data on success
      } else {
        setIsParkButtonEnabled(false);
        Alert.alert('Error', 'Failed to exit parking transaction.');
      }
    } catch (error) {
      console.error('Error exiting parking transaction:', error);
      Alert.alert(
        'Error',
        'An error occurred while exiting parking transaction.',
      );
    } finally {
      setLoading(false);
    }
  };

  const renderActionButton = () => {
    if (isExit) {
      return (
        <TouchableOpacity
          style={[styles.button]}
          onPress={handleExitButtonPress}>
          <Text style={styles.buttonText}>Exit</Text>
        </TouchableOpacity>
      );
    } else {
      return (
        <TouchableOpacity
          style={[styles.button, !isParkButtonEnabled && styles.disabledButton]}
          disabled={!isParkButtonEnabled}
          onPress={handleParkButtonPress}>
          <Text style={styles.buttonText}>Park</Text>
        </TouchableOpacity>
      );
    }
  };

  const FullNameSelectedVehicle = (location) => {
    const vD = location.UserWiseRegisteredVehicles?.find(ele => ele.VehicleId == selectedVehicles[location.LocationId])

    if(vD){
       return `${vD.VehicleTypeName} (${vD.VehicleNumber})`
    }

    return ""
  }

  return (
    <View style={styles.ScrollView}>
      <Text style={styles.header}>Location wise parking</Text>
      {loading ? (
        <Text>Loading...</Text>
      ) : (
        <View style={styles.container}>
          {parkingLocations.map(location => (
            <View key={location.LocationId} style={styles.locationContainer}>
              <View style={styles.location}>
                <Text style={styles.locationName}>{location.LocationName}</Text>

                <CustomPicker
                  // selectedValue={selectedVehicles[location.LocationId]}
                  selectedValue={FullNameSelectedVehicle(location)}
                  style={styles.picker}

                >
                   {isExit == true ? (
                    <CustomPickerItem
                      value={null}
                      label="- Select -"
                      onPress={
                        itemValue => handleVehicleChange(location.LocationId, itemValue)
                      }
                    />
                  ) : (
                    <CustomPickerItem
                      label="- Select -" 
                      value={null}
                      onPress={
                        itemValue => handleVehicleChange(location.LocationId, itemValue)
                      }
                    />
                  )}

                  {location.UserWiseRegisteredVehicles.map(vehicle =>
                    isExit == true ? (
                      <CustomPickerItem
                        label={`${vehicle.VehicleTypeName} (${vehicle.VehicleNumber})`}
                        value={vehicle.VehicleId}
                        enabled={false}
                        onPress={
                          itemValue => handleVehicleChange(location.LocationId, itemValue)
                        }
                      />
                    ) : (
                      <CustomPickerItem
                        label={`${vehicle.VehicleTypeName} (${vehicle.VehicleNumber})`}
                        value={vehicle.VehicleId}
                        enabled={false}
                        onPress={
                          itemValue => handleVehicleChange(location.LocationId, itemValue)
                        }
                      />
                    ),
                  )}
                </CustomPicker>
                {/* <Picker
                  style={styles.picker}
                  selectedValue={selectedVehicles[location.LocationId]}
                  onValueChange={itemValue =>
                    handleVehicleChange(location.LocationId, itemValue)
                  }>
                  {isExit == true ? (
                    <Picker.Item
                      label="- Select -"
                      value={null}
                      enabled={false}
                    />
                  ) : (
                    <Picker.Item label="- Select -" value={null} />
                  )}
                  {location.UserWiseRegisteredVehicles.map(vehicle =>
                    isExit == true ? (
                      <Picker.Item
                        key={vehicle.VehicleId}
                        label={`${vehicle.VehicleTypeName} (${vehicle.VehicleNumber})`}
                        value={vehicle.VehicleId}
                        enabled={false}
                      />
                    ) : (
                      <Picker.Item
                        key={vehicle.VehicleId}
                        label={`${vehicle.VehicleTypeName} (${vehicle.VehicleNumber})`}
                        value={vehicle.VehicleId}
                      />
                    ),
                  )}
                </Picker> */}
              </View>
            </View>
          ))}
          {renderActionButton()}
        </View>
      )}
      {loading && <Loader loading={loading} />}
      <ExitTokenModal
        exitTokenData={exitTokenData}
        onClose={() => setExitTokenData(null)}
        onDownload={() => {
          // Implement the logic to download the exit token here
          // You can use libraries like react-native-fs or fetch the token data and save it using Expo FileSystem
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  ScrollView: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 10,
    margin: 12,
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 20,
  },
  container: {
    padding: 10,
  },
  locationContainer: {
    marginBottom: 20,
  },
  location: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
  },
  locationName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  picker: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#0073b7',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 16,
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
});

export default ParkingAccessDashboard;
