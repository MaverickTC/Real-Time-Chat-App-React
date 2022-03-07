import React, {useState, useEffect} from 'react';
import { Image, View, Text, StyleSheet, ActivityIndicator, useWindowDimensions, Pressable } from 'react-native';
import { DataStore, Auth, Storage } from 'aws-amplify';
import { User } from '../../src/models';
import AudioPlayer from '../AudioPlayer';
import { Message as MessageModel } from '../../src/models';
import Colors from '../../constants/Colors';

const grey = 'lightgrey';

const MessageReply = ( props ) => {
  const { message: propMessage} = props;

  const [message, setMessage] = useState<MessageModel>(props.message);

  const [user, setUser] = useState<User|undefined>();
  const [isMe, setIsMe] = useState<boolean|null>(null);
  const [soundURI, setSoundURI] = useState<any>(null);

  const { width } = useWindowDimensions();

  useEffect(() => {
    DataStore.query(User, message.userID).then(setUser);
  }, []);

  useEffect(() => {
    setMessage(propMessage);
  },[propMessage]);

  useEffect (() => {
    if(message.audio){
      Storage.get(message.audio).then(setSoundURI);
    }
    
  }, [message]);

  useEffect(() => {
    const checkIfMe = async () => {
      if(!user){
        return;
      }
      const authUser = await Auth.currentAuthenticatedUser();
      setIsMe(user.id === authUser.attributes.sub);
    }
    checkIfMe();
  }, [user]);

  if(!user){
    return <ActivityIndicator/>
  }

  return (
    <View
      style={[styles.container, 
      isMe ? styles.rightContainer : styles.leftContainer,
      {width: soundURI ? '75%' : 'auto'},
      ]}>

      <View style={styles.row}>
      {soundURI && (<AudioPlayer soundURI={soundURI}/>)}
        <View style={{flexDirection: 'column'}}>
          {message.image && (
            <View style={{marginTop: -10, marginBottom: message.content ? -1: -8}}>
              <Image
                source={{uri: message.image}}
                style={{width:width*0.66, aspectRatio: 4 / 3}}
                resizeMode='contain'
              />
            </View>
          )}

          {!!message.content && (
            <Text style={{ color: isMe ? 'black' : 'white'}}>{message.content}</Text>
          )}
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
    margin: 4,
    borderRadius: 10,
    maxWidth: '100%',
  },
  row: {
    flexDirection: 'row',
    alignItems:'flex-end',
  },
  messageReply: {
    backgroundColor: 'gray',
    padding: 5,
    borderRadius: 5,
  },
  leftContainer: {
    backgroundColor: Colors.mainColor,
    marginLeft: 10,
    marginRight: 'auto',
  },
  rightContainer: {
    backgroundColor: Colors.replyColor,
    marginLeft: 'auto',
    marginRight: 10,
    alignItems:'flex-end',
  }
});

export default MessageReply;
