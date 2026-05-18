import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Linking, ImageBackground } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function HelpSupportScreen() {
  const appInfo = {
    name: "Dream Arena",
    version: "1.0.0",
    description: "The ultimate football management and booking app for players and teams.",
    features: [
      "Book football grounds easily",
      "Manage your team roster and matches",
      "Track player statistics and performance",
      "Join leagues and tournaments",
      "Connect with other football enthusiasts"
    ]
  };

  const contactSupport = () => {
    Linking.openURL('mailto:support@dreamarena.com');
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.container}>
        <View style={styles.section}>
          <Text style={styles.title}>About {appInfo.name}</Text>
          <Text style={styles.description}>{appInfo.description}</Text>
          
          <Text style={styles.subtitle}>App Features:</Text>
          {appInfo.features.map((feature, index) => (
            <View key={index} style={styles.featureItem}>
              <Ionicons name="checkmark-circle" size={16} color="#4CAF50" />
              <Text style={styles.featureText}>{feature}</Text>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.subtitle}>Getting Started</Text>
          <Text style={styles.text}>
            To start using {appInfo.name}, simply create an account or log in if you already have one. 
            You can then browse available football grounds, make bookings, or join/create a team.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.subtitle}>Need Help?</Text>
          <Text style={styles.text}>
            If you're experiencing any issues or have questions about the app, 
            our support team is ready to assist you.
          </Text>
          
          <ImageBackground 
            source={require('./vector.png')} 
            style={styles.contactButton}
            imageStyle={styles.buttonImage}
          >
            <TouchableOpacity style={styles.contactTouchable} onPress={contactSupport}>
              <Ionicons name="mail" size={20} color="#ffd700" />
              <Text style={styles.contactButtonText}>Contact Support</Text>
            </TouchableOpacity>
          </ImageBackground>
        </View>
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
  section: {
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    fontFamily: 'Sportypo-Regular',
    color: '#fff',
    marginBottom: 15,
    letterSpacing: 1.5,
  },
  subtitle: {
    fontSize: 18,
    fontFamily: 'Sportypo-Regular',
    color: '#ffd700',
    marginBottom: 10,
    letterSpacing: 1,
  },
  description: {
    fontSize: 16,
    fontFamily: 'Montserrat-Regular',
    color: '#ddd',
    marginBottom: 15,
    lineHeight: 24,
  },
  text: {
    fontSize: 16,
    fontFamily: 'Montserrat-Regular',
    color: '#ddd',
    marginBottom: 15,
    lineHeight: 24,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  featureText: {
    fontSize: 16,
    fontFamily: 'Montserrat-Regular',
    color: '#ddd',
    marginLeft: 10,
  },
  contactButton: {
    borderRadius: 8,
    height: 50,
    marginTop: 10,
    borderWidth: 2,
    borderColor: '#ffd700',
    overflow: 'hidden',
  },
  buttonImage: {
    opacity: 0.3,
  },
  contactTouchable: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
  },
  contactButtonText: {
    color: '#ffd700',
    fontSize: 16,
    fontFamily: 'Montserrat-Regular',
    marginLeft: 10,
    fontWeight: 'bold',
    textShadowColor: '#000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
});