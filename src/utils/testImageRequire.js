import { Alert } from 'react-native';

try {
  const image = require('../assets/vector.png');
  Alert.alert('Success', 'Image loaded successfully!');
  console.log('Image path:', image);
} catch (error) {
  Alert.alert('Error', 'Failed to load image: ' + error.message);
  console.log('Image require error:', error);
}

export default {};