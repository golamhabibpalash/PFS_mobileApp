import {
  StyleSheet,
  Text,
  TextInput,
  View,
  Image,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import React from 'react';
import ImageComponent from './ImageComponent';
import DynamicIcon from './DynamicIcon';
import {blBgColors, blFontSize} from '../App/Accessibilities';
import LinearGradient from 'react-native-linear-gradient';
import {useNavigation} from '@react-navigation/native';

const CustomHeaderComponent = props => {
  const navigation = useNavigation();
  return (
    <SafeAreaView>
      <StatusBar translucent backgroundColor="transparent" />
      <LinearGradient
        colors={[blBgColors.primaryGradient, blBgColors.secondaryGradient]}
        start={{x: 0, y: 1}}
        end={{x: 1, y: 0}}>
        <View style={styles.container}>
          <View style={styles.welcomeWraper}>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('UserProfile', {title: 'Profile'})
              }
              style={{flexDirection: 'row', alignItems: 'center'}}>
              <View style={styles.imageWrapper}>
                {props?.byteArray && (
                  <ImageComponent byteArray={props?.byteArray} />
                )}
                {!props?.byteArray && (
                  <Image
                    style={styles.profileImage}
                    source={require('../Asset/imageNotFound.png')}
                  />
                )}
              </View>
              <View style={styles.welcomeTextWrapper}>
                <Text style={styles.welcomeText}>Welcome</Text>
                <Text style={styles.userNameText}>{props.employeeName}</Text>
              </View>
            </TouchableOpacity>
            <View style={styles.notifyStyle}>
              <DynamicIcon
                iconName={'notifications-active'}
                iconType={'MaterialIcons'}
                iconSize={24}
                iconColor={'#fff'}
              />
            </View>
          </View>
          <View style={styles.searchPortion}>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('Seacrh', {title: 'PFS Search'})
              }>
              <View
                style={[
                  styles.searchBox,
                  {
                    width: '100%',
                    height: 40,
                    justifyContent: 'center',
                  },
                ]}>
                <Text style={{padding: 5}}> Search </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
};

export default CustomHeaderComponent;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    marginTop: StatusBar.currentHeight,
  },
  welcomeWraper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  imageWrapper: {
    width: 50,
    height: 50,
    borderRadius: 25,
    overflow: 'hidden',
    alignItems: 'center',
    borderColor: '#fff',
    borderWidth: 0.5,
  },
  profileImage: {
    flex: 1,
    resizeMode: 'cover',
  },
  welcomeTextWrapper: {
    paddingLeft: 10,
  },
  welcomeText: {
    fontWeight: 'bold',
    fontSize: blFontSize.bodyLarge,
    color: '#fff',
  },
  userNameText: {
    color: '#fff',
  },
  notifyStyle: {
    flex: 1,
    alignItems: 'flex-end',
    paddingRight: 10,
  },
  searchPortion: {
    margin: 10,
    marginTop: 15,
    marginLeft: 0,
  },
  searchBox: {
    backgroundColor: '#fff',
    borderRadius: 8,
    fontSize: blFontSize.bodyLarge,
    color: '#000',
    elevation: 5,
  },
});
