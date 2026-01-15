import React, { useState } from 'react';
import { View, TextInput, FlatList, TouchableOpacity, Text, StyleSheet } from 'react-native';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import { useNavigation } from '@react-navigation/native';
import { useAuthState } from '../../../Navigation/AuthContext';
import DynamicIcon from '../../../Components/DynamicIcon';


const IncludedRootModule = ["CafeteriaManagement", "ParkingManagement", "Dispatch"];

const Search = () => {
  const [searchText, setSearchText] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const authState = useAuthState();
  const navigation = useNavigation();

  const staticData = authState.DynamicMenu
  .filter(menu => IncludedRootModule.includes(menu.RootSystemName))
  .flatMap(menu => 
    menu.ChildNodes
      .filter(child => child.ChildUrl && child.ChildTitle)
      .map(child => ({
        appIcon: child.ChildIcon,
        appIconType: child.ChildIconType,
        appTitle: child.ChildTitle,
        parent: menu.RootTitle,
        appUrl: child.ChildUrl
      }))
  );

  const handleSearch = (text) => {
    setSearchText(text);
    if (text.length >= 1) {
      const results = staticData.filter(item =>
        item.appTitle.toLowerCase().includes(text.toLowerCase())||
        item.parent.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredData(results);
    } else {
      setFilteredData([]);
    }
  };

  const handleNavigate = (item) => {
    navigation.navigate(item.appUrl, {title: item.appTitle});
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.card} onPress={() => handleNavigate(item)}>
      <DynamicIcon
                iconStyles={styles.icon}
                iconName={item.appIcon}
                iconSize={30}
                iconType={item.appIconType}
              />
      {/* <FontAwesome5Icon name={item.appIcon} size={24} style={styles.icon} /> */}
      <View style={styles.textContainer}>
        <Text style={styles.title}>{item.appTitle}</Text>
        <Text style={styles.path}>{item.parent} &gt; {item.appTitle}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.textInput}
        placeholder="Input Search here"
        value={searchText}
        onChangeText={handleSearch}
      />
      <FlatList
        data={filteredData}
        renderItem={renderItem}
        keyExtractor={(item) => item.appTitle}
        style={styles.list}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  textInput: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 20,
    backgroundColor: '#fff',
  },
  list: {
    flex: 1,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  icon: {
    marginRight: 10,
    color: '#555',
    padding: 5
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    color: '#333',
  },
  path: {
    fontSize: 12,
    color: '#888',
    marginTop: 4,
  },
});

export default Search;
