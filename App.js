import { Provider } from 'react-redux';
import { StyleSheet, Text, View } from 'react-native';
import SplashScreen from './src/screens/SplashScreen';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import LoginScreen from './src/screens/auth/LoginScreen';
import RegisterScreen from './src/screens/auth/RegisterScreen';
import 'react-native-gesture-handler';
import { store } from './src/store';
import MainContent from './src/screens/MainContent';

const Stack = createStackNavigator();

export default function App() {
  return (
      <Provider store={store}>
        <NavigationContainer>
          <Stack.Navigator  initialRouteName='Splash'>
            <Stack.Screen options={{headerShown:false}} name='Splash' component={SplashScreen}/>
            <Stack.Screen options={{headerShown:false}} name='login' component={LoginScreen}/>
            <Stack.Screen options={{headerShown:false}} name='register' component={RegisterScreen}/>
            <Stack.Screen options={{headerShown:false}} name='main' component={MainContent}/>
          </Stack.Navigator>
        </NavigationContainer>  
      </Provider>
      
    
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
