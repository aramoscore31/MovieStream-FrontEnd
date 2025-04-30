import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Dimensions, TextInput } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import Fontisto from '@expo/vector-icons/Fontisto';

interface HeaderProps {
  navigation: any;
  username: string | null;
}

const { width } = Dimensions.get('window');

const Header: React.FC<HeaderProps> = ({ navigation, username }) => {
  const [menuVisible, setMenuVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchBarVisible, setSearchBarVisible] = useState(false);

  const toggleMenu = () => {
    setMenuVisible(!menuVisible);
  };

  const toggleSearchBar = () => {
    setSearchBarVisible(!searchBarVisible);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={toggleMenu}>
          <FontAwesome name="bars" size={35} color="white" />
        </TouchableOpacity>
        
        <TouchableOpacity onPress={toggleSearchBar}>
          <FontAwesome name="search" size={21} color="white" marginRight={240}/>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Home')} style={styles.logoContainer}>
          <Image source={require('../assets/logo.png')} style={styles.logo} />
        </TouchableOpacity>

        <View style={styles.headerIcons}>
          {username ? (
            <>
              <TouchableOpacity onPress={() => navigation.navigate('Favorites')}>
                <Fontisto name="favorite" size={19} color="white" marginRight={5}/>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
                <FontAwesome5 name="user-cog" size={30} color="white" />
              </TouchableOpacity>
            </>
          ) : (
            <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
              <FontAwesome name="user-circle" size={35} color="white" marginRight={15}/>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {searchBarVisible && (
        <View style={styles.searchBarContainer}>
          <TextInput
            placeholder="Buscar por nombre de película o serie..."
            placeholderTextColor="white"
            style={styles.searchInputExpanded}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      )}

      {menuVisible && (
        <View style={styles.recommendationBar}>
          <TouchableOpacity
            style={styles.recommendationButton}
            onPress={() => {
              setMenuVisible(false);
              navigation.navigate('Recommendations');
            }}
          >
            <Text style={styles.recommendationButtonText}>Películas</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.recommendationButton}
            onPress={() => {
              setMenuVisible(false);
              navigation.navigate('ComingSoon');
            }}
          >
            <Text style={styles.recommendationButtonText}>Series</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.recommendationButton}
            onPress={() => {
              setMenuVisible(false);
              navigation.navigate('Categories');
            }}
          >
            <Text style={styles.recommendationButtonText}>Categorías</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.recommendationButton}
            onPress={() => {
              setMenuVisible(false);
              navigation.navigate('Help');
            }}
          >
            <Text style={styles.recommendationButtonText}>Ayuda</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {},
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    paddingHorizontal: 20,
    backgroundColor: '#2C2C2C',
  },
  logoContainer: {
    position: 'absolute',
    left: '50%',
    transform: [{ translateX: -40 }],
  },
  logo: {
    width: 130,
    height: 50,
  },
  headerIcons: {
    flexDirection: 'row',
    gap: 15,
    alignContent: 'center',
    alignItems: 'center',
  },
  recommendationBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#2C2C2C',
    paddingVertical: 20,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  recommendationButton: {},
  recommendationButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },

  searchIcon: {
    marginRight: 150,
    color: '#3498db',
  },

  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#3498db',
  },

  searchBarContainer: {
    backgroundColor: '#2C2C2C',
    padding: 10,
    width: '100%',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: 'white',
  },

  searchInputExpanded: {
    fontSize: 16,
    color: 'white',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    padding: 10,
    borderRadius: 10,
    width: '90%',
  },
});

export default Header;