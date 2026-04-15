export const authTemplates = {
  context: `import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStorageData();
  }, []);

  async function loadStorageData() {
    try {
      const authDataSerialized = await AsyncStorage.getItem('@AuthData');
      if (authDataSerialized) {
        setUser(JSON.parse(authDataSerialized));
      }
    } catch (error) {
    } finally {
      setLoading(true);
    }
  }

  const signIn = async (email, password) => {
    // Implement your login logic here
    const mockUser = { id: '1', name: 'Pro Developer', email };
    setUser(mockUser);
    await AsyncStorage.setItem('@AuthData', JSON.stringify(mockUser));
  };

  const signOut = async () => {
    await AsyncStorage.removeItem('@AuthData');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
`,
  loginScreen: `import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { LogIn, Mail, Lock } from 'lucide-react-native';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { signIn } = useAuth();

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
      <View style={styles.header}>
        <LogIn color="#6366f1" size={48} />
        <Text style={styles.title}>Welcome Back</Text>
        <Text style={styles.subtitle}>Sign in to continue your journey</Text>
      </View>

      <View style={styles.form}>
        <View style={styles.inputContainer}>
          <Mail color="#94a3b8" size={20} />
          <TextInput 
            style={styles.input} 
            placeholder="Email Address" 
            placeholderTextColor="#94a3b8"
            value={email}
            onChangeText={setEmail}
          />
        </View>

        <View style={styles.inputContainer}>
          <Lock color="#94a3b8" size={20} />
          <TextInput 
            style={styles.input} 
            placeholder="Password" 
            placeholderTextColor="#94a3b8" 
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
        </View>

        <TouchableOpacity style={styles.button} onPress={() => signIn(email, password)}>
          <Text style={styles.buttonText}>Sign In</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f172a', padding: 20, justifyContent: 'center' },
  header: { alignItems: 'center', marginBottom: 40 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#f8fafc', marginTop: 15 },
  subtitle: { color: '#94a3b8', marginTop: 5 },
  form: { width: '100%' },
  inputContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1e293b', padding: 15, borderRadius: 12, marginBottom: 15 },
  input: { flex: 1, color: '#fff', marginLeft: 10 },
  button: { backgroundColor: '#6366f1', padding: 18, borderRadius: 12, alignItems: 'center', marginTop: 10 },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 }
});
`,
};
