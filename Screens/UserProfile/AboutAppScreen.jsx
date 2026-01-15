// AboutAppScreen.jsx
import React from 'react';
import {View, Text, ScrollView, StyleSheet} from 'react-native';
import {blBgColors} from '../../App/Accessibilities';

const AboutAppScreen = () => {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.header}>About Our App</Text>
        <Text style={styles.content}>
          Welcome to [App Name], your ultimate solution for [primary function or
          purpose of the app]. Our app is designed to help you [main benefits of
          the app], ensuring that you have the best experience possible.
        </Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.header}>Our Mission</Text>
        <Text style={styles.content}>
          At [App Name], our mission is to provide users with a seamless and
          intuitive platform for [describe the main purpose or function]. We
          strive to deliver high-quality service, ensuring that all your needs
          are met with efficiency and reliability.
        </Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.header}>Key Features</Text>
        <Text style={styles.content}>
          - **User-Friendly Interface**: Navigate through the app with ease and
          find what you need quickly.
          {'\n'}- **Secure and Reliable**: Your data is safe with us. We
          prioritize your privacy and security.
          {'\n'}- **24/7 Support**: Our support team is available around the
          clock to assist you with any issues or questions.
          {'\n'}- **Regular Updates**: We continuously improve our app with new
          features and bug fixes.
        </Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.header}>Contact Us</Text>
        <Text style={styles.content}>
          We value your feedback and are here to help with any questions or
          concerns. Feel free to reach out to us at [support email address] or
          visit our website at [website URL] for more information.
        </Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.header}>Follow Us</Text>
        <Text style={styles.content}>
          Stay connected with us on social media:
          {'\n'}- **Facebook**: [Facebook URL]
          {'\n'}- **Twitter**: [Twitter URL]
          {'\n'}- **Instagram**: [Instagram URL]
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingHorizontal: 40,
    backgroundColor: blBgColors.defaultBackground,
  },
  section: {
    marginBottom: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  content: {
    fontSize: 16,
    lineHeight: 24,
    color: '#555',
  },
});

export default AboutAppScreen;
