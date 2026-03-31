import { useRouter } from 'expo-router';
import LottieView from 'lottie-react-native';
import React, { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

export default function SignUpScreen() {
  const router = useRouter();

  const [name, setName] = useState('');
  const [gender, setGender] = useState('');
  const [college, setCollege] = useState('');
  const [phone, setPhone] = useState(''); // optional
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignUp = () => {
    if (
      name.trim() === '' ||
      gender.trim() === '' ||
      college.trim() === '' ||
      email.trim() === '' ||
      password.trim() === ''
    ) {
      Alert.alert('Error', 'Please fill all required fields');
    } else {
      router.replace('/home');
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#0a0a0a' }}>
      
      <View style={StyleSheet.absoluteFillObject}>
        <LottieView
          source={require('../assets/animations /scan-ring.json')}
          autoPlay
          loop
          style={styles.backgroundAnimation}
          resizeMode="cover"
        />
        <View style={styles.overlay} />
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.container}>
          
          <Text style={styles.title}>Sign Up</Text>

          {/* Name */}
          <TextInput
            style={styles.input}
            placeholder="Full Name"
            value={name}
            onChangeText={setName}
            placeholderTextColor="#9CA3AF"
          />

          {/* Gender */}
          <View style={styles.genderContainer}>
            {['Male', 'Female', 'Other'].map((item) => (
              <TouchableOpacity
                key={item}
                onPress={() => setGender(item)}
                style={[
                  styles.genderBtn,
                  gender === item && styles.genderSelected
                ]}
              >
                <Text style={styles.genderText}>{item}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* College */}
          <TextInput
            style={styles.input}
            placeholder="College Name"
            value={college}
            onChangeText={setCollege}
            placeholderTextColor="#9CA3AF"
          />

          {/* Phone (Optional) */}
          <TextInput
            style={styles.input}
            placeholder="Phone Number (Optional)"
            value={phone}
            onChangeText={setPhone}
            placeholderTextColor="#9CA3AF"
            keyboardType="phone-pad"
          />

          {/* Email */}
          <TextInput
            style={styles.input}
            placeholder="Enter Email"
            value={email}
            onChangeText={setEmail}
            placeholderTextColor="#9CA3AF"
            keyboardType="email-address"
          />

          {/* Password */}
          <TextInput
            style={styles.input}
            placeholder="Enter Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            placeholderTextColor="#9CA3AF"
          />

          {/* Button */}
          <TouchableOpacity style={styles.button} onPress={handleSignUp}>
            <Text style={styles.buttonText}>Sign Up</Text>
          </TouchableOpacity>

          {/* Footer */}
          <Text style={styles.footerText}>
            Already have an account?{' '}
            <Text style={styles.loginText} onPress={() => router.push('/login')}>
              Login
            </Text>
          </Text>

        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 30,
  },
  backgroundAnimation: {
    width: '100%',
    height: '100%',
    opacity: 0.4,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(10, 10, 10, 0.2)',
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#F5F7FB',
    textAlign: 'center',
    marginBottom: 30,
    textShadowColor: '#9966CC',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 15,
  },
  input: {
    backgroundColor: 'rgba(20, 20, 20, 0.7)',
    padding: 18,
    borderRadius: 15,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#9966CC',
    color: '#FFFFFF',
  },

  // Gender styles
  genderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  genderBtn: {
    flex: 1,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#9966CC',
    marginHorizontal: 5,
    alignItems: 'center',
    backgroundColor: 'rgba(20,20,20,0.7)',
  },
  genderSelected: {
    backgroundColor: '#9966CC',
  },
  genderText: {
    color: '#F5F7FB',
    fontWeight: '600',
  },

  button: {
    backgroundColor: '#9966CC',
    paddingVertical: 18,
    borderRadius: 15,
    alignItems: 'center',
    marginTop: 10,
    elevation: 5,
    shadowColor: '#9966CC',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  buttonText: {
    color: '#F5F7FB',
    fontSize: 20,
    fontWeight: 'bold',
  },
  footerText: {
    textAlign: 'center',
    marginTop: 25,
    color: '#F5F7FB',
    fontSize: 14,
  },
  loginText: {
    color: '#9966CC',
    fontWeight: 'bold',
  },
});
