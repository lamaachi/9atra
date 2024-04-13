import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/user/HomeScreen';
import RdvScreen from '../screens/user/RdvScreen';
import ProfileScreen from '../screens/user/ProfileScreen';
import Icon from 'react-native-vector-icons/FontAwesome';
import { createStackNavigator } from '@react-navigation/stack';
import CentreScreen from '../screens/user/CentreScreen';

const Tab = createBottomTabNavigator();

const screens = [
  {
    name: 'Appointment',
    component: RdvScreen,
    icon: 'calendar',
  },
  {
    name: 'Profile',
    component: ProfileScreen,
    icon: 'user',
  },
];

const HomNavigation = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          const screen = screens.find((screen) => screen.name === route.name);
          if (screen) {
            return <Icon name={screen.icon} size={size} color={color} />;
          }
          return null;
        },
        tabBarActiveTintColor: '#FC2947',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: {
          display: 'flex',
        },
      })}
    >
      <Tab.Screen 
        name="HomeStack" 
        component={HomeStackScreen}
        options={{ 
          title: 'Home',
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Icon name="home" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen name="Appointment" component={RdvScreen} options={{ headerShown: false }} />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ headerShown: false }} />
    </Tab.Navigator>
  );
};

const HomeStackScreen = () => {
  return (
    <HomeStack.Navigator>
      <HomeStack.Screen 
        name="Home" 
        component={HomeScreen} 
        options={{ headerShown: false }} 
      />
      <HomeStack.Screen 
        name="Centre" 
        component={CentreScreen} 
        options={{ title: 'Centre' ,headerShown: false }} 
      />
    </HomeStack.Navigator>
  );
};

const HomeStack = createStackNavigator();

export default HomNavigation;
