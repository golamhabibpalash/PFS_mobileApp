import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Image,
} from 'react-native';
import React from 'react';
import {useAuthState} from '../../Navigation/AuthContext';
import DynamicIcon from '../../Components/DynamicIcon';
import {blBgColors, blFontColor, blFontSize} from '../../App/Accessibilities';
import {useNavigation} from '@react-navigation/native';
import {useDispatch} from 'react-redux';
import {
  loadModuleMenu,
  loadSubMenus,
} from '../../Services/CommonServices/ModuleHomeMenuProcessSlice';
import LinearGradient from 'react-native-linear-gradient';
import HomeHeaderView from '../Home/HomeComponent/HomeHeaderView';

const pfsData = [
  {
    id: 'P',
    title: 'Properties & Infrastructure',
    icon: 'home',
    color: '#f00',
    data: {},
  },
  {
    id: 'F',
    title: 'Facilities & Services',
    icon: 'gear',
    color: '#00f',
    data: [],
  },
  {id: 'S', title: 'Security', icon: 'star', color: '#0f0', data: []},
];

const NavigationScreen = () => {
  const navigation = useNavigation();
  const authState = useAuthState();
  const dispatch = useDispatch();

  const renderMenuItems = () => {
    return pfsData.map(pfsItem => (
      <View style={{padding: 5}} key={pfsItem.id}>
        <View style={[styles.moduleGroupItemWrapper]}>
          <View style={[styles.titleContainer]}>
            <TouchableOpacity
              onPress={() => {
                dispatch(
                  loadModuleMenu({
                    pfs: pfsItem.id,
                  }),
                );
                navigation.navigate('ModuleDashboard', {title: pfsItem.title});
              }}
              style={{
                flex: 1,
                flexDirection: 'row',
                justifyContent: 'flex-start',
                alignContent: 'center',
                alignItems: 'center',
              }}>
              <View style={styles.ImageWrapper}>
                {pfsItem.id === 'P' && (
                  <Image
                    style={styles.Image}
                    source={require('../../Asset/p.png')}
                  />
                )}
                {pfsItem.id === 'F' && (
                  <Image
                    style={styles.Image}
                    source={require('../../Asset/f.png')}
                  />
                )}
                {pfsItem.id === 'S' && (
                  <Image
                    style={styles.Image}
                    source={require('../../Asset/s.png')}
                  />
                )}
              </View>
              <View style={styles.titleTextWrapper}>
                <Text style={[styles.titleText]}>{pfsItem.title}</Text>
              </View>
              <View style={styles.rightIconWrapper}>
                <DynamicIcon
                  iconName={'chevron-right'}
                  iconSize={30}
                  iconColor={blFontColor.BLDefaultColour}
                />
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    ));
  };

  return (
    <SafeAreaView style={styles.container}>
      <HomeHeaderView title={'Navigation'} />
      <LinearGradient
        // colors={[blBgColors.primaryGradient, blBgColors.secondaryGradient]}
        colors={['#fff', '#fff']}
        start={{x: 0, y: 1}}
        end={{x: 1, y: 0}}>
        {/* <ScrollView>
          <View style={styles.drawerSection}>{renderMenuItems()}</View>
        </ScrollView> */}
        <View
          style={{
            justifyContent: 'center',
            flexDirection: 'column',
            alignItems: 'center',
            height: '93%',
          }}>
          <View style={{alignItems: 'center'}}>
            <TouchableOpacity
              onPress={() => {
                dispatch(
                  loadModuleMenu({
                    pfs: 'P',
                  }),
                );
                navigation.navigate('ModuleDashboard', {title: 'Properties & Infrastructure'});
              }}>
              <Image
                source={require('../../Asset/p.png')}
                style={[styles.Image]}
              />
            </TouchableOpacity>
          </View>
          <View style={{justifyContent: 'center', flexDirection: 'row'}}>
            <TouchableOpacity
              onPress={() => {
                dispatch(
                  loadModuleMenu({
                    pfs: 'F',
                  }),
                );
                navigation.navigate('ModuleDashboard', {title: 'Facilities & Services'});
              }}>
              <Image
                source={require('../../Asset/f.png')}
                style={[styles.Image]}
              />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                dispatch(
                  loadModuleMenu({
                    pfs: 'S',
                  }),
                );
                navigation.navigate('ModuleDashboard', {title: 'Security'});
              }}>
              <Image
                source={require('../../Asset/s.png')}
                style={[styles.Image]}
              />
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
};
export default NavigationScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: blBgColors.defaultBackground,
  },
  drawerSection: {
    backgroundColor: blBgColors.defaultBackground,
  },
  moduleGroupItemWrapper: {
    backgroundColor: blBgColors.defaultBackground,
  },
  ImageWrapper: {
    width: 80,
    height: 80,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: '#fff',
  },
  Image: {
    width: 170,
    height: 170,
  },
  titleContainer: {
    backgroundColor: blBgColors.bgTitle,
    padding: 10,
    borderRadius: 10,
    width: '98%',
    elevation: 8,
  },
  titleTextWrapper: {
    width: '50%',
    margin: 10,
  },
  titleText: {
    fontSize: blFontSize.subTitle,
    color: '#fff',
    fontWeight: 'bold',
  },
  rightIconWrapper: {
    padding: 5,
    backgroundColor: '#fff',
    width: 60,
    height: 60,
    borderRadius: 30,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    right: -20,
    elevation: 10,
  },
  moduleContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    backgroundColor: blBgColors.defaultBackground,
    padding: 10,
    paddingBottom: 20,
    elevation: 3,
    borderBottomRightRadius: 5,
    borderBottomLeftRadius: 5,
    marginBottom: 10,
  },
  menuItem: {},
  menuItemContent: {
    alignItems: 'center',
    width: 100,
    borderRadius: 8,
    margin: 5,
    height: 80,
  },
  menuItemIconWrapper: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 20,
    elevation: 3,
  },
  menuItemText: {
    fontSize: blFontSize.bodyRegular,
    color: '#000',
    textAlignVertical: 'center',
    textAlign: 'center',
  },
});
