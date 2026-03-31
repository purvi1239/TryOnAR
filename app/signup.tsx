
import { useRouter } from 'expo-router';
import LottieView from 'lottie-react-native';
import React, { useState } from 'react';
import {
  Alert,
  Animated,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

// 🔥 Floating Input Component
const FloatingInput = ({ label, value, onChangeText, secureTextEntry, keyboardType }: any) => {
  const [isFocused, setIsFocused] = useState(false);
  const animatedValue = useState(new Animated.Value(value ? 1 : 0))[0];

  const handleFocus = () => {
    setIsFocused(true);
    Animated.timing(animatedValue, {
      toValue: 1,
      duration: 200,
      useNativeDriver: false,
    }).start();
  };

  const handleBlur = () => {
    setIsFocused(false);
    if (!value) {
      Animated.timing(animatedValue, {
        toValue: 0,
        duration: 200,
        useNativeDriver: false,
      }).start();
    }
  };

  const labelStyle = {
    position: 'absolute' as const,
    left: 15,
    top: animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: [18, -10],
    }),
    fontSize: animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: [16, 12],
    }),
    color: '#9966CC',
  };

  return (
    <View style={{ marginBottom: 25 }}>
      <Animated.Text style={labelStyle}>{label}</Animated.Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        style={[
          styles.input,
          isFocused && styles.inputFocused
        ]}
        onFocus={handleFocus}
        onBlur={handleBlur}
      />
    </View>
  );
};

export default function SignUpScreen() {
  const router = useRouter();

  const [name, setName] = useState('');
  const [gender, setGender] = useState('');
  const [college, setCollege] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignUp = () => {
    if (!name || !gender || !college || !email || !password) {
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
        />
        <View style={styles.overlay} />
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.container}>

          <Text style={styles.title}>Sign Up</Text>

          <FloatingInput label="Full Name" value={name} onChangeText={setName} />

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

          <FloatingInput label="College" value={college} onChangeText={setCollege} />

          <FloatingInput label="Phone (Optional)" value={phone} onChangeText={setPhone} keyboardType="phone-pad" />

          <FloatingInput label="Email" value={email} onChangeText={setEmail} keyboardType="email-address" />

          <FloatingInput label="Password" value={password} onChangeText={setPassword} secureTextEntry />

          <TouchableOpacity style={styles.button} onPress={handleSignUp}>
            <Text style={styles.buttonText}>Sign Up</Text>
          </TouchableOpacity>

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
    backgroundColor: 'rgba(10,10,10,0.2)',
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#F5F7FB',
    textAlign: 'center',
    marginBottom: 30,
    textShadowColor: '#9966CC',
    textShadowRadius: 15,
  },
  input: {
    backgroundColor: 'rgba(20,20,20,0.7)',
    padding: 18,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#444',
    color: '#fff',
  },
  inputFocused: {
    borderColor: '#9966CC',
    shadowColor: '#9966CC',
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 8,
  },

  genderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 25,
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
    color: '#fff',
    fontWeight: '600',
  },

  button: {
    backgroundColor: '#9966CC',
    paddingVertical: 18,
    borderRadius: 15,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
});