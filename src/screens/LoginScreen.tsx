import React, { useState } from 'react';
import { SafeAreaView, View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import auth from '@react-native-firebase/auth'; // Import Firebase auth

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignUp = () => {
    if (email.length === 0 || password.length === 0) {
      Alert.alert("Error", "Please enter email and password.");
      return;
    }
    auth()
      .createUserWithEmailAndPassword(email, password)
      .then(() => {
        console.log('User account created & signed in!');
      })
      .catch(error => {
        if (error.code === 'auth/email-already-in-use') {
          Alert.alert('That email address is already in use!');
        }
        if (error.code === 'auth/invalid-email') {
          Alert.alert('That email address is invalid!');
        }
        console.error(error);
      });
  };

  const handleLogin = () => {
    if (email.length === 0 || password.length === 0) {
      Alert.alert("Error", "Please enter email and password.");
      return;
    }
    auth()
      .signInWithEmailAndPassword(email, password)
      .then(() => {
        console.log('User signed in!');
      })
      .catch(error => {
        Alert.alert("Login Failed", "Please check your email and password.");
        console.error(error);
      });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>SuperIntern</Text>
        <Text style={styles.subtitle}>Welcome back! Sign in to continue your journey</Text>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Password</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </View>

        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Sign In</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleSignUp}>
           <Text style={styles.signUpText}>Don't have an account? <Text style={{fontWeight: 'bold'}}>Sign up for free</Text></Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

// Add the styles from the previous step here...
const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F9FAFB' },
    content: { flex: 1, justifyContent: 'center', padding: 24 },
    title: { fontSize: 36, fontWeight: 'bold', color: '#6366F1', textAlign: 'center', marginBottom: 8 },
    subtitle: { fontSize: 16, color: '#6B7280', textAlign: 'center', marginBottom: 40 },
    inputContainer: { marginBottom: 20 },
    label: { fontSize: 14, color: '#374151', marginBottom: 8 },
    input: { backgroundColor: '#FFFFFF', paddingHorizontal: 16, paddingVertical: 12, borderRadius: 12, borderWidth: 1, borderColor: '#E5E7EB', fontSize: 16 },
    button: { backgroundColor: '#6366F1', paddingVertical: 16, borderRadius: 12, alignItems: 'center', marginTop: 20 },
    buttonText: { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold' },
    signUpText: { color: '#6B7280', textAlign: 'center', marginTop: 24 },
});


export default LoginScreen;