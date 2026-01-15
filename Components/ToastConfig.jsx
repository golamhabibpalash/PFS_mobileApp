// ToastConfig.js
import React from 'react';
// import {pow} from 'react-native-reanimated';
import Toast, {
  BaseToast,
  ErrorToast,
  InfoToast,
} from 'react-native-toast-message';
import {View, Text, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const CustomToast = ({text1, props}) => (
  <View style={{height: 60, width: '100%', backgroundColor: 'tomato'}}>
    <Text>{text1}</Text>
    <Text>{props.uuid}</Text>
  </View>
);

const getIconType = type => {
  switch (type) {
    case 'info':
      return 'info-circle';
    case 'success':
      return 'check-circle';
    case 'error':
      return 'exclamation-circle';
    case 'warning':
      return 'exclamation-triangle';
    default:
      return 'info-circle';
  }
};

const ToastConfig = {
  success: props => (
    <View style={styles.success_container}>
      <View style={styles.success_iconSection}>
        <Icon name="check-circle" size={30} color="white" />
      </View>
      <View style={styles.success_textSection}>
        <Text style={styles.success_headingText}>{props.text1}</Text>
        <Text style={styles.success_text}>{props.text2}</Text>
      </View>
    </View>
  ),
  error: props => (
    <View style={styles.error_container}>
      <View style={styles.error_iconSection}>
        <Icon name="exclamation-circle" size={30} color="white" />
      </View>
      <View style={styles.error_textSection}>
        <Text style={styles.error_headingText}>{props.text1}</Text>
        <Text style={styles.errorText}>{props.text2}</Text>
      </View>
    </View>
  ),

  info: props => (
    <View style={styles.info_container}>
      <View style={styles.info_iconSection}>
        <Icon name="info-circle" size={30} color="white" />
      </View>
      <View style={styles.info_textSection}>
        <Text style={styles.info_headingText}>{props.text1}</Text>
        <Text style={styles.info_text}>{props.text2}</Text>
      </View>
    </View>
  ),

  warning: props => (
    <View style={styles.warning_container}>
      <View style={styles.warning_iconSection}>
        <Icon name="exclamation-triangle" size={30} color="white" />
      </View>
      <View style={styles.warning_textSection}>
        <Text style={styles.warning_headingText}>{props.text1}</Text>
        <Text>{props.text2}</Text>
      </View>
    </View>
  ),

  tomatoToast: CustomToast,
};

const styles = StyleSheet.create({
  info_container: {
    width: '85%',
    borderWidth: 0.5,
    borderColor: '#f8f8ff',
    borderRadius: 10,
    flexDirection: 'row',
    overflow: 'hidden',
  },
  info_iconSection: {
    width: '15%',
    backgroundColor: '#505E69',
    alignItems: 'center',
    justifyContent: 'center',
  },
  info_textSection: {
    width: '85%',
    backgroundColor: '#48545E',
    padding: 10,
    color: '#fff',
  },
  info_headingText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#fff',
  },
  info_text: {
    color: '#fff',
  },

  error_container: {
    width: '85%',
    borderWidth: 1,
    borderColor: '#f8f8ff',
    borderRadius: 10,
    flexDirection: 'row',
    overflow: 'hidden',
  },
  error_iconSection: {
    width: '15%',
    backgroundColor: '#BB0613',
    alignItems: 'center',
    justifyContent: 'center',
  },
  error_textSection: {
    width: '85%',
    backgroundColor: '#9D0510',
    padding: 10,
  },
  error_headingText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#fff',
  },
  errorText: {
    color: '#fff',
  },

  success_container: {
    width: '85%',
    borderWidth: 1,
    borderColor: '#f8f8ff',
    borderRadius: 10,
    flexDirection: 'row',
    overflow: 'hidden',
  },
  success_iconSection: {
    width: '15%',
    backgroundColor: '#39B189',
    alignItems: 'center',
    justifyContent: 'center',
  },
  success_textSection: {
    width: '85%',
    backgroundColor: '#309674',
    padding: 10,
  },
  success_headingText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#fff',
  },
  success_text: {
    color: '#fff',
  },
  warning_container: {
    width: '85%',
    borderWidth: 1,
    borderColor: '#f8f8ff',
    borderRadius: 10,
    flexDirection: 'row',
    overflow: 'hidden',
  },
  warning_iconSection: {
    width: '15%',
    backgroundColor: '#FFB500',
    alignItems: 'center',
    justifyContent: 'center',
  },
  warning_textSection: {
    width: '85%',
    backgroundColor: '#E5A300',
    padding: 10,
    color: '#000000',
  },
  warning_headingText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
});

export default ToastConfig;
