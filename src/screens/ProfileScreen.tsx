import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, Alert, TextInput } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { styles } from '../css/ProfileSyles';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RootStackParamList } from '../../app/index';
import Header from '../components/Header';
import { StackNavigationProp } from '@react-navigation/stack';

type ProfileScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Profile'>;

interface ProfileScreenProps {
    navigation: ProfileScreenNavigationProp;
}

const ProfileScreen: React.FC<ProfileScreenProps> = ({ navigation }) => {
    const [username, setUsername] = useState<string | null>(null);
    const [role, setRole] = useState<string | null>(null);
    const [email, setEmail] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [showRecommendationBar, setShowRecommendationBar] = useState(false);

    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [showChangePasswordForm, setShowChangePasswordForm] = useState(false);

    useEffect(() => {
        const checkSession = async () => {
            const token = await AsyncStorage.getItem('token');
            if (!token) {
                navigation.navigate('Login');
            } else {
                getUserData(token);
            }
        };

        checkSession();
    }, []);

    const getUserData = async (token: string) => {
        try {
            const response = await fetch('http://192.168.1.87:8080/api/auth/profile/me', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                const data = await response.json();
                setUsername(data.username);
                setRole(data.role);
                setEmail(data.email);
            } else {
                Alert.alert('Error', 'No se pudo cargar los datos del perfil.');
            }
        } catch (err) {
            console.error('Error fetching profile data:', err);
            Alert.alert('Error', 'Hubo un problema al cargar los datos del perfil.');
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        await AsyncStorage.removeItem('token');
        await AsyncStorage.removeItem('username');
        await AsyncStorage.removeItem('role');

        setUsername(null);
        setRole(null);
        setEmail(null);
        setShowRecommendationBar(false);
        navigation.navigate('Login');
    };

    const handleDeleteAccount = async () => {
        Alert.alert(
            'Confirmar eliminación',
            '¿Estás seguro de que deseas eliminar tu cuenta? Esta acción no puede deshacerse.',
            [
                {
                    text: 'Cancelar',
                    style: 'cancel',
                },
                {
                    text: 'Eliminar',
                    onPress: async () => {
                        try {
                            const token = await AsyncStorage.getItem('token');
                            if (!token) {
                                throw new Error('No token found');
                            }

                            const response = await fetch('http://192.168.1.87:8080/api/auth/selfdelete', {
                                method: 'DELETE',
                                headers: {
                                    'Authorization': `Bearer ${token}`,
                                    'Content-Type': 'application/json',
                                },
                            });

                            if (!response.ok) {
                                throw new Error('Failed to delete account');
                            }

                            Alert.alert('Cuenta eliminada', 'Tu cuenta ha sido eliminada correctamente.');
                            handleLogout();
                            navigation.navigate('Login');
                        } catch (err) {
                            Alert.alert('Error', 'Hubo un error al eliminar tu cuenta.');
                        }
                    },
                },
            ]
        );
    };

    const handleChangePassword = async () => {
        if (!currentPassword || !newPassword || !confirmNewPassword) {
            setPasswordError('Por favor completa todos los campos.');
            return;
        }

        if (newPassword !== confirmNewPassword) {
            setPasswordError('Las contraseñas no coinciden.');
            return;
        }

        if (newPassword.length < 6) {
            setPasswordError('La nueva contraseña debe tener al menos 6 caracteres.');
            return;
        }

        setPasswordError('');

        try {
            const token = await AsyncStorage.getItem('token');
            if (!token) {
                Alert.alert('No token found', 'Please log in again.');
                return;
            }

            const response = await fetch('http://192.168.1.87:8080/api/auth/update-password', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    password: newPassword,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to update password');
            }

            Alert.alert('Contraseña cambiada', 'Tu contraseña ha sido cambiada correctamente.');
            setCurrentPassword('');
            setNewPassword('');
            setConfirmNewPassword('');
            setShowChangePasswordForm(false);
        } catch (err) {
            Alert.alert('Error', 'Hubo un problema al cambiar tu contraseña.');
        }
    };

    const renderGradientButton = (text: string, onPress: () => void) => {
        return (
            <LinearGradient
                colors={['#3498db', '#9b59b6']} // Example gradient colors (replace with the colors from your logo)
                style={styles.button} // Usar el estilo de botón definido
            >
                <TouchableOpacity onPress={onPress} style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={[styles.buttonText, { color: 'white', textShadowColor: 'rgba(0, 0, 0, 0.75)', textShadowOffset: { width: 1, height: 1 }, textShadowRadius: 3 }]}>
                        {text}
                    </Text>
                </TouchableOpacity>
            </LinearGradient>
        );
    };

    const renderProfileDetails = () => (
        <View style={styles.mainContent}>
            <Text style={styles.profileTitle}>Bienvenido, {username}</Text>
            <Text style={styles.profileInfo}>Correo: {email}</Text>
            <Text style={styles.profileInfo}>Rol: {role}</Text>

            {renderGradientButton(showChangePasswordForm ? 'Ocultar Formulario' : 'Cambiar Contraseña', () => setShowChangePasswordForm(!showChangePasswordForm))}

            {showChangePasswordForm && (
                <View>
                    <TextInput
                        style={styles.input}
                        placeholder="Contraseña actual"
                        secureTextEntry
                        value={currentPassword}
                        onChangeText={setCurrentPassword}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Nueva contraseña"
                        secureTextEntry
                        value={newPassword}
                        onChangeText={setNewPassword}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Confirmar nueva contraseña"
                        secureTextEntry
                        value={confirmNewPassword}
                        onChangeText={setConfirmNewPassword}
                    />
                    {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}

                    {renderGradientButton('Cambiar Contraseña', handleChangePassword)}
                </View>
            )}

            {renderGradientButton('Eliminar Cuenta', handleDeleteAccount)}
            {renderGradientButton('Cerrar Sesión', handleLogout)}
            {renderGradientButton('Solicitar ser organizador', () => navigation.navigate('OrganizerRequestScreen'))}
        </View>
    );

    return (
        <View style={styles.container}>
            <Header navigation={navigation} username={username || ''} />
            {renderProfileDetails()}
        </View>
    );
};

export default ProfileScreen;