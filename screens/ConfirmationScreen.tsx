import React, { useState, useEffect } from 'react';
import { View, TextInput, StyleSheet, SafeAreaView, Text, Pressable } from 'react-native';
import Colors from '../constants/Colors';
import { Auth } from 'aws-amplify';
import { useNavigation } from '@react-navigation/core';


export default function ConfirmationScreen({route}) {

  const [code, onChangeCode] = React.useState("");
  const {username} = route.params;

  const navigation = useNavigation();

  async function confirmSignUp() {
      try {
        await Auth.confirmSignUp(username, code);
        navigation.navigate('Home');
      } catch (error) {
          console.log('error confirming sign up', error);
      }
  }

  return (
    <SafeAreaView style={styles.view}>

      <Text style={styles.text}>
        Confirm your phone
      </Text>
      <TextInput
        keyboardType='number-pad' 
        style={styles.input}
        placeholder='Code'
        onChangeText={text => onChangeCode(text)}
      />

      <Pressable onPress={confirmSignUp} style={[styles.button, {backgroundColor: Colors.mainColor}]}>
        <Text style={styles.buttonText}>
          Confirm
        </Text>
      </Pressable>
      
    
    </SafeAreaView>
  );
}





const styles = StyleSheet.create({
  text: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.darkColor,
    margin: 15,
    paddingTop: 20,
  },
  view: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '76%',
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
    marginTop: 10,
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
  }
});