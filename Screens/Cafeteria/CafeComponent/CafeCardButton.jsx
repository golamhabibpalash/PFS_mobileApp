import {Text, View, StyleSheet, TouchableOpacity} from 'react-native';
import React, {Component} from 'react';
// import {TouchableOpacity} from 'react-native-gesture-handler';

export default function CafeCardButton({title}) {
  return (
    <TouchableOpacity style={styles.container}>
      <View style={styles.button}>
        <Text style={styles.text}>{title}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    margin: 5,
    borderWidth: 0.5,
    borderRadius: 10,
    padding: 10,
    backgroundColor: '#ddd',
    elevation: 5,
    minWidth: 100,
    alignItems: 'center',
  },
  button: {
    padding: 10,
  },
  text: {
    color: '#000',
  },
});
