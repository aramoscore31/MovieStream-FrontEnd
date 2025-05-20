import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, Image, FlatList, TouchableOpacity, Animated, Dimensions } from 'react-native';
import { Fontisto } from '@expo/vector-icons'; // Using Fontisto for the favorite icon
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../app/index';
import { styles } from '../css/HomeStyles';
import Carousel from 'react-native-reanimated-carousel';
import { useFocusEffect } from '@react-navigation/native';
import Header from '../components/Header';

const { width: screenWidth } = Dimensions.get('window');

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
  imdbRating: string;
  imdbID: string;
  filePath: string;
}

const carouselItems = [
  { image: require('../assets/evento1.jpg') },
  { image: require('../assets/evento1.jpg') },
  { image: require('../assets/evento1.jpg') },
];

const renderCarouselItem = ({ item }: { item: { image: any } }) => {
  return (
    <View style={styles.carouselItem}>
      <Image source={item.image} style={styles.carouselImage} />
    </View>
  );
};

const HomeScreen = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList, 'Home'>>();
  const [username, setUsername] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [movies, setMovies] = useState<MovieData[]>([]);
  const [favorites, setFavorites] = useState<MovieData[]>([]);

  const opacity = useState(new Animated.Value(1))[0];

  // Fetch movies
  const fetchMovies = async () => {
    try {
      const response = await fetch('http://192.168.1.87:8080/movies/list');
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error: ${response.status} - ${errorText}`);
      }

      const data: MovieData[] = await response.json();
      setMovies(data);
    } catch (err) {
      console.error('Error al obtener películas:', err);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchMovies();
    }, [])
  );

  useEffect(() => {
    const loadUserData = async () => {
      const storedUsername = await AsyncStorage.getItem('username');
      const storedRole = await AsyncStorage.getItem('role');
      if (storedUsername) setUsername(storedUsername);
      if (storedRole) setRole(storedRole);

      setLoading(false);
    };

    loadUserData();
  }, []);

  const handleMoviePress = (item: MovieData) => () => {
    navigation.navigate('MovieDetails', { movie: item });
  };

  const toggleFavorite = async (movie: MovieData) => {
    let updatedFavorites = [...favorites];
    const movieIndex = favorites.findIndex(fav => fav.id === movie.id);

    if (movieIndex !== -1) {
      updatedFavorites.splice(movieIndex, 1);
    } else {
      updatedFavorites.push(movie);
    }

    try {
      await AsyncStorage.setItem('favorites', JSON.stringify(updatedFavorites));
      setFavorites(updatedFavorites); 
    } catch (error) {
      console.error('Error saving favorites:', error);
    }
  };

  const renderMovieItem = ({ item }: { item: MovieData }) => {
    const isFavorite = favorites.some(fav => fav.id === item.id);
    return (
      <TouchableOpacity style={styles.movieContainer} onPress={handleMoviePress(item)}>
        <View style={styles.movieImageContainer}>
          <Image source={{ uri: item.posterUrl }} style={styles.movieImage} />
          <TouchableOpacity 
            onPress={() => toggleFavorite(item)} 
            style={[
              styles.favoriteIcon,
              { opacity: isFavorite ? 1 : 0.5 } // Make it slightly transparent when not a favorite
            ]}
          >
            <Fontisto
              name="favorite" // Fontisto icon for the favorite
              size={30}
              color={isFavorite ? 'red' : 'white'} // Change color when favorite
            />
          </TouchableOpacity>
        </View>
        <Text style={styles.movieTitle}>{item.title}</Text>
      </TouchableOpacity>
    );
  };

  const startBlinking = () => {
    Animated.loop(
      Animated.sequence([ 
        Animated.timing(opacity, { toValue: 0.5, duration: 1000, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 1, duration: 1000, useNativeDriver: true }),
      ])
    ).start();
  };

  useEffect(() => {
    startBlinking();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.fixedHeader}>
        <Header navigation={navigation} username={username || ''} />
      </View>

      <FlatList
        ListHeaderComponent={
          <>
            <View style={styles.carouselContainer}>
              <Carousel
                data={carouselItems}
                renderItem={renderCarouselItem}
                width={screenWidth}
                height={250}
                loop={true}
                autoPlay={true}
                autoPlayInterval={4000}
              />
            </View>

            <Text style={styles.sectionTitle}>Películas</Text>
          </>
        }
        data={movies}
        keyExtractor={(item) => item.id.toString()}
        numColumns={3}
        renderItem={renderMovieItem}
      />

      <View style={styles.fixedBottomNav}></View>
    </View>
  );
};

export default HomeScreen;
