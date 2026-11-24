import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
  StatusBar,
} from 'react-native';
import Toast from 'react-native-toast-message';
import {useAuthState, hasAdminAccess} from '../../Navigation/AuthContext';
import {fetchSessionConfig} from '../../Services/AppConfigService';
import sessionManager from '../../Services/SessionManager';
import {blBgColors, blFontSize, blFontColor} from '../../App/Accessibilities';
import DynamicIcon from '../../Components/DynamicIcon';
import Loader from '../../Components/Loader';

const AppConfigScreen = () => {
  const authState = useAuthState();
  const [loading, setLoading] = useState(true);
  const [timeoutMinutes, setTimeoutMinutes] = useState(null);

  useEffect(() => {
    const loadConfig = async () => {
      try {
        const minutes = await fetchSessionConfig();
        setTimeoutMinutes(minutes);
        sessionManager.setSessionTimeoutMinutes(minutes);
      } catch (e) {
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: 'Failed to load session settings.',
        });
      } finally {
        setLoading(false);
      }
    };
    loadConfig();
  }, []);

  if (!hasAdminAccess(authState)) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.notAuthorized}>
          <DynamicIcon
            iconName={'shield-block-outline'}
            iconType={'MaterialCommunityIcons'}
            iconSize={60}
            iconColor={blFontColor.BLLigntGray}
          />
          <Text style={styles.notAuthorizedText}>
            You are not authorized to view app settings.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <Loader loading={loading} />
      <ScrollView>
        <View style={styles.section}>
          <View style={styles.portionTitle}>
            <Text style={styles.portionTitleText}>Session Timeout</Text>
          </View>
          <View style={styles.Info}>
            <View style={styles.settingRow}>
              <View style={styles.settingTextBlock}>
                <Text style={styles.settingTitle}>Idle Session Timeout</Text>
                <Text style={styles.settingDescription}>
                  You are logged out after this much inactivity. The value is
                  configured on the server and applies to every device.
                </Text>
              </View>
            </View>
            <View style={styles.valueRow}>
              <DynamicIcon
                iconName={'timer-outline'}
                iconType={'MaterialCommunityIcons'}
                iconSize={22}
                iconColor={blBgColors.toffee}
              />
              <Text style={styles.valueText}>
                {loading
                  ? '—'
                  : timeoutMinutes
                  ? `${timeoutMinutes} minute${timeoutMinutes > 1 ? 's' : ''}`
                  : 'Unlimited'}
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AppConfigScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: blBgColors.defaultBackground,
    flex: 1,
  },
  notAuthorized: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 30,
  },
  notAuthorizedText: {
    marginTop: 15,
    fontSize: blFontSize.bodyLarge,
    color: blFontColor.BLLigntGray,
    textAlign: 'center',
  },
  section: {
    flex: 1,
  },
  portionTitle: {
    backgroundColor: blBgColors.bgTitle1,
  },
  portionTitleText: {
    fontSize: blFontSize.subTitle,
    paddingLeft: 20,
    paddingVertical: 10,
    color: blFontColor.TitleColor1,
  },
  Info: {
    backgroundColor: blBgColors.defaultBackground,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  settingRow: {
    paddingVertical: 10,
  },
  settingTextBlock: {
    flex: 1,
  },
  settingTitle: {
    fontSize: blFontSize.bodyLarge,
    fontWeight: '800',
    color: '#000',
  },
  settingDescription: {
    marginTop: 5,
    fontSize: blFontSize.bodyRegular,
    color: blFontColor.BLLigntGray,
  },
  valueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: blBgColors.bgTitle1,
  },
  valueText: {
    paddingLeft: 10,
    fontSize: blFontSize.bodyLarge,
    fontWeight: '600',
    color: '#000',
  },
});
