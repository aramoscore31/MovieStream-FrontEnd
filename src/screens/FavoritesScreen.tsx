import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, ActivityIndicator, TouchableOpacity, Image } from 'react-native';
import { FontAwesome, Fontisto } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { ComingSoonStyles } from '../css/ComingSoonStyles';
import Header from '../components/Header';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../app/index';

interface MovieData {
  id: number;
  title: string;
  year: string;
  genre: string;
  director: string;
  actors: string;
  plot: string;
  language: string | null;
  country: string | null;
  posterUrl: string;
  imdbRating: string; // IMDb rating
  imdbID: string;
  filePath: string;
}

// Función para convertir la calificación a estrellas sobre 5
const renderStars = (rating: string) => {
  const stars = [];
  const ratingValue = parseFloat(rating);
  const maxRating = 10;
  const starsOutOfFive = (ratingValue / maxRating) * 5; // Convertir la calificación a una escala de 5 estrellas
  const fullStars = Math.floor(starsOutOfFive);
  const halfStar = starsOutOfFive % 1 >= 0.5 ? 1 : 0;
  const emptyStars = 5 - fullStars - halfStar;

  // Llenar las estrellas completas
  for (let i = 0; i < fullStars; i++) {
    stars.push(<FontAwesome key={`full-${i}`} name="star" size={18} color="#FFD700" />);
  }
  
  // Llenar la media estrella si existe
  if (halfStar) {
    stars.push(<FontAwesome key="half" name="star-half-o" size={18} color="#FFD700" />);
  }
  
  // Llenar las estrellas vacías
  for (let i = 0; i < emptyStars; i++) {
    stars.push(<FontAwesome key={`empty-${i}`} name="star-o" size={18} color="#FFD700" />);
  }

  return stars;
};

const FavoritesScreen = () => {
  const [favorites, setFavorites] = useState<MovieData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const [username, setUsername] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);

  const fetchFavorites = async () => {
    setLoading(true);
    setError(null);
    try {
      const storedFavorites = await AsyncStorage.getItem('favorites');
      if (storedFavorites) {
        setFavorites(JSON.parse(storedFavorites));
      }
    } catch (error) {
      setError('Error loading favorites');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFavorites();

    const getUserData = async () => {
      const storedUsername = await AsyncStorage.getItem('username');
      const storedRole = await AsyncStorage.getItem('role');
      if (storedUsername) setUsername(storedUsername);
      if (storedRole) setRole(storedRole);
    };
    getUserData();
  }, []);

  const handleRemoveFavorite = async (movieId: number) => {
    const updatedFavorites = favorites.filter((movie) => movie.id !== movieId);
    setFavorites(updatedFavorites);

    try {
      await AsyncStorage.setItem('favorites', JSON.stringify(updatedFavorites));
    } catch (error) {
      console.error('Error saving favorites:', error);
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#3498db" />;
  }

  const renderMovieItem = ({ item }: { item: MovieData }) => {
    return (
      <TouchableOpacity
        onPress={() => navigation.navigate('MovieDetails', { movie: item })}
        style={ComingSoonStyles.event}
      >
        <Image 
          source={{ uri: item.posterUrl }} 
          style={ComingSoonStyles.eventImage} 
        />
        <View style={ComingSoonStyles.eventDetails}>
          <Text style={ComingSoonStyles.eventTitle}>{item.title}</Text>
          <Text style={ComingSoonStyles.eventDate}>{item.year}</Text>
          {/* Mostrar las estrellas de IMDb */}
          <View style={ComingSoonStyles.eventStars}>
            {renderStars(item.imdbRating)}
          </View>
        </View>
        <TouchableOpacity onPress={() => handleRemoveFavorite(item.id)} style={ComingSoonStyles.favoriteIcon}>
          <Fontisto name="favorite" size={35} color="red" top={-59} right={10} />
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  return (
    <View style={ComingSoonStyles.container}>
      <Header navigation={navigation} username={username || ''} />
      <View style={ComingSoonStyles.headerContainer}>
        <Text style={ComingSoonStyles.headerText}>Mis Favoritos</Text>
      </View>

      {error && <Text style={{ color: 'red', textAlign: 'center', marginVertical: 10 }}>{error}</Text>}

      {favorites.length === 0 ? (
        <Text style={{ color: 'red', textAlign: 'center', marginTop: 30 }}>No tienes favoritos.</Text>
      ) : (
        <FlatList
          data={favorites}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderMovieItem}
        />
      )}
    </View>
  );
};

export default FavoritesScreen;