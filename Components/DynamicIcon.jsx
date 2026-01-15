import React from 'react';
import {StyleSheet, View} from 'react-native';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import FontAwesome6Icon from 'react-native-vector-icons/FontAwesome6';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';

const DynamicIcon = ({iconName, iconColor, iconType, iconSize, iconStyles}) => {
  const renderIcon = () => {
    switch (iconType) {
      case 'FontAwesome5':
        return (
          <FontAwesome5Icon
            style={iconStyles}
            name={iconName}
            color={iconColor}
            size={iconSize}
          />
        );
      case 'FontAwesome6':
        return (
          <FontAwesome6Icon
            style={iconStyles}
            name={iconName}
            color={iconColor}
            size={iconSize}
          />
        );
      case 'MaterialIcons':
        return (
          <MaterialIcon
            style={iconStyles}
            name={iconName}
            color={iconColor}
            size={iconSize}
          />
        );
      case 'AntDesign':
        return (
          <AntDesign
            style={iconStyles}
            name={iconName}
            color={iconColor}
            size={iconSize}
          />
        );
      case 'MaterialCommunityIcons':
        return (
          <MaterialCommunityIcon
            style={iconStyles}
            name={iconName}
            color={iconColor}
            size={iconSize}
          />
        );
      case 'Entypo':
        return (
          <Entypo
            style={iconStyles}
            name={iconName}
            color={iconColor}
            size={iconSize}
          />
        );
      case 'EvilIcons':
        return (
          <EvilIcons
            style={iconStyles}
            name={iconName}
            color={iconColor}
            size={iconSize}
          />
        );
      case 'Ionicons':
        return (
          <Ionicons
            style={iconStyles}
            name={iconName}
            color={iconColor}
            size={iconSize}
          />
        );
      default:
        return (
          <FontAwesomeIcon
            style={iconStyles}
            name={iconName}
            color={iconColor}
            size={iconSize}
          />
        );
    }
  };

  return <View style={styles.content}>{renderIcon()}</View>;
};

const styles = StyleSheet.create({
  content: {},
});

export default DynamicIcon;
