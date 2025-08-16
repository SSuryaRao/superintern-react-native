import React, { useState, useEffect, useRef } from 'react';
import { 
    SafeAreaView, View, Text, TextInput, TouchableOpacity, 
    StyleSheet, Alert, StatusBar, KeyboardAvoidingView, 
    ScrollView, Platform, Animated 
} from 'react-native';
import auth from '@react-native-firebase/auth';
import { SvgXml } from 'react-native-svg';
import LinearGradient from 'react-native-linear-gradient';

// --- SVG Icons ---
const emailIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>`;
const lockIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>`;

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    // Staggered animation effect on component mount
    Animated.stagger(200, [
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, slideAnim]);

  const handleSignUp = () => {
    if (!email || !password) {
      Alert.alert("Error", "Please enter email and password.");
      return;
    }
    auth().createUserWithEmailAndPassword(email, password)
      .then(() => console.log('User account created & signed in!'))
      .catch(error => {
        if (error.code === 'auth/email-already-in-use') Alert.alert('Error', 'That email address is already in use!');
        else if (error.code === 'auth/invalid-email') Alert.alert('Error', 'That email address is invalid!');
        else Alert.alert("Sign Up Error", error.message);
      });
  };

  const handleLogin = () => {
    if (!email || !password) {
      Alert.alert("Error", "Please enter email and password.");
      return;
    }
    auth().signInWithEmailAndPassword(email, password)
      .then(() => console.log('User signed in!'))
      .catch(() => Alert.alert("Login Failed", "Please check your email and password."));
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
            <Text style={styles.title}>SuperIntern</Text>
            <Text style={styles.subtitle}>Welcome back! Sign in to continue your journey</Text>
          </Animated.View>

          <Animated.View style={[styles.card, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Email</Text>
              <View style={styles.inputWrapper}>
                <SvgXml xml={emailIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Enter your email"
                  placeholderTextColor="#9CA3AF"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Password</Text>
              <View style={styles.inputWrapper}>
                <SvgXml xml={lockIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Enter your password"
                  placeholderTextColor="#9CA3AF"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                />
              </View>
            </View>
            
            <TouchableOpacity onPress={handleLogin}>
                <LinearGradient
                    colors={['#8B5CF6', '#6366F1']}
                    style={styles.button}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                >
                    <Text style={styles.buttonText}>Sign In</Text>
                </LinearGradient>
            </TouchableOpacity>

             <TouchableOpacity>
                <Text style={styles.forgotText}>Forgot password?</Text>
            </TouchableOpacity>
          </Animated.View>

          <Animated.View style={[styles.signUpCard, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
            <TouchableOpacity onPress={handleSignUp}>
              <Text style={styles.signUpText}>Don't have an account? <Text style={{fontWeight: 'bold', color: '#6366F1'}}>Sign up for free</Text></Text>
            </TouchableOpacity>
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
        marginTop: 10,
        shadowColor: "#4F46E5",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 8,
    },
    buttonText: { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold' },
    forgotText: {
        color: '#6366F1',
        textAlign: 'center',
        marginTop: 16,
        fontWeight: '500'
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