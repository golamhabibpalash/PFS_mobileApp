import {Text, View} from 'react-native';
import React, {PureComponent} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import CafeteriaHome from './CafeteriaHome';

const CafeteriaScreen = () => {
  const Stack = createNativeStackNavigator();
  return (
    <Stack.Navigator>
      <Stack.Screen name="Registration" component={CafeHome}></Stack.Screen>
    </Stack.Navigator>
  );
};

const CafeHome = () => (
  <View>
    <CafeteriaHome></CafeteriaHome>
  </View>
);

export default CafeteriaScreen;
