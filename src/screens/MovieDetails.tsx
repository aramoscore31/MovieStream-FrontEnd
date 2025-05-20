import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, ScrollView, TouchableOpacity } from 'react-native';
import { useVideoPlayer, VideoView } from 'expo-video';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { WebView } from 'react-native-webview';  // Importa WebView

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// Función para obtener el token desde AsyncStorage
const getToken = async () => {
  const token = await AsyncStorage.getItem('token');
  console.log('Token obtenido:', token);  // Verifica que el token esté presente
  return token;
};

// Función para autorizar el acceso al video
const authorizeVideoAccess = async () => {
  try {
    const token = await getToken();
    if (!token) {
      console.error('Token no disponible');
      return false;
    }

    const response = await fetch('http://192.168.1.87:8080/PedirVideo/video', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,  // Mandamos el token en el header
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Error de autorización: ${response.status} - ${errorText}`);
      return false;
    }

    return true;
  } catch (err) {
    console.error('Error al autorizar acceso al video:', err);
    return false;
  }
};

// Función para obtener la URL del video sin el token
const fetchVideoUrl = async (filePath: string) => {
  try {
    const response = await fetch(`http://192.168.1.87:8080/video/${filePath}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Error al obtener video: ${response.status} - ${errorText}`);
      return null;
    }

    // Si la respuesta es correcta, devolver la URL del video
    return response.url;
  } catch (err) {
    console.error('Error al obtener el video:', err);
    return null;
  }
};

const MovieDetailsScreen = ({ route }: any) => {
  const { movie } = route.params;
  const navigation = useNavigation();
  const [videoUrl, setVideoUrl] = useState<string | null>(null);

  useEffect(() => {
    // Primero, autorizar el acceso al video
    const authorizeAndFetchVideoData = async () => {
      const authorized = await authorizeVideoAccess();
      if (authorized) {
        const url = await fetchVideoUrl(movie.filePath);
        if (url) {
          setVideoUrl(url); // Establecer la URL del video en el estado
        }
      } else {
        console.error('Acceso no autorizado');
      }
    };

    authorizeAndFetchVideoData();
  }, [movie.filePath]);

  const player = useVideoPlayer(videoUrl, player => {
    if (videoUrl) {
      player.loop = true;
      player.play();
    }
  });

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
            object-fit: cover; /* Ajusta la imagen para que cubra todo el espacio */
          }
        </style>
      </head>
      <body>
        <img src="${movie.posterUrl}" />
      </body>
    </html>
  `;

  return (
    <View style={styles.container}>
      {/* Botón de regreso al menú principal */}
      <TouchableOpacity 
        style={styles.backButton} 
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.backButtonText}>← Volver</Text>
      </TouchableOpacity>

      {/* Imagen de portada */}
      <View style={styles.headerContainer}>
        <WebView
          originWhitelist={['*']}  // Permite el acceso a cualquier origen
          source={{ html: htmlContent }} // Carga el contenido HTML generado
          style={styles.posterImage}  // Ajusta el estilo para que ocupe todo el espacio
          javaScriptEnabled={true}  // Habilita JavaScript si es necesario
          allowsInlineMediaPlayback={true}
        />
      </View>

      {/* Detalles de la película */}
      <ScrollView style={styles.detailsContainer}>
        <Text style={styles.detail}>Director: {movie.director}</Text>
        <Text style={styles.detail}>Actores: {movie.actors}</Text>
        <Text style={styles.plot}>{movie.plot}</Text>
      </ScrollView>

      {/* Reproductor de video */}
      <View style={styles.videoContainer}>
        {videoUrl && (
          <VideoView
            style={styles.videoPlayer}
            player={player}
            allowsFullscreen
            allowsPictureInPicture
          />
        )}
      </View>

      {/* Controles de reproducción */}
      <View style={styles.controlsContainer}>
        <TouchableOpacity
          style={styles.playPauseButton}
          onPress={() => {
            if (player.playing) {
              player.pause();
            } else {
              player.play();
            }
          }}
        >
          <Text style={styles.playPauseText}>{player.playing ? 'Pausar' : 'Reproducir'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#141414',
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    zIndex: 1,
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
  },
  posterImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
  },
  headerTextContainer: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    zIndex: 1,
  },
  title: {
    fontSize: 32,
    color: 'white',
    fontWeight: 'bold',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: 'white',
    fontWeight: '300',
  },
  detailsContainer: {
    padding: 20,
    backgroundColor: '#1c1c1c',
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderColor: '#444',
    maxHeight: screenHeight * 0.3,
  },
  detail: {
    fontSize: 16,
    color: 'white',
    marginBottom: 5,
  },
  plot: {
    fontSize: 14,
    color: 'white',
    marginTop: 10,
    marginBottom: 10,
  },
  videoContainer: {
    flex: 1,
    backgroundColor: 'black',
    height: screenHeight * 0.35,
  },
  videoPlayer: {
    flex: 1,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  controlsContainer: {
    padding: 10,
    alignItems: 'center',
  },
  playPauseButton: {
    backgroundColor: '#FF6347',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  playPauseText: {
    color: 'white',
    fontSize: 18,
  },
});

export default MovieDetailsScreen;
