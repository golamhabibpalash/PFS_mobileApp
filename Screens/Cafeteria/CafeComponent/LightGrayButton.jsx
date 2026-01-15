import React, {useState} from 'react';
import {Text, TouchableOpacity, StyleSheet} from 'react-native';

export default function LightGrayButton({onPress, text}) {
  const [isPressed, setIsPressed] = useState(false);
  const handleButtonPressed = () => {
    setIsPressed(!isPressed);
    console.log('button pressed');
  };
  return (
    <TouchableOpacity
      onPress={() => handleButtonPressed}
      style={[styles.button, isPressed && styles.buttonPressed]}>
      <Text style={styles.buttonText}>{text}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#ddd',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
    width: '30%',
    margin: 5,
    alignItems: 'center',
    minHeight: 50,
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 15,
    color: '#333',
  },
  buttonPressed: {
    backgroundColor: '#FFA500',
    color: '#fff',
  },
});
