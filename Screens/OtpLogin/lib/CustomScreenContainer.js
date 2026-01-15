import React from 'react';
import {StatusBar, SafeAreaView} from 'react-native';

import {GenericStyles} from '../styles/GenericStyles';

const CustomScreenContainer = props => {
  const {children} = props;

  return (
    <>
      <StatusBar
        hidden={false}
        barStyle="light-content"
        backgroundColor={'#000'}
      />
      <SafeAreaView style={GenericStyles.whiteBackgroundContainer}>
        {children}
      </SafeAreaView>
    </>
  );
};

export default CustomScreenContainer;
