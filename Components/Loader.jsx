import React from 'react';
import { Modal, ActivityIndicator, StyleSheet, View } from 'react-native';

const Loader = ({ loading }) => (
  <Modal transparent animationType="none" visible={loading}>
    <View style={styles.modalBackground}>
      <View style={styles.activityIndicatorWrapper}>
        <ActivityIndicator animating={loading} />
      </View>
    </View>
  </Modal>
);

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'space-around',
    backgroundColor: '#00000040', // Background color with some opacity
  },
  activityIndicatorWrapper: {
    backgroundColor: '#FFFFFF', // Background color of the modal
    height: 100,
    width: 100,
    borderRadius: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
});

export default Loader;
