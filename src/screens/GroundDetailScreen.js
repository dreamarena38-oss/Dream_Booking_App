import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  TextInput,
  Modal,
  ImageBackground,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Rating } from 'react-native-ratings';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

import DateTimePicker from '@react-native-community/datetimepicker';
import { Platform } from 'react-native';

export default function GroundDetailScreen({ route, navigation }) {
  const { ground } = route.params;
  const [reviews, setReviews] = useState([]);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [reviewText, setReviewText] = useState('');
  const [rating, setRating] = useState(5);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [loading, setLoading] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDateObj, setSelectedDateObj] = useState(new Date());
  
  const { user, API_BASE_URL } = useAuth();

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/grounds/${ground._id}/reviews`);
      setReviews(response.data);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
  };

  const handleBookGround = async () => {
    if (!selectedDate || !selectedTime) {
      Alert.alert('Error', 'Please select date and time');
      return;
    }

    setLoading(true);
    try {
      await axios.post(`${API_BASE_URL}/bookings`, {
        groundId: ground._id,
        date: selectedDate,
        time: selectedTime,
      });
      
      Alert.alert('Success', 'Ground booked successfully!');
      setShowBookingModal(false);
      setSelectedDate('');
      setSelectedTime('');
    } catch (error) {
      Alert.alert('Error', error.response?.data?.message || 'Failed to book ground');
    } finally {
      setLoading(false);
    }
  };

  const onDateChange = (event, date) => {
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
    }
    if (date) {
      setSelectedDateObj(date);
      setSelectedDate(date.toISOString().split('T')[0]);
    }
  };

  const showDatePickerModal = () => {
    setShowDatePicker(true);
  };

  const handleSubmitReview = async () => {
    if (!reviewText.trim()) {
      Alert.alert('Error', 'Please write a review');
      return;
    }

    setLoading(true);
    try {
      await axios.post(`${API_BASE_URL}/grounds/${ground._id}/reviews`, {
        rating,
        comment: reviewText,
      });
      
      Alert.alert('Success', 'Review submitted successfully!');
      setShowReviewModal(false);
      setReviewText('');
      setRating(5);
      fetchReviews();
    } catch (error) {
      Alert.alert('Error', error.response?.data?.message || 'Failed to submit review');
    } finally {
      setLoading(false);
    }
  };

  const timeSlots = [
    '09:00', '10:00', '11:00', '12:00', '13:00', '14:00',
    '15:00', '16:00', '17:00', '18:00', '19:00', '20:00'
  ];

  return (
    <View style={styles.container}>
      <ScrollView style={styles.container}>
        <Image source={{ uri: ground.image }} style={styles.groundImage} />
        
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.groundName}>{ground.name}</Text>
            <View style={styles.ratingContainer}>
              <Ionicons name="star" size={20} color="#ffd700" />
              <Text style={styles.ratingText}>
                {ground.averageRating?.toFixed(1) || '0.0'}
              </Text>
            </View>
          </View>
          
          <View style={styles.locationContainer}>
            <Ionicons name="location-outline" size={16} color="#888" />
            <Text style={styles.locationText}>{ground.location}</Text>
          </View>

          <View style={styles.detailsContainer}>
            <View style={styles.detailItem}>
              <Ionicons name="resize-outline" size={20} color="#ffd700" />
              <Text style={styles.detailLabel}>Size</Text>
              <Text style={styles.detailValue}>{ground.size}</Text>
            </View>
            
            <View style={styles.detailItem}>
              <Ionicons name="cash-outline" size={20} color="#ffd700" />
              <Text style={styles.detailLabel}>Price</Text>
              <Text style={styles.detailValue}>${ground.pricePerHour}/hour</Text>
            </View>
            
            <View style={styles.detailItem}>
              <Ionicons name="time-outline" size={20} color="#ffd700" />
              <Text style={styles.detailLabel}>Available</Text>
              <Text style={styles.detailValue}>
                {ground.isAvailable ? 'Yes' : 'No'}
              </Text>
            </View>
          </View>

          {ground.features && ground.features.length > 0 && (
            <View style={styles.featuresContainer}>
              <Text style={styles.sectionTitle}>Features</Text>
              <View style={styles.featuresGrid}>
                {ground.features.map((feature, index) => (
                  <View key={index} style={styles.featureItem}>
                    <Ionicons name="checkmark-circle" size={16} color="#4CAF50" />
                    <Text style={styles.featureText}>{feature}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          <View style={styles.actionsContainer}>
            <ImageBackground 
              source={require('./vector.png')} 
              style={[styles.actionButton, styles.bookButton]}
              imageStyle={styles.buttonImage}
            >
              <TouchableOpacity
                style={styles.actionTouchable}
                onPress={() => setShowBookingModal(true)}
                disabled={!ground.isAvailable}
              >
                <Ionicons name="calendar" size={20} color="#ffd700" />
                <Text style={styles.actionButtonText}>Book Ground</Text>
              </TouchableOpacity>
            </ImageBackground>
            
            <ImageBackground 
              source={require('./vector.png')} 
              style={[styles.actionButton, styles.reviewButton]}
              imageStyle={styles.buttonImage}
            >
              <TouchableOpacity
                style={styles.actionTouchable}
                onPress={() => setShowReviewModal(true)}
              >
                <Ionicons name="star-outline" size={20} color="#ffd700" />
                <Text style={styles.actionButtonText}>
                  Write Review
                </Text>
              </TouchableOpacity>
            </ImageBackground>
          </View>

          <View style={styles.reviewsContainer}>
            <Text style={styles.sectionTitle}>
              Reviews ({reviews.length})
            </Text>
            
            {reviews.length > 0 ? (
              reviews.map((review, index) => (
                <View key={index} style={styles.reviewItem}>
                  <View style={styles.reviewHeader}>
                    <Text style={styles.reviewerName}>{review.user?.name}</Text>
                    <View style={styles.reviewRating}>
                      {[...Array(5)].map((_, i) => (
                        <Ionicons
                          key={i}
                          name={i < review.rating ? "star" : "star-outline"}
                          size={14}
                          color="#ffd700"
                        />
                      ))}
                    </View>
                  </View>
                  <Text style={styles.reviewText}>{review.comment}</Text>
                  <Text style={styles.reviewDate}>
                    {new Date(review.createdAt).toLocaleDateString()}
                  </Text>
                </View>
              ))
            ) : (
              <Text style={styles.noReviewsText}>No reviews yet</Text>
            )}
          </View>
        </View>

        {/* Booking Modal */}
        <Modal
          visible={showBookingModal}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setShowBookingModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Book Ground</Text>
              
              <Text style={styles.inputLabel}>Select Date</Text>
              <TouchableOpacity style={styles.dateInputContainer} onPress={showDatePickerModal}>
                <Ionicons name="calendar-outline" size={20} color="#ffd700" style={styles.calendarIcon} />
                <TextInput
                  style={styles.dateInput}
                  placeholder="Select Date"
                  placeholderTextColor="#888"
                  value={selectedDate}
                  editable={false}
                />
              </TouchableOpacity>
              
              {showDatePicker && (
                <DateTimePicker
                  value={selectedDateObj}
                  mode="date"
                  display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                  onChange={onDateChange}
                  minimumDate={new Date()}
                  textColor="#fff"
                  themeVariant="dark"
                />
              )}
              
              <Text style={styles.inputLabel}>Select Time</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={styles.timeSlots}>
                  {timeSlots.map((time) => (
                    <TouchableOpacity
                      key={time}
                      style={[
                        styles.timeSlot,
                        selectedTime === time && styles.selectedTimeSlot
                      ]}
                      onPress={() => setSelectedTime(time)}
                    >
                      <Text style={[
                        styles.timeSlotText,
                        selectedTime === time && styles.selectedTimeSlotText
                      ]}>
                        {time}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>
              
              <View style={styles.modalActions}>
                <TouchableOpacity
                  style={[styles.modalButton, styles.cancelButton]}
                  onPress={() => setShowBookingModal(false)}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                
                <ImageBackground 
                  source={require('./vector.png')} 
                  style={[styles.modalButton, styles.confirmButton]}
                  imageStyle={styles.buttonImage}
                >
                  <TouchableOpacity
                    style={styles.confirmTouchable}
                    onPress={handleBookGround}
                    disabled={loading}
                  >
                    <Text style={styles.confirmButtonText}>
                      {loading ? 'Booking...' : 'Book Now'}
                    </Text>
                  </TouchableOpacity>
                </ImageBackground>
              </View>
            </View>
          </View>
        </Modal>

        {/* Review Modal */}
        <Modal
          visible={showReviewModal}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setShowReviewModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Write a Review</Text>
              
              <Text style={styles.inputLabel}>Rating</Text>
              <Rating
                showRating
                onFinishRating={setRating}
                style={styles.rating}
                startingValue={rating}
                imageSize={30}
                tintColor="#1a4d3a"
              />
              
              <Text style={styles.inputLabel}>Review</Text>
              <TextInput
                style={styles.reviewInput}
                placeholder="Share your experience..."
                placeholderTextColor="#888"
                value={reviewText}
                onChangeText={setReviewText}
                multiline
                numberOfLines={4}
              />
              
              <View style={styles.modalActions}>
                <TouchableOpacity
                  style={[styles.modalButton, styles.cancelButton]}
                  onPress={() => setShowReviewModal(false)}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                
                <ImageBackground 
                  source={require('./vector.png')} 
                  style={[styles.modalButton, styles.confirmButton]}
                  imageStyle={styles.buttonImage}
                >
                  <TouchableOpacity
                    style={styles.confirmTouchable}
                    onPress={handleSubmitReview}
                    disabled={loading}
                  >
                    <Text style={styles.confirmButtonText}>
                      {loading ? 'Submitting...' : 'Submit'}
                    </Text>
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
  },
  groundImage: {
    width: '100%',
    height: 250,
    resizeMode: 'cover',
  },
  content: {
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  groundName: {
    fontSize: 24,
    fontFamily: 'Sportypo-Regular',
    color: '#fff',
    flex: 1,
    letterSpacing: 1.5,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  ratingText: {
    color: '#ffd700',
    fontSize: 16,
    fontFamily: 'LemonMilk-Regular',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginBottom: 20,
  },
  locationText: {
    color: '#888',
    fontSize: 14,
    fontFamily: 'Montserrat-Regular',
  },
  detailsContainer: {
    backgroundColor: '#1a4d3a',
    borderRadius: 15,
    padding: 15,
    marginBottom: 20,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    gap: 10,
  },
  detailLabel: {
    color: '#888',
    fontSize: 14,
    fontFamily: 'Montserrat-Regular',
    flex: 1,
  },
  detailValue: {
    color: '#fff',
    fontSize: 14,
    fontFamily: 'Roboto-Bold',
  },
  featuresContainer: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Sportypo-Regular',
    color: '#ffd700',
    marginBottom: 10,
    letterSpacing: 1,
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a4d3a',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    gap: 5,
  },
  featureText: {
    color: '#fff',
    fontSize: 12,
    fontFamily: 'Montserrat-Regular',
  },
  actionsContainer: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 30,
  },
  actionButton: {
    borderRadius: 10,
    height: 48,
    flex: 1,
    overflow: 'hidden',
  },
  buttonImage: {
    opacity: 0.3,
  },
  actionTouchable: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  bookButton: {
    borderWidth: 2,
    borderColor: '#ffd700',
  },
  reviewButton: {
    borderWidth: 1,
    borderColor: '#ffd700',
  },
  actionButtonText: {
    fontSize: 16,
    fontFamily: 'Montserrat-Regular',
    color: '#ffd700',
    fontWeight: 'bold',
    textShadowColor: '#000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  reviewsContainer: {
    marginBottom: 20,
  },
  reviewItem: {
    backgroundColor: '#1a4d3a',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  reviewerName: {
    color: '#fff',
    fontSize: 14,
    fontFamily: 'Montserrat-Regular',
  },
  reviewRating: {
    flexDirection: 'row',
    gap: 2,
  },
  reviewText: {
    color: '#ccc',
    fontSize: 14,
    fontFamily: 'Montserrat-Regular',
    lineHeight: 20,
    marginBottom: 8,
  },
  reviewDate: {
    color: '#888',
    fontSize: 12,
    fontFamily: 'Montserrat-Regular',
  },
  noReviewsText: {
    color: '#888',
    fontSize: 14,
    fontFamily: 'Montserrat-Regular',
    textAlign: 'center',
    padding: 20,
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
  modalTitle: {
    fontSize: 20,
    fontFamily: 'Sportypo-Regular',
    color: '#fff',
    marginBottom: 20,
    textAlign: 'center',
    letterSpacing: 1,
  },
  inputLabel: {
    color: '#ffd700',
    fontSize: 14,
    fontFamily: 'LemonMilk-Regular',
    marginBottom: 8,
  },
  dateInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0d2818',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 15,
    height: 50,
  },
  calendarIcon: {
    marginRight: 10,
  },
  dateInput: {
    flex: 1,
    color: '#fff',
    fontSize: 16,
    height: 50,
  },
  timeSlots: {
    flexDirection: 'row',
    gap: 10,
    paddingVertical: 10,
  },
  timeSlot: {
    backgroundColor: '#0d2818',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 8,
  },
  selectedTimeSlot: {
    backgroundColor: '#ffd700',
  },
  timeSlotText: {
    color: '#fff',
    fontSize: 14,
    fontFamily: 'Montserrat-Regular',
  },
  selectedTimeSlotText: {
    color: '#000',
    fontFamily: 'LemonMilk-Regular',
  },
  reviewInput: {
    backgroundColor: '#0d2818',
    borderRadius: 8,
    padding: 12,
    color: '#fff',
    fontSize: 16,
    textAlignVertical: 'top',
    marginBottom: 15,
    minHeight: 100,
  },
  rating: {
    marginBottom: 15,
  },
  modalActions: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 10,
  },
  modalButton: {
    flex: 1,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  cancelButton: {
  
    borderWidth: 1,
    borderColor: '#888',
  },
  confirmButton: {
    borderWidth: 2,
    borderColor: '#ffd700',
    overflow: 'hidden',
  },
  confirmTouchable: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#888',
    fontSize: 16,
    fontFamily: 'Montserrat-Regular',
  },
  confirmButtonText: {
    color: '#ffd700',
    fontSize: 16,
    fontFamily: 'LemonMilk-Regular',
    fontWeight: 'bold',
    textShadowColor: '#000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
});