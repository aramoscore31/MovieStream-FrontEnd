import React from 'react';
import { View, Text, StyleSheet, Dimensions, Image, ScrollView, TouchableOpacity } from 'react-native';
import { WebView } from 'react-native-webview'; // Importamos WebView
import { useNavigation } from '@react-navigation/native';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const MovieDetailsScreen = ({ route }: any) => {
  const { movie } = route.params;
  const navigation = useNavigation();

  // Concatenar correctamente el dominio con el filePath
  const videoUrl = `https://${movie.filePath}`;  // Concatenamos el dominio con la ruta del video

  return (
    <View style={styles.container}>
      {/* Botón de regreso al menú principal */}
      <TouchableOpacity 
        style={styles.backButton} 
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.backButtonText}>← Regresar</Text>
      </TouchableOpacity>

      {/* Imagen de portada */}
      <View style={styles.headerContainer}>
        <Image source={{ uri: movie.posterUrl }} style={styles.posterImage} />
        <View style={styles.headerTextContainer}>
          <Text style={styles.title}>{movie.title}</Text>
          <Text style={styles.subtitle}>{movie.year} • {movie.genre}</Text>
        </View>
      </View>

      {/* Detalles de la película */}
      <ScrollView style={styles.detailsContainer}>
        <Text style={styles.detail}>Director: {movie.director}</Text>
        <Text style={styles.detail}>Actores: {movie.actors}</Text>
        <Text style={styles.plot}>{movie.plot}</Text>
      </ScrollView>

      {/* Reproductor de video */}
      <View style={styles.videoContainer}>
        <WebView
          originWhitelist={['*']}
          source={{ html: `
            <html>
              <body style="margin: 0; padding: 0; background-color: black;">
                <video width="100%" height="100%" controls>
                  <source src="${videoUrl}" type="video/mp4">
                  Your browser does not support the video tag.
                </video>
              </body>
            </html>
          ` }}
          style={styles.webView}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#141414', // Fondo oscuro similar a Netflix
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
    height: screenHeight * 0.35, // La imagen de la portada ocupa el 35% de la pantalla
    position: 'relative',
  },
  posterImage: {
    width: '100%',
    height: '100%',
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: -1, // Mantener la imagen de fondo debajo del texto
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
    maxHeight: screenHeight * 0.3, // Limitar la altura de los detalles al 30% de la pantalla
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
    height: screenHeight * 0.35, // El reproductor ocupa el 35% restante de la pantalla
  },
  webView: {
    flex: 1, // El WebView ocupa todo el espacio disponible
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
});

export default MovieDetailsScreen;
