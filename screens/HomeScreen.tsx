import React, {useState, useEffect} from 'react';

import { Pressable, Image, View, StyleSheet, FlatList } from 'react-native';
import { Auth, DataStore } from 'aws-amplify';
import { ChatRoom, ChatRoomUser } from '../src/models';
import ChatRoomItem from '../components/ChatRoomItem';
import { useNavigation } from '@react-navigation/core';
import { ConsoleLogger } from '@aws-amplify/core';

export default function TabOneScreen(this: any) {
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);
  const navigation = useNavigation();

  const fetchChatRooms = async () => {
    const userData = await Auth.currentAuthenticatedUser();

    const chatRooms = (await DataStore.query(ChatRoomUser))
      .filter(chatRoomUser => chatRoomUser.user.id === userData.attributes.sub)
      .map(chatRoomUser => chatRoomUser.chatroom);

    setChatRooms(chatRooms);

    //console.log(chatRooms);
  };

  useEffect(() => {
    fetchChatRooms();
  }, []);

  const fetchChatRoomsSub = async () => {
    const userData = await Auth.currentAuthenticatedUser();

    const subscription = DataStore.observe(ChatRoomUser).subscribe(room => {
      //console.log(msg.model, msg.opType, msg.element);
      
      if(room.model === ChatRoomUser && room.opType === 'INSERT') {
        //console.log(room.element);
        //setChatRooms(existingRoom => [room.element,...existingRoom])
        //console.log(room.element);
        fetchChatRooms();
      }
    });

    return () => subscription.unsubscribe();
  }
  useEffect (() => {
    fetchChatRoomsSub();
  }, []); 

  const logOut = async () => {
    navigation.navigate('Auth');
    await DataStore.clear();
    Auth.signOut();
  };
  return (
    <View style={styles.page}>
       <FlatList 
        data={chatRooms}
        renderItem={({ item }) => <ChatRoomItem chatRoom={item} />}
        showsVerticalScrollIndicator={false}
      />
      <Pressable onPress={logOut} style={{backgroundColor: 'red', height: 50, margin: 15}}/>
    </View>
    
  );
}

const styles = StyleSheet.create({
  page: {
    backgroundColor: 'white',
    flex: 1
  }
});