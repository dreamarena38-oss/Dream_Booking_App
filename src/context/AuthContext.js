import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { Alert, Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';


const AuthContext = createContext();

// Custom Alert Component with styled colors
const CustomAlert = ({ visible, title, message, buttons, onClose }) => {
  return (
    <Modal
      transparent={true}
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={customAlertStyles.overlay}>
        <View style={customAlertStyles.alertContainer}>
          {title && <Text style={customAlertStyles.title}>{title}</Text>}
          {message && <Text style={customAlertStyles.message}>{message}</Text>}

          <View style={customAlertStyles.buttonContainer}>
            {buttons ? buttons.map((button, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  customAlertStyles.button,
                  button.style === 'destructive' && customAlertStyles.destructiveButton,
                  button.style === 'cancel' && customAlertStyles.cancelButton
                ]}
                onPress={() => {
                  onClose();
                  if (button.onPress) button.onPress();
                }}
              >
                <Text style={[
                  customAlertStyles.buttonText,
                  button.style === 'destructive' && customAlertStyles.destructiveButtonText,
                  button.style === 'cancel' && customAlertStyles.cancelButtonText
                ]}>
                  {button.text}
                </Text>
              </TouchableOpacity>
            )) : (
              <TouchableOpacity
                style={customAlertStyles.button}
                onPress={onClose}
              >
                <Text style={customAlertStyles.buttonText}>OK</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
};

const customAlertStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  alertContainer: {
    backgroundColor: '#FFD700',
    borderRadius: 15,
    padding: 20,
    minWidth: 280,
    maxWidth: '90%',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  title: {
    fontSize: 18,
    fontFamily: 'Sportypo-Regular',
    color: '#0d2818',
    textAlign: 'center',
    marginBottom: 10,
    letterSpacing: 1,
  },
  message: {
    fontSize: 16,
    fontFamily: 'LemonMilk-Regular',
    color: '#0d2818',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 22,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    gap: 10,
  },
  button: {
    flex: 1,
    backgroundColor: '#0d2818',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#0d2818',
  },
  destructiveButton: {
    backgroundColor: '#d32f2f',
  },
  buttonText: {
    fontSize: 16,
    fontFamily: 'LemonMilk-Regular',
    color: '#FFD700',
  },
  cancelButtonText: {
    color: '#0d2818',
  },
  destructiveButtonText: {
    color: '#fff',
  },
});
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [alertConfig, setAlertConfig] = useState({
    visible: false,
    title: '',
    message: '',
    buttons: null,
  });

  const API_BASE_URL = 'https://dream-booking-backend-1.onrender.com/api';


  // Setup Axios interceptors
  useEffect(() => {
    const requestInterceptor = axios.interceptors.request.use(
      async (config) => {
        const token = await AsyncStorage.getItem('userToken');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    const responseInterceptor = axios.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.response?.status === 401) {
          // Token expired or invalid, logout user
          await logout();
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.request.eject(requestInterceptor);
      axios.interceptors.response.eject(responseInterceptor);
    };
  }, []);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const userData = await AsyncStorage.getItem('userData');

      if (token && userData) {
        setUser(JSON.parse(userData));
        // Set default authorization header
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
    } finally {
      setLoading(false);
    }
  };

  const login = async ({ email, password }) => {
    try {
      // Direct API call to backend
      const response = await axios.post(`${API_BASE_URL}/auth/login`, { email, password });
      const { token, user: apiUserData } = response.data;

      await AsyncStorage.setItem('userToken', token);
      await AsyncStorage.setItem('userData', JSON.stringify(apiUserData));
      await AsyncStorage.setItem('userRole', apiUserData.role);

      setUser(apiUserData);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      return { success: true, user: apiUserData };
    } catch (error) {
      console.error('Login error:', error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data?.message || 'Login failed'
      };
    }
  };

  const register = async (userData) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/register`, userData);
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Registration failed'
      };
    }
  };

  const updateProfile = async (profileData) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/auth/profile`, profileData);
      const updatedUser = response.data.user;

      // Update local storage and state
      await AsyncStorage.setItem('userData', JSON.stringify(updatedUser));
      setUser(updatedUser);

      return { success: true, user: updatedUser };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Profile update failed'
      };
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.multiRemove(['userToken', 'userData', 'userRole']);
      setUser(null);
      delete axios.defaults.headers.common['Authorization'];
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  // Custom Alert function with styled appearance
  const showCustomAlert = (title, message, buttons) => {
    setAlertConfig({
      visible: true,
      title,
      message,
      buttons,
    });
  };

  const hideCustomAlert = () => {
    setAlertConfig({
      visible: false,
      title: '',
      message: '',
      buttons: null,
    });
  };

  const value = {
    user,
    login,
    register,
    updateProfile,
    logout,
    loading,
    API_BASE_URL,
    showCustomAlert
  };

  // Override global Alert.alert to use our custom styled alert
  useEffect(() => {
    const originalAlert = Alert.alert;
    Alert.alert = (title, message, buttons, options) => {
      showCustomAlert(title, message, buttons);
    };

    return () => {
      Alert.alert = originalAlert;
    };
  }, []);

  return (
    <AuthContext.Provider value={value}>
      {children}
      <CustomAlert
        visible={alertConfig.visible}
        title={alertConfig.title}
        message={alertConfig.message}
        buttons={alertConfig.buttons}
        onClose={hideCustomAlert}
      />
    </AuthContext.Provider>
  );
};