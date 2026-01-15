import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import DynamicIcon from '../../Components/DynamicIcon';
import {blBgColors} from '../../App/Accessibilities';
import {useSelector, useDispatch} from 'react-redux';
import {useAuthState} from '../../Navigation/AuthContext';
import {loadSubMenus} from '../../Services/CommonServices/ModuleHomeMenuProcessSlice';
import {useNavigation} from '@react-navigation/native';

const ModuleDashboard = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const {menus, pfs} = useSelector(state => state.menuLoad);
  const authState = useAuthState();
  const RenderModuleGroup = () => {
    return (
      <>
        {authState.DynamicMenu.map((rootNode, index) =>
          rootNode.RootUrl && rootNode.RootPFS === pfs ? (
            <TouchableOpacity
              style={styles.moduleBlock}
              key={index}
              onPress={() => {
                dispatch(
                  loadSubMenus({
                    dynamicMenu: authState.DynamicMenu,
                    url: rootNode.RootUrl,
                  }),
                ),
                  navigation.navigate(rootNode.RootUrl, {
                    title: rootNode.RootTitle,
                  });
              }}>
              <View style={styles.moduleIconWrapper}>
                <DynamicIcon
                  iconName={rootNode.RootIcon}
                  iconType={rootNode.RootIconType}
                  iconSize={35}
                  iconColor={'#000'}
                />
              </View>
              <View style={styles.moduleTitleTextArea}>
                <Text style={styles.menuItemText}>{rootNode.RootTitle}</Text>
              </View>
            </TouchableOpacity>
          ) : (
            <View key={index}></View>
          ),
        )}
      </>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <RenderModuleGroup />
    </SafeAreaView>
  );
};

export default ModuleDashboard;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: blBgColors.defaultBackground,
    flex: 1,
    justifyContent: 'space-evenly',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  moduleBlock: {
    width: '30%',
    padding: 10,
    alignItems: 'center',
    overflow: 'hidden',
    marginBottom: 10,
  },
  moduleIconWrapper: {
    padding: 10,
    backgroundColor: '#fff',
    alignItems: 'center',
    borderRadius: 8,
    elevation: 5,
    minWidth: 80,
  },
  moduleTitleTextArea: {
    padding: 5,
  },
  menuItemText: {
    color: '#000',
    textAlign: 'center',
    fontSize: 12,
  },
});
