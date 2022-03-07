import React, { useEffect, useState } from 'react';
import {View, Image, Text, useWindowDimensions, Pressable} from 'react-native';
import { Feather } from '@expo/vector-icons'; 
import { Auth, DataStore } from 'aws-amplify';

import { ChatRoom, ChatRoomUser, User } from '../src/models';
import moment from 'moment';
import { useNavigation } from '@react-navigation/core';

const HomeHeader = ({ id }) => {
    const { width } = useWindowDimensions();
    const navigation = useNavigation();

    const [uri, setUri] = useState<string>("");

    const init = async () => {
      const user = await Auth.currentAuthenticatedUser();
      const original = await DataStore.query(User, user.attributes.sub);
      setUri(original?.imageUri || '');
    }
    init();



    return (
      <View style={{ 
        flexDirection: 'row',
        justifyContent: 'space-between', 
        width,
        padding: 10,
        alignItems: 'center',
      }}>
        <Pressable onPress={() => navigation.navigate('UsersScreen')}>
          <Feather name="edit-2" size={24} color="black" style={{ marginHorizontal: 8}} />
        </Pressable>

        <Text style={{flex: 1, textAlign: 'center', fontWeight: 'bold'}}>Chat App</Text>
        
        <Pressable onPress={() => navigation.navigate('ProfileEditScreen')}>
          <Image 
            source={{ uri }}
            style={{ width: 34, height: 34, borderRadius: 17, marginRight: 5}}
          />
        </Pressable>
      </View>
    )
  }
  export default HomeHeader;