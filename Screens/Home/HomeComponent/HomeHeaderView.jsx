import {StatusBar, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import LinearGradient from 'react-native-linear-gradient';
import {blBgColors, blFontSize} from '../../../App/Accessibilities';

const HomeHeaderView = ({title}) => {
  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
      <LinearGradient
        colors={[blBgColors.primaryGradient, blBgColors.secondaryGradient]}
        start={{x: 0, y: 1}}
        end={{x: 1, y: 0}}
        style={styles.linearGradient}>
        <View style={styles.titleContainer}>
          <Text style={styles.titleText}>{title}</Text>
        </View>
      </LinearGradient>
    </View>
  );
};

export default HomeHeaderView;

const styles = StyleSheet.create({
  container: {
    // flex: 1,
  },
  linearGradient: {
    // position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: StatusBar.currentHeight * 2,
  },
  titleContainer: {
    position: 'absolute',
    alignSelf: 'center',
    bottom: '10%',
  },
  titleText: {
    color: '#fff',
    fontSize: blFontSize.title,
  },
});
