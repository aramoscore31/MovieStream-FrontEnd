import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useVideoPlayer, VideoView } from 'expo-video';
import { StackNavigationProp } from '@react-navigation/stack';  
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { RootStackParamList } from '../../app/index'; 
import { WebView } from 'react-native-webview';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios'; 

type MovieDetailsNavigationProp = StackNavigationProp<RootStackParamList, 'MovieDetails'>;

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const MovieDetailsScreen = ({ route }: any) => {
  const { movie } = route.params;
  const navigation = useNavigation<MovieDetailsNavigationProp>();

  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const checkSubscription = async () => {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        Alert.alert('Error', 'No se ha encontrado el token, por favor inicie sesión nuevamente.');
        return;
      }

      try {
        const response = await axios.post(
          'http://192.168.1.87:8080/api/subscription/check-subscription',
          {}, 
          { headers: { Authorization: `Bearer ${token}` } }
        );
        
        if (response.data.subscriptionActive) {
          setIsAuthorized(true);
        } else {
          setIsAuthorized(false);
        }
      } catch (error) {
        console.error('Error al verificar suscripción', error);
        Alert.alert('Error', 'Hubo un problema al verificar el estado de la suscripción.');
      }
    };

    checkSubscription();
  }, []);

  const htmlContent = `
    <html>
      <head>
        <style>
          body, html {
            margin: 0;
            padding: 0;
            height: 100%;
            width: 100%;
            overflow: hidden;
          }
          img {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }
        </style>
      </head>
      <body>
        <img src="${movie.posterUrl}" />
      </body>
    </html>
  `;

  const handlePlayPress = () => {
    const videoUrl = `http://192.168.1.87:8080/video/${movie.title.replace(/\s+/g, '_')}.mp4`;
  
    console.log('Video URL:', videoUrl);
    
    if (isAuthorized) {
      if (videoUrl) {
        navigation.navigate('VideoPlayer', { videoUrl });
      } else {
        Alert.alert("Error", "No se proporcionó una URL de video válida.");
      }
    } else {
      Alert.alert("Tu suscripción ha expirado o no es válida.");
    }
  };
  

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.backButton} 
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.backButtonText}>← Volver</Text>
      </TouchableOpacity>

      <View style={styles.headerContainer}>
        <WebView
          originWhitelist={['*']}  
          source={{ html: htmlContent }} 
          style={styles.posterImage}  
          javaScriptEnabled={true}  
          allowsInlineMediaPlayback={true}
        />
        
        <TouchableOpacity
          style={styles.playButton}
          onPress={handlePlayPress}
        >
          <FontAwesome name="play-circle" size={60} color="white" />
        </TouchableOpacity>
      </View>

      <View style={styles.detailsContainer}>
        <Text style={styles.eventTitle}>{movie.title}</Text>
        <Text style={styles.plot}>{movie.plot}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  backButtonText: {
    color: 'white',
    fontSize: 18,
  },
  headerContainer: {
    width: '100%',
    height: screenHeight * 0.35,
    position: 'relative',
    marginBottom: 15,
  },
  posterImage: {
    width: '100%',
    height: '100%',
  },
  playButton: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -30 }, { translateY: -30 }],
    opacity: 0.7,
  },
  detailsContainer: {
    padding: 20,
  },
  eventTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: '#2c3e50',
    marginBottom: 15,
    textAlign: 'center',
  },
  plot: {
    fontSize: 14,
    color: '#34495e',
    marginTop: 10,
    marginBottom: 10,
  },
});

export default MovieDetailsScreen;
