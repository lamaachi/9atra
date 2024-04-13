import React from 'react';
import { StyleSheet, SafeAreaView, Image } from 'react-native';
import { useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

function SplashScreen({navigation}) {


  const checkToken = async () => {
    try {
      // Wait for 2 seconds
      setTimeout(async () => {
        const token = await AsyncStorage.getItem('jwtToken');
        const useremail = await AsyncStorage.getItem('username');
        console.log(token)
        console.log(useremail)
        if (token) {
          // Navigate to Home or any other screen if token exists
          navigation.navigate('main');
        } else {
          // Navigate to Login screen if token doesn't exist
          navigation.navigate('login');
        }
      }, 2000);
    } catch (error) {
      console.error('Error checking token:', error);
    }
  };

  
  useEffect(() => {
    checkToken();
  }, [navigation]);


  return (
    <SafeAreaView style={styles.container}>
      <Image 
        source={require('../../assets/logo.png')} 
        style={styles.logo}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
  },
});

export default SplashScreen;
