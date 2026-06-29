import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../context/AuthContext";
import axios from "axios";

export default function BookingScreen({ navigation }) {
  const [grounds, setGrounds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const { API_BASE_URL, user } = useAuth();

  useEffect(() => {
    fetchGrounds();
  }, []);

  const fetchGrounds = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/grounds`);
      setGrounds(response.data);
    } catch (error) {
      // console.log("Error fetching grounds:", error);
      Alert.alert("Error", "Failed to load grounds");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchGrounds();
  };

  const handleGroundPress = (ground) => {
    if (!user) {
      navigation.navigate("Login");
    } else {
      navigation.navigate("GroundDetail", { ground });
    }
  };

  const renderGroundItem = (ground, index) => {
    return (
      <TouchableOpacity
        key={index}
        style={styles.groundItem}
        onPress={() => handleGroundPress(ground)}
      >
        <Image
          source={{
            uri:
              ground.image ||
              "https://images.pexels.com/photos/274506/pexels-photo-274506.jpeg",
          }}
          style={styles.groundImage}
        />

        <View style={styles.groundInfo}>
          <Text style={styles.groundName}>{ground.name}</Text>
          <Text style={styles.groundLocation}>{ground.location}</Text>

          <View style={styles.groundDetails}>
            <View style={styles.detailItem}>
              <Ionicons name="resize-outline" size={16} color="#888" />
              <Text style={styles.detailText}>{ground.size}</Text>
            </View>
            <View style={styles.detailItem}>
              <Ionicons name="cash-outline" size={16} color="#888" />
              <Text style={styles.detailText}>${ground.pricePerHour}/hour</Text>
            </View>
          </View>

          <View style={styles.groundFeatures}>
            {ground.features?.map((feature, idx) => (
              <View key={idx} style={styles.featureTag}>
                <Text style={styles.featureText}>{feature}</Text>
              </View>
            ))}
          </View>

          <View style={styles.groundFooter}>
            <View style={styles.ratingContainer}>
              <Ionicons name="star" size={16} color="#ff9626" />
              <Text style={styles.ratingText}>
                {ground.averageRating?.toFixed(1) || "0.0"} (
                {ground.reviewCount || 0} reviews)
              </Text>
            </View>

            <View
              style={[
                styles.availabilityBadge,
                { backgroundColor: ground.isAvailable ? "#4CAF50" : "#F44336" },
              ]}
            >
              <Text style={styles.availabilityText}>
                {ground.isAvailable ? "Available" : "Booked"}
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading grounds...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Available Grounds</Text>
        <Text style={styles.headerSubtitle}>
          Find the perfect ground for your game
        </Text>
      </View>

      <FlatList
        data={grounds}
        renderItem={({ item, index }) => renderGroundItem(item, index)}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="football-outline" size={64} color="#888" />
            <Text style={styles.emptyText}>No grounds available</Text>
            <Text style={styles.emptySubtext}>
              Check back later for new grounds
            </Text>
          </View>
        }
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0d2818",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#0d2818",
  },
  loadingText: {
    color: "#fff",
    fontSize: 16,
  },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 12,
  },
  listContent: {
    paddingBottom: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontFamily: "Sportypo-Regular",
    color: "#ffd700",
    letterSpacing: 1.5,
  },
  headerSubtitle: {
    fontSize: 14,
    fontFamily: "Montserrat-Regular",
    color: "#888",
    marginTop: 5,
  },
  groundItem: {
    backgroundColor: "#FFD700",
    borderRadius: 15,
    margin: 15,
    marginTop: 10,
    overflow: "hidden",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  groundImage: {
    width: "100%",
    height: 200,
    resizeMode: "cover",
  },
  groundInfo: {
    padding: 15,
  },
  groundName: {
    fontSize: 20,
    fontFamily: "Sportypo-Regular",
    color: "#0d2818",
    marginBottom: 5,
    letterSpacing: 0.5,
  },
  groundLocation: {
    fontSize: 14,
    fontFamily: "Montserrat-Regular",
    color: "#888",
    marginBottom: 10,
  },
  groundDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  detailText: {
    color: "#000",
    fontSize: 14,
    fontFamily: "LemonMilk-Regular",
  },
  groundFeatures: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 5,
    marginBottom: 15,
  },
  featureTag: {
    backgroundColor: "rgba(244, 244, 241, 0.98)",
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  featureText: {
    color: "#000",
    fontSize: 12,
    fontFamily: "Montserrat-Regular",
  },
  groundFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  ratingText: {
    color: "#000",
    fontSize: 12,
    fontFamily: "LemonMilk-Regular",
  },
  availabilityBadge: {
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  availabilityText: {
    color: "#fff",
    fontSize: 12,
    fontFamily: "LemonMilk-Regular",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
  },
  emptyText: {
    color: "#fff",
    fontSize: 18,
    fontFamily: "Sportypo-Regular",
    marginTop: 15,
    letterSpacing: 1,
  },
  emptySubtext: {
    color: "#888",
    fontSize: 14,
    fontFamily: "Montserrat-Regular",
    marginTop: 5,
  },
});
