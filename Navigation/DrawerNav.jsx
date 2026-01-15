// DrawerNav.jsx
import React from 'react';
// import {createDrawerNavigator} from '@react-navigation/drawer';
import StackNav from './StackNav';

// const Drawer = createDrawerNavigator();

const DrawerNav = () => {

  return <StackNav />

  // return (
  //   <Drawer.Navigator
  //     drawerContent={props => <DrawerContent {...props} />}
  //     screenOptions={{
  //       headerShown: false,
  //     }}>
  //     <Drawer.Screen name="StackNav" component={StackNav} />
  //   </Drawer.Navigator>
  // );
};

export default DrawerNav;
