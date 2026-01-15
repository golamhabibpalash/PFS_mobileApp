// TermsAndConditionsScreen.jsx
import React from 'react';
import {View, Text, ScrollView, StyleSheet} from 'react-native';
import {blBgColors} from '../../App/Accessibilities';

const TermsAndConditionsScreen = () => {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.header}>Terms & Conditions</Text>
        <Text style={styles.content}>
          Welcome to [App Name]. By accessing and using this application, you
          agree to be bound by the following terms and conditions:
        </Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.subheader}>1. Acceptance of Terms</Text>
        <Text style={styles.content}>
          By accessing or using the [App Name] application, you agree to comply
          with and be bound by these terms and conditions. If you do not agree
          with any of these terms, you are prohibited from using or accessing
          this application.
        </Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.subheader}>2. Use of the Application</Text>
        <Text style={styles.content}>
          You agree to use [App Name] solely for your personal, non-commercial
          use. You must not use this application in any way that causes, or may
          cause, damage to the application or impairment of the availability or
          accessibility of the application.
        </Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.subheader}>3. User Accounts</Text>
        <Text style={styles.content}>
          In order to access certain features of the application, you may be
          required to create a user account. You are responsible for maintaining
          the confidentiality of your account and password and for restricting
          access to your account.
        </Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.subheader}>4. Modifications</Text>
        <Text style={styles.content}>
          [App Name] reserves the right to modify or revise these terms and
          conditions at any time. By using this application, you agree to be
          bound by the current version of these terms and conditions.
        </Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.subheader}>5. Contact Us</Text>
        <Text style={styles.content}>
          If you have any questions or concerns about these terms and
          conditions, please contact us at [contact email address].
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
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
  subheader: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  content: {
    fontSize: 16,
    lineHeight: 24,
    color: '#555',
  },
});

export default TermsAndConditionsScreen;
