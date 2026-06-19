import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  RefreshControl,
  ImageBackground,
} from 'react-native';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { Video } from 'expo-av';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
  const [news, setNews] = useState([]);
  const [leagues, setLeagues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const { user, API_BASE_URL } = useAuth();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [newsResponse, leaguesResponse] = await Promise.all([
        axios.get(`${API_BASE_URL}/news`),
        axios.get(`${API_BASE_URL}/leagues`)
      ]);

      setNews(newsResponse.data);
      setLeagues(leaguesResponse.data);
    } catch (error) {
      console.log('Error fetching data:', error);
      Alert.alert('Error', 'Failed to load data');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  const handleJoinLeague = async (leagueId) => {
    try {
      await axios.post(`${API_BASE_URL}/leagues/${leagueId}/join`);
      Alert.alert('Success', 'Join request sent successfully!');
      fetchData(); // Refresh data
    } catch (error) {
      Alert.alert('Error', error.response?.data?.message || 'Failed to join league');
    }
  };

  const renderNewsItem = (item, index) => {
    return (
      <View key={index} style={styles.newsItem}>
        {item.type === 'text' && (
          <View style={styles.textNewsContainer}>
            <Text style={styles.newsText}>{item.content}</Text>
          </View>
        )}

        {item.type === 'image' && (
          <Image source={{ uri: item.content }} style={styles.newsImage} />
        )}

        {item.type === 'video' && (
          <Video
            source={{ uri: item.content }}
            style={styles.newsVideo}
            useNativeControls
            resizeMode="contain"
            shouldPlay={false}
          />
        )}

        <View style={styles.newsFooter}>
          <Text style={styles.newsDate}>
            {new Date(item.createdAt).toLocaleDateString()}
          </Text>
        </View>
      </View>
    );
  };

  const renderLeagueItem = (league, index) => {
    const canJoin = user?.role === 'team' && !user?.currentLeague;

    return (
      <View key={index} style={styles.leagueItem}>
        <View style={styles.leagueHeader}>
          <Text style={styles.leagueName}>{league.name}</Text>
          <View style={styles.leagueStatus}>
            <Ionicons
              name={league.status === 'active' ? 'play-circle' : 'pause-circle'}
              size={16}
              color={league.status === 'active' ? '#4CAF50' : '#ff9626'}
            />
            <Text style={[
              styles.leagueStatusText,
              { color: league.status === 'active' ? '#4CAF50' : '#ff9626' }
            ]}>
              {league.status.toUpperCase()}
            </Text>
          </View>
        </View>

        <Text style={styles.leagueDescription}>{league.description}</Text>

        <View style={styles.leagueInfo}>
          <View style={styles.leagueInfoItem}>
            <Ionicons name="people-outline" size={16} color="#888" />
            <Text style={styles.leagueInfoText}>
              {league.teams?.length || 0} Teams
            </Text>
          </View>
          <View style={styles.leagueInfoItem}>
            <Ionicons name="calendar-outline" size={16} color="#888" />
            <Text style={styles.leagueInfoText}>
              {new Date(league.startDate).toLocaleDateString()}
            </Text>
          </View>
        </View>

        {canJoin && (
          <ImageBackground
            source={require('./vector.png')}
            style={styles.joinButton}
            imageStyle={styles.buttonImage}
          >
            <TouchableOpacity
              style={styles.buttonTouchable}
              onPress={() => handleJoinLeague(league._id)}
            >
              <Text style={styles.joinButtonText}>Join League</Text>
            </TouchableOpacity>
          </ImageBackground>
        )}
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>What's New</Text>
          {news.length > 0 ? (
            news.map((item, index) => renderNewsItem(item, index))
          ) : (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No news available</Text>
            </View>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ongoing Leagues</Text>
          {leagues.length > 0 ? (
            leagues.map((league, index) => renderLeagueItem(league, index))
          ) : (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No leagues available</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0d2818',
  },
  scrollView: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  heading: {
    fontFamily: 'Bebas Neue, Anton, sans-serif',
    fontSize: 24,
  },
  bodyText: {
    fontFamily: 'Montserrat, Poppins, sans-serif',
    fontSize: 16,
  },
  numbers: {
    fontFamily: 'LemonMilk-Regular',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0d2818',
  },
  loadingText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Montserrat-Regular',
  },
  sectionTitle: {
    fontSize: 24,
    fontFamily: 'Sportypo-Regular',
    color: '#ffd700',
    marginBottom: 15,
    letterSpacing: 1.5,
  },
  emptyText: {
    color: '#888',
    fontSize: 16,
    fontFamily: 'Montserrat-Regular',
  },
  newsText: {
    fontSize: 16,
    fontFamily: 'Montserrat-Regular',
    color: '#fff',
  },
  newsDate: {
    fontSize: 14,
    fontFamily: 'LemonMilk-Regular',
    color: '#888',
  },
  leagueName: {
    fontSize: 18,
    fontFamily: 'Sportypo-Regular',
    color: '#fff',
    letterSpacing: 1,
  },
  leagueStatusText: {
    fontSize: 12,
    fontFamily: 'LemonMilk-Regular',
  },
  leagueDescription: {
    fontSize: 14,
    fontFamily: 'Montserrat-Regular',
    color: '#aaa',
    marginVertical: 10,
  },
  leagueInfoText: {
    fontSize: 12,
    fontFamily: 'LemonMilk-Regular',
    color: '#888',
    marginLeft: 5,
  },
  joinButtonText: {
    fontSize: 16,
    fontFamily: 'Montserrat-Regular',
    color: '#000',
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontFamily: 'Sportypo-Regular',
    color: '#ffd700',
    marginBottom: 15,
  },
  newsItem: {
    backgroundColor: '#FFD700',
    borderRadius: 10,
    marginBottom: 15,
    overflow: 'hidden',
  },
  textNewsContainer: {
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    padding: 15,
  },
  newsText: {
    color: '#000',
    fontSize: 16,
    fontFamily: 'Montserrat-Regular',
    lineHeight: 24,
  },
  newsImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  newsVideo: {
    width: '100%',
    height: 200,
  },
  newsFooter: {
    padding: 15,
  },
  newsDate: {
    color: '#888',
    fontSize: 12,
    fontFamily: 'LemonMilk-Regular',
  },
  leagueItem: {
    backgroundColor: '#1a4d3a',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
  },
  leagueHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  leagueName: {
    fontSize: 18,
    fontFamily: 'Sportypo-Regular',
    color: '#fff',
    flex: 1,
  },
  leagueStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  leagueStatusText: {
    fontSize: 12,
    fontFamily: 'LemonMilk-Regular',
  },
  leagueDescription: {
    color: '#fff',
    fontSize: 14,
    fontFamily: 'LemonMilk-Regular',
    marginBottom: 10,
    lineHeight: 20,
  },
  leagueInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  leagueInfoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  leagueInfoText: {
    color: '#888',
    fontSize: 12,
    fontFamily: 'LemonMilk-Regular',
  },
  joinButton: {
    borderRadius: 8,
    height: 40,
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
    paddingHorizontal: 20,
  },
  joinButtonText: {
    color: '#ffd700',
    fontSize: 14,
    fontFamily: 'LemonMilk-Regular',
    fontWeight: 'bold',
    textShadowColor: '#000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  emptyContainer: {
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    color: '#888',
    fontSize: 16,
    fontFamily: 'LemonMilk-Regular',
  },
});