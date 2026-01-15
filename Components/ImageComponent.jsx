import React from 'react';
import {Image, StyleSheet} from 'react-native';

const ImageComponent = ({byteArray}) => {
  const base64String = byteArray?.toString('base64');
  const dataUrl = `data:image/jpeg;base64,${base64String}`;
  if (!byteArray || byteArray.length === 0) {
    return (
      <Image
        style={styles.image}
        source={require('../Asset/imageNotFound.png')}
      />
    );
  }

  return <Image style={styles.image} source={{uri: dataUrl}} />;
};
const styles = StyleSheet.create({
  image: {
    flex: 1,
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  placeholderImage: {
    // Add styles for the placeholder image if needed
  },
  loadedImage: {
    // Add styles for the loaded image if needed
  },
});

export default ImageComponent;
