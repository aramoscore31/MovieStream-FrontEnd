import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  Animated,
  Dimensions,
  TextInput,
  Alert,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
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
  const [walletBalance, setWalletBalance] = useState<number>(0);
  const [addMoneyInput, setAddMoneyInput] = useState<string>('');
  const [isAddingMoney, setIsAddingMoney] = useState<boolean>(false);

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

      // Cargar saldo del monedero
      const storedBalance = await AsyncStorage.getItem('walletBalance');
      if (storedBalance) setWalletBalance(Number(storedBalance));

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

  const handleAddMoney = async () => {
    const amount = parseFloat(addMoneyInput);
    if (isNaN(amount) || amount <= 0) {
      Alert.alert('Error', 'Por favor ingresa una cantidad válida.');
      return;
    }

    // Actualizamos el saldo en el estado
    const newBalance = walletBalance + amount;
    setWalletBalance(newBalance);

    // Guardamos el nuevo saldo en AsyncStorage
    try {
      await AsyncStorage.setItem('walletBalance', newBalance.toString());
      setAddMoneyInput(''); // Limpiamos el campo de texto
      setIsAddingMoney(false); // Ocultamos el formulario
    } catch (error) {
      console.error('Error al guardar el saldo en AsyncStorage:', error);
    }
  };

  const renderMovieItem = ({ item }: { item: MovieData }) => {
    const isFavorite = favorites.some(fav => fav.id === item.id);
    return (
      <TouchableOpacity style={styles.movieContainer} onPress={handleMoviePress(item)}>
        <View style={styles.movieImageContainer}>
          <Image source={{ uri: item.posterUrl }} style={styles.movieImage} />
          <TouchableOpacity onPress={() => toggleFavorite(item)} style={styles.favoriteIcon}>
            <FontAwesome
              name={isFavorite ? 'heart' : 'heart-o'}
              size={24}
              color={isFavorite ? 'red' : 'white'}
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
        <View style={styles.walletContainer}>
          <Text style={styles.walletText}>Saldo: ${walletBalance.toFixed(2)}</Text>
          <TouchableOpacity onPress={() => setIsAddingMoney(!isAddingMoney)}>
            <FontAwesome name="plus-circle" size={30} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      {isAddingMoney && (
        <View style={styles.addMoneyContainer}>
          <TextInput
            style={styles.addMoneyInput}
            value={addMoneyInput}
            onChangeText={setAddMoneyInput}
            keyboardType="numeric"
            placeholder="Ingrese monto"
          />
          <TouchableOpacity onPress={handleAddMoney} style={styles.addMoneyButton}>
            <Text style={styles.addMoneyButtonText}>Agregar dinero</Text>
          </TouchableOpacity>
        </View>
      )}

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
