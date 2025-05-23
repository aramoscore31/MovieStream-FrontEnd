import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { FavoritesProvider } from '@/src/components/FavoritesContext';
import HomeScreen from '../src/screens/HomeScreen';
import LoginScreen from '../src/screens/LoginScreen';
import RegisterScreen from '../src/screens/RegisterScreen';
import AdminUsersScreen from '@/src/screens/AdminUsersScreen';
import FavoritesScreen from '@/src/screens/FavoritesScreen';
import ProfileScreen from '@/src/screens/ProfileScreen';
import BoughtTickets from '@/src/screens/BoughtTickets';
import AdminPanel from '@/src/screens/AdminPanel';
import EditEventScreen from '@/src/screens/EditEventScreen';
import { MovieData } from '../types/movieTypes';
import OrganizerRequestScreen from '@/src/screens/OrganizerRequestScreen';
import MovieDetails from '@/src/screens/MovieDetails';
import VideoPlayerScreen from '@/src/screens/VideoPlayerScreen';

export type RootStackParamList = {
  Home: undefined;
  Login: undefined;
  Register: undefined;
  Recommendations: undefined;
  ComingSoon: undefined;
  Help: undefined;
  Admin: undefined;
  Favorites: undefined;
  Profile: undefined;
  ShoppingCart: undefined;
  BoughtTickets: undefined;
  Categories: undefined;
  EventsByCategoryScreen: { category: any };
  AdminPanel: undefined;
  VideoPlayer: { videoUrl: string };
  EditEvent: { eventId: number };
  OrganizerRequestScreen: undefined;
  MovieDetails: { movie: MovieData };
};

const Stack = createStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    <FavoritesProvider>
      <Stack.Navigator initialRouteName="Home" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="Admin" component={AdminUsersScreen} />
        <Stack.Screen name="MovieDetails" component={MovieDetails} />
        <Stack.Screen name="Favorites" component={FavoritesScreen} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
        <Stack.Screen name="BoughtTickets" component={BoughtTickets} />
        <Stack.Screen name="AdminPanel" component={AdminPanel} />
        <Stack.Screen name="EditEvent" component={EditEventScreen} />
        <Stack.Screen name="OrganizerRequestScreen" component={OrganizerRequestScreen} />
        <Stack.Screen name="VideoPlayer" component={VideoPlayerScreen} />

      </Stack.Navigator>
    </FavoritesProvider>
  );
}
