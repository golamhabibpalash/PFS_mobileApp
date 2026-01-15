import {StyleSheet, SafeAreaView} from 'react-native';
import React from 'react';
import Home from '../Home/HomeComponent/Home';

const ParkingHome = () => {
  return (
    <SafeAreaView style={styles.container}>
      <Home homeTitle="Parking Management" />
    </SafeAreaView>
  );
};

export default ParkingHome;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
