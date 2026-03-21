import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { StatusBar, StyleSheet, Text, View } from 'react-native';

export default function Index() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace('/login');
    }, 10000);

})

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      <Text style={styles.welcome}>WELCOME</Text>

      <View style={styles.centerContent}>
        <Text style={styles.appName}>
          Smart <Text style={styles.highlight}>Vision</Text> AR
        </Text>

        <View style={styles.divider} />

        <Text style={styles.tagline}>
          Detect objects and try products using AI
        </Text>
      </View>

      <Text style={styles.loading}>LOADING...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a', 
    justifyContent: 'center',
    alignItems: 'center',
  },
  welcome: {
    position: 'absolute',
    top: 60,
    fontSize: 22,
    color: '#888',
    letterSpacing: 3,
  },
  centerContent: {
    alignItems: 'center',
  },
  appName: {
    fontSize: 26,
    color: '#fff',
    fontWeight: '700',
    letterSpacing: 1.5,
  },
  highlight: {
    color: '#00E5FF', 
  },
  divider: {
    height: 1,
    width: 120,
    backgroundColor: '#222',
    marginVertical: 20,
  },
  tagline: {
    fontSize: 14,
    color: '#aaa',
    textAlign: 'center',
    paddingHorizontal: 40,
    lineHeight: 20,
  },
  loading: {
    position: 'absolute',
    bottom: 40,
    fontSize: 12,
    color: '#666',
    letterSpacing: 4,
  },
});