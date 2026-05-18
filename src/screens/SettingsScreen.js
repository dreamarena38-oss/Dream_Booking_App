import React, { useState } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  StyleSheet, 
  Switch, 
  TouchableOpacity, 
  Linking, 
  Alert,
  Modal,
  TextInput,
  ImageBackground,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '../context/AuthContext';
import { useNavigation } from '@react-navigation/native';

export default function SettingsScreen() {
  const [darkMode, setDarkMode] = useState(true);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('English');
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const { logout } = useAuth();
  const navigation = useNavigation();
  const appVersion = '1.0.0';

  const languages = [
    'English',
    'Spanish',
    'French',
    'German',
    'Italian',
    'Portuguese',
    'Arabic',
    'Chinese'
  ];

  const toggleDarkMode = async () => {
    const newValue = !darkMode;
    setDarkMode(newValue);
    try {
      await AsyncStorage.setItem('darkMode', JSON.stringify(newValue));
      Alert.alert('Settings Updated', `Dark mode ${newValue ? 'enabled' : 'disabled'}`);
    } catch (error) {
      console.error('Error saving dark mode setting:', error);
    }
  };

  const toggleNotifications = async () => {
    const newValue = !notificationsEnabled;
    setNotificationsEnabled(newValue);
    try {
      await AsyncStorage.setItem('notificationsEnabled', JSON.stringify(newValue));
      Alert.alert('Settings Updated', `Notifications ${newValue ? 'enabled' : 'disabled'}`);
    } catch (error) {
      console.error('Error saving notification setting:', error);
    }
  };

  const handleLanguageSelect = async (language) => {
    setSelectedLanguage(language);
    try {
      await AsyncStorage.setItem('selectedLanguage', language);
      setShowLanguageModal(false);
      Alert.alert('Language Updated', `Language changed to ${language}`);
    } catch (error) {
      console.error('Error saving language setting:', error);
    }
  };

  const handleChangePassword = () => {
    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      Alert.alert('Error', 'Please fill in all password fields');
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      Alert.alert('Error', 'New passwords do not match');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      Alert.alert('Error', 'New password must be at least 6 characters long');
      return;
    }

    // In a real app, you would make an API call here
    Alert.alert('Success', 'Password changed successfully!', [
      {
        text: 'OK',
        onPress: () => {
          setShowPasswordModal(false);
          setPasswordData({
            currentPassword: '',
            newPassword: '',
            confirmPassword: ''
          });
        }
      }
    ]);
  };

  const navigateToAccount = () => {
    navigation.navigate('DetailedProfile');
  };

  const clearCache = async () => {
    Alert.alert(
      'Clear Cache',
      'This will clear all cached data. Are you sure?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: async () => {
            try {
              // Clear specific cache items (keep user data)
              const keysToRemove = ['cachedImages', 'tempData', 'searchHistory'];
              await AsyncStorage.multiRemove(keysToRemove);
              Alert.alert('Success', 'Cache cleared successfully');
            } catch (error) {
              console.error('Error clearing cache:', error);
              Alert.alert('Error', 'Failed to clear cache');
            }
          }
        }
      ]
    );
  };

  const openPrivacyPolicy = () => {
    Linking.openURL('https://dreamarena.com/privacy').catch(() => {
      Alert.alert('Error', 'Unable to open Privacy Policy. Please try again later.');
    });
  };

  const openTermsOfService = () => {
    Linking.openURL('https://dreamarena.com/terms').catch(() => {
      Alert.alert('Error', 'Unable to open Terms of Service. Please try again later.');
    });
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Logout', 
          style: 'destructive', 
          onPress: logout 
        }
      ]
    );
  };

  const handleContactSupport = () => {
    Alert.alert(
      'Contact Support',
      'How would you like to contact support?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Email',
          onPress: () => Linking.openURL('mailto:support@dreamarena.com')
        },
        {
          text: 'Phone',
          onPress: () => Linking.openURL('tel:+1234567890')
        }
      ]
    );
  };

  const handleRateApp = () => {
    Alert.alert(
      'Rate Dream Arena',
      'Would you like to rate our app?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Rate Now',
          onPress: () => {
            // In a real app, this would open the app store
            Alert.alert('Thank You!', 'Thank you for your feedback!');
          }
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.container}>
        {/* Account Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          
          <TouchableOpacity style={styles.settingItem} onPress={navigateToAccount}>
            <View style={styles.settingInfo}>
              <Ionicons name="person" size={20} color="#888" />
              <Text style={styles.settingText}>Account Settings</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#888" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingItem} onPress={() => setShowPasswordModal(true)}>
            <View style={styles.settingInfo}>
              <Ionicons name="lock-closed" size={20} color="#888" />
              <Text style={styles.settingText}>Change Password</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#888" />
          </TouchableOpacity>
        </View>

        {/* Appearance Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Appearance</Text>
          
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Ionicons name="moon" size={20} color="#888" />
              <Text style={styles.settingText}>Dark Mode</Text>
            </View>
            <Switch
              trackColor={{ false: '#767577', true: '#1a4d3a' }}
              thumbColor={darkMode ? '#ffd700' : '#f4f3f4'}
              onValueChange={toggleDarkMode}
              value={darkMode}
            />
          </View>
        </View>

        {/* Preferences Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferences</Text>
          
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Ionicons name="notifications" size={20} color="#888" />
              <Text style={styles.settingText}>Notifications</Text>
            </View>
            <Switch
              trackColor={{ false: '#767577', true: '#1a4d3a' }}
              thumbColor={notificationsEnabled ? '#ffd700' : '#f4f3f4'}
              onValueChange={toggleNotifications}
              value={notificationsEnabled}
            />
          </View>

          <TouchableOpacity style={styles.settingItem} onPress={() => setShowLanguageModal(true)}>
            <View style={styles.settingInfo}>
              <Ionicons name="language" size={20} color="#888" />
              <Text style={styles.settingText}>Language</Text>
            </View>
            <View style={styles.settingValue}>
              <Text style={styles.valueText}>{selectedLanguage}</Text>
              <Ionicons name="chevron-forward" size={20} color="#888" />
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingItem} onPress={clearCache}>
            <View style={styles.settingInfo}>
              <Ionicons name="trash" size={20} color="#888" />
              <Text style={styles.settingText}>Clear Cache</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#888" />
          </TouchableOpacity>
        </View>

        {/* Support Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Support</Text>
          
          <TouchableOpacity style={styles.settingItem} onPress={handleContactSupport}>
            <View style={styles.settingInfo}>
              <Ionicons name="help-circle" size={20} color="#888" />
              <Text style={styles.settingText}>Contact Support</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#888" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingItem} onPress={handleRateApp}>
            <View style={styles.settingInfo}>
              <Ionicons name="star" size={20} color="#888" />
              <Text style={styles.settingText}>Rate App</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#888" />
          </TouchableOpacity>
        </View>

        {/* About Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Ionicons name="information-circle" size={20} color="#888" />
              <Text style={styles.settingText}>Version</Text>
            </View>
            <Text style={styles.versionText}>{appVersion}</Text>
          </View>

          <TouchableOpacity style={styles.settingItem} onPress={openPrivacyPolicy}>
            <View style={styles.settingInfo}>
              <Ionicons name="shield" size={20} color="#888" />
              <Text style={styles.settingText}>Privacy Policy</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#888" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingItem} onPress={openTermsOfService}>
            <View style={styles.settingInfo}>
              <Ionicons name="document-text" size={20} color="#888" />
              <Text style={styles.settingText}>Terms of Service</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#888" />
          </TouchableOpacity>
        </View>

        {/* Logout Section */}
        <View style={styles.section}>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Ionicons name="log-out" size={20} color="#ff3333" />
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>

        {/* Language Selection Modal */}
        <Modal
          visible={showLanguageModal}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setShowLanguageModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Select Language</Text>
                <TouchableOpacity onPress={() => setShowLanguageModal(false)}>
                  <Ionicons name="close" size={24} color="#888" />
                </TouchableOpacity>
              </View>
              <ScrollView style={styles.languageList}>
                {languages.map((language) => (
                  <TouchableOpacity
                    key={language}
                    style={[
                      styles.languageItem,
                      selectedLanguage === language && styles.selectedLanguageItem
                    ]}
                    onPress={() => handleLanguageSelect(language)}
                  >
                    <Text style={[
                      styles.languageText,
                      selectedLanguage === language && styles.selectedLanguageText
                    ]}>
                      {language}
                    </Text>
                    {selectedLanguage === language && (
                      <Ionicons name="checkmark" size={20} color="#ffd700" />
                    )}
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </View>
        </Modal>

        {/* Change Password Modal */}
        <Modal
          visible={showPasswordModal}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setShowPasswordModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Change Password</Text>
                <TouchableOpacity onPress={() => setShowPasswordModal(false)}>
                  <Ionicons name="close" size={24} color="#888" />
                </TouchableOpacity>
              </View>
              
              <View style={styles.passwordForm}>
                <TextInput
                  style={styles.passwordInput}
                  placeholder="Current Password"
                  placeholderTextColor="#888"
                  secureTextEntry
                  value={passwordData.currentPassword}
                  onChangeText={(text) => setPasswordData({...passwordData, currentPassword: text})}
                />
                
                <TextInput
                  style={styles.passwordInput}
                  placeholder="New Password"
                  placeholderTextColor="#888"
                  secureTextEntry
                  value={passwordData.newPassword}
                  onChangeText={(text) => setPasswordData({...passwordData, newPassword: text})}
                />
                
                <TextInput
                  style={styles.passwordInput}
                  placeholder="Confirm New Password"
                  placeholderTextColor="#888"
                  secureTextEntry
                  value={passwordData.confirmPassword}
                  onChangeText={(text) => setPasswordData({...passwordData, confirmPassword: text})}
                />
                
                <ImageBackground 
                  source={require('./vector.png')} 
                  style={styles.changePasswordButton}
                  imageStyle={styles.buttonImage}
                >
                  <TouchableOpacity style={styles.changePasswordTouchable} onPress={handleChangePassword}>
                    <Text style={styles.changePasswordButtonText}>Change Password</Text>
                  </TouchableOpacity>
                </ImageBackground>
              </View>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0d2818',
    padding: 20,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Sportypo-Regular',
    color: '#ffd700',
    marginBottom: 15,
    letterSpacing: 1,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#1a4d3a',
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingText: {
    fontSize: 16,
    fontFamily: 'Montserrat-Regular',
    color: '#ddd',
    marginLeft: 10,
  },
  settingValue: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  valueText: {
    fontSize: 16,
    fontFamily: 'LemonMilk-Regular',
    color: '#888',
    marginRight: 8,
  },
  versionText: {
    fontSize: 16,
    fontFamily: 'LemonMilk-Regular',
    color: '#888',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    borderRadius: 8,
    backgroundColor: '#ff3333',
    marginTop: 10,
  },
  logoutText: {
    fontSize: 16,
    fontFamily: 'Montserrat-Regular',
    color: '#fff',
    marginLeft: 10,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#1a4d3a',
    borderRadius: 15,
    padding: 20,
    width: '90%',
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontFamily: 'Sportypo-Regular',
    color: '#fff',
    letterSpacing: 1,
  },
  languageList: {
    maxHeight: 400,
  },
  languageItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#2a5d4a',
  },
  selectedLanguageItem: {
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
  },
  languageText: {
    fontSize: 16,
    fontFamily: 'Montserrat-Regular',
    color: '#ddd',
  },
  selectedLanguageText: {
    color: '#ffd700',
    fontFamily: 'Montserrat-Regular',
  },
  passwordForm: {
    gap: 15,
  },
  passwordInput: {
    backgroundColor: '#0d2818',
    borderRadius: 8,
    padding: 15,
    color: '#fff',
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#2a5d4a',
    fontFamily: 'Montserrat-Regular',
  },
  changePasswordButton: {
    borderRadius: 8,
    height: 50,
    marginTop: 10,
    borderWidth: 2,
    borderColor: '#ffd700',
    overflow: 'hidden',
  },
  buttonImage: {
    opacity: 0.3,
  },
  changePasswordTouchable: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  changePasswordButtonText: {
    color: '#ffd700',
    fontSize: 16,
    fontFamily: 'Montserrat-Regular',
    fontWeight: 'bold',
    textShadowColor: '#000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
});