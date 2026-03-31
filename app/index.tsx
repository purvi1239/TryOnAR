
import { useRouter } from 'expo-router';
import LottieView from 'lottie-react-native';
import React, { useEffect, useRef } from 'react';
import { Animated, StatusBar, View } from 'react-native';
import { StyleSheet } from 'react-native';
export default function Index() {
  const router = useRouter();

  const moveAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    
    Animated.timing(moveAnim, {
      toValue: -40,
      duration: 1500,
      useNativeDriver: true,
    }).start();

    
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 2000,
      delay: 1000,
      useNativeDriver: true,
    }).start();

    
    const timer = setTimeout(() => {
      router.push('/login');
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: '#000',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <StatusBar barStyle="light-content" />

      
      <Animated.View
        style={{
          transform: [{ translateY: moveAnim }],
          alignItems: 'center',
        }}
      >
        
        <LottieView
          source={require('../assets/animations/scan-ring.json')}
          autoPlay
          loop
          style={{
            position: 'absolute',
            width: 260,
            height: 300,
            opacity: 1.0, // reduced intensity
          }}
        />

      
        <LottieView
          source={require('../assets/animations/face-scan.json')}
          autoPlay
          loop={false}
          style={{
            width: 200,
            height: 200,
            opacity: 1.0,
          }}
        />
      </Animated.View>

      <Animated.Text
        style={{
          opacity: fadeAnim,
          color: "#9966CC", 
          fontSize: 25, 
          marginTop: 70, 
          fontWeight: '600',
          fontFamily:"Poppins-bold",
          letterSpacing: 1.5,
          textShadowColor: '#9966CC',
          textShadowOffset: { width: 0, height: 0 },
          textShadowRadius: 12,
        }}
      >
        Smart Vision AR
      </Animated.Text>
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
    fontSize: 20,
    color: '#666',
    letterSpacing: 4,
  },
});

