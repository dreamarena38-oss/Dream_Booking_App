import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Image,
  ImageBackground,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Picker } from '@react-native-picker/picker';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const positions = [
  'Goalkeeper',
  'Defender',
  'Midfielder',
  'Forward',
  'Striker',
  'Winger',
  'Center Back',
  'Full Back',
  'Attacking Midfielder',
  'Defensive Midfielder'
];

export default function RegisterScreen({ navigation }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    height: '',
    position: positions[0],
    teamId: '',
    teamPassword: '',
    profileImage: null,
  });
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { register, API_BASE_URL } = useAuth();

  useEffect(() => {
    fetchTeams();
  }, []);

  const fetchTeams = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/teams`);
      setTeams(response.data);
    } catch (error) {
      console.error('Error fetching teams:', error);
      Alert.alert('Error', 'Failed to load teams. Please check your connection and try again.');
    }
  };

  const pickImage = async () => {
    try {
      // Request permission
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (permissionResult.granted === false) {
        Alert.alert('Permission Required', 'Permission to access camera roll is required!');
        return;
      }

      // Launch image picker
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
        base64: true,
      });

      if (!result.canceled && result.assets[0]) {
        // Convert to base64 data URL for storage
        const base64Image = `data:image/jpeg;base64,${result.assets[0].base64}`;
        updateFormData('profileImage', base64Image);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image. Please try again.');
    }
  };

  const handleRegister = async () => {
    if (!formData.name || !formData.email || !formData.password || !formData.height) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters long');
      return;
    }

    setLoading(true);
    try {
      const result = await register(formData);

      if (result.success) {
        Alert.alert(
          'Success',
          'Account created successfully! A welcome email has been sent to your email address.',
          [
            { text: 'OK', onPress: () => navigation.navigate('Login') }
          ]
        );
      } else {
        // Handle specific error cases
        let errorMessage = result.error;
        if (result.error === 'USER_EXISTS') {
          errorMessage = 'An account with this email already exists';
        } else if (result.error === 'PASSWORD_TOO_SHORT') {
          errorMessage = 'Password must be at least 6 characters';
        }

        Alert.alert('Registration Failed', errorMessage);
      }
    } catch (error) {
      console.error('Registration error:', error);
      Alert.alert('Error', 'Failed to connect to server. Please check your internet connection.');
    } finally {
      setLoading(false);
    }
  };

  const updateFormData = (key, value) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.header}>
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>Join Dream Arena today</Text>

            <TouchableOpacity style={styles.imageUploadContainer} onPress={pickImage}>
              {formData.profileImage ? (
                <Image source={{ uri: formData.profileImage }} style={styles.profileImage} />
              ) : (
                <View style={styles.imagePlaceholder}>
                  <Ionicons name="camera" size={32} color="#888" />
                  <Text style={styles.imagePlaceholderText}>Add Photo</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>

          <View style={styles.form}>
            <View style={styles.inputContainer}>
              <Ionicons name="person-outline" size={20} color="#888" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Full Name *"
                placeholderTextColor="#888"
                value={formData.name}
                onChangeText={(value) => updateFormData('name', value)}
              />
            </View>

            <View style={styles.inputContainer}>
              <Ionicons name="mail-outline" size={20} color="#888" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Email *"
                placeholderTextColor="#888"
                value={formData.email}
                onChangeText={(value) => updateFormData('email', value)}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputContainer}>
              <Ionicons name="resize-outline" size={20} color="#888" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Height (cm) *"
                placeholderTextColor="#888"
                value={formData.height}
                onChangeText={(value) => updateFormData('height', value)}
                keyboardType="numeric"
              />
            </View>

            <View style={styles.pickerContainer}>
              <Ionicons name="football-outline" size={20} color="#888" style={styles.inputIcon} />
              <Picker
                selectedValue={formData.position}
                style={styles.picker}
                onValueChange={(value) => updateFormData('position', value)}
                dropdownIconColor="#888"
              >
                {positions.map((position) => (
                  <Picker.Item key={position} label={position} value={position} color="#fff" />
                ))}
              </Picker>
            </View>

            <View style={styles.inputContainer}>
              <Ionicons name="lock-closed-outline" size={20} color="#888" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Password *"
                placeholderTextColor="#888"
                value={formData.password}
                onChangeText={(value) => updateFormData('password', value)}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity
                style={styles.eyeIcon}
                onPress={() => setShowPassword(!showPassword)}
              >
                <Ionicons
                  name={showPassword ? "eye-outline" : "eye-off-outline"}
                  size={20}
                  color="#888"
                />
              </TouchableOpacity>
            </View>

            <View style={styles.inputContainer}>
              <Ionicons name="lock-closed-outline" size={20} color="#888" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Confirm Password *"
                placeholderTextColor="#888"
                value={formData.confirmPassword}
                onChangeText={(value) => updateFormData('confirmPassword', value)}
                secureTextEntry={!showConfirmPassword}
              />
              <TouchableOpacity
                style={styles.eyeIcon}
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                <Ionicons
                  name={showConfirmPassword ? "eye-outline" : "eye-off-outline"}
                  size={20}
                  color="#888"
                />
              </TouchableOpacity>
            </View>

            <Text style={styles.sectionTitle}>Join a Team (Optional)</Text>

            {teams.length > 0 ? (
              <View style={styles.pickerContainer}>
                <Ionicons name="people-outline" size={20} color="#888" style={styles.inputIcon} />
                <Picker
                  selectedValue={formData.teamId}
                  style={styles.picker}
                  onValueChange={(value) => updateFormData('teamId', value)}
                  dropdownIconColor="#ffd700"
                >
                  <Picker.Item label="Select a team (optional)" value="" color="#888" />
                  {teams.map((team) => (
                    <Picker.Item key={team._id} label={team.name} value={team._id} color="#fff" />
                  ))}
                </Picker>
              </View>
            ) : (
              <View style={styles.noTeamsContainer}>
                <Text style={styles.noTeamsText}>No teams available to join.</Text>
                <TouchableOpacity onPress={fetchTeams}>
                  <Text style={styles.retryText}>Tap to refresh</Text>
                </TouchableOpacity>
              </View>
            )}

            {formData.teamId && (
              <View style={styles.inputContainer}>
                <Ionicons name="key-outline" size={20} color="#888" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Team Password"
                  placeholderTextColor="#888"
                  value={formData.teamPassword}
                  onChangeText={(value) => updateFormData('teamPassword', value)}
                  secureTextEntry
                />
              </View>
            )}

            <ImageBackground
              source={require('./vector.png')}
              style={[styles.button, loading && styles.buttonDisabled]}
              imageStyle={styles.buttonImage}
            >
              <TouchableOpacity
                style={styles.buttonTouchable}
                onPress={handleRegister}
                disabled={loading}
              >
                <Text style={styles.buttonText}>
                  {loading ? 'Creating Account...' : 'Create Account'}
                </Text>
              </TouchableOpacity>
            </ImageBackground>

            <TouchableOpacity
              style={styles.loginLink}
              onPress={() => navigation.navigate('Login')}
            >
              <Text style={styles.loginText}>
                Already have an account? <Text style={styles.loginTextBold}>Login</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0d2818',
  },
  imageUploadContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: '#ffd700',
  },
  imagePlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#1a4d3a',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#888',
    borderStyle: 'dashed',
  },
  imagePlaceholderText: {
    color: '#888',
    marginTop: 5,
    fontSize: 12,
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
    marginTop: 20,
  },
  title: {
    fontSize: 28,
    fontFamily: 'Sportypo-Regular',
    color: '#fff',
    letterSpacing: 1.5,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Montserrat-Regular',
    color: '#888',
    marginTop: 5,
  },
  form: {
    width: '100%',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a4d3a',
    borderRadius: 10,
    marginBottom: 15,
    paddingHorizontal: 15,
    height: 50,
  },
  pickerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a4d3a',
    borderRadius: 10,
    marginBottom: 15,
    paddingHorizontal: 15,
    height: 50,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    color: '#fff',
    fontSize: 16,
  },
  picker: {
    flex: 1,
    color: '#fff',
    height: 50,
  },
  eyeIcon: {
    padding: 5,
  },
  sectionTitle: {
    color: '#ffd700',
    fontSize: 16,
    fontFamily: 'Sportypo-Regular',
    marginBottom: 10,
    marginTop: 10,
    letterSpacing: 1,
  },
  button: {
    borderRadius: 10,
    height: 50,
    marginTop: 20,
    marginBottom: 15,
    borderWidth: 2,
    borderColor: '#ffd700',
    overflow: 'hidden',
  },
  buttonImage: {
    opacity: 0.3,
  },
  buttonTouchable: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#ffd700',
    fontSize: 18,
    fontFamily: 'Montserrat-Regular',
    fontWeight: 'bold',
    textShadowColor: '#000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  loginLink: {
    alignItems: 'center',
    marginBottom: 20,
  },
  loginText: {
    color: '#888',
    fontSize: 16,
    fontFamily: 'Montserrat-Regular',
  },
  loginTextBold: {
    color: '#ffd700',
    fontFamily: 'Montserrat-Bold',
  },
  noTeamsContainer: {
    backgroundColor: '#1a4d3a',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#2a5d4a',
  },
  noTeamsText: {
    color: '#888',
    fontFamily: 'Montserrat-Regular',
    fontSize: 14,
    marginBottom: 5,
  },
  retryText: {
    color: '#ffd700',
    fontFamily: 'LemonMilk-Regular',
    fontSize: 12,
    textDecorationLine: 'underline',
  },
});