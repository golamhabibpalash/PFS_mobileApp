import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  BackHandler,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {blBgColors, blFontColor, blFontSize} from '../App/Accessibilities';
import DynamicIcon from './DynamicIcon';
import {openAppStore} from '../Services/AppUpdateService';

const ForceUpdateModal = ({
  visible,
  isRequired,
  latestVersion,
  currentVersion,
  releaseNotes,
  onSkip,
}) => {
  React.useEffect(() => {
    if (isRequired && visible) {
      const handler = () => true;
      BackHandler.addEventListener('hardwareBackPress', handler);
      return () =>
        BackHandler.removeEventListener('hardwareBackPress', handler);
    }
  }, [isRequired, visible]);

  return (
    <Modal
      transparent
      animationType="fade"
      visible={visible}
      statusBarTranslucent>
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.iconWrapper}>
            <DynamicIcon
              iconName="cloud-download"
              iconType="MaterialIcons"
              iconSize={48}
              iconColor={blBgColors.secondaryGradient}
            />
          </View>

          <Text style={styles.title}>Update Available</Text>
          <Text style={styles.subtitle}>
            Version {latestVersion} is now available
          </Text>
          <Text style={styles.versionInfo}>
            Current version: {currentVersion}
          </Text>

          {releaseNotes ? (
            <View style={styles.notesContainer}>
              <Text style={styles.notesLabel}>What's new:</Text>
              <Text style={styles.notesText} numberOfLines={4}>
                {releaseNotes}
              </Text>
            </View>
          ) : null}

          <Text style={isRequired ? styles.requiredText : styles.optionalText}>
            {isRequired
              ? 'This update is required to continue using the app.'
              : 'A new version is available. Update for the best experience.'}
          </Text>

          <TouchableOpacity
            style={styles.updateButtonWrapper}
            onPress={openAppStore}
            activeOpacity={0.8}>
            <LinearGradient
              style={styles.updateButton}
              colors={[
                blBgColors.primaryGradient,
                blBgColors.secondaryGradient,
              ]}
              start={{x: 0, y: 1}}
              end={{x: 1, y: 0}}>
              <Text style={styles.updateButtonText}>Update Now</Text>
            </LinearGradient>
          </TouchableOpacity>

          {!isRequired && onSkip ? (
            <TouchableOpacity style={styles.skipButton} onPress={onSkip}>
              <Text style={styles.skipButtonText}>Skip This Version</Text>
            </TouchableOpacity>
          ) : null}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  container: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 340,
    alignItems: 'center',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  iconWrapper: {
    marginBottom: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: blBgColors.primaryGradient,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: blFontSize.bodyLarge,
    color: blBgColors.secondaryGradient,
    marginBottom: 8,
  },
  versionInfo: {
    fontSize: blFontSize.bodySmall,
    color: blFontColor.BLLigntGray,
    marginBottom: 16,
  },
  notesContainer: {
    width: '100%',
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  notesLabel: {
    fontSize: blFontSize.bodySmall,
    fontWeight: 'bold',
    color: blBgColors.primaryGradient,
    marginBottom: 4,
  },
  notesText: {
    fontSize: blFontSize.bodySmall,
    color: '#555',
    lineHeight: 18,
  },
  requiredText: {
    fontSize: blFontSize.bodySmall,
    color: '#e74c3c',
    textAlign: 'center',
    marginBottom: 20,
  },
  optionalText: {
    fontSize: blFontSize.bodySmall,
    color: blFontColor.BLLigntGray,
    textAlign: 'center',
    marginBottom: 20,
  },
  updateButtonWrapper: {
    width: '100%',
    borderRadius: 8,
    overflow: 'hidden',
  },
  updateButton: {
    paddingVertical: 14,
    alignItems: 'center',
  },
  updateButtonText: {
    color: '#fff',
    fontSize: blFontSize.bodyLarge,
    fontWeight: 'bold',
  },
  skipButton: {
    marginTop: 12,
    paddingVertical: 10,
  },
  skipButtonText: {
    fontSize: blFontSize.bodyRegular,
    color: blFontColor.BLLigntGray,
    textDecorationLine: 'underline',
  },
});

export default ForceUpdateModal;
