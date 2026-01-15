import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  Image,
  TouchableOpacity,
} from 'react-native';

const { width, height } = Dimensions.get('window');

const OnboardingScreen = ({ navigation }) => {
  const [currentPage, setCurrentPage] = useState(0);

  const scrollViewRef = useRef(null); // Ref for the ScrollView


  const pages = [
    {
      title: 'Welcome to BL PFS',
      description: 'Manage Parking, Cafeteria, and Dispatch with ease.',
      image: require('./../../Asset/PFS_LOGO.png'),
    },
    {
      title: 'Streamlined Operations',
      description: 'Simplify your tasks and enhance productivity.',
      image: require('./../../Asset/PFS_LOGO.png'),
    },
    {
      title: 'Real-Time Updates',
      description: 'Stay informed with live data and notifications.',
      image: require('./../../Asset/PFS_LOGO.png'),
    },
  ];

  const handleScroll = (event) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const currentPageIndex = Math.round(scrollPosition / width);
    setCurrentPage(currentPageIndex);
  };

  const handleNextPress = () => {
    if (currentPage < pages.length - 1) {
      const nextPage = currentPage + 1;
      scrollViewRef.current.scrollTo({ x: nextPage * width, animated: true });
      setCurrentPage(nextPage);
    } else {
      navigation.navigate('WelcomeScreen'); // Navigate to the Login Screen
    }
  };

  const handleSkipPress = () => {
    navigation.navigate('Login'); // Directly navigate to the Login Screen
  };

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        pagingEnabled        
        ref={scrollViewRef}
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}>
        {pages.map((page, index) => (
          <View style={styles.page} key={index}>
            <Image source={page.image} style={styles.image} />
            <Text style={styles.title}>{page.title}</Text>
            <Text style={styles.description}>{page.description}</Text>
          </View>
        ))}
      </ScrollView>

      {/* Pagination Dots */}
      <View style={styles.pagination}>
        {pages.map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              currentPage === index ? styles.activeDot : styles.inactiveDot,
            ]}
          />
        ))}
      </View>

      <TouchableOpacity style={styles.skipButton} onPress={handleSkipPress}>
        <Text style={styles.skipButtonText}>Skip to Login</Text>
      </TouchableOpacity>

      {/* Next or Get Started Button */}
      <TouchableOpacity
        style={styles.button}
        onPress={handleNextPress}
        // onPress={() =>
        //   currentPage === pages.length - 1
        //     ? navigation.navigate('WelcomeScreen') // Navigate to the Login Screen
        //     : setCurrentPage(currentPage + 1)
        // }
    >
        <Text style={styles.buttonText}>
          {currentPage === pages.length - 1 ? 'Get Started' : 'Next'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  page: {
    width: width,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  image: {
    width: 250,
    height: 250,
    resizeMode: 'contain',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  activeDot: {
    backgroundColor: '#222',
  },
  inactiveDot: {
    backgroundColor: '#ccc',
  },
  button: {
    backgroundColor: '#222',
    padding: 15,
    borderRadius: 10,
    marginBottom: 30,
    marginHorizontal: 50,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  skipButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    padding: 10,
    zIndex: 1,
    backgroundColor:'#f5f5f5',
    borderRadius: 5,
    paddingHorizontal: 15,
    paddingVertical: 5,
  },
  skipButtonText: {
    color: '#222',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default OnboardingScreen;
