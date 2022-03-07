/**
 * If you are not familiar with React Navigation, check out the "Fundamentals" guide:
 * https://reactnavigation.org/docs/getting-started
 *
 */
import { NavigationContainer, DefaultTheme, DarkTheme, useNavigation } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import * as React from 'react';
import { ColorSchemeName, View, Text, Image, useWindowDimensions, Pressable } from 'react-native';

import NotFoundScreen from '../screens/NotFoundScreen';
import { RootStackParamList } from '../types';
import LinkingConfiguration from './LinkingConfiguration';

import ChatRoomScreen from '../screens/ChatRoomScreen';
import HomeScreen from '../screens/HomeScreen';
import UsersScreen from '../screens/UsersScreen';

import ChatRoomHeader from './ChatRoomHeader';
import GroupInfoScreen from '../components/GroupInfoScreen';
import AuthScreen from '../screens/AuthScreen';
import Colors from '../constants/Colors';
import ConfirmationScreen from '../screens/ConfirmationScreen';
import ProfileEditScreen from '../screens/ProfileEditScreen';
import HomeHeader from './HomeHeader';

export default function Navigation({ colorScheme }: { colorScheme: ColorSchemeName }) {

  return (
    <NavigationContainer
      linking={LinkingConfiguration}
      theme={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <RootNavigator />
    </NavigationContainer>
  );
}

// A root stack navigator is often used for displaying modals on top of all other content
// Read more here: https://reactnavigation.org/docs/modal
const Stack = createStackNavigator<RootStackParamList>();

function ActionBarIcon() {
  return (
    <View style={{alignItems: 'center'}}>
      <Image
        source={{uri : 'https://www.candygaming.xyz/assets/images/logobrand-140x140.png'}}
        style={{ width: 80, height: 80, marginBottom: 15}} />
      <Text style={{color: 'white', fontSize: 20, fontWeight: 'bold'}}>
        Authentication
      </Text>
    </View>
  );
}

function RootNavigator() {
  return (
    <Stack.Navigator screenOptions={{headerTitleAlign: 'center'}}>
      <Stack.Screen 
        name="Auth" 
        component={AuthScreen}
        options={{ title: 'Authentication', 
        headerStyle: {
          height: 200,
          backgroundColor: Colors.mainColor,
        }, 
        headerTitleStyle: {
          fontWeight: 'bold',
          fontSize: 19,
        }, 
        headerTitle : props => <ActionBarIcon {...props} />,
        headerTintColor: 'white',
      }}
      />
      <Stack.Screen 
        name="ConfirmationScreen" 
        component={ConfirmationScreen}
        options={{ title: 'Confirm', 
        headerStyle: {
          height: 106,
          backgroundColor: Colors.mainColor,
        }, 
        headerTitleStyle: {
          fontWeight: 'bold',
          fontSize: 19,
        }, 
        headerLeft: () => null,
        headerTintColor: 'white',
      }}
      />
      <Stack.Screen 
        name="Home" 
        component={HomeScreen} 
        options={({ route }) => ({ 
          headerTitle: () => <HomeHeader id={route.params?.id}/>, 
          headerLeft: () => null
        })} 
      />
      <Stack.Screen 
        name="ChatRoom" 
        component={ChatRoomScreen}         
        options={({ route }) => ({ 
          headerTitle: () => <ChatRoomHeader id={route.params?.id}/>, 
          headerBackTitleVisible: false,
        })} 
      />
      <Stack.Screen 
        name="GroupInfoScreen" component={GroupInfoScreen}
      />
      <Stack.Screen 
        name="UsersScreen" 
        component={UsersScreen}         
        options={{ 
          title: "Users",
        }} 
      />
      <Stack.Screen 
        name="ProfileEditScreen" 
        component={ProfileEditScreen}         
        options={{ 
          title: "Edit your profile",
        }} 
      />
      <Stack.Screen name="NotFound" component={NotFoundScreen} options={{ title: 'Oops!' }} />
      
    </Stack.Navigator>
  );
}