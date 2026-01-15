import {StyleSheet, SafeAreaView} from 'react-native';
import React, {useEffect} from 'react';
import Home from '../Home/HomeComponent/Home';

const CafeteriaHome = () => {
  return (
    <SafeAreaView style={styles.container}>
      <Home homeTitle="Tiger's Cafeteria" />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default CafeteriaHome;
