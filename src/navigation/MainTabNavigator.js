import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { Ionicons } from "@expo/vector-icons";

import HomeScreen from "../screens/HomeScreen";
import BookingScreen from "../screens/BookingScreen";
import ProfileScreen from "../screens/ProfileScreen";
import HelpSupportScreen from "../screens/HelpSupportScreen";
import SettingsScreen from "../screens/SettingsScreen";
import DetailedProfileScreen from "../screens/DetailedProfileScreen";
import BookingsHistoryScreen from "../screens/BookingsHistoryScreen";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const Tab = createBottomTabNavigator();
const ProfileStack = createStackNavigator();

function ProfileStackScreen() {
  return (
    <ProfileStack.Navigator>
      <ProfileStack.Screen
        name="ViewProfile"
        component={ProfileScreen}
        options={{ headerShown: false }}
      />
      <ProfileStack.Screen
        name="DetailedProfile"
        component={DetailedProfileScreen}
        options={{ title: "My Profile" }}
      />
      <ProfileStack.Screen
        name="BookingsHistory"
        component={BookingsHistoryScreen}
        options={{ title: "My Bookings" }}
      />
      <ProfileStack.Screen
        name="HelpSupportScreen"
        component={HelpSupportScreen}
        options={{ title: "Help & Support" }}
      />
      <ProfileStack.Screen
        name="SettingsScreen"
        component={SettingsScreen}
        options={{ title: "Settings" }}
      />
    </ProfileStack.Navigator>
  );
}

export default function MainTabNavigator() {
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === "Home") {
            iconName = focused ? "home" : "home-outline";
          } else if (route.name === "Booking") {
            iconName = focused ? "calendar" : "calendar-outline";
          } else if (route.name === "Profile") {
            iconName = focused ? "person" : "person-outline";
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "#ffd700",
        tabBarInactiveTintColor: "#888",
        tabBarStyle: {
          backgroundColor: "#000",
          borderTopColor: "#1a4d3a",
          borderTopWidth: 2,
          height: 60 + Math.max(insets.bottom, 20),
          paddingBottom: Math.max(insets.bottom, 8),
          paddingTop: 8,
        },
        headerStyle: {
          backgroundColor: "#000",
        },
        headerTintColor: "#fff",
        headerTitleStyle: {
          fontWeight: "bold",
        },
        headerRight: () => (
          <Ionicons
            name="football"
            size={24}
            color="#ffd700"
            style={{ marginRight: 15 }}
          />
        ),
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Booking" component={BookingScreen} />
      <Tab.Screen
        name="Profile"
        component={ProfileStackScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-outline" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
