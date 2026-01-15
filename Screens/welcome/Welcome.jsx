import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { blBgColors } from '../../App/Accessibilities';

const WelcomeScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Image source={require('./../../Asset/PFS_LOGO.png')} style={styles.logo} />
      <Text style={styles.title}>Welcome to BL PFS</Text>
      <Text style={styles.subtitle}>
        Your ultimate solution for Parking, Cafeteria, and Dispatch Management.
      </Text>

    
      <TouchableOpacity style={{width:'80%'}} onPress={() => navigation.navigate('FAQScreen')} >
        <LinearGradient
            style={styles.button}
            colors={[
                blBgColors.primaryGradient,
                blBgColors.secondaryGradient,
            ]}
            start={{x: 0, y: 1}}
            end={{x: 1, y: 0}}>
            <Text style={styles.buttonText}>Learn More</Text>
        </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity style={{width:'80%'}} onPress={() => navigation.navigate('Login')} >
        <LinearGradient
            style={styles.button}
            colors={[
                blBgColors.primaryGradient,
                blBgColors.secondaryGradient,
            ]}
            start={{x: 0, y: 1}}
            end={{x: 1, y: 0}}>
            <Text style={styles.buttonText}>Login</Text>
        </LinearGradient>
        </TouchableOpacity>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  logo: {
    width: 150,
    height: 150,
    resizeMode: 'contain',
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
    marginBottom: 30,
    paddingHorizontal: 20,
  },
  button: {
    backgroundColor: '#222',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  secondaryButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#222',
  },
  secondaryButtonText: {
    color: '#222',
  },
});

export default WelcomeScreen;
