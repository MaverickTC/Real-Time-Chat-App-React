import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, Pressable, Text, SafeAreaView, Alert } from 'react-native';
import { Auth, DataStore } from 'aws-amplify/';
import UserItem from '../components/UserItem';
import NewGroupButton from '../components/NewGroupButton';
import { useNavigation } from '@react-navigation/native';
import { ChatRoom, User, ChatRoomUser } from '../src/models';
import Colors from '../constants/Colors';

export default function UsersScreen() {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
  const [isNewGroup, setIsNewGroup] = useState(false);

  const navigation = useNavigation();
  
  useEffect(() => {
    showUsers();
  }, []);

  const showUsers = async () => {
    const authUser = await Auth.currentAuthenticatedUser();
    const dbUser = await DataStore.query(User, authUser.attributes.sub);

    DataStore.query(User, u =>
      u.id('ne', dbUser?.id || '')).then(setUsers);
  };

  /*useEffect (() => {
    const fetchUsers = async () => {
      const fetchedUsers = await DataStore.query(User);
      //setUsers(fetchedUsers);
      console.log(fetchedUsers);
    };
    fetchUsers();
  }, [])*/

  const addUserToChatRoom = async (user: User, chatroom: ChatRoom) => {
    DataStore.save(
      new ChatRoomUser({user, chatroom })
    );
  };

  const createChatRoom = async (users: any[]) => {
    // TODO if there is already a chat room between these 2 users
    // then redirect to the existing chat room
    // otherwise, create a new chatroom with these users.

    // connect authenticated user with the chat room
    const authUser = await Auth.currentAuthenticatedUser();
    const dbUser = await DataStore.query(User, authUser.attributes.sub);
    if (!dbUser) {
      Alert.alert("There was an error creating the group");
      return;
    }
    //const now = new Date();
    // Create a chat room
    const newChatRoomData = {
      newMessages: 0,
      Admin: dbUser,
      //_deleted: false,
      //_lastChangedAt: now.toISOString(),
      //_version: 1,
    };
    if (users.length > 1) {
      newChatRoomData.name = "New group";
      newChatRoomData.imageUri =
        "https://notjustdev-dummy.s3.us-east-2.amazonaws.com/avatars/group.jpeg";
    } else {
      //const post = await DataStore.query(ChatRoomUser);
      //console.log(post);
    }
    const newChatRoom = await DataStore.save(new ChatRoom(newChatRoomData));

    if (dbUser) {
      await addUserToChatRoom(dbUser, newChatRoom);
    }

    // connect users user with the chat room
    await Promise.all(
      users.map((user: any) => addUserToChatRoom(user, newChatRoom))
    );

    navigation.navigate("ChatRoom", { id: newChatRoom.id });
  };

  const isUserSelected = (user: User) => {
    return selectedUsers.some((selectedUsers) => selectedUsers.id === user.id);
  };

  const onUserPress = async (user) => {
    if(isNewGroup){
      if(isUserSelected(user)){
        setSelectedUsers(selectedUsers.filter((selectedUsers) => selectedUsers.id !== user.id))
      } else {
        setSelectedUsers([...selectedUsers, user]);
      }
      
    } else {
      await createChatRoom([user]);
    }
  };

  const saveGroup = async () => {
    await createChatRoom(selectedUsers);
  };
  
  return (
    <SafeAreaView style={styles.page}>
       <FlatList 
        data={users}
        renderItem={({ item }) => (<UserItem user={item} onPress={() => onUserPress(item)} isSelected={isNewGroup ? isUserSelected(item) : undefined}/>)}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={() => (<NewGroupButton onPress={() => setIsNewGroup(!isNewGroup)}/>)}
      />
      {isNewGroup && <Pressable style={styles.button} onPress={saveGroup}>
        <Text style={styles.buttonText}>Save Group ({selectedUsers.length})</Text>
      </Pressable>}
    </SafeAreaView>
    
  );
}

const styles = StyleSheet.create({
  page: {
    backgroundColor: 'white',
    flex: 1
  },
  button: {
    backgroundColor: Colors.mainColor,
    margin: 10,
    padding: 10,
    borderRadius: 15,
    alignItems: 'center',
  }, 
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  }
});