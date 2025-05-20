import { StyleSheet, Dimensions } from 'react-native';

const { height } = Dimensions.get('window');

export const ComingSoonStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#3e3e3e',
  },
  headerContainer: {
    backgroundColor: '#2C2C2C',
    padding: 15,
    marginBottom: 10,
    borderTopWidth: 1,
    borderTopColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    color: 'white',
    backgroundColor: '#3498db',
    padding: 15,
    marginBottom: 10,
    borderTopWidth: 1,
    borderTopColor: 'white',
  },
  event: {
    flexDirection: 'row',
    marginBottom: 20,
    backgroundColor: '#34495e',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    maxHeight: 200,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
    marginHorizontal: 15,
  },
  eventImageContainer: {
    width: 120,
    height: 180,
    borderRadius: 10,
    overflow: 'hidden',
    marginRight: 15,
  },
  eventImage: {
    width: 100,
    height: 120,
    borderRadius: 5,
  },
  eventDetails: {
    flex: 1,
    justifyContent: 'space-between',
    marginLeft: 30,
  },
  eventTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
  },
  eventDate: {
    fontSize: 14,
    color: '#bdc3c7',
  },
  eventLocation: {
    fontSize: 14,
    color: '#bdc3c7',
    marginBottom: 10,
  },
  favoriteIcon: {
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  favoriteIconActive: {
    color: '#FFD700',
  },
  favoriteIconInactive: {
    color: '#7f8c8d',
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  filterButton: {
    padding: 10,
    backgroundColor: '#3498db',
    borderRadius: 5,
  },
  filterButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  pastEvent: {
    backgroundColor: '#e0e0e0',  // Fondo gris claro para los eventos pasados
    borderColor: '#bdbdbd',  // Borde gris más oscuro
    borderWidth: 1,
  },
  pastEventText: {
    color: 'gray',
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 5,
  },
  ongoingButton: {
    backgroundColor: '#3498db',  // Azul vibrante para "En curso"
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: '#3498db',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    marginHorizontal: 10,
    marginVertical: 10,
    shadowColor: '#3498db',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },

  ongoingButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },

  // Efecto hover para el botón En curso
  ongoingButtonPressed: {
    backgroundColor: '#2874A6', // Cambio de color cuando el botón es presionado
    borderColor: '#2874A6',
    transform: [{ scale: 0.98 }],  // Efecto de reducción para el click
  },

  // Botón Finalizadas
  completedButton: {
    backgroundColor: '#B0BEC5',  // Gris suave para "Finalizadas"
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: '#B0BEC5',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    marginHorizontal: 10,
    marginVertical: 10,
    shadowColor: '#B0BEC5',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },

  completedButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },

  // Efecto hover para el botón Finalizadas
  completedButtonPressed: {
    backgroundColor: '#90A4AE',  // Cambio de color cuando el botón es presionado
    borderColor: '#90A4AE',
    transform: [{ scale: 0.98 }],  // Efecto de reducción para el click
  },
  eventStars: {
  flexDirection: 'row', // Asegúrate de que las estrellas estén alineadas horizontalmente
  marginTop: 5,
}

});
