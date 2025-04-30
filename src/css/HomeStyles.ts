import { StyleSheet, Dimensions } from 'react-native';

const { height } = Dimensions.get('window');

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#3e3e3e',
    position: 'relative',
  },

  fixedHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
  },

  fixedBottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 100,
  },

  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    backgroundColor: '#2C2C2C',
    padding: 10,
    color: 'white',
  },

  carouselContainer: {
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    marginTop: 55,
  },

  carouselItem: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 250,
    overflow: 'hidden',
    backgroundColor: 'transparent',
  },

  carouselImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },

  movieContainer: {
    flex: 1,
    margin: 5,
    alignItems: 'center',
  },

  movieImageContainer: {
    position: 'relative',
    width: '100%',
    aspectRatio: 2 / 3,
  },

  movieImage: {
    width: '100%',
    height: '100%',
    borderRadius: 7,
  },

  favoriteIcon: {
    position: 'absolute',
    top: 10,
    left: 10,
    zIndex: 1,
  },

  movieTitle: {
    marginTop: 5,
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    color: 'white',
  },

  upcomingEventList: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 10,
  },

  upcomingEvent: {
    width: 150,
    height: 270,
    marginRight: 10,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },

  upcomingEventImage: {
    width: '100%',
    height: 160,
    resizeMode: 'cover',
    borderRadius: 12,
  },

  upcomingEventTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'Arial, sans-serif',
    color: '#333',
    textAlign: 'center',
    marginBottom: 8,
  },
});

export default styles;
