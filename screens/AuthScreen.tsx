import React, { useState, useRef, useEffect } from 'react';
import { TextInput, StyleSheet, SafeAreaView, Text, Pressable, KeyboardAvoidingView, Platform } from 'react-native';
import Colors from '../constants/Colors';
import { Auth } from 'aws-amplify';
import PhoneInput from 'react-native-phone-number-input';
import { useNavigation } from '@react-navigation/core';


export default function AuthScreen() {

  const [email, onChangeEmail] = useState('');
  const [password, onChangePassword] = useState('');
  const [phoneNumber, setphoneNumber] = useState('');
  const phoneInput = useRef(null);

  const [isAuth, setIsAuth] = useState(true);
  const navigation = useNavigation();

  const checkIsLoggedIn = async () => {
    try {
      const user = await Auth.currentAuthenticatedUser();
      return true;
    } catch {
      return false;
    }
  }

  useEffect(() => {
    if(isAuth){
      (async () => {
        if(await checkIsLoggedIn()){
          navigation.navigate('Home');
        } else {
          setIsAuth(false);
        }
      })();
    }
  }, []);

  async function signIn() {
      try {
          const user = await Auth.signIn(email, password);
          navigation.navigate('Home');
      } catch (error) {
          console.log('error signing in', error);
      }
  }

  async function signUp() {
    try {
        const { user } = await Auth.signUp({
            username: email,
            password: password,
            attributes: {
                email: email,
                //phone_number: phoneInput,         
                // optional  // optional - E.164 number convention
                // other custom attributes 
            }
        });
        
        //console.log(user);
        navigation.navigate('ConfirmationScreen', {username: email})
    } catch (error) {
        console.log('error signing up:', error);
    }
  }

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS == "ios" ? "padding" : "height"}
      keyboardVerticalOffset={250}
      style={styles.view}>
        
      <Text style={styles.text}>
        Login To Your Account
      </Text>
      <PhoneInput
        ref={phoneInput}
        defaultValue={phoneNumber}
        defaultCode="TR"
        layout="first"
        withShadow
        autoFocus
        containerStyle={styles.phoneContainer}
        textContainerStyle={styles.textInput}
        onChangeFormattedText={text => {
          setphoneNumber(text);
        }}
      />
      <TextInput
        style={styles.input}
        placeholder='Email'
        onChangeText={text => onChangeEmail(text)}
      />
      <TextInput
        secureTextEntry={true}
        textContentType='password'
        style={styles.input}
        placeholder='Password'
        onChangeText={text => onChangePassword(text)}
      />
      <Pressable onPress={signIn} style={[styles.button, {backgroundColor: Colors.mainColor}]}>
        <Text style={styles.buttonText}>
          Login
        </Text>
      </Pressable>
      
      <Pressable onPress={signUp} style={[styles.button, {backgroundColor: Colors.greyColor}]}>
        <Text style={styles.buttonText}>
          Register
        </Text>
      </Pressable>
    
    </KeyboardAvoidingView>
  );
}



const styles = StyleSheet.create({
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