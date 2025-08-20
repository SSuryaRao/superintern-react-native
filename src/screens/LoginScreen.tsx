import React, { useState, useEffect, useRef } from 'react';
import {
  SafeAreaView, View, Text, TextInput, TouchableOpacity,
  StyleSheet, Alert, StatusBar, KeyboardAvoidingView,
  ScrollView, Platform, Animated
} from 'react-native';

import auth from '@react-native-firebase/auth';
import { SvgXml } from 'react-native-svg';
import LinearGradient from 'react-native-linear-gradient';

import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { loginOrRegister } from '../api/api';

// --- Configuration for Google Sign-In ---
// Use the value below (already correct based on your previous config)
GoogleSignin.configure({
  webClientId: '679503283198-r3b5o2msale508rpd3geddpe4f8hcfn8.apps.googleusercontent.com', // <--- Copy from Google Cloud Console OAuth2 client for Android
  offlineAccess: true // If you want server-side auth, usually not needed for mobile
});

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    Animated.stagger(200, [
      Animated.timing(fadeAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 800, useNativeDriver: true }),
    ]).start();
  }, [fadeAnim, slideAnim]);

  // --- Handle Google Sign-In ---
  const onGoogleButtonPress = async () => {
    try {
      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
      const signInResponse = await GoogleSignin.signIn();

      if (!('idToken' in signInResponse) || typeof signInResponse.idToken !== 'string' || !signInResponse.idToken) {
        throw new Error('Google Sign-In failed: idToken is missing or invalid.');
      }

      const idToken = signInResponse.idToken;
      const googleCredential = auth.GoogleAuthProvider.credential(idToken);
      await auth().signInWithCredential(googleCredential);

      // Optional: Synchronize with backend
      await loginOrRegister();

      // Proceed to home/dashboard
      // navigation.replace("Dashboard"); // Uncomment if using react-navigation
      Alert.alert('Success', 'You are now signed in with Google!');
    } catch (error: any) {
      if (error.code === '12501') {
        return console.log('User cancelled the login flow');
      }
      Alert.alert("Google Sign-In Error", error.message);
    }
  };

  // --- Handle Email Sign-Up ---
  const handleSignUp = () => {
    if (!email || !password) {
      Alert.alert("Error", "Please enter email and password.");
      return;
    }

    auth().createUserWithEmailAndPassword(email, password)
      .then(async () => {
        await loginOrRegister();
        Alert.alert('Success', 'Your account was created!');
      })
      .catch(error => {
        if (error.code === 'auth/email-already-in-use') Alert.alert('Error', 'That email address is already in use!');
        else if (error.code === 'auth/invalid-email') Alert.alert('Error', 'That email address is invalid!');
        else Alert.alert("Sign Up Error", error.message);
      });
  };

  // --- Handle Email Login ---
  const handleLogin = () => {
    if (!email || !password) {
      Alert.alert("Error", "Please enter email and password.");
      return;
    }

    auth().signInWithEmailAndPassword(email, password)
      .then(async () => {
        await loginOrRegister();
        Alert.alert('Success', 'Signed in!');
      })
      .catch(() => Alert.alert("Login Failed", "Please check your email and password."));
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F0F5FF" />
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Animated.View style={[styles.card, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
            <Text style={styles.title}>SuperIntern</Text>
            <Text style={styles.subtitle}>Welcome back! Sign in to continue your journey</Text>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Email</Text>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.input}
                  placeholder="your@email.com"
                  autoCapitalize="none"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                />
              </View>
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Password</Text>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.input}
                  placeholder="Password"
                  secureTextEntry
                  value={password}
                  onChangeText={setPassword}
                />
              </View>
            </View>
            <TouchableOpacity style={[styles.button, { backgroundColor: "#6366F1" }]} onPress={handleLogin}>
              <Text style={styles.buttonText}>Sign In</Text>
            </TouchableOpacity>
            <View style={styles.dividerContainer}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>OR</Text>
              <View style={styles.dividerLine} />
            </View>
            <TouchableOpacity style={styles.googleButton} onPress={onGoogleButtonPress}>
              <Text style={styles.googleButtonText}>Sign in with Google</Text>
            </TouchableOpacity>
            <Animated.View style={styles.signUpCard}>
              <Text style={styles.signUpText}>
                Don't have an account?{' '}
                <Text style={{ color: "#6366F1", fontWeight: "bold" }} onPress={handleSignUp}>
                  Sign up for free
                </Text>
              </Text>
            </Animated.View>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F0F5FF' },
  scrollContent: { flexGrow: 1, justifyContent: 'center', padding: 24 },
  title: { fontSize: 40, fontWeight: 'bold', color: '#4338CA', textAlign: 'center', marginBottom: 8 },
  subtitle: { fontSize: 16, color: '#6B7280', textAlign: 'center', marginBottom: 40 },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 5,
  },
  inputContainer: { marginBottom: 20 },
  label: { fontSize: 14, color: '#374151', marginBottom: 8, fontWeight: '500' },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingHorizontal: 12,
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 8,
    fontSize: 16,
    color: '#111827',
  },
  button: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: "#4F46E5",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  buttonText: { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold' },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E5E7EB',
  },
  dividerText: {
    marginHorizontal: 12,
    color: '#6B7280',
    fontSize: 12,
    fontWeight: '500',
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  googleButtonText: {
    marginLeft: 12,
    color: '#374151',
    fontSize: 16,
    fontWeight: 'bold',
  },
  signUpCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    marginTop: 24,
    alignItems: 'center',
  },
  signUpText: { color: '#6B7280', textAlign: 'center' },
});

export default LoginScreen;
