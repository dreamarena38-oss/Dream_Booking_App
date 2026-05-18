import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
  ImageBackground,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';

export default function ProfileScreen() {
  const navigation = useNavigation();
  const { user, logout, updateProfile } = useAuth();

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Logout', style: 'destructive', onPress: logout }
      ]
    );
  };

  const handleImagePicker = async () => {
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

        // Update profile with new image
        const updateResult = await updateProfile({ profileImage: base64Image });

        if (updateResult.success) {
          Alert.alert('Success', 'Profile photo updated successfully!');
        } else {
          Alert.alert('Error', updateResult.error || 'Failed to update profile photo');
        }
      }
    } catch (error) {
      console.error('Error updating profile photo:', error);
      Alert.alert('Error', 'Failed to update profile photo. Please try again.');
    }
  };

  const getPositionIcon = (position) => {
    switch (position?.toLowerCase()) {
      case 'goalkeeper':
        return 'shield-outline';
      case 'defender':
      case 'center back':
      case 'full back':
        return 'shield-checkmark-outline';
      case 'midfielder':
      case 'attacking midfielder':
      case 'defensive midfielder':
        return 'ellipse-outline';
      case 'forward':
      case 'striker':
      case 'winger':
        return 'arrow-up-outline';
      default:
        return 'football-outline';
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <View style={styles.profileImageContainer}>
            <Image
              source={{
                uri: user?.profileImage || 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg'
              }}
              style={styles.profileImage}
            />
            <TouchableOpacity style={styles.editImageButton} onPress={handleImagePicker}>
              <Ionicons name="camera" size={16} color="#000" />
            </TouchableOpacity>
          </View>

          <Text style={styles.userName}>{user?.name}</Text>
          <Text style={styles.userEmail}>{user?.email}</Text>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Ionicons
              name={getPositionIcon(user?.position)}
              size={24}
              color="#ffd700"
            />
            <Text style={styles.statLabel}>Position</Text>
            <Text style={styles.statValue}>{user?.position || 'Not specified'}</Text>
          </View>

          <View style={styles.statItem}>
            <Ionicons name="resize-outline" size={24} color="#ffd700" />
            <Text style={styles.statLabel}>Height</Text>
            <Text style={styles.statValue}>{user?.height ? `${user.height} cm` : 'Not specified'}</Text>
          </View>

          <View style={styles.statItem}>
            <Ionicons name="people-outline" size={24} color="#ffd700" />
            <Text style={styles.statLabel}>Team</Text>
            <Text style={styles.statValue}>{user?.teamId?.name || 'No team'}</Text>
          </View>
        </View>

        {user?.teamId && (
          <View style={styles.teamSection}>
            <Text style={styles.sectionTitle}>Team Information</Text>
            <View style={styles.teamCard}>
              <View style={styles.teamHeader}>
                <Image
                  source={{
                    uri: user.teamId.logo || 'https://images.pexels.com/photos/274506/pexels-photo-274506.jpeg'
                  }}
                  style={styles.teamLogo}
                />
                <View style={styles.teamInfo}>
                  <Text style={styles.teamName}>{user.teamId.name}</Text>
                  <Text style={styles.teamCaptain}>Captain: {user.teamId.captain}</Text>
                </View>
              </View>

              <View style={styles.teamStats}>
                <View style={styles.teamStatItem}>
                  <Text style={styles.teamStatValue}>{user.teamId.players?.length || 0}</Text>
                  <Text style={styles.teamStatLabel}>Players</Text>
                </View>
                <View style={styles.teamStatItem}>
                  <Text style={styles.teamStatValue}>{user.teamId.matchesPlayed || 0}</Text>
                  <Text style={styles.teamStatLabel}>Matches</Text>
                </View>
                <View style={styles.teamStatItem}>
                  <Text style={styles.teamStatValue}>{user.teamId.wins || 0}</Text>
                  <Text style={styles.teamStatLabel}>Wins</Text>
                </View>
              </View>
            </View>
          </View>
        )}

        <View style={styles.menuSection}>
          <Text style={styles.sectionTitle}>Account</Text>

          <ImageBackground
            source={require('./vector.png')}
            style={styles.menuItem}
            imageStyle={styles.buttonImage}
          >
            <TouchableOpacity style={styles.menuTouchable} onPress={() => navigation.navigate('DetailedProfile')}>
              <Ionicons name="person-outline" size={20} color="#ffd700" />
              <Text style={styles.menuText}>View Profile</Text>
              <Ionicons name="chevron-forward" size={20} color="#ffd700" />
            </TouchableOpacity>
          </ImageBackground>


          <ImageBackground
            source={require('./vector.png')}
            style={styles.menuItem}
            imageStyle={styles.buttonImage}
          >
            <TouchableOpacity style={styles.menuTouchable} onPress={() => navigation.navigate('BookingsHistory')}>
              <Ionicons name="calendar-outline" size={20} color="#ffd700" />
              <Text style={styles.menuText}>My Bookings</Text>
              <Ionicons name="chevron-forward" size={20} color="#ffd700" />
            </TouchableOpacity>
          </ImageBackground>

          <ImageBackground
            source={require('./vector.png')}
            style={styles.menuItem}
            imageStyle={styles.buttonImage}
          >
            <TouchableOpacity style={styles.menuTouchable} onPress={() => navigation.navigate('HelpSupportScreen')}>
              <Ionicons name="help-circle-outline" size={20} color="#ffd700" />
              <Text style={styles.menuText}>Help & Support</Text>
              <Ionicons name="chevron-forward" size={20} color="#ffd700" />
            </TouchableOpacity>
          </ImageBackground>

          <ImageBackground
            source={require('./vector.png')}
            style={styles.menuItem}
            imageStyle={styles.buttonImage}
          >
            <TouchableOpacity style={styles.menuTouchable} onPress={() => navigation.navigate('SettingsScreen')}>
              <Ionicons name="settings-outline" size={20} color="#ffd700" />
              <Text style={styles.menuText}>Settings</Text>
              <Ionicons name="chevron-forward" size={20} color="#ffd700" />
            </TouchableOpacity>
          </ImageBackground>
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={20} color="#fff" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0d2818',
  },
  header: {
    alignItems: 'center',
    padding: 30,
    backgroundColor: '000',
  },
  profileImageContainer: {
    position: 'relative',
    marginBottom: 15,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: '#ffd700',
  },
  editImageButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#ffd700',
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  userName: {
    fontSize: 24,
    fontFamily: 'Sportypo-Regular',
    color: '#fff',
    marginBottom: 5,
    letterSpacing: 1.5,
  },
  userEmail: {
    fontSize: 14,
    fontFamily: 'LemonMilk-Regular',
    color: '#888',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 20,
    backgroundColor: 'transparent',
    marginTop: 1,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statLabel: {
    color: '#888',
    fontSize: 12,
    fontFamily: 'LemonMilk-Regular',
    marginTop: 5,
  },
  statValue: {
    color: '#fff',
    fontSize: 14,
    fontFamily: 'LemonMilk-Regular',
    marginTop: 2,
    textAlign: 'center',
  },
  teamSection: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Sportypo-Regular',
    color: '#ffd700',
    marginBottom: 15,
    letterSpacing: 1,
  },
  teamCard: {
    backgroundColor: '#1a4d3a',
    borderRadius: 15,
    padding: 15,
  },
  teamHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  teamLogo: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  teamInfo: {
    flex: 1,
  },
  teamName: {
    fontSize: 18,
    fontFamily: 'Sportypo-Regular',
    color: '#fff',
    letterSpacing: 1,
  },
  teamCaptain: {
    fontSize: 14,
    fontFamily: 'LemonMilk-Regular',
    color: '#888',
    marginTop: 2,
  },
  teamStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  teamStatItem: {
    alignItems: 'center',
  },
  teamStatValue: {
    fontSize: 20,
    fontFamily: 'LemonMilk-Regular',
    color: '#ffd700',
  },
  teamStatLabel: {
    fontSize: 12,
    fontFamily: 'LemonMilk-Regular',
    color: '#888',
    marginTop: 2,
  },
  menuSection: {
    padding: 20,
  },
  menuItem: {
    borderRadius: 10,
    height: 50,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: '#ffd700',
    overflow: 'hidden',
  },
  buttonImage: {
    opacity: 0.3,
  },
  menuTouchable: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
  },
  menuText: {
    flex: 1,
    color: '#ffd700',
    fontSize: 16,
    fontFamily: 'LemonMilk-Regular',
    marginLeft: 15,
    fontWeight: 'bold',
    textShadowColor: '#000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#d32f2f',
    borderRadius: 10,
    padding: 15,
    margin: 20,
    marginTop: 10,
  },
  logoutText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'LemonMilk-Regular',
    marginLeft: 10,
  },
});