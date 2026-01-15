import React, {useState} from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';
import AntDesign from 'react-native-vector-icons/AntDesign';

const CollapsibleCard = ({title, children, iconName, width}) => {
  const [collapsed, setCollapsed] = useState(true);

  const handleTouchOutside = () => {
    setCollapsed(true);
  };
  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  return (
    <View style={[styles.card, {width: width}]}>
      <TouchableOpacity onPress={toggleCollapsed} style={[styles.header]}>
        <View style={styles.headerContent}>
          <Entypo
            style={{paddingRight: 5}}
            name={iconName}
            size={20}
            color={'#000'}
          />
          <Text style={styles.title}>{title}</Text>
        </View>
        <AntDesign name={collapsed ? 'down' : 'up'} size={20} color="black" />
      </TouchableOpacity>
      {!collapsed && <View style={styles.content}>{children}</View>}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    elevation: 3,
    marginBottom: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#666',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 10,
    color: '#000',
  },
  headerContent: {
    flexDirection: 'row',
    color: '#fff',
  },
  content: {
    padding: 10,
  },
});

export default CollapsibleCard;
