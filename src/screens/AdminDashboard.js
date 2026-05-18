import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Modal,
  TextInput,
  FlatList,
  Platform,
  ImageBackground,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalTeams: 0,
    totalGrounds: 0,
    totalBookings: 0,
  });
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [teams, setTeams] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [grounds, setGrounds] = useState([]);
  const [leagues, setLeagues] = useState([]);
  const [news, setNews] = useState([]);
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const { logout, API_BASE_URL } = useAuth();

  const pickImage = async (field) => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (permissionResult.granted === false) {
        Alert.alert('Permission Required', 'Permission to access camera roll is required!');
        return;
      }

      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [16, 9],
        quality: 0.7,
        base64: true,
      });

      if (!result.canceled && result.assets[0]) {
        const base64Image = `data:image/jpeg;base64,${result.assets[0].base64}`;
        updateFormData(field, base64Image);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  // Format date to YYYY-MM-DD
  const formatDate = (date) => {
    if (!(date instanceof Date) || isNaN(date)) return '';
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const fetchStats = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      };
      const response = await axios.get(`${API_BASE_URL}/admin/stats`, config);
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error.response?.data || error.message);
      if (error.response?.status === 403) {
        Alert.alert('Access Denied', 'Admin access required. Please login with valid admin credentials.');
      } else if (error.response?.status === 401) {
        Alert.alert('Session Expired', 'Your session has expired. Please login again.');
        logout();
      } else {
        Alert.alert('Error', 'Failed to load admin statistics');
      }
    }
  };

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Logout', style: 'destructive', onPress: logout },
    ]);
  };

  const openModal = (type, item = null) => {
    setModalType(type);
    setEditMode(!!item);
    setEditingItem(item);
    setFormData(
      item
        ? {
          ...item,
          startDate: item.startDate ? new Date(item.startDate) : null,
          endDate: item.endDate ? new Date(item.endDate) : null,
        }
        : {}
    );
    setShowStartPicker(false);
    setShowEndPicker(false);

    if (type === 'bookings') fetchBookings();
    else if (type === 'teams') fetchTeams();
    else if (type === 'customers') fetchCustomers();
    else if (type === 'grounds') fetchGrounds();
    else if (type === 'leagues') fetchLeagues();
    else if (type === 'news') fetchNews();

    setShowModal(true);
  };

  const fetchBookings = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const response = await axios.get(`${API_BASE_URL}/bookings`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBookings(response.data);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      Alert.alert('Error', 'Failed to load bookings');
    }
  };

  const fetchTeams = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const response = await axios.get(`${API_BASE_URL}/teams`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTeams(response.data);
    } catch (error) {
      console.error('Error fetching teams:', error);
      Alert.alert('Error', 'Failed to load teams');
    }
  };

  const fetchCustomers = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const response = await axios.get(`${API_BASE_URL}/auth/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCustomers(response.data);
    } catch (error) {
      console.error('Error fetching customers:', error);
      Alert.alert('Error', 'Failed to load customers');
    }
  };

  const fetchGrounds = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const response = await axios.get(`${API_BASE_URL}/grounds`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setGrounds(response.data);
    } catch (error) {
      console.error('Error fetching grounds:', error);
      Alert.alert('Error', 'Failed to load grounds');
    }
  };

  const fetchLeagues = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const response = await axios.get(`${API_BASE_URL}/leagues`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setLeagues(response.data);
    } catch (error) {
      console.error('Error fetching leagues:', error);
      Alert.alert('Error', 'Failed to load leagues');
    }
  };

  const fetchNews = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const response = await axios.get(`${API_BASE_URL}/news`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNews(response.data);
    } catch (error) {
      console.error('Error fetching news:', error);
      Alert.alert('Error', 'Failed to load news');
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      console.log('Form data before submit:', formData); // Debug log

      const token = await AsyncStorage.getItem('userToken');
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      };

      // Validate form data based on modalType
      if (modalType === 'league') {
        if (!formData.name || !formData.startDate || !formData.endDate) {
          Alert.alert('Error', 'Please fill in all required fields: name, start date, and end date');
          setLoading(false);
          return;
        }
        if (!(formData.startDate instanceof Date) || isNaN(formData.startDate)) {
          Alert.alert('Error', 'Invalid start date. Please select a valid date.');
          setLoading(false);
          return;
        }
        if (!(formData.endDate instanceof Date) || isNaN(formData.endDate)) {
          Alert.alert('Error', 'Invalid end date. Please select a valid date.');
          setLoading(false);
          return;
        }
        if (formData.endDate <= formData.startDate) {
          Alert.alert('Error', 'End date must be after start date');
          setLoading(false);
          return;
        }
      } else if (modalType === 'news') {
        if (!formData.type || typeof formData.type !== 'string' || formData.type.trim() === '') {
          Alert.alert('Error', 'Please select a news type');
          setLoading(false);
          return;
        }
        if (!formData.content || typeof formData.content !== 'string' || formData.content.trim() === '') {
          Alert.alert('Error', 'Please fill in all required fields: type and content');
          setLoading(false);
          return;
        }
        if (!['text', 'image', 'video'].includes(formData.type.trim())) {
          Alert.alert('Error', 'Invalid news type selected');
          setLoading(false);
          return;
        }
      }

      let endpoint = '';
      let method = editMode ? 'put' : 'post';
      let requestData = { ...formData };

      // Clean up data for news
      if (modalType === 'news') {
        requestData = {
          type: formData.type.trim(),
          content: formData.content.trim()
        };
      }

      // Format dates for league
      if (modalType === 'league') {
        requestData = {
          ...formData,
          startDate: formatDate(formData.startDate),
          endDate: formatDate(formData.endDate),
        };
      }

      switch (modalType) {
        case 'team':
          endpoint = editMode ? `/teams/${editingItem._id}` : '/teams';
          break;
        case 'ground':
          endpoint = editMode ? `/grounds/${editingItem._id}` : '/grounds';
          break;
        case 'league':
          endpoint = editMode ? `/leagues/${editingItem._id}` : '/leagues';
          break;
        case 'news':
          endpoint = editMode ? `/news/${editingItem._id}` : '/news';
          break;
        default:
          setLoading(false);
          return;
      }

      console.log('Sending request body:', requestData); // Debug log

      console.log('Making request to:', `${API_BASE_URL}${endpoint}`); // Debug log
      const response = await axios[method](`${API_BASE_URL}${endpoint}`, requestData, config);
      console.log('Response received:', response.data); // Debug log

      Alert.alert('Success', `${modalType} ${editMode ? 'updated' : 'created'} successfully!`);
      setShowModal(false);
      setEditMode(false);
      setEditingItem(null);
      setFormData({});
      fetchStats();

      if (modalType === 'ground') fetchGrounds();
      if (modalType === 'league') fetchLeagues();
      if (modalType === 'team') fetchTeams();
      if (modalType === 'news') fetchNews();
    } catch (error) {
      console.error('Error saving item:', error);
      if (error.response?.status === 403) {
        Alert.alert('Access Denied', 'Admin access required for this operation.');
      } else {
        Alert.alert('Error', error.response?.data?.message || `Failed to ${editMode ? 'update' : 'create'}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const deleteItem = async (type, id) => {
    Alert.alert('Confirm Delete', `Are you sure you want to delete this ${type}?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            const token = await AsyncStorage.getItem('userToken');
            let endpoint = '';

            switch (type) {
              case 'team':
                endpoint = `/teams/${id}`;
                break;
              case 'customer':
                endpoint = `/auth/users/${id}`;
                break;
              case 'booking':
                endpoint = `/bookings/${id}`;
                break;
              case 'ground':
                endpoint = `/grounds/${id}`;
                break;
              case 'league':
                endpoint = `/leagues/${id}`;
                break;
              case 'news':
                endpoint = `/news/${id}`;
                break;
              default:
                return;
            }

            await axios.delete(`${API_BASE_URL}${endpoint}`, {
              headers: { Authorization: `Bearer ${token}` },
            });

            switch (type) {
              case 'team':
                fetchTeams();
                break;
              case 'customer':
                fetchCustomers();
                break;
              case 'booking':
                fetchBookings();
                break;
              case 'ground':
                fetchGrounds();
                break;
              case 'league':
                fetchLeagues();
                break;
              case 'news':
                fetchNews();
                break;
            }

            fetchStats();
            Alert.alert('Success', `${type} deleted successfully`);
          } catch (error) {
            console.error('Error deleting item:', error);
            Alert.alert('Error', `Failed to delete ${type}`);
          }
        },
      },
    ]);
  };

  const updateFormData = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  // Handle date picker changes
  const onChangeStartDate = (event, selectedDate) => {
    setShowStartPicker(Platform.OS === 'ios');
    if (selectedDate && !isNaN(selectedDate)) {
      updateFormData('startDate', selectedDate);
      // Reset endDate if it's before the new startDate
      if (formData.endDate && selectedDate >= formData.endDate) {
        updateFormData('endDate', null);
      }
    }
  };

  const onChangeEndDate = (event, selectedDate) => {
    setShowEndPicker(Platform.OS === 'ios');
    if (selectedDate && !isNaN(selectedDate)) {
      updateFormData('endDate', selectedDate);
    }
  };

  const adminOptions = [
    {
      title: 'Manage Bookings',
      icon: 'calendar-outline',
      color: '#4CAF50',
      onPress: () => openModal('bookings'),
    },
    {
      title: 'Manage Grounds',
      icon: 'football-outline',
      color: '#2196F3',
      onPress: () => openModal('grounds'),
    },
    {
      title: 'Manage Leagues',
      icon: 'trophy-outline',
      color: '#FF9800',
      onPress: () => openModal('leagues'),
    },
    {
      title: 'Create News',
      icon: 'newspaper-outline',
      color: '#9C27B0',
      onPress: () => openModal('news'),
    },
    {
      title: 'Manage Teams',
      icon: 'people-outline',
      color: '#F44336',
      onPress: () => openModal('teams'),
    },
    {
      title: 'Manage Users',
      icon: 'person-outline',
      color: '#607D8B',
      onPress: () => openModal('customers'),
    },
  ];

  const renderListItem = (item, type) => {
    let title = '';
    let subtitle = '';

    switch (type) {
      case 'booking':
        title = `${item.ground?.name || 'Unknown Ground'}`;
        subtitle = `${item.user?.name} - ${new Date(item.date).toLocaleDateString()} at ${item.time}`;
        break;
      case 'team':
        title = item.name;
        subtitle = `Captain: ${item.captain} | Players: ${item.players?.length || 0}`;
        break;
      case 'customer':
        title = item.name;
        subtitle = `${item.email} | Role: ${item.role}`;
        break;
      case 'ground':
        title = item.name;
        subtitle = `${item.location} | ${item.size} | $${item.pricePerHour}/hour`;
        break;
      case 'league':
        title = item.name;
        subtitle = `${item.status} | Teams: ${item.teams?.length || 0}`;
        break;
      case 'news':
        title = item.type;
        subtitle = item.content.substring(0, 50) + (item.content.length > 50 ? '...' : '');
        break;
    }

    return (
      <View key={item._id} style={styles.listItem}>
        <View style={styles.listItemContent}>
          <Text style={styles.listItemTitle}>{title}</Text>
          <Text style={styles.listItemSubtitle}>{subtitle}</Text>
        </View>
        <View style={styles.listItemActions}>
          {(type === 'ground' || type === 'league' || type === 'news') && (
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => {
                setShowModal(false);
                setTimeout(() => openModal(type, item), 100);
              }}
            >
              <Ionicons name="pencil-outline" size={20} color="#2196F3" />
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => deleteItem(type, item._id)}
          >
            <Ionicons name="trash-outline" size={20} color="#F44336" />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderModalContent = () => {
    switch (modalType) {
      case 'bookings':
        return (
          <View style={styles.listContainer}>
            <Text style={styles.listTitle}>All Bookings</Text>
            <FlatList
              data={bookings}
              renderItem={({ item }) => renderListItem(item, 'booking')}
              keyExtractor={(item) => item._id}
              style={styles.flatList}
            />
          </View>
        );
      case 'teams':
        return (
          <View style={styles.listContainer}>
            <Text style={styles.listTitle}>All Teams</Text>
            <FlatList
              data={teams}
              renderItem={({ item }) => renderListItem(item, 'team')}
              keyExtractor={(item) => item._id}
              style={styles.flatList}
            />
          </View>
        );
      case 'customers':
        return (
          <View style={styles.listContainer}>
            <Text style={styles.listTitle}>All Customers</Text>
            <FlatList
              data={customers}
              renderItem={({ item }) => renderListItem(item, 'customer')}
              keyExtractor={(item) => item._id}
              style={styles.flatList}
            />
          </View>
        );
      case 'grounds':
        return (
          <View style={styles.listContainer}>
            <View style={styles.listHeader}>
              <Text style={styles.listTitle}>All Grounds</Text>
              <ImageBackground
                source={require('./vector.png')}
                style={styles.addButton}
                imageStyle={styles.buttonImage}
              >
                <TouchableOpacity
                  style={styles.addButtonTouchable}
                  onPress={() => {
                    setShowModal(false);
                    setTimeout(() => openModal('ground'), 100);
                  }}
                >
                  <Ionicons name="add" size={24} color="#6200ee" />
                  <Text style={styles.addButtonText}>Add Ground</Text>
                </TouchableOpacity>
              </ImageBackground>
            </View>
            <FlatList
              data={grounds}
              renderItem={({ item }) => renderListItem(item, 'ground')}
              keyExtractor={(item) => item._id}
              style={styles.flatList}
            />
          </View>
        );
      case 'leagues':
        return (
          <View style={styles.listContainer}>
            <View style={styles.listHeader}>
              <Text style={styles.listTitle}>All Leagues</Text>
              <ImageBackground
                source={require('./vector.png')}
                style={styles.addButton}
                imageStyle={styles.buttonImage}
              >
                <TouchableOpacity
                  style={styles.addButtonTouchable}
                  onPress={() => {
                    setShowModal(false);
                    setTimeout(() => openModal('league'), 100);
                  }}
                >
                  <Ionicons name="add" size={24} color="#6200ee" />
                  <Text style={styles.addButtonText}>Add League</Text>
                </TouchableOpacity>
              </ImageBackground>
            </View>
            <FlatList
              data={leagues}
              renderItem={({ item }) => renderListItem(item, 'league')}
              keyExtractor={(item) => item._id}
              style={styles.flatList}
            />
          </View>
        );
      case 'news':
        return (
          <View style={styles.listContainer}>
            <View style={styles.listHeader}>
              <Text style={styles.listTitle}>All News</Text>
              <ImageBackground
                source={require('./vector.png')}
                style={styles.addButton}
                imageStyle={styles.buttonImage}
              >
                <TouchableOpacity
                  style={styles.addButtonTouchable}
                  onPress={() => {
                    setShowModal(false);
                    setTimeout(() => openModal('news'), 100);
                  }}
                >
                  <Ionicons name="add" size={24} color="#6200ee" />
                  <Text style={styles.addButtonText}>Add News</Text>
                </TouchableOpacity>
              </ImageBackground>
            </View>
            <FlatList
              data={news}
              renderItem={({ item }) => renderListItem(item, 'news')}
              keyExtractor={(item) => item._id}
              style={styles.flatList}
            />
          </View>
        );
      case 'team':
        return (
          <>
            <TextInput
              style={styles.input}
              placeholder="Team Name"
              placeholderTextColor="#888"
              value={formData.name || ''}
              onChangeText={(value) => updateFormData('name', value)}
            />
            <TextInput
              style={styles.input}
              placeholder="Captain Name"
              placeholderTextColor="#888"
              value={formData.captain || ''}
              onChangeText={(value) => updateFormData('captain', value)}
            />
            {!editMode && (
              <TextInput
                style={styles.input}
                placeholder="Team Password"
                placeholderTextColor="#888"
                value={formData.password || ''}
                onChangeText={(value) => updateFormData('password', value)}
                secureTextEntry
              />
            )}
            <TouchableOpacity
              style={styles.imagePickerButton}
              onPress={() => pickImage('logo')}
            >
              <Ionicons name="image-outline" size={24} color="#6200ee" />
              <Text style={styles.imagePickerText}>
                {formData.logo ? 'Change Logo' : 'Upload Team Logo'}
              </Text>
            </TouchableOpacity>
            {formData.logo && (
              <Image source={{ uri: formData.logo }} style={styles.imagePreview} />
            )}
          </>
        );
      case 'ground':
        return (
          <>
            <TextInput
              style={styles.input}
              placeholder="Ground Name"
              placeholderTextColor="#888"
              value={formData.name || ''}
              onChangeText={(value) => updateFormData('name', value)}
            />
            <TextInput
              style={styles.input}
              placeholder="Location"
              placeholderTextColor="#888"
              value={formData.location || ''}
              onChangeText={(value) => updateFormData('location', value)}
            />
            <TextInput
              style={styles.input}
              placeholder="Size (e.g., 11v11, 7v7)"
              placeholderTextColor="#888"
              value={formData.size || ''}
              onChangeText={(value) => updateFormData('size', value)}
            />
            <TextInput
              style={styles.input}
              placeholder="Price per Hour"
              placeholderTextColor="#888"
              value={formData.pricePerHour?.toString() || ''}
              onChangeText={(value) => updateFormData('pricePerHour', value)}
              keyboardType="numeric"
            />
            <TouchableOpacity
              style={styles.imagePickerButton}
              onPress={() => pickImage('image')}
            >
              <Ionicons name="image-outline" size={24} color="#6200ee" />
              <Text style={styles.imagePickerText}>
                {formData.image ? 'Change Ground Image' : 'Upload Ground Image'}
              </Text>
            </TouchableOpacity>
            {formData.image && (
              <Image source={{ uri: formData.image }} style={styles.imagePreview} />
            )}
            <TextInput
              style={styles.input}
              placeholder="Features (comma separated)"
              placeholderTextColor="#888"
              value={Array.isArray(formData.features) ? formData.features.join(', ') : formData.features || ''}
              onChangeText={(value) => updateFormData('features', value.split(',').map((item) => item.trim()))}
            />
          </>
        );
      case 'league':
        return (
          <>
            <TextInput
              style={styles.input}
              placeholder="League Name"
              placeholderTextColor="#888"
              value={formData.name || ''}
              onChangeText={(value) => updateFormData('name', value)}
            />
            <TextInput
              style={styles.input}
              placeholder="Description"
              placeholderTextColor="#888"
              value={formData.description || ''}
              onChangeText={(value) => updateFormData('description', value)}
              multiline
            />
            <View style={styles.dateContainer}>
              <TextInput
                style={styles.input}
                placeholder="Start Date (YYYY-MM-DD)"
                placeholderTextColor="#888"
                value={formData.startDate ? formatDate(formData.startDate) : ''}
                editable={false}
              />
              <TouchableOpacity onPress={() => setShowStartPicker(true)}>
                <Ionicons name="calendar-outline" size={24} color="#6200ee" />
              </TouchableOpacity>
            </View>
            {showStartPicker && (
              <DateTimePicker
                value={formData.startDate || new Date()}
                mode="date"
                display="default"
                onChange={onChangeStartDate}
                minimumDate={new Date()}
                maximumDate={new Date(2100, 11, 31)}
              />
            )}
            <View style={styles.dateContainer}>
              <TextInput
                style={styles.input}
                placeholder="End Date (YYYY-MM-DD)"
                placeholderTextColor="#888"
                value={formData.endDate ? formatDate(formData.endDate) : ''}
                editable={false}
              />
              <TouchableOpacity onPress={() => setShowEndPicker(true)}>
                <Ionicons name="calendar-outline" size={24} color="#6200ee" />
              </TouchableOpacity>
            </View>
            {showEndPicker && (
              <DateTimePicker
                value={formData.endDate || (formData.startDate || new Date())}
                mode="date"
                display="default"
                onChange={onChangeEndDate}
                minimumDate={formData.startDate || new Date()}
                maximumDate={new Date(2100, 11, 31)}
              />
            )}
          </>
        );
      case 'news':
        return (
          <>
            <View style={styles.pickerContainer}>
              <Ionicons name="list-outline" size={20} color="#888" style={styles.inputIcon} />
              <Picker
                selectedValue={formData.type || ''}
                style={styles.picker}
                onValueChange={(value) => updateFormData('type', value)}
                dropdownIconColor="#888"
              >
                <Picker.Item label="Select news type..." value="" color="#888" />
                <Picker.Item label="Text" value="text" color="#fff" />
                <Picker.Item label="Image" value="image" color="#fff" />
                <Picker.Item label="Video" value="video" color="#fff" />
              </Picker>
            </View>
            {formData.type === 'image' ? (
              <View style={styles.newsImageContainer}>
                <TouchableOpacity
                  style={styles.imagePickerButton}
                  onPress={() => pickImage('content')}
                >
                  <Ionicons name="image-outline" size={24} color="#6200ee" />
                  <Text style={styles.imagePickerText}>
                    {formData.content ? 'Change News Image' : 'Upload News Image'}
                  </Text>
                </TouchableOpacity>
                {formData.content && (
                  <Image source={{ uri: formData.content }} style={styles.imagePreview} />
                )}
              </View>
            ) : (
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder={
                  !formData.type || formData.type === ''
                    ? "Please select a news type first..."
                    : formData.type === 'text'
                      ? "Enter your news text here..."
                      : "Enter video URL (e.g., https://example.com/video.mp4)"
                }
                placeholderTextColor="#888"
                value={formData.content || ''}
                onChangeText={(value) => updateFormData('content', value)}
                multiline
                numberOfLines={4}
                editable={formData.type && formData.type !== ''}
              />
            )}
          </>
        );
      default:
        return null;
    }
  };

  const isListModal = ['bookings', 'teams', 'customers', 'grounds', 'leagues', 'news'].includes(modalType);
  const isFormModal = ['team', 'ground', 'league', 'news'].includes(modalType);

  return (
    <View style={styles.container}>
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <Text style={styles.headerTitle}>Admin Dashboard</Text>
            <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
              <Ionicons name="log-out-outline" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Ionicons name="people-outline" size={30} color="#4CAF50" />
            <Text style={styles.statNumber}>{stats.totalUsers}</Text>
            <Text style={styles.statLabel}>Users</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="shield-outline" size={30} color="#2196F3" />
            <Text style={styles.statNumber}>{stats.totalTeams}</Text>
            <Text style={styles.statLabel}>Teams</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="football-outline" size={30} color="#FF9800" />
            <Text style={styles.statNumber}>{stats.totalGrounds}</Text>
            <Text style={styles.statLabel}>Grounds</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="calendar-outline" size={30} color="#9C27B0" />
            <Text style={styles.statNumber}>{stats.totalBookings}</Text>
            <Text style={styles.statLabel}>Bookings</Text>
          </View>
        </View>

        <View style={styles.optionsContainer}>
          <Text style={styles.sectionTitle}>Management Options</Text>
          {adminOptions.map((option, index) => (
            <ImageBackground
              key={index}
              source={require('./vector.png')}
              style={styles.optionCard}
              imageStyle={styles.buttonImage}
            >
              <TouchableOpacity style={styles.optionTouchable} onPress={option.onPress}>
                <View style={[styles.optionIcon, { backgroundColor: option.color }]}>
                  <Ionicons name={option.icon} size={24} color="#fff" />
                </View>
                <Text style={styles.optionTitle}>{option.title}</Text>
                <Ionicons name="chevron-forward" size={20} color="#FFD700" />
              </TouchableOpacity>
            </ImageBackground>
          ))}
        </View>

        <Modal
          visible={showModal}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setShowModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={[styles.modalContent, isListModal && styles.modalContentLarge]}>
              <ScrollView style={styles.modalForm}>{renderModalContent()}</ScrollView>
              {isFormModal && (
                <View style={styles.modalActions}>
                  <TouchableOpacity
                    style={[styles.modalButton, styles.cancelButton]}
                    onPress={() => setShowModal(false)}
                  >
                    <Text style={styles.cancelButtonText}>Cancel</Text>
                  </TouchableOpacity>
                  <ImageBackground
                    source={require('./vector.png')}
                    style={[styles.modalButton, styles.confirmButton]}
                    imageStyle={styles.buttonImage}
                  >
                    <TouchableOpacity
                      style={styles.confirmButtonTouchable}
                      onPress={handleSubmit}
                      disabled={loading}
                    >
                      <Text style={styles.confirmButtonText}>
                        {loading ? (editMode ? 'Updating...' : 'Creating...') : (editMode ? 'Update' : 'Create')}
                      </Text>
                    </TouchableOpacity>
                  </ImageBackground>
                </View>
              )}
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
  contentContainer: {
    paddingBottom: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: '#000',
    paddingVertical: 24,
    paddingHorizontal: 20,
    borderRadius: 12,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  headerTitle: {
    fontSize: 22,
    fontFamily: 'Sportypo-Regular',
    color: '#FFD700',
    letterSpacing: 0.5,
  },
  logoutButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    marginBottom: 24,
  },
  statCard: {
    width: '48%',
    padding: 24,
    borderRadius: 16,
    marginBottom: 16,
    elevation: 4,
    backgroundColor: '#0d2818',
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontFamily: 'LemonMilk-Regular',
    color: '#FFFFFF',
    marginTop: 10,
  },
  statLabel: {
    fontSize: 14,
    fontFamily: 'Montserrat-Regular',
    color: '#666',
    marginTop: 5,
  },
  optionsContainer: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Sportypo-Regular',
    color: '#FFD700',
    marginBottom: 15,
  },
  optionCard: {
    borderRadius: 15,
    borderColor: '#FFD700',
    overflow: 'hidden',
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonImage: {
    opacity: 0.3,
  },
  optionTouchable: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  optionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  optionTitle: {
    flex: 1,
    fontSize: 18,
    fontFamily: 'Montserrat-Regular',
    color: '#FFD700',
    fontWeight: 'bold',
    textShadowColor: '#000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    width: '90%',
    maxHeight: '80%',
  },
  modalContentLarge: {
    width: '95%',
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontFamily: 'Sportypo-Regular',
    color: '#6200ee',
    flex: 1,
  },
  closeButton: {
    padding: 4,
  },
  modalForm: {
    maxHeight: 400,
  },
  input: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 12,
    color: '#333',
    fontSize: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  pickerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    marginBottom: 16,
    paddingHorizontal: 12,
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  inputIcon: {
    marginRight: 10,
  },
  picker: {
    flex: 1,
    color: '#333',
    height: 50,
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
  },
  modalButton: {
    flex: 1,
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#888',
  },
  confirmButton: {
    borderWidth: 2,
    borderColor: '#6200ee',
    overflow: 'hidden',
  },
  confirmButtonTouchable: {
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
    color: '#6200ee',
    fontSize: 18,
    fontFamily: 'Montserrat-Regular',
    fontWeight: 'bold',
    textShadowColor: '#000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  listContainer: {
    flex: 1,
  },
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  listTitle: {
    fontSize: 18,
    fontFamily: 'Sportypo-Regular',
    color: '#6200ee',
    marginBottom: 15,
  },
  addButton: {
    borderRadius: 8,
    height: 36,
    borderWidth: 2,
    borderColor: '#6200ee',
    overflow: 'hidden',
  },
  addButtonTouchable: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
    gap: 4,
  },
  addButtonText: {
    color: '#6200ee',
    fontSize: 16,
    fontFamily: 'Montserrat-Regular',
    fontWeight: 'bold',
    textShadowColor: '#000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  flatList: {
    flex: 1,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  listItemContent: {
    flex: 1,
  },
  listItemTitle: {
    fontSize: 16,
    fontFamily: 'Montserrat-Regular',
    color: '#333',
    marginBottom: 4,
  },
  listItemSubtitle: {
    fontSize: 14,
    fontFamily: 'Montserrat-Regular',
    color: '#666',
  },
  listItemActions: {
    flexDirection: 'row',
    gap: 8,
  },
  editButton: {
    padding: 8,
    borderRadius: 6,
    backgroundColor: 'rgba(33, 150, 243, 0.1)',
  },
  deleteButton: {
    padding: 8,
    borderRadius: 6,
    backgroundColor: 'rgba(244, 67, 54, 0.2)',
  },

  imagePickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#ddd',
    borderStyle: 'dashed',
    justifyContent: 'center',
    gap: 10,
  },
  imagePickerText: {
    color: '#6200ee',
    fontSize: 16,
    fontFamily: 'Montserrat-Regular',
  },
  imagePreview: {
    width: '100%',
    height: 150,
    borderRadius: 10,
    marginBottom: 16,
    resizeMode: 'cover',
  },
  newsImageContainer: {
    width: '100%',
  },
});