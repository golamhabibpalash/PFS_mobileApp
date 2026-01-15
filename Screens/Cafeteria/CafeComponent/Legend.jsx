import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

// Define event categories and their colors
const eventCategories = [
  {name: 'Holiday', color: 'red'},
  {name: 'Registered', color: '#E6067E'},
  {name: 'Consumed', color: 'green'},
  {name: 'Transferred', color: '#8BC63E'},
  {name: 'Cancel', color: '#808285'},
];

const Legend = () => {
  return (
    <View style={styles.legendContainer}>
      {eventCategories.map(category => (
        <View key={category.name} style={styles.legendItem}>
          <View
            style={[
              styles.legendColorIndicator,
              {backgroundColor: category.color},
            ]}
          />
          <Text style={{color: category.color}}>{category.name}</Text>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  legendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    flexWrap: 'wrap',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
  },
  legendColorIndicator: {
    width: 10,
    height: 10,
    marginRight: 5,
    borderRadius: 5,
  },
});

export default Legend;
