import React from 'react';
import {Modal, View, Text, StyleSheet, TouchableOpacity} from 'react-native';

const ExitTokenModal = ({exitTokenData, onClose, onDownload}) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={exitTokenData !== null}
      onRequestClose={onClose}>
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.modalText}>Exit Token</Text>
          <Text>Date: {exitTokenData?.Date}</Text>
          <Text style={styles.modalText}>Token ID: {exitTokenData?.TokenId}</Text>
          <Text style={styles.modalText}>Vehicle Number: {exitTokenData?.VehicleNumber}</Text>
          <Text>Contact Number: {exitTokenData?.ContactNumber}</Text>
          {/* <TouchableOpacity
            style={styles.downloadButton}
            onPress={onDownload}>
            <Text style={styles.buttonText}>Download</Text>
          </TouchableOpacity> */}
          <TouchableOpacity
            style={styles.downloadButton}
            onPress={onClose}>
            <Text style={styles.buttonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 15,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 25,
  },
  downloadButton: {
    backgroundColor: '#2196F3',
    borderRadius: 5,
    padding: 12,
    elevation: 2,
    marginTop: 20,
  },
  closeButton: {
    backgroundColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    elevation: 2,
    marginTop: 15,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default ExitTokenModal;
