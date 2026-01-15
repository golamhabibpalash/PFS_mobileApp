import { StyleSheet, SafeAreaView } from 'react-native';
import React from 'react';
import Home from '../Home/HomeComponent/Home';

const DispatchHome = () => {
  return (
    <SafeAreaView style={styles.container}>
      <Home homeTitle="Dispatch" />
    </SafeAreaView>
  );
};

export default DispatchHome;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

