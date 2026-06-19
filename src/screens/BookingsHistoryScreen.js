import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, RefreshControl, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const BookingsHistoryScreen = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { user, API_BASE_URL } = useAuth();

  const fetchBookings = useCallback(async () => {
    try {
      const endpoint = user?.role === 'admin' ? '/bookings' : '/bookings/my-bookings';
      const response = await axios.get(`${API_BASE_URL}${endpoint}`);
      // Sort bookings by date descending
      const sortedBookings = response.data.sort((a, b) => new Date(b.date) - new Date(a.date));
      setBookings(sortedBookings);
    } catch (error) {
      console.log('Error fetching bookings:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [API_BASE_URL, user]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchBookings();
  };

  const renderBookingItem = ({ item }) => (
    <View style={styles.bookingItem}>
      <View style={styles.bookingHeader}>
        <Text style={styles.groundName}>{item.ground?.name || 'Unknown Ground'}</Text>
        <View style={[
          styles.statusBadge,
          { backgroundColor: item.status === 'confirmed' ? '#4CAF50' : item.status === 'pending' ? '#FFD700' : '#F44336' }
        ]}>
          <Text style={styles.statusText}>{item.status?.toUpperCase() || 'PENDING'}</Text>
        </View>
      </View>
      <View style={styles.bookingDetails}>
        <View style={styles.detailRow}>
          <Ionicons name="calendar-outline" size={16} color="#ffd700" />
          <Text style={styles.detailText}>{new Date(item.date).toLocaleDateString()}</Text>
        </View>
        <View style={styles.detailRow}>
          <Ionicons name="time-outline" size={16} color="#ffd700" />
          <Text style={styles.detailText}>{item.time}</Text>
        </View>
        {item.ground?.location && (
          <View style={styles.detailRow}>
            <Ionicons name="location-outline" size={16} color="#ffd700" />
            <Text style={styles.detailText}>{item.ground.location}</Text>
          </View>
        )}
        {user?.role === 'admin' && item.user?.name && (
          <View style={styles.detailRow}>
            <Ionicons name="person-outline" size={16} color="#ffd700" />
            <Text style={styles.detailText}>Customer: {item.user.name}</Text>
          </View>
        )}
      </View>
    </View>
  );

  if (loading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#ffd700" />
        <Text style={styles.loadingText}>Loading bookings...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={bookings}
        renderItem={renderBookingItem}
        keyExtractor={item => item._id}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#ffd700" colors={['#ffd700']} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="calendar-outline" size={64} color="#2a5d4a" />
            <Text style={styles.emptyText}>No bookings found</Text>
            <Text style={styles.emptySubtext}>Book a ground to see it here!</Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0d2818',
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#0d2818',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#ffd700',
    marginTop: 10,
    fontFamily: 'Montserrat-Regular',
  },
  title: {
    fontSize: 28,
    fontFamily: 'Sportypo-Regular',
    color: '#ffd700',
    marginBottom: 20,
    letterSpacing: 2,
  },
  listContainer: {
    paddingBottom: 20,
  },
  bookingItem: {
    backgroundColor: '#1a4d3a',
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#2a5d4a',
  },
  bookingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  groundName: {
    fontSize: 20,
    fontFamily: 'Sportypo-Regular',
    color: '#fff',
    letterSpacing: 0.5,
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginLeft: 10,
  },
  statusText: {
    fontSize: 10,
    fontFamily: 'LemonMilk-Regular',
    color: '#0d2818',
  },
  bookingDetails: {
    borderTopWidth: 1,
    borderTopColor: '#2a5d4a',
    paddingTop: 12,
    gap: 8,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailText: {
    marginLeft: 10,
    fontFamily: 'Montserrat-Regular',
    color: '#eee',
    fontSize: 14,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 100,
  },
  emptyText: {
    marginTop: 15,
    fontSize: 18,
    fontFamily: 'Sportypo-Regular',
    color: '#ffd700',
  },
  emptySubtext: {
    marginTop: 5,
    fontSize: 14,
    fontFamily: 'LemonMilk-Regular',
    color: '#888',
  },
});

export default BookingsHistoryScreen;