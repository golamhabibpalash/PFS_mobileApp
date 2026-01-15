import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import React, {useState, useEffect} from 'react';
import {useNavigation} from '@react-navigation/core';
import {useSelector, useDispatch} from 'react-redux';
import DynamicIcon from '../../../Components/DynamicIcon';
import {
  blBgColors,
  blFontColor,
  blFontSize,
} from '../../../App/Accessibilities';
import LinearGradient from 'react-native-linear-gradient';

const Home = ({homeTitle}) => {
  const {subMenus} = useSelector(state => state.subMenuLoad);

  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [NavButtons, setNavButtons] = useState([]);

  const navigationButton = (navigateName, iconName, title, iconType) => {
    return (
      <TouchableOpacity
        style={styles.optionWrapper}
        onPress={() => navigation.navigate(navigateName, {title: title})}>
        <View style={styles.option}>
          <DynamicIcon
            iconName={iconName}
            iconColor={blFontColor.BLDarkGray}
            iconType={iconType}
            iconSize={50}
          />
        </View>
        <Text style={styles.optionText}>{title}</Text>
      </TouchableOpacity>
    );
  };

  useEffect(() => {
    if (subMenus) {
      const subNav = [];
      subMenus.map(item => {
        item.ChildUrl &&
          subNav.push({
            navigationName: item.ChildUrl,
            iconName: item.ChildTitle == 'Registration' && Platform.OS == "ios" ? "edit" : item.ChildIcon,
            title: item.ChildTitle,
            iconType: item.ChildTitle == 'Registration' && Platform.OS == "ios" ? "FontAwesome5" : item.ChildIconType,
          });
      });
      setNavButtons(subNav);
    }
  }, [subMenus]);

  return (
    <LinearGradient
      style={styles.buttonContainer}
      colors={[blBgColors.toffeeLight, blBgColors.banglalink50]}
      start={{x: 0, y: 0}}
      end={{x: 0, y: 1}}>
      <View style={styles.buttonWrapper}>
        {NavButtons.map((item, index) => (
          <View key={item.title + index}>
            {navigationButton(
              item.navigationName,
              item.iconName,
              item.title,
              item.iconType,
            )}
          </View>
        ))}
      </View>
    </LinearGradient>
  );
};

export default Home;

const styles = StyleSheet.create({
  buttonContainer: {
    borderBottomLeftRadius: 100,
  },
  buttonWrapper: {
    // backgroundColor: blBgColors.banglalink50,
    height: '65%',
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    borderBottomLeftRadius: 100,
  },
  optionWrapper: {
    alignItems: 'center',
  },
  option: {
    height: 80,
    width: 80,
    backgroundColor: '#fff',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 10,
    shadowOffset: {
      width: 3,
      height: 3,
    },
    elevation: 5,
  },
  optionText: {
    fontSize: blFontSize.bodyRegular,
    color: '#fff',
    textAlign: 'center',
    flexWrap: 'wrap',
    width: 100,
  },
});
