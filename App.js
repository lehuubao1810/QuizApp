import { StatusBar } from 'expo-status-bar';
import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Ionicons from 'react-native-vector-icons/Ionicons';
import HomeScreen from './screens/Home';
import GuideScreen from './screens/Guide';
import QuizScreen from './screens/Quiz';

const Tab = createBottomTabNavigator();

function HomeStack() {
  return (
    <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ focused, color, size }) => {
        let iconName;

        if (route.name === 'Home') {
          iconName = focused
            ? 'home'
            : 'home-outline';
        } else if (route.name === 'Guide') {
          iconName = focused ? 'book' : 'book-outline';
        }

        return <Ionicons name={iconName} size={size} color={color} />;
      },
      tabBarActiveTintColor: 'tomato',
      tabBarInactiveTintColor: 'gray',
    })}
    >
        <Tab.Screen name="Home" component={HomeScreen} options={{headerShown: false, title: "Trang chủ"}} />
        <Tab.Screen name="Guide" component={GuideScreen} options={{headerShown: false, title: "Hướng dẫn"}}/>
      </Tab.Navigator>
  );
}

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="HomeTab" component={HomeStack} options={{ tabBarBadge: 3 }} />
        <Stack.Screen name="Quiz" component={QuizScreen} options={{ tabBarBadge: 4 }}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}


