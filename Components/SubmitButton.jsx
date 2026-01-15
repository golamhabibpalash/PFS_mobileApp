import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {blBgColors} from '../App/Accessibilities';
import LinearGradient from 'react-native-linear-gradient';

const SubmitButton = ({
  onPress,
  title = 'Submit',
  disabled = true,
  width = 100,
  textColor = '#fff',
}) => {
  return (
    <LinearGradient
      style={styles.submitButtonWrapper}
      colors={[blBgColors.primaryGradient, blBgColors.secondaryGradient]}
      start={{x: 0, y: 1}}
      end={{x: 1, y: 0}}>
      <TouchableOpacity
        style={[styles.SubmitButton]}
        onPress={onPress}
        accessibilityLabel="Submit Button">
        <Text style={[styles.buttonText, {color: textColor}]}>{title}</Text>
      </TouchableOpacity>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: blBgColors.banglalink,
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  disabledButton: {
    backgroundColor: '#F2641C',
    opacity: 0.5,
  },
  SubmitButton: {
    padding: 10,
    alignItems: 'center',
  },
  submitButtonWrapper: {
    borderRadius: 5,
  },
});

export default SubmitButton;
