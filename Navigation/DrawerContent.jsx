// DrawerContent.jsx
import React, {useState} from 'react';
import {StyleSheet, View, TouchableOpacity, Text, Image} from 'react-native';
import {DrawerContentScrollView, DrawerItem} from '@react-navigation/drawer';
import Icon from 'react-native-vector-icons/FontAwesome';
import {useNavigation} from '@react-navigation/native';
import {useAuthState} from './AuthContext';
import Toast from 'react-native-toast-message';
import DynamicIcon from '../Components/DynamicIcon';
import packageJson from '../package.json';

const DrawerContent = props => {
  const navigation = useNavigation();
  const authState = useAuthState();
  const [openMenu, setOpenMenu] = useState('');
  const [clickedChild, setClickedChild] = useState('');

  const handleToggleMenu = rootSystemName => {
    setOpenMenu(prevOpenMenu =>
      prevOpenMenu === rootSystemName ? '' : rootSystemName,
    );
  };

  const handleChildItemClick = childTitle => {
    setClickedChild(childTitle);
  };

  const renderMenuItems = () => {
    return authState.DynamicMenu.map((rootNode, index) => (
      <View key={index} style={styles.menuItem}>
        {rootNode.RootUrl && (
          <TouchableOpacity
            onPress={() => {
              handleToggleMenu(rootNode.RootSystemName);
            }}>
            <View style={styles.menuItemContent}>
              <Text
                style={[
                  styles.menuItemText,
                  {
                    fontWeight:
                      openMenu === rootNode.RootSystemName ? 'bold' : 'normal',
                  },
                ]}>
                <DynamicIcon
                  iconName={rootNode.RootIcon}
                  iconType={rootNode.RootIconType}
                  iconSize={14}
                />{' '}
                {/* <Icon name={rootNode.RootIcon} size={15}></Icon>{' '} */}
                {rootNode.RootTitle}
              </Text>
              <Icon
                name={
                  openMenu === rootNode.RootSystemName
                    ? 'chevron-down'
                    : 'chevron-right'
                }
                style={styles.menuItemIcon}
              />
            </View>
          </TouchableOpacity>
        )}
        {openMenu === rootNode.RootSystemName &&
          rootNode.ChildNodes &&
          rootNode.ChildNodes.length > 0 && (
            <View style={styles.childContainer}>
              {rootNode.ChildNodes.map(
                (childNode, childIndex) =>
                  childNode.ChildUrl && (
                    <DrawerItem
                      key={childIndex}
                      label={() => (
                        <View>
                          <Text
                            style={[
                              styles.childItemText,
                              {
                                fontWeight:
                                  clickedChild === childNode.ChildTitle
                                    ? 'bold'
                                    : 'normal',
                              },
                            ]}>
                            <DynamicIcon
                              iconName={childNode.ChildIcon}
                              iconType={childNode.ChildIconType}
                              iconSize={12}
                            />{' '}
                            {childNode.ChildTitle}
                          </Text>
                        </View>
                      )}
                      onPress={() => {
                        handleChildItemClick(childNode.ChildTitle);
                        if (childNode.ChildUrl !== null) {
                          navigation.navigate(childNode.ChildUrl);
                        } else {
                          Toast.show({
                            type: 'warning',
                            text1: 'Warning',
                            text2: 'Link is not available',
                          });
                          navigation.navigate('Home');
                        }
                      }}
                      style={styles.childItem}
                    />
                  ),
              )}
            </View>
          )}
      </View>
    ));
  };

  return (
    <View style={styles.drawerContainer}>
      <DrawerContentScrollView {...props}>
        <View style={styles.drawerContent}>
          <View style={styles.contentHeader}>
            <Image source={require('../Asset/Login.png')} />
          </View>
          <View style={styles.drawerSection}>{renderMenuItems()}</View>
        </View>
      </DrawerContentScrollView>
      <View style={styles.contentFooter}>
        {/* ============ Code will implement as soon as posible ============= */}
        <Text>PFS Version: {packageJson.version}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  drawerContainer: {
    flex: 1,
  },
  contentHeader: {
    height: 150,
    alignItems: 'center',
    verticalAlign: 'middle',
  },
  drawerSection: {
    marginTop: 5,
  },
  menuItem: {
    borderBottomWidth: 3,
    borderBottomColor: '#ddd',
  },
  menuItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  menuItemIcon: {
    fontSize: 20,
    color: '#555',
  },
  menuItemText: {
    fontSize: 15,
    color: '#000',
  },
  childContainer: {
    marginLeft: 15,
  },
  childItem: {
    marginLeft: 15,
  },
  childItemText: {
    fontSize: 15,
    color: '#000',
  },
  signoutButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    padding: 10,
  },
  contentFooter: {
    position: 'absolute',
    bottom: 5,
    alignSelf: 'center',
  },
});

export default DrawerContent;
