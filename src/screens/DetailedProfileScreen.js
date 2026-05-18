import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';

const DetailedProfileScreen = () => {
  const { user } = useAuth();

  return (
    <View style={styles.container}>
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <Image
            source={{ uri: user?.profileImage || 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg' }}
            style={styles.profileImage}
          />
          <Text style={styles.userName}>{user?.name}</Text>
          <Text style={styles.userEmail}>{user?.email}</Text>
        </View>

        <View style={styles.detailsContainer}>
          <View style={styles.detailItem}>
            <Ionicons name="person-outline" size={24} color="#ffd700" />
            <Text style={styles.detailLabel}>Full Name</Text>
            <Text style={styles.detailValue}>{user?.name}</Text>
          </View>

          <View style={styles.detailItem}>
            <Ionicons name="mail-outline" size={24} color="#ffd700" />
            <Text style={styles.detailLabel}>Email</Text>
            <Text style={styles.detailValue}>{user?.email}</Text>
          </View>

          <View style={styles.detailItem}>
            <Ionicons name="call-outline" size={24} color="#ffd700" />
            <Text style={styles.detailLabel}>Phone</Text>
            <Text style={styles.detailValue}>{user?.phone || 'Not specified'}</Text>
          </View>

          <View style={styles.detailItem}>
            <Ionicons name="location-outline" size={24} color="#ffd700" />
            <Text style={styles.detailLabel}>Address</Text>
            <Text style={styles.detailValue}>{user?.address || 'Not specified'}</Text>
          </View>

          <View style={styles.detailItem}>
            <Ionicons name="football-outline" size={24} color="#ffd700" />
            <Text style={styles.detailLabel}>Position</Text>
            <Text style={styles.detailValue}>{user?.position || 'Not specified'}</Text>
          </View>

          <View style={styles.detailItem}>
            <Ionicons name="resize-outline" size={24} color="#ffd700" />
            <Text style={styles.detailLabel}>Height</Text>
            <Text style={styles.detailValue}>{user?.height ? `${user.height} cm` : 'Not specified'}</Text>
          </View>

          <View style={styles.detailItem}>
            <Ionicons name="scale-outline" size={24} color="#ffd700" />
            <Text style={styles.detailLabel}>Weight</Text>
            <Text style={styles.detailValue}>{user?.weight ? `${user.weight} kg` : 'Not specified'}</Text>
          </View>

          {user?.teamId && (
            <View style={styles.teamSection}>
              <Text style={styles.sectionTitle}>Team Information</Text>
              <View style={styles.teamCard}>
                <Image
                  source={{ uri: user.teamId.logo || 'https://images.pexels.com/photos/274506/pexels-photo-274506.jpeg' }}
                  style={styles.teamLogo}
                />
                <Text style={styles.teamName}>{user.teamId.name}</Text>
                <Text style={styles.teamInfo}>Captain: {user.teamId.captain}</Text>
                <Text style={styles.teamInfo}>Players: {user.teamId.players?.length || 0}</Text>
                <Text style={styles.teamInfo}>Matches: {user.teamId.matchesPlayed || 0}</Text>
                <Text style={styles.teamInfo}>Wins: {user.teamId.wins || 0}</Text>
              </View>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

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
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: '#ffd700',
    marginBottom: 15,
  },
  userName: {
    fontSize: 24,
    fontFamily: 'Sportypo-Regular',
    color: '#fff',
    marginBottom: 5,
    letterSpacing: 1.5,
  },
  userEmail: {
    fontSize: 16,
    fontFamily: 'Montserrat-Regular',
    color: '#aaa',
  },
  detailsContainer: {
    padding: 20,
    backgroundColor: 'transparent',
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#1a4d3a',
  },
  detailLabel: {
    flex: 1,
    marginLeft: 15,
    fontSize: 16,
    fontFamily: 'Montserrat-Regular',
    color: '#aaa',
  },
  detailValue: {
    flex: 1,
    textAlign: 'right',
    fontSize: 16,
    fontFamily: 'Roboto-Bold',
    color: '#fff',
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Sportypo-Regular',
    color: '#ffd700',
    marginTop: 20,
    marginBottom: 10,
    letterSpacing: 1,
  },
  teamCard: {
    backgroundColor: '#1a4d3a',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
  },
  teamLogo: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 10,
  },
  teamName: {
    fontSize: 18,
    fontFamily: 'Sportypo-Regular',
    color: '#fff',
    marginBottom: 5,
    letterSpacing: 1,
  },
  teamInfo: {
    fontSize: 14,
    fontFamily: 'Roboto-Bold',
    color: '#aaa',
    marginBottom: 3,
  },
});

export default DetailedProfileScreen;