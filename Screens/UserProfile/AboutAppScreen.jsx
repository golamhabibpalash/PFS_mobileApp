import React, {useState} from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import {blBgColors} from '../../App/Accessibilities';
import LinearGradient from 'react-native-linear-gradient';
import DynamicIcon from '../../Components/DynamicIcon';
import packageJson from '../../package.json';
import {checkForUpdate} from '../../Services/AppUpdateService';
import ForceUpdateModal from '../../Components/ForceUpdateModal';

const AboutAppScreen = () => {
  const [checking, setChecking] = useState(false);
  const [checkResult, setCheckResult] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const handleCheckUpdate = async () => {
    setChecking(true);
    setCheckResult(null);
    try {
      const result = await checkForUpdate();
      if (result && result.needsUpdate) {
        setCheckResult(result);
        setShowModal(true);
      } else {
        setCheckResult({upToDate: true});
      }
    } catch {
      setCheckResult({error: true});
    }
    setChecking(false);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.header}>App Version</Text>
        <Text style={styles.content}>Version {packageJson.version}</Text>
      </View>

      <TouchableOpacity
        style={styles.updateButtonWrapper}
        onPress={handleCheckUpdate}
        disabled={checking}
        activeOpacity={0.8}>
        <LinearGradient
          style={styles.updateButton}
          colors={['#060606', '#737373']}
          start={{x: 0, y: 1}}
          end={{x: 1, y: 0}}>
          <DynamicIcon
            iconName="cloud-download"
            iconType="MaterialIcons"
            iconSize={20}
            iconColor="#fff"
          />
          <Text style={styles.updateButtonText}>
            {checking ? 'Checking...' : 'Check for Updates'}
          </Text>
        </LinearGradient>
      </TouchableOpacity>

      {checkResult?.upToDate && (
        <View style={styles.resultContainer}>
          <DynamicIcon
            iconName="check-circle"
            iconType="MaterialIcons"
            iconSize={20}
            iconColor="#27ae60"
          />
          <Text style={styles.upToDateText}>
            You're using the latest version
          </Text>
        </View>
      )}

      {checkResult?.error && (
        <View style={styles.resultContainer}>
          <DynamicIcon
            iconName="error-outline"
            iconType="MaterialIcons"
            iconSize={20}
            iconColor="#e74c3c"
          />
          <Text style={styles.errorText}>
            Could not check for updates. Try again later.
          </Text>
        </View>
      )}

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

      <ForceUpdateModal
        visible={showModal}
        isRequired={checkResult?.isRequired ?? false}
        latestVersion={checkResult?.latestVersion ?? ''}
        currentVersion={checkResult?.currentVersion ?? ''}
        releaseNotes={checkResult?.releaseNotes ?? ''}
        onSkip={() => setShowModal(false)}
      />
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
  updateButtonWrapper: {
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 16,
  },
  updateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    gap: 8,
  },
  updateButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  resultContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  upToDateText: {
    fontSize: 14,
    color: '#27ae60',
  },
  errorText: {
    fontSize: 14,
    color: '#e74c3c',
  },
});

export default AboutAppScreen;
