import React from 'react';
import { Modal, ActivityIndicator,Text, StyleSheet, View, ScrollView, TouchableOpacity } from 'react-native';

const CustomPickerItem = ({ key, value, label, onPress, onPressOut }) => (

    <TouchableOpacity 
      key={key}
      style={styles.btn}
      onPress={() => onPress(value)}
      onPressOut={onPressOut}
    >
      <Text style={styles.label} >{label}</Text>
    </TouchableOpacity>
);

const styles = StyleSheet.create({
  
  modalBackground:{
    flex:1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },


  innerSection:{
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 2,
    maxHeight:'70%',
    width:'80%'
  },

  btn:{
    height:40,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  label:{
    fontSize: 16,
    color: '#000',
  }

});

export default CustomPickerItem;
