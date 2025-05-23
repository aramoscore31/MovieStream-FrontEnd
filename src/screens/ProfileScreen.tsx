import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Alert, TextInput } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../app/index';
import { styles } from '../css/ProfileStyles';
import Header from '../components/Header';

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
    const [walletBalance, setWalletBalance] = useState<number>(0);
    const [addMoneyInput, setAddMoneyInput] = useState<string>('');
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [showChangePasswordForm, setShowChangePasswordForm] = useState(false);
    const [subscriptionActive, setSubscriptionActive] = useState<boolean>(false);
    const [subscriptionEndDate, setSubscriptionEndDate] = useState<string | null>(null);

    useEffect(() => {
        const checkSession = async () => {
            const token = await AsyncStorage.getItem('token');
            if (!token) {
                navigation.navigate('Login');
            } else {
                checkSubscriptionStatus(token);
                getUserData(token);
            }
        };

        checkSession();
    }, []);

    const checkSubscriptionStatus = async (token: string) => {
        try {
            const response = await fetch('http://192.168.1.87:8080/api/subscription/check-subscription', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
    
            if (!response.ok) {
                const errorText = await response.text(); // Obtener el contenido de la respuesta si no es JSON
                console.error('Error de respuesta:', errorText);
                Alert.alert('Error', 'Hubo un problema al verificar el estado de la suscripción.');
                return;
            }
    
            // Intentamos parsear la respuesta como JSON
            const data = await response.json();
            console.log('Datos de la suscripción:', data);
    
            // Procesar la respuesta
            setSubscriptionActive(data.subscriptionActive);
            setSubscriptionEndDate(data.subscriptionEndDate ? new Date(data.subscriptionEndDate).toLocaleDateString() : null);
        } catch (err) {
            console.error('Error checking subscription:', err);
            Alert.alert('Error', 'Hubo un problema al verificar el estado de la suscripción.');
        }
    };
    
    

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
                setWalletBalance(data.balance);
                setWalletBalance(Number(data.balance) || 0);
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

    const handleSubscribe = async () => {
        const fee = 10.0;

        if (walletBalance < fee) {
            Alert.alert('Saldo insuficiente', 'No tienes suficiente saldo para comprar la suscripción.');
            return;
        }

        const token = await AsyncStorage.getItem('token');
        if (!token) {
            Alert.alert('Error', 'Por favor, inicie sesión nuevamente.');
            return;
        }

        try {
            const response = await fetch('http://192.168.1.87:8080/api/subscription/subscribe', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    subscriptionFee: fee,
                }),
            });

            if (response.ok) {
                const data = await response.json();
                Alert.alert('Éxito', data);
                getUserData(token);  // Update user data after subscription
                checkSubscriptionStatus(token);  // Check the subscription status again after subscribing
            } else {
                Alert.alert('Error', 'Hubo un problema al procesar la suscripción.');
            }
        } catch (err) {
            console.error('Error al suscribirse:', err);
        }
    };

    const handleLogout = async () => {
        await AsyncStorage.removeItem('token');
        await AsyncStorage.removeItem('username');
        await AsyncStorage.removeItem('role');
        await AsyncStorage.removeItem('balance')

        setUsername(null);
        setRole(null);
        setEmail(null);
        setWalletBalance(0);
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

    const handleAddMoney = async () => {
        const amountString = addMoneyInput.replace(',', '.');
        const amount = parseFloat(amountString);

        if (isNaN(amount) || amount <= 0) {
            Alert.alert('Error', 'Por favor ingresa una cantidad válida.');
            return;
        }

        const token = await AsyncStorage.getItem('token');
        if (!token) {
            Alert.alert('Error', 'Por favor, inicie sesión nuevamente.');
            return;
        }

        try {
            const response = await fetch('http://192.168.1.87:8080/api/wallet/add', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    amount: amount,
                }),
            });

            if (response.ok) {
                const data = await response.json();
                getUserData(token);
                setAddMoneyInput('');
                Alert.alert('Éxito', 'Saldo agregado correctamente.');
            } else {
                Alert.alert('Error', 'No se pudo agregar el saldo.');
            }
        } catch (err) {
            getUserData(token);
        }
    };

    const renderProfileDetails = () => (
        <View style={styles.mainContent}>
            <Text style={styles.profileTitle}>Bienvenido, {username}</Text>
            <Text style={styles.profileInfo}>Correo: {email}</Text>
            <Text style={styles.profileInfo}>Rol: {role}</Text>
            {subscriptionEndDate && (
                <Text style={styles.profileInfo}>Suscripción activa hasta: {subscriptionEndDate}</Text>
            )}
            <Text style={styles.profileInfo}>Saldo: ${walletBalance.toFixed(2)}</Text>

            <TextInput
                style={styles.input}
                placeholder="Cantidad a agregar"
                keyboardType="numeric"
                value={addMoneyInput}
                onChangeText={setAddMoneyInput}
            />
            <TouchableOpacity onPress={handleAddMoney} style={styles.button}>
                <Text style={styles.buttonText}>Agregar dinero</Text>
            </TouchableOpacity>

            {subscriptionActive ? (
                <Text style={styles.successText}>¡Ya estás suscrito!</Text>
            ) : (
                <TouchableOpacity onPress={handleSubscribe} style={styles.button}>
                    <Text style={styles.buttonText}>Comprar suscripción</Text>
                </TouchableOpacity>
            )}

            <TouchableOpacity onPress={() => setShowChangePasswordForm(!showChangePasswordForm)} style={styles.button}>
                <Text style={styles.buttonText}>
                    {showChangePasswordForm ? 'Ocultar Formulario' : 'Cambiar Contraseña'}
                </Text>
            </TouchableOpacity>

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

                    <TouchableOpacity onPress={handleChangePassword} style={styles.button}>
                        <Text style={styles.buttonText}>Cambiar Contraseña</Text>
                    </TouchableOpacity>
                </View>
            )}

            <TouchableOpacity onPress={handleDeleteAccount} style={styles.button}>
                <Text style={styles.buttonText}>Eliminar Cuenta</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleLogout} style={styles.button}>
                <Text style={styles.buttonText}>Cerrar Sesión</Text>
            </TouchableOpacity>

        </View>
    );

    return (
        <View style={styles.container}>
            <Header navigation={navigation} username={username} />
            {renderProfileDetails()}
        </View>
    );
};

export default ProfileScreen;
