import { FontAwesome } from '@expo/vector-icons';
import React from 'react';
import { Pressable, View, Text, StyleSheet } from 'react-native';
import Colors from '../../constants/Colors';


const NewGroupButton = ({onPress}) => {
    return (
        <Pressable onPress={onPress}>
            <View style={styles.view}>
                <FontAwesome name='group' size={24} color={Colors.greyColor}/>
                <Text style={styles.text}>New group</Text>
            </View>   
        </Pressable>
    );
}

const styles = StyleSheet.create({
    view: {
        flexDirection: 'row',
        padding: 10,
        alignItems: 'center',
    },
    text: {
        marginLeft: 10,
        fontWeight: 'bold',
    }
});

export default NewGroupButton;