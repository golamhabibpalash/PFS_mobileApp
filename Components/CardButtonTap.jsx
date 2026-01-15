import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Entypo from 'react-native-vector-icons/Entypo';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

const CardButtonTap = ({buttons, onPress}) => {
  const Stack = createNativeStackNavigator();
  return (
    <></>
    // <Stack.Navigator>
    //   <Stack.Screen
    //     name="Home"
    //     component={CafeteriaRegistrationIndex}
    //     options={{
    //       title: '',
    //       headerStyle: {
    //         backgroundColor: 'orange',
    //       },
    //       headerLeft: () => (
    //         <>
    //           <Entypo name="menu" size={30} />
    //         </>
    //       ),
    //       headerRight: () => (
    //         <FontAwesome name="sign-out" size={30} style={{color: 'black'}} />
    //       ),
    //     }}
    //   />
    // </Stack.Navigator>

    // <View style={styles.buttonRow}>
    //   {buttons.map((button, index) => (
    //     <TouchableOpacity
    //       key={index}
    //       style={[
    //         styles.button,
    //         {
    //           backgroundColor: button.color,
    //           padding: button.padding,
    //           margin: button.margin,
    //         },
    //       ]}
    //       onPress={() => onPress(index)}>
    //       {button.icon && <Icon name={button.icon} size={24} />}
    //       <Text style={styles.buttonText}>{button.title}</Text>
    //     </TouchableOpacity>

    //   ))}
    // </View>
  );
};

const styles = StyleSheet.create({
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    flexWrap: 'wrap',
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    borderRadius: 5,
    width: '24%',
  },
  buttonText: {
    fontSize: 16,
  },
});

export default CardButtonTap;
