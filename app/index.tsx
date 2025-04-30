import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../src/screens/HomeScreen';
import LoginScreen from '../src/screens/LoginScreen';
import RegisterScreen from '../src/screens/RegisterScreen';
import RecommendationsScreen from '../src/screens/RecommendationsScreen';
import ComingSoonScreen from '../src/screens/ComingSoonScreen';
import HelpScreen from '../src/screens/HelpScreen';
import AdminUsersScreen from '@/src/screens/AdminUsersScreen';
import FavoritesScreen from '@/src/screens/FavoritesScreen';
import ProfileScreen from '@/src/screens/ProfileScreen';
import ShoppingCartScreen from '@/src/screens/ShoppingCartScreen';
import BoughtTickets from '@/src/screens/BoughtTickets';
import CategoriasScreen from '@/src/screens/CategoriasScreen';
import EventsByCategoryScreen from '@/src/screens/EventsByCategoryScreen';
import AdminPanel from '@/src/screens/AdminPanel';
import EditEventScreen from '@/src/screens/EditEventScreen';
import { MovieData } from '../types/movieTypes';
import OrganizerRequestScreen from '@/src/screens/OrganizerRequestScreen';
import MovieDetails from '@/src/screens/MovieDetails';

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
  EditEvent: { eventId: number };
  OrganizerRequestScreen: undefined;
  MovieDetails: { movie: MovieData };
};

const Stack = createStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    <Stack.Navigator initialRouteName="Home" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="Recommendations" component={RecommendationsScreen} />
      <Stack.Screen name="ComingSoon" component={ComingSoonScreen} />
      <Stack.Screen name="Help" component={HelpScreen} />
      <Stack.Screen name="Admin" component={AdminUsersScreen} />
      <Stack.Screen name="MovieDetails" component={MovieDetails} />
      <Stack.Screen name="Favorites" component={FavoritesScreen} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen name="ShoppingCart" component={ShoppingCartScreen} />
      <Stack.Screen name="BoughtTickets" component={BoughtTickets} />
      <Stack.Screen name="Categories" component={CategoriasScreen} />
      <Stack.Screen name="EventsByCategoryScreen" component={EventsByCategoryScreen} /> 
      <Stack.Screen name="AdminPanel" component={AdminPanel} />
      <Stack.Screen name="EditEvent" component={EditEventScreen} />
      <Stack.Screen name="OrganizerRequestScreen" component={OrganizerRequestScreen} />

    </Stack.Navigator>
  );
}
