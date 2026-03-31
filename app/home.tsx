import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function HomeScreen() {

  const router = useRouter();
  const handlePress = (option: string) => {
    console.log(option);
    // later you can navigate:
    // router.push('/try-lens') etc.

    if (option === 'DIRECT TRYONS') {
      router.push('/ecommerce');
    }

  };

  return (
    <View style={styles.container}>

      {/* App Title */}
      <Text style={styles.title}>TRY ON AR</Text>

      {/* Buttons */}
      <View style={styles.buttonContainer}>

        <TouchableOpacity
          style={styles.button}
          onPress={() => handlePress('TRY LENS')}
        >
          <Text style={styles.buttonText}>TRY LENS</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => handlePress('DETECT OBJECT')}
        >
          <Text style={styles.buttonText}>DETECT OBJECT</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => handlePress('DIRECT TRYONS')}
        >
          <Text style={styles.buttonText}>DIRECT TRYONS</Text>
        </TouchableOpacity>

      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000', // black theme
    alignItems: 'center',
    justifyContent: 'center',
  },

  title: {
    color: '#fff',
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 50,
    letterSpacing: 2,
  },

  buttonContainer: {
    width: '80%',
  },

  button: {
    backgroundColor: '#1a1a1a',
    paddingVertical: 18,
    borderRadius: 12,
    marginBottom: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#333',
  },

  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 1,
  },
});