import React, { useState, useRef, useEffect } from 'react';
import { View, Image, TextInput, StyleSheet, SafeAreaView, Text, Pressable, KeyboardAvoidingView, Platform, AsyncStorage } from 'react-native';
import Colors from '../constants/Colors';
import { useNavigation } from '@react-navigation/core';
import { Feather } from '@expo/vector-icons';
import * as ImagePicker from "expo-image-picker";
import { useActionSheet } from '@expo/react-native-action-sheet'
import { v4 as uuidv4 } from "uuid";
import { Auth, DataStore, Storage } from "aws-amplify";
import { User } from '../src/models';
import * as ImageManipulator from 'expo-image-manipulator';


export default function ProfileEditScreen() {
  const navigation = useNavigation();
  const { showActionSheetWithOptions } = useActionSheet();
  const [uri, setUri] = useState<string>("");
  
  const init = async () => {
    const user = await Auth.currentAuthenticatedUser();
    const original = await DataStore.query(User, user.attributes.sub);
    setUri(original?.imageUri || '');
  }
  init();

  

  const openActionMenu = () => {
    const options = ['Camera', 'Gallery', 'Cancel', 'Remove'];

    const destructiveButtonIndex = 3;
    const cancelButtonIndex = 2;
    showActionSheetWithOptions({
      options,
      destructiveButtonIndex,
      cancelButtonIndex,
    },
    onActionPress
    );
  }

  const onActionPress = (index: number) => {
    if(index===1){
      pickImage();
    } else if(index==0){
      takePhoto();
    }
  }

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });

    if (!result.cancelled) {
      sendImage(result.uri);
    }
  };

  const takePhoto = async () => {
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      aspect: [1, 1],
      quality: 0.5,
    });

    if (!result.cancelled) {
      sendImage(result.uri);
    }
  };


  const getBlob = async (uri: string) => {
    const respone = await fetch(uri);
    const blob = await respone.blob();
    return blob;
  };

  const progressCallback = (progress) => {

  };

  const compress = async (image: string) => {
    
    
  };

  const sendImage = async (image: string) => {
   //console.log(image);
    if (!image) {
      return;
    }
    
    /*const manipResult = await ImageManipulator.manipulateAsync(
      image,
      [{ flip: ImageManipulator.FlipType.Vertical }],
      { compress: 0, format: ImageManipulator.SaveFormat.PNG }
    );*/

    const blob = await getBlob(image);
    const { key } = await Storage.put(`${uuidv4()}.png`, blob, {
      progressCallback,
    });

    // send message
    const user = await Auth.currentAuthenticatedUser();

    const original = await DataStore.query(User, user.attributes.sub);

    const uri = await Storage.get(key);
    await DataStore.save(
      User.copyOf(original, updated => {
        updated.imageUri = uri
      })
    );

    setUri(uri);
  }


  return (
    <View
      behavior={Platform.OS == "ios" ? "padding" : "height"}
      keyboardVerticalOffset={250}
      style={styles.view}>
        
      <View style={{ flex: 1, marginTop: 60}}>
        <Image source={{ uri }} style={styles.profileImage}/>
        <Pressable onPress={openActionMenu} style={styles.container}>
            <Image style={styles.editButton}/>
            <Feather name="edit" style={styles.editIcon} size={24} color="white" />
        </Pressable>
      </View>

    
    </View>
  );
}



const styles = StyleSheet.create({
  container: {
    top: 0,
    bottom: 0,
    left: 0,
    right: 0, 
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileImage: {
    width: '50%',
    borderRadius: 1000,
    aspectRatio: 1,
  },
  editIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    right: -8,
    bottom: -7.5,
  },
  editButton: {
    backgroundColor: Colors.mainColor,
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 3,
    borderColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    right: 5,
    bottom: 5,
  },
  text: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.darkColor,
    marginBottom: 30,
    paddingTop: 20,
  },
  view: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '85%',
  },
  input: {
    marginTop: 12,
    marginBottom: 24,
    height: 40,
    width: '85%',
    margin: 12,
    padding: 10,
    borderRadius: 10,
    borderBottomColor: Colors.darkColor,
    borderBottomWidth: 2,
  },
  button: {
    marginBottom: 16,
    height: 50,
    width: '65%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
  }, 
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  phoneContainer: {
    width: '83%',
    height: 54,
  },
  textInput: {
    paddingVertical: 0,
  },
});
