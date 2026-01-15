import React from 'react';
import {View, StyleSheet, Text} from 'react-native';
import {blFontSize} from '../../../App/Accessibilities';
import DynamicIcon from '../../../Components/DynamicIcon';

const UserDashboardTile = ({
  bgColor,
  iconName,
  title,
  count,
  textColor,
  iconType,
  iconColor,
}) => {
  return (
    <View style={[styles.tileWrap, {backgroundColor: bgColor}]}>
      <DynamicIcon
        iconName={iconName}
        iconColor={iconColor ? iconColor : '#000'}
        iconType={iconType}
        iconSize={30}
      />
      <View style={styles.tileContainer}>
        <Text style={[styles.tileText, {color: textColor}]}>{title}</Text>
        <Text style={[styles.countText]}>{count}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  tileWrap: {
    padding: 10,
    borderRadius: 8,
    margin: 5,
    width: '45%',
    height: 80,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 0.5,
  },
  tileContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tileIcon: {
    position: 'absolute',
    left: '2%',
    top: '35%',
    opacity: 0.2,
  },
  tileText: {
    fontSize: blFontSize.bodyLarge,
    fontWeight: 'bold',
  },
  countText: {
    fontSize: blFontSize.title,
    alignSelf: 'center',
    fontWeight: 'bold',
    color: '#666',
  },
});

export default UserDashboardTile;
