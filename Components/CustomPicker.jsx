import React, { useState } from 'react';
import { Modal, ActivityIndicator,Text, StyleSheet, View, ScrollView, TouchableOpacity, Pressable } from 'react-native';
import DynamicIcon from './DynamicIcon';

const CustomPicker = ({style, enabled, children, selectedValue }) => {

  const [open, Setopen] = useState(false)

  return(
    <View>
      <TouchableOpacity
        style={[{
          flexDirection:'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingHorizontal:10,
          height:50
        }, style]}
        disabled={enabled === false}
        onPress={() => Setopen(true)}
      >
        <Text style={{color:'#000', fontSize:16}} >{selectedValue || "- Select -"}</Text>
        <DynamicIcon 
          iconType="fontAwesome5"
          iconName="caret-down"
          iconSize={18}
        />
      </TouchableOpacity>
      <Modal 
        animationType="fade"
        onRequestClose={() => Setopen(false)}
        transparent
        visible={open}
      >

        
        <View style={styles.modalBackground}>
        <Pressable
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            bottom: 0,
            right: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
          }}
          onPress={() => Setopen(false)}
        >

        </Pressable>

          <Pressable 
            style={styles.innerSection}
          >

            {React.Children.map(children, (child) =>
              React.cloneElement(child, { onPressOut: () =>  Setopen(false) })
            )}
              
          </Pressable>

        </View>
      </Modal>
    </View>
  )
};

const styles = StyleSheet.create({
  
  modalBackground:{
    flex:1,
    alignItems: 'center',
    justifyContent: 'center',
    // backgroundColor: 'rgba(0,0,0,0.5)',
  },


  innerSection:{
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 5,
    maxHeight:'70%',
    width:'80%'
  },

  btn:{
    height:40,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  }

});

export default CustomPicker;
