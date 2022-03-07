import React, {useState, useEffect} from 'react';
import { Image, View, Text, StyleSheet, ActivityIndicator, useWindowDimensions, Pressable, Alert } from 'react-native';
import { DataStore, Auth, Storage } from 'aws-amplify';
import { User } from '../../src/models';
import { Ionicons } from '@expo/vector-icons';
import AudioPlayer from '../AudioPlayer';
import { Message as MessageModel } from '../../src/models';
import Colors from '../../constants/Colors';
import MessageReply from '../MessageReply';
import { useActionSheet } from '@expo/react-native-action-sheet'
import FastImage from 'react-native-fast-image'

const grey = 'lightgrey';

const Message = ( props ) => {
  const { setAsMessageReply, message: propMessage } = props;

  const [message, setMessage] = useState<MessageModel>(props.message);
  const [repliedTo, setRepliedTo] = useState<MessageModel|undefined>(undefined);
  const [user, setUser] = useState<User|undefined>();
  const [isMe, setIsMe] = useState<boolean|null>(null);
  const [soundURI, setSoundURI] = useState<any>(null);
  const [isDeleted, setIsDeleted] = useState(false);

  const { width } = useWindowDimensions();
  const { showActionSheetWithOptions } = useActionSheet();

  useEffect(() => {
    DataStore.query(User, message.userID).then(setUser);
  }, []);

  useEffect(() => {
    setMessage(propMessage);
  },[propMessage]);

  useEffect(() => {
    if (message?.replyToMessageID) {
      DataStore.query(MessageModel, message.replyToMessageID).then(
        setRepliedTo
      );
    }
  }, [message]);

  useEffect (() => {
    const subscription = DataStore.observe(MessageModel, message.id).subscribe((msg) => {
      //console.log(msg.model, msg.opType, msg.element);
      if(msg.model === MessageModel) {
        if(msg.opType === 'UPDATE'){
          setMessage((message) => ({...message, ...msg.element}));
        } else if(msg.opType === 'DELETE'){
          setIsDeleted(true);
        }
      }
    });

    return () => subscription.unsubscribe();
  }, []); 

  useEffect(() => {
    setAsRead();
  }, [isMe, message])

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

  const setAsRead = async () => {
    if(isMe === false && message.status !== 'READ'){
      console.log(isMe + " " + message.status);
      await DataStore.save(MessageModel.copyOf(message, (updated) => {
        updated.status = 'READ';
      }));
    }
  };

  const deleteMessage = async () => {
    await DataStore.delete(message);
  }

  const confirmDelete = () => {
    Alert.alert(
      'Confirm delete', 
      'Are you sure you want to delete the message?',
      [
        {
          text: 'Delete',
          onPress: deleteMessage,
          style: 'destructive',
        },
        {
          text: 'Cancel',
        }
      ]
    );
  }

  const onActionPress = (index) => {
    if(index===0){
      setAsMessageReply();
    } else if(index==1){
      confirmDelete();
    }
  }

  const openActionMenu = () => {
    if(!isMe){
      confirmDelete();
      return;
    }
    const options = ['Reply', 'Delete', 'Cancel'];

    const destructiveButtonIndex = 1;
    const cancelButtonIndex = 2;
    showActionSheetWithOptions({
      options,
      destructiveButtonIndex,
      cancelButtonIndex,
    },
    onActionPress
    );
  }

  if(!user){
    return <ActivityIndicator/>
  }

  return (
    <Pressable
      onLongPress={openActionMenu}
      style={[styles.container, 
      isMe ? styles.rightContainer : styles.leftContainer,
      {width: soundURI ? '75%' : 'auto'},
      ]}>

      {repliedTo && (<MessageReply message={repliedTo} />)}
      
      
      <View style={styles.row}>
        {soundURI && (<AudioPlayer soundURI={soundURI}/>)}
        <View style={{flexDirection: 'column'}}>    
          {message.image && (
            <View style={{marginTop: -10, marginBottom: message.content ? -1: -8}}>
              <Image
              source={{uri: message.image }}
              style={{ width: width * 0.65, aspectRatio: 4 / 3 }}
              resizeMode="contain"
            />
            </View>
          )}

          {!!message.content && (
            <Text style={{ color: isMe ? 'black' : 'white'}}>
              {isDeleted ? 'Message deleted' : message.content}</Text>
          )}
        </View>

        {isMe && !!message.status && message.status !== 'SENT' && (
          <Ionicons name={message.status === 'DELIVERED' ? 'checkmark' : 'checkmark-done'} size={16} color={message.status === 'DELIVERED' ? Colors.grey : Colors.mainColor} style={{marginLeft: 7, marginRight:0, }}/>)}
      </View>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
    margin: 8,
    borderRadius: 10,
    maxWidth: '79%',
  },
  row: {
    flexDirection: 'row',
    alignItems:'flex-end',
  },
  leftContainer: {
    backgroundColor: Colors.mainColor,
    marginLeft: 10,
    marginRight: 'auto',
  },
  rightContainer: {
    backgroundColor: grey,
    marginLeft: 'auto',
    marginRight: 10,
    alignItems:'flex-end',
  }
});

export default Message;
