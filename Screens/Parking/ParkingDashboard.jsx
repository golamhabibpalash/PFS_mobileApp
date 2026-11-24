import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import {useSelector} from 'react-redux';
import ParkingSpaceInfo from './ParkingSpaceInfo';
import Loader from '../../Components/Loader';
import {useAuthState} from '../../Navigation/AuthContext';
import ParkingAccess from './Component/ParkingAccess';
import Icon from 'react-native-vector-icons/FontAwesome';
import {useLiveData} from '../../hooks/useLiveData';

// Stable reference: returning a fresh [] from the selector would re-render on
// every store update.
const NO_PARKING_DATA = [];

const ParkingDashboard = () => {
  const [selectedTab, setSelectedTab] = useState(`Tiger's Den`);
  const authState = useAuthState();
  const userId = authState.UserId;

  // Same live feed the home slider uses: the WebSocket pushes changes, and a
  // timed poll covers the case where the socket is unavailable.
  const {retry} = useLiveData();
  const parkingSpaceInfos = useSelector(
    state => state.securityParkingAccess?.parkingData ?? NO_PARKING_DATA,
  );
  const isLoading = useSelector(
    state => !!state.securityParkingAccess?.isLoading,
  );

  // Only block on the very first load. Showing the overlay on every background
  // refresh would flash a spinner over the page every poll interval.
  const showLoader = isLoading && parkingSpaceInfos.length === 0;

  const handleTabPress = tabName => {
    setSelectedTab(tabName);
  };

  const handleReload = () => {
    retry();
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[
            styles.tab,
            selectedTab === `Tiger's Den` && styles.selectedTab,
          ]}
          onPress={() => handleTabPress(`Tiger's Den`)}>
          <Text style={styles.tabText}>Tiger's Den</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.tab,
            selectedTab === 'Police Plaza' && styles.selectedTab,
          ]}
          onPress={() => handleTabPress('Police Plaza')}>
          <Text style={styles.tabText}>Police Plaza</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleReload}>
          <Icon
            style={styles.reloadIcon}
            name="refresh"
            size={24}
            color="#000"
          />
        </TouchableOpacity>
      </View>
      <View style={styles.chartContainer}>
        {parkingSpaceInfos.map(parking => {
          if (parking.ParkingLocation === selectedTab) {
            return (
              <View
                key={parking.ParkingLocation}
                style={styles.parkingLocation}>
                {parking.ParkingSpaceInfoLists.map((info, index) => (
                  <View key={index} style={styles.barContainer}>
                    <Text style={styles.label}>{info.VehicleType}</Text>
                    <View style={styles.bar}>
                      <View
                        style={[
                          styles.barSegment,
                          {
                            width: `${
                              (info.OcupiedParkingSpace /
                                (info.OcupiedParkingSpace +
                                  info.FreeParkingSpace)) *
                              100
                            }%`,
                          },
                          {backgroundColor: 'red'},
                        ]}>
                        <Text style={styles.barText}>
                          {info.OcupiedParkingSpace}
                        </Text>
                      </View>
                      <View
                        style={[
                          styles.barSegment,
                          {
                            width: `${
                              (info.FreeParkingSpace /
                                (info.OcupiedParkingSpace +
                                  info.FreeParkingSpace)) *
                              100
                            }%`,
                          },
                          {backgroundColor: 'green'},
                        ]}>
                        <Text style={styles.barText}>
                          {info.FreeParkingSpace}
                        </Text>
                      </View>
                    </View>
                  </View>
                ))}
              </View>
            );
          }
          return null;
        })}
      </View>

      <View>
        <ParkingAccess userId={userId} />
      </View>
      <View style={styles.spaceContainer}>
        <ParkingSpaceInfo parkingSpaceInfos={parkingSpaceInfos} />
      </View>
      {showLoader && <Loader loading={showLoader} />}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f0f0f0',
    marginTop: 20,
  },
  tabContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    marginBottom: 20,
  },
  tab: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#ccc',
    marginRight: 10,
    borderRadius: 10,
  },
  selectedTab: {
    backgroundColor: 'orange',
  },
  tabText: {
    color: '#000',
    fontWeight: 'bold',
  },
  chartContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  chartWrapper: {
    flex: 1,
    flexDirection: 'row-reverse',
  },
  chartItem: {
    width: 100,
    margin: 5,
    backgroundColor: 'yellow',
    height: 200,
  },
  parkingLocation: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 10,
  },
  barContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  label: {
    width: 120,
    marginRight: 10,
  },
  bar: {
    flexDirection: 'row',
    height: 25,
    width: 220, // Set the width of the chart
  },
  barSegment: {
    height: '100%',
    justifyContent: 'center',
    borderRadius: 10,
  },
  barText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 12,
  },
  spaceContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  reloadIcon: {
    paddingLeft: 10,
    backgroundColor: '#f0f0f0',
  },
});

export default ParkingDashboard;
