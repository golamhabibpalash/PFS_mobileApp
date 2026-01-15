import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';

const FAQScreen = () => {
  const [expandedIndex, setExpandedIndex] = useState(null);

  const faqData = [
    {
      question: 'What is BL PFS?',
      answer:
        'BL PFS is a comprehensive management tool designed for parking, cafeteria, and dispatch operations at Banglalink.',
    },
    {
      question: 'Who can use this app?',
      answer:
        'This app is designed for Banglalink employees, contractors, vendors, and temporary guests who need access to facilities.',
    },
    {
      question: 'How do I register?',
      answer:
        'Registration credentials are provided by Banglalink IT admin. Temporary guests will receive login details for short-term access.',
    },
    {
      question: 'Can visitors use this app?',
      answer:
        'Yes, visitors can download the app from the App Store and log in using credentials provided by Banglalink IT admin.',
    },
    {
      question: 'Is there a fee to use this app?',
      answer:
        'No, the app is free to download and use for authorized personnel and temporary visitors.',
    },
    {
      question: 'What should I do if I forget my password?',
      answer:
        'If you forget your password, contact Banglalink IT admin for password recovery or reset assistance.',
    },
    {
      question: 'Does the app work offline?',
      answer:
        'No, the app requires an active internet connection to function as it provides real-time updates and information.',
    },
    {
      question: 'How is my data secured?',
      answer:
        'BL PFS follows strict data security protocols to ensure all user information is encrypted and securely stored.',
    },
    {
      question: 'Can I access multiple features at once?',
      answer:
        'Yes, the app allows you to manage parking, cafeteria, and dispatch operations simultaneously through an intuitive interface.',
    },
    {
      question: 'What permissions does the app require?',
      answer:
        'The app may require location access to optimize parking features and internet access for real-time updates.',
    },
  ];

  const toggleExpand = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Frequently Asked Questions</Text>
      {faqData.map((item, index) => (
        <View key={index} style={styles.faqItem}>
          <TouchableOpacity onPress={() => toggleExpand(index)}>
            <Text style={styles.question}>
              {expandedIndex === index ? '▼ ' : '▶ '} {item.question}
            </Text>
          </TouchableOpacity>
          {expandedIndex === index && <Text style={styles.answer}>{item.answer}</Text>}
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  faqItem: {
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    paddingBottom: 10,
  },
  question: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#222',
  },
  answer: {
    fontSize: 16,
    color: '#555',
    marginTop: 10,
    paddingLeft: 10,
  },
});

export default FAQScreen;
