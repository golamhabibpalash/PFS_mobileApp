import {Text, TextInput, View, StyleSheet} from 'react-native';
import React, {Component} from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';
const inputContainer = ({placeholder}) => {
  return (
    <View style={styles.inputContainer}>
      <Icon name="user" size={24} color="#000" />
      <TextInput
        placeholder={placeholder}
        placeholderTextColor={'#000'}
        style={styles.input}
      />
    </View>
  );
};

// const LoginComp = () => {
//   return <View>{inputContainer((placeholder = 'Username'))}</View>;
// };

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 0.5,
    borderColor: '#ccc',
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 10,
  },
  input: {
    paddingLeft: 10,
    backgroundColor: '#fff',
    width: 200,
  },
});

export default inputContainer;
