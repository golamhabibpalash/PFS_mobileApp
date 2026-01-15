// CustomHeader.jsx
import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {blBgColors} from '../App/Accessibilities';
import DynamicIcon from './DynamicIcon';
import {useNavigation} from '@react-navigation/native';

const CustomStackHeaderComponent = ({title}) => {
  const navigation = useNavigation();
  return (
    <LinearGradient
      colors={[blBgColors.primaryGradient, blBgColors.secondaryGradient]}
      start={{x: 0, y: 1}}
      end={{x: 1, y: 0}}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}>
          <DynamicIcon
            iconName="arrow-back"
            iconSize={30}
            iconColor="#fff"
            iconType="Ionicons"
          />
        </TouchableOpacity>
        <Text style={styles.headerText}>{title}</Text>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  header: {
    padding: 10,
    marginLeft: 10,
    justifyContent: 'flex-start',
    alignItems: 'center',
    // height: 100,
    marginTop: 40,
    flexDirection: 'row',
  },
  backButton: {
    padding: 10,
  },
  headerText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    padding: 10,
  },
});

export default CustomStackHeaderComponent;
